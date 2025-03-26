import { classifierOrchestrator } from './classifiers/ClassifierFactory';
import { NLP_CONFIG } from '../../config/nlpConfig';
import { customEntities } from '../../dictionaries/customEntities';

class IntentClassifier {
  constructor(config = {}) {
    this.config = {
      maxCacheSize: 100,
      ...config
    };
    this.cache = new Map();
    this.initialized = this.initialize();
  }

  async initialize() {
    await classifierOrchestrator.initialize();
  }

  buildDirectTopicMatcher() {
    const directTopicPatterns = {};
    
    Object.keys(customEntities).forEach(language => {
      const energyTypes = customEntities[language]?.energyTypes || [];
      directTopicPatterns[language] = energyTypes.map(type => 
        new RegExp(`\\b${type}\\b`, 'i')
      );
    });
    
    return directTopicPatterns;
  }

  getCacheKey(text, language) {
    return `${language}:${text}`;
  }

  async classifyIntent(text, entities, language = NLP_CONFIG.languages.default) {
    await this.initialized;
    
    const cacheKey = this.getCacheKey(text, language);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const features = this.extractFeatures(text, entities, language);
    const result = await classifierOrchestrator.classify(text, features);
    
    this.cache.set(cacheKey, result);
    this.maintainCache();

    return result;
  }

  checkDirectTopicRequest(text, language) {
    const trimmedText = text.trim().toLowerCase();
    
    if (trimmedText.split(/\s+/).length <= 3) {
      const patterns = this.directTopicMatcher[language] || 
                      this.directTopicMatcher[NLP_CONFIG.languages.default];
      
      for (const pattern of patterns) {
        if (pattern.test(trimmedText)) {
          return new ClassificationResult('topic_request', 0.95, 1.5);
        }
      }
    }
    
    return null;
  }

  maintainCache() {
    if (this.cache.size > this.config.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  extractFeatures(text, entities, language = NLP_CONFIG.languages.default) {
    return {
      hasEnergyType: entities?.energyDomain?.energyTypes?.length > 0 ? 1 : 0,
      hasDate: entities?.dates?.length > 0 ? 1 : 0,
      hasTradeTerms: entities?.energyDomain?.metrics?.some(m => ['import', 'export', 'trade'].includes(m)) ? 1 : 0,
      hasProductionTerms: entities?.energyDomain?.metrics?.some(m => ['production', 'generation'].includes(m)) ? 1 : 0,
      hasComparison: text.match(/\b(compare|vs|versus|difference|than)\b/i) !== null ? 1 : 0,
      hasTrendTerms: text.match(/\b(trend|evolution|change|over time)\b/i) !== null ? 1 : 0
    };
  }

  calculatePriority(intent, features) {
    let priority = 1;

    if (features.hasEnergyType && intent.startsWith('query_')) {
      priority += 0.3;
    }
    if (intent === 'query_trade' && features.hasTradeTerms) {
      priority += 0.2;
    }
    if (intent === 'query_trend' && features.hasDate) {
      priority += 0.2;
    }

    return priority;
  }
}

// Export singleton instance
export const intentClassifier = new IntentClassifier();