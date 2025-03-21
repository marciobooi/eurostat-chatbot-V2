import { NLP_CONFIG } from '../../config/nlpConfig';

class ContextManager {
  constructor() {
    this.conversationHistory = new Map();
  }

  getConversationKey(userId, language) {
    return `${userId}:${language}`;
  }

  updateContext(userId, message, nlpResult, language = NLP_CONFIG.languages.default) {
    const key = this.getConversationKey(userId, language);
    let history = this.conversationHistory.get(key) || [];

    // Add new context with safe defaults for undefined properties
    history.push({
      message,
      timestamp: Date.now(),
      entities: nlpResult?.entities || { standardEntities: {}, energyDomain: {} },
      intent: nlpResult?.intent || 'general_info',
      sentiment: nlpResult?.sentiment || { score: 0, comparative: 0 }
    });

    // Maintain context window size
    if (history.length > NLP_CONFIG.questionProcessing.contextRetentionLimit) {
      history = history.slice(-NLP_CONFIG.questionProcessing.contextRetentionLimit);
    }

    this.conversationHistory.set(key, history);
    return this.analyzeContext(history);
  }

  analyzeContext(history) {
    if (!history || history.length === 0) {
      return null;
    }

    const currentContext = history[history.length - 1];
    const previousContext = history.length > 1 ? history[history.length - 2] : null;

    return {
      currentTopic: this.extractCurrentTopic(currentContext),
      isFollowUp: this.isFollowUpQuestion(currentContext, previousContext),
      referencedEntities: this.getReferencedEntities(history),
      contextualIntent: this.getContextualIntent(currentContext, previousContext),
      topicChain: this.buildTopicChain(history),
      sentiment: this.getOverallSentiment(history),
      entities: currentContext.entities
    };
  }

  extractCurrentTopic(context) {
    if (!context?.entities?.energyDomain) return null;

    return {
      mainTopic: context.entities.energyDomain.energyTypes?.[0] || null,
      relatedTopics: context.entities.energyDomain.energyTypes?.slice(1) || [],
      metrics: context.entities.energyDomain.metrics || [],
      timeframe: context.entities.energyDomain.timeframes?.[0] || null
    };
  }

  isFollowUpQuestion(current, previous) {
    if (!current || !previous) return false;

    // Check for follow-up indicators
    const isQuickSuccession = current.timestamp - previous.timestamp < 30000; // 30 seconds
    const sharesSameEntities = this.hasSharedEntities(current.entities, previous.entities);
    const isRelatedIntent = this.areIntentsRelated(current.intent, previous.intent);

    return isQuickSuccession && (sharesSameEntities || isRelatedIntent);
  }

  hasSharedEntities(currentEntities, previousEntities) {
    if (!currentEntities?.energyDomain || !previousEntities?.energyDomain) return false;

    const current = new Set([
      ...(currentEntities.energyDomain.energyTypes || []),
      ...(currentEntities.energyDomain.metrics || [])
    ].map(e => e.text || e));
    
    const previous = new Set([
      ...(previousEntities.energyDomain.energyTypes || []),
      ...(previousEntities.energyDomain.metrics || [])
    ].map(e => e.text || e));

    return [...current].some(entity => previous.has(entity));
  }

  areIntentsRelated(currentIntent, previousIntent) {
    if (!currentIntent || !previousIntent) return false;

    // Get the base intent type if it's an object
    const current = typeof currentIntent === 'object' ? currentIntent.type : currentIntent;
    const previous = typeof previousIntent === 'object' ? previousIntent.type : previousIntent;

    // Define related intent groups
    const relatedIntents = {
      data_query: ['query_production', 'query_consumption', 'query_trade'],
      analysis: ['query_comparison', 'query_trend'],
      visualization: ['request_visualization']
    };

    const findGroup = (intent) => {
      return Object.entries(relatedIntents)
        .find(([_, intents]) => intents.includes(intent))?.[0];
    };

    return findGroup(current) === findGroup(previous);
  }

  getReferencedEntities(history) {
    const entities = new Map();

    history.forEach(context => {
      if (context.entities?.energyDomain) {
        Object.entries(context.entities.energyDomain).forEach(([type, values]) => {
          if (!Array.isArray(values)) return;
          
          values.forEach(value => {
            const entityText = value.text || value;
            if (!entities.has(entityText)) {
              entities.set(entityText, { 
                type, 
                count: 1, 
                lastMentioned: context.timestamp 
              });
            } else {
              const entity = entities.get(entityText);
              entity.count++;
              entity.lastMentioned = context.timestamp;
            }
          });
        });
      }
    });

    return Array.from(entities.entries())
      .map(([entity, data]) => ({
        entity,
        ...data
      }))
      .sort((a, b) => b.count - a.count);
  }

  getContextualIntent(current, previous) {
    if (!current) return null;

    const baseIntent = current.intent;
    
    // Modify intent based on context
    if (this.isFollowUpQuestion(current, previous)) {
      return {
        type: baseIntent,
        isFollowUp: true,
        originalIntent: previous.intent,
        confidence: current.intent.confidence * 0.8 // Reduce confidence for follow-ups
      };
    }

    return {
      type: baseIntent,
      isFollowUp: false,
      confidence: current.intent.confidence
    };
  }

  buildTopicChain(history) {
    return history
      .map(context => this.extractCurrentTopic(context))
      .filter(topic => topic?.mainTopic)
      .reduce((chain, topic) => {
        const lastTopic = chain[chain.length - 1];
        if (!lastTopic || lastTopic.mainTopic !== topic.mainTopic) {
          chain.push(topic);
        }
        return chain;
      }, []);
  }

  getOverallSentiment(history) {
    if (history.length === 0) return null;

    const sentiments = history.map(context => context.sentiment?.score || 0);
    const average = sentiments.reduce((sum, score) => sum + score, 0) / sentiments.length;
    const trend = this.calculateSentimentTrend(sentiments);

    return {
      current: history[history.length - 1].sentiment?.score || 0,
      average,
      trend
    };
  }

  calculateSentimentTrend(sentiments) {
    if (sentiments.length < 2) return 'stable';

    const recentScores = sentiments.slice(-3); // Look at last 3 interactions
    const changes = recentScores.slice(1).map((score, i) => score - recentScores[i]);
    const averageChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;

    if (averageChange > 0.1) return 'improving';
    if (averageChange < -0.1) return 'declining';
    return 'stable';
  }

  clearContext(userId, language) {
    const key = this.getConversationKey(userId, language);
    this.conversationHistory.delete(key);
  }
}

export const contextManager = new ContextManager();