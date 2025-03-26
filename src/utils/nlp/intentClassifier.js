import { NLP_CONFIG } from '../../config/nlpConfig';
import { intentPatterns } from '../../dictionaries/intentPatterns';
import { customEntities } from '../../dictionaries/customEntities';
import { energyBalanceIndicators } from '../../dictionaries/energyBalanceIndicators';

class DecisionNode {
  constructor(feature, threshold, left, right, value = null) {
    this.feature = feature;
    this.threshold = threshold;
    this.left = left;
    this.right = right;
    this.value = value;
  }

  predict(features) {
    if (this.value !== null) return this.value;
    return features[this.feature] >= this.threshold 
      ? this.right.predict(features) 
      : this.left.predict(features);
  }
}

class IntentClassifier {
  constructor() {
    this.cache = new Map();
    this.directTopicMatcher = this.buildDirectTopicMatcher();
    this.decisionTree = this.buildDecisionTree();
  }

  buildDecisionTree() {
    // Pre-defined decision tree structure based on feature importance
    return new DecisionNode(
      'hasEnergyType', 0.5,
      new DecisionNode(
        'hasDate', 0.5,
        new DecisionNode(null, null, null, null, 'general_info'),
        new DecisionNode('hasComparison', 0.5,
          new DecisionNode(null, null, null, null, 'query_trend'),
          new DecisionNode(null, null, null, null, 'query_trend')
        )
      ),
      new DecisionNode(
        'hasTradeTerms', 0.5,
        new DecisionNode(
          'hasProductionTerms', 0.5,
          new DecisionNode(null, null, null, null, 'query_consumption'),
          new DecisionNode(null, null, null, null, 'query_production')
        ),
        new DecisionNode(null, null, null, null, 'query_trade')
      )
    );
  }

  buildDirectTopicMatcher() {
    // Create a matcher for direct topic requests from custom entities
    const directTopicPatterns = {};
    
    Object.keys(customEntities).forEach(language => {
      const energyTypes = customEntities[language]?.energyTypes || [];
      directTopicPatterns[language] = energyTypes.map(type => 
        new RegExp(`\\b${type}\\b`, 'i')
      );
    });
    
    return directTopicPatterns;
  }

  extractFeatures(text, entities, language = NLP_CONFIG.languages.default) {
    // Get patterns for the current language or fall back to default
    const patterns = intentPatterns[language] || intentPatterns[NLP_CONFIG.languages.default];
    const balanceIndicators = energyBalanceIndicators;
    
    const features = {
      hasEnergyType: entities?.energyDomain?.energyTypes?.length > 0 ? 1 : 0,
      hasDate: entities?.dates?.length > 0 ? 1 : 0,
      hasTradeTerms: this.matchesAnyPattern(text, [
        ...patterns.query_trade,
        ...balanceIndicators.IMP.patterns,
        ...balanceIndicators.EXP.patterns
      ]) ? 1 : 0,
      hasProductionTerms: this.matchesAnyPattern(text, [
        ...patterns.query_production,
        ...Object.values(balanceIndicators)
          .filter(indicator => indicator.intent === 'query_production')
          .flatMap(indicator => indicator.patterns)
      ]) ? 1 : 0,
      hasComparison: this.matchesAnyPattern(text, patterns.query_comparison) ? 1 : 0,
      hasTrendTerms: this.matchesAnyPattern(text, patterns.query_trend) ? 1 : 0
    };

    return features;
  }

  matchesAnyPattern(text, patterns) {
    return patterns.some(pattern => {
      // If pattern is already a RegExp, use it directly
      if (pattern instanceof RegExp) {
        return pattern.test(text);
      }
      // Otherwise, create a case-insensitive RegExp from the string pattern
      const regex = new RegExp(`\\b${pattern}\\b`, 'i');
      return regex.test(text);
    });
  }

  getCacheKey(text, language) {
    return `${language}:${text}`;
  }

  async classifyIntent(text, entities, language = NLP_CONFIG.languages.default) {
    const cacheKey = this.getCacheKey(text, language);
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Check for direct topic requests first
    const directTopic = this.checkDirectTopicRequest(text, language);
    if (directTopic) {
      return directTopic;
    }

    // Extract features and use decision tree
    const features = this.extractFeatures(text, entities, language);
    const primaryIntent = this.decisionTree.predict(features);

    // Calculate confidence using pattern matching as additional signal
    const patterns = intentPatterns[language] || intentPatterns[NLP_CONFIG.languages.default];
    const matches = {};
    const intents = [];

    // Combine decision tree result with pattern matching
    for (const [intent, intentPatterns] of Object.entries(patterns)) {
      const intentMatches = intentPatterns.filter(pattern => pattern.test(text));
      if (intentMatches.length > 0) {
        matches[intent] = intentMatches.length / intentPatterns.length;
        if (matches[intent] >= NLP_CONFIG.intents.confidenceThreshold) {
          intents.push({
            intent,
            confidence: matches[intent],
            priority: this.calculatePriority(intent, entities)
          });
        }
      }
    }

    // Boost confidence for decision tree result
    const decisionTreeConfidence = 0.8; // Base confidence in tree decision
    intents.push({
      intent: primaryIntent,
      confidence: decisionTreeConfidence,
      priority: this.calculatePriority(primaryIntent, entities)
    });

    // Sort by combined score
    intents.sort((a, b) => (b.confidence * b.priority) - (a.confidence * a.priority));

    const result = {
      primaryIntent: intents[0]?.intent || 'general_info',
      allIntents: intents,
      confidence: intents[0]?.confidence || 0,
      language
    };

    // Cache results
    this.cache.set(cacheKey, result);

    // Maintain cache size
    if (this.cache.size > NLP_CONFIG.cache.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    return result;
  }

  checkDirectTopicRequest(text, language) {
    // For short queries, check if they directly match an energy type
    const trimmedText = text.trim().toLowerCase();
    
    // Only apply this logic to short queries (direct topic requests)
    if (trimmedText.split(/\s+/).length <= 3) {
      const directPatterns = this.directTopicMatcher[language] || 
                            this.directTopicMatcher[NLP_CONFIG.languages.default];
      
      for (const pattern of directPatterns) {
        if (pattern.test(trimmedText)) {
          // This is likely a direct topic request
          return {
            primaryIntent: 'topic_request',
            allIntents: [{
              intent: 'topic_request',
              confidence: 0.95,
              priority: 1.5
            }],
            confidence: 0.95,
            language,
            directMatch: true
          };
        }
      }
    }
    
    return null;
  }

  calculatePriority(intent, entities) {
    let priority = 1;

    // Boost priority based on presence of relevant entities
    if (entities?.energyDomain) {
      if (intent.startsWith('query_') && entities.energyDomain.energyTypes) {
        priority += 0.3;
      }
      if (intent === 'query_trade' && entities.energyDomain.metrics?.some(m => ['import', 'export'].includes(m))) {
        priority += 0.2;
      }
      if (intent === 'query_trend' && entities.dates?.length > 0) {
        priority += 0.2;
      }
    }

    return priority;
  }
}

export const intentClassifier = new IntentClassifier();