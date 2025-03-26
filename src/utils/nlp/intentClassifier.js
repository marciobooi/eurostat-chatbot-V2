import { createClassifier } from './classifiers/ClassifierFactory';
import { ClassificationResult } from './classifiers/BaseClassifier';
import { NLP_CONFIG } from '../../config/nlpConfig';
import { customEntities } from '../../dictionaries/customEntities';

class IntentClassifier {
  constructor(config = {}) {
    this.cache = new Map();
    this.config = {
      maxCacheSize: NLP_CONFIG.cache.maxSize,
      ...config
    };

    this.classifiers = {};
    this.directTopicMatcher = this.buildDirectTopicMatcher();
    this.initialized = this.initializeClassifiers();
  }

  async initializeClassifiers() {
    this.classifiers.neural = await createClassifier('neural');
    this.classifiers.decisionTree = await createClassifier('decision_tree');
    this.classifiers.pattern = await createClassifier('pattern');
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

  async classifyIntent(text, entities, language = NLP_CONFIG.languages.default) {
    await this.initialized; // Wait for classifiers to be ready
    
    const cacheKey = this.getCacheKey(text, language);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Check for direct topic requests first
    const directTopicResult = this.checkDirectTopicRequest(text, language);
    if (directTopicResult) {
      return this.createResult([directTopicResult], language);
    }

    // Get predictions from all classifiers
    const features = this.extractFeatures(text, entities, language);
    const predictions = await this.getPredictions(text, features, language);
    
    // Create and cache the final result
    const result = this.createResult(predictions, language);
    this.cache.set(cacheKey, result);
    this.maintainCache();

    return result;
  }

  async getPredictions(text, features, language) {
    const predictions = [];

    // Get neural network prediction
    const neuralResult = await this.classifiers.neural.predict(features);
    predictions.push(neuralResult);

    // Get decision tree prediction
    const treeResult = await this.classifiers.decisionTree.predict(features);
    predictions.push(treeResult);

    // Get pattern matching prediction
    const patternResult = await this.classifiers.pattern.predict(text, language);
    predictions.push(patternResult);

    // Calculate priorities
    predictions.forEach(pred => {
      pred.priority = this.calculatePriority(pred.intent, features);
    });

    return predictions;
  }

  createResult(predictions, language) {
    // Sort by combined confidence and priority
    predictions.sort((a, b) => (b.confidence * b.priority) - (a.confidence * a.priority));

    return {
      primaryIntent: predictions[0]?.intent || 'general_info',
      allIntents: predictions,
      confidence: predictions[0]?.confidence || 0,
      language
    };
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