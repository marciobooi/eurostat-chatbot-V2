import { NLP_CONFIG } from '../../config/nlpConfig';
import { comparisonModule } from './comparisonModule';
import { CONFIG } from '../../i18n';
import EurostatQueryModule from './eurostatQueryModule';

class ContextManager {
  constructor() {
    this.conversationHistory = new Map();
    this.eurostatModule = new EurostatQueryModule(this);
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
      entities: currentContext.entities,
      eurostat: this.getEurostatContext(history)
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
    if (!current || !previous) return current?.intent;

    const currentIntent = current.intent;
    const previousIntent = previous.intent;

    // Check if this is a follow-up question
    const isFollowUp = this.isFollowUpQuestion(current, previous);
    
    if (isFollowUp) {
      // If the current query is very short, likely inherits intent
      const isShortQuery = current.message.split(/\s+/).length <= 3;
      if (isShortQuery && this.hasSharedEntities(current.entities, previous.entities)) {
        return previousIntent;
      }

      // If intents are related, use the more specific one
      if (this.areIntentsRelated(currentIntent, previousIntent)) {
        // Prefer trade > production > consumption for related queries
        const intentPriority = {
          'query_trade': 3,
          'query_production': 2,
          'query_consumption': 1
        };

        const currentPriority = intentPriority[currentIntent] || 0;
        const previousPriority = intentPriority[previousIntent] || 0;

        return currentPriority >= previousPriority ? currentIntent : previousIntent;
      }

      // If previous intent was comparison/trend, maintain it for follow-ups
      if (['query_comparison', 'query_trend'].includes(previousIntent) &&
          current.entities?.dates?.length > 0) {
        return previousIntent;
      }
    }

    return currentIntent;
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

  checkRelationship(message, language = CONFIG.DEFAULT_LANGUAGE) {
    return comparisonModule.checkRelationship(message, language);
  }

  // Helper method to safely add relationship to history
  addRelationshipToHistory(userId, message, details, language) {
    const key = this.getConversationKey(userId, language);
    let history = this.conversationHistory.get(key) || [];

    history.push({
      message,
      timestamp: Date.now(),
      entities: { 
        standardEntities: {}, 
        energyDomain: { 
          energyTypes: details.energyTypes.map(term => ({ text: term, canonical: term }))
        }
      },
      intent: details.intent
    });

    // Maintain context window size
    if (history.length > NLP_CONFIG.questionProcessing.contextRetentionLimit) {
      history = history.slice(-NLP_CONFIG.questionProcessing.contextRetentionLimit);
    }

    this.conversationHistory.set(key, history);
  }

  clearContext(userId, language) {
    const key = this.getConversationKey(userId, language);
    this.conversationHistory.delete(key);
  }

  getEurostatContext(history) {
    if (!history || history.length === 0) return null;

    const currentMessage = history[history.length - 1];
    return {
      lastQuery: currentMessage.message,
      intent: currentMessage.intent,
      entities: currentMessage.entities
    };
  }

  async processEurostatQuery(query, language = CONFIG.DEFAULT_LANGUAGE) {
    this.eurostatModule.setLanguage(language);
    return await this.eurostatModule.processQuery(query);
  }
}

export const contextManager = new ContextManager();