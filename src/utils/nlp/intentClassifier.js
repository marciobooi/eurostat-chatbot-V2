import { classifierOrchestrator } from './classifiers/ClassifierFactory';
import { NLP_CONFIG } from '../../config/nlpConfig';
import { customEntities } from '../../dictionaries/customEntities';

/**
 * Classifies user intent based on text and extracted entities.
 * Uses a caching mechanism to speed up responses for repeated queries.
 * Leverages a ClassifierOrchestrator for the actual classification logic.
 */
class IntentClassifier {
  constructor(config = {}) {
    this.config = {
      maxCacheSize: 100,
      ...config
    };
    this.cache = new Map();
    this.directTopicMatcher = this.buildDirectTopicMatcher();
    this.initialized = this.initialize();
  }

  async initialize() {
    await classifierOrchestrator.initialize();
  }

  /**
   * Builds regular expressions for directly matching known energy types/topics.
   * This allows for quick identification of simple topic requests.
   * @returns {Object.<string, RegExp[]>} A dictionary mapping language codes to arrays of RegExps.
   */
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
    let result;
    try {
      result = await classifierOrchestrator.classify(text, features);
    } catch (error) {
      console.error('Error during intent classification in IntentClassifier:', error);
      result = { intent: 'classification_error', confidence: 0.0, classificationFailed: true };
    }
    
    this.cache.set(cacheKey, result);
    this.maintainCache();

    return result;
  }

  /**
   * Checks if the input text directly matches a known topic, typically for short queries.
   * @param {string} text - The user input text.
   * @param {string} language - The current language code.
   * @returns {ClassificationResult|null} A ClassificationResult if a direct match is found, otherwise null.
   */
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

  /**
   * Extracts a feature set from the input text and entities for the classifier.
   * These features help the classifier determine the user's intent.
   * @param {string} text - The user input text.
   * @param {Object} entities - Entities extracted from the text.
   * @param {string} language - The current language code.
   * @returns {Object} A feature object (e.g., { hasEnergyType: 1, hasDate: 0 }).
   */
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