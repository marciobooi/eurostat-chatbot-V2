export const NLP_CONFIG = {
  // Language settings
  languages: {
    default: 'en',
    supported: ['en', 'fr', 'de'],
    fallback: 'en'
  },

  // Sentiment analysis settings
  sentiment: {
    thresholds: {
      positive: 0.3,
      negative: -0.3
    },
    weights: {
      winkNLP: 0.6,
      multiLang: 0.4
    }
  },

  // Entity recognition settings
  entityExtraction: {
    confidenceThreshold: 0.7,
    maxEntities: 5
  },

  // Question processing
  questionProcessing: {
    contextRetentionLimit: 3, // number of previous messages to retain
    similarityThreshold: 0.8
  },

  // Caching settings
  cache: {
    maxSize: 1000,
    ttl: 3600 * 24 // 24 hours in seconds
  },

  // Intent classification
  intents: {
    types: [
      'topic_request',    // Direct request for a specific energy topic
      'query_production',
      'query_consumption',
      'query_trade',
      'query_comparison',
      'query_trend',
      'request_visualization',
      'general_info'
    ],
    confidenceThreshold: 0.6,
    directTopicConfidence: 0.95 // confidence for direct topic matches
  }
};