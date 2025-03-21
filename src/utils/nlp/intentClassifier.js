import { NLP_CONFIG } from '../../config/nlpConfig';
import { intentPatterns } from '../../dictionaries/intentPatterns';
import { customEntities } from '../../dictionaries/customEntities';

class IntentClassifier {
  constructor() {
    this.cache = new Map();
    this.directTopicMatcher = this.buildDirectTopicMatcher();
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

    const patterns = intentPatterns[language] || intentPatterns[NLP_CONFIG.languages.default];
    const matches = {};
    const intents = [];

    // Match patterns for each intent
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

    // Sort intents by confidence and priority
    intents.sort((a, b) => 
      (b.confidence * b.priority) - (a.confidence * a.priority)
    );

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