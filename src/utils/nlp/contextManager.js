import { NLP_CONFIG } from '../../config/nlpConfig';
import { relationshipPatterns } from '../../dictionaries/relationshipPatterns';
import { energyDictionary } from '../energyDictionary';
import { CONFIG } from '../../i18n';
import { getRandomElement } from '../randomUtils';

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

    // Check for relationship question
    const relationshipInfo = this.checkRelationship(currentContext.message);

    return {
      currentTopic: this.extractCurrentTopic(currentContext),
      isFollowUp: this.isFollowUpQuestion(currentContext, previousContext),
      referencedEntities: this.getReferencedEntities(history),
      contextualIntent: this.getContextualIntent(currentContext, previousContext),
      topicChain: this.buildTopicChain(history),
      sentiment: this.getOverallSentiment(history),
      entities: currentContext.entities,
      relationship: relationshipInfo
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

  checkRelationship(message, language = CONFIG.DEFAULT_LANGUAGE) {
    if (!message) return null;

    const lowercaseInput = message.toLowerCase();
    const dictionary = energyDictionary[language] || energyDictionary[CONFIG.DEFAULT_LANGUAGE];
    const patterns = relationshipPatterns[language]?.patterns || relationshipPatterns[CONFIG.DEFAULT_LANGUAGE].patterns;
    
    // Enhanced relationship question detection
    const isRelationshipQuestion = patterns.some(pattern => pattern.test(lowercaseInput)) ||
      /\bis\s+.*\brelated\b|\brelation\b.*\bbetween\b|\bare\b.*\band\b.*\brelated\b/i.test(lowercaseInput);

    // Extract terms with improved matching
    const terms = Object.keys(dictionary).filter(term => {
      const termLower = term.toLowerCase();
      return lowercaseInput.includes(termLower) || 
             lowercaseInput.split(/\s+/).some(word => word.includes(termLower)) ||
             (dictionary[term].text && lowercaseInput.includes(term.toLowerCase()));
    });

    // Special handling for coke and coal products relationship
    if (terms.includes('coke') && terms.includes('coal_products')) {
      const def1 = dictionary['coke'];
      const def2 = dictionary['coal_products'];
      return this.createRelationshipResponse(true, 'child-parent', def1, def2, 'coke', 'coal_products', language);
    }

    // If we have less than 2 terms but the question is a relationship question,
    // try to find terms in definitions
    if (terms.length < 2 && isRelationshipQuestion) {
      const allTerms = Object.entries(dictionary);
      for (const [term, def] of allTerms) {
        if (def.text && def.text.toLowerCase().includes(lowercaseInput)) {
          terms.push(term);
        }
      }
    }

    if (terms.length < 2) return null;

    const [term1, term2] = terms;
    const def1 = dictionary[term1];
    const def2 = dictionary[term2];

    if (!def1 || !def2) return null;

    // Enhanced relationship checking
    const isRelated = (
      // Direct relationships
      def1.related?.includes(term2) ||
      def2.related?.includes(term1) ||
      // Hierarchical relationships
      def1.subFuels?.includes(term2) ||
      def2.subFuels?.includes(term1) ||
      def1.parentFuel === term2 ||
      def2.parentFuel === term1 ||
      // Category relationships
      def1.category === def2.category ||
      def1.family === def2.family ||
      def1.subFamily === def2.subFamily ||
      // Text-based relationship detection
      (def1.text && (
        def1.text.toLowerCase().includes(term2.toLowerCase()) ||
        def1.text.toLowerCase().includes(def2.title?.toLowerCase() || '')
      )) ||
      (def2.text && (
        def2.text.toLowerCase().includes(term1.toLowerCase()) ||
        def2.text.toLowerCase().includes(def1.title?.toLowerCase() || '')
      )) ||
      // Production/derivation relationships
      def1.derivedFrom?.includes(term2) ||
      def2.derivedFrom?.includes(term1) ||
      // Check if one is mentioned in the other's definition
      this.checkTextualRelationship(def1, def2)
    );

    return this.createRelationshipResponse(isRelated, this.determineRelationshipType(def1, def2, term1, term2), def1, def2, term1, term2, language);
  }

  checkTextualRelationship(def1, def2) {
    const text1 = def1.text?.toLowerCase() || '';
    const text2 = def2.text?.toLowerCase() || '';
    const title1 = def1.title?.toLowerCase() || '';
    const title2 = def2.title?.toLowerCase() || '';

    // Enhanced text relationship checking
    const relationshipTerms = [
      'include', 'includes', 'including',
      'derive', 'derives', 'derived',
      'produce', 'produces', 'produced',
      'made from', 'processed from',
      'refined from', 'based on'
    ];

    // Check for direct mention
    const hasDirectMention = text1.includes(title2) || text2.includes(title1);

    // Check for relationship terms
    const hasRelationshipTerm = relationshipTerms.some(term => 
      (text1.includes(term) && text1.includes(title2)) ||
      (text2.includes(term) && text2.includes(title1))
    );

    // Check for co-occurrence of terms in the same sentence
    const sentences1 = text1.split(/[.!?]+/);
    const sentences2 = text2.split(/[.!?]+/);
    
    const hasSentenceRelation = sentences1.some(sentence => 
      sentence.includes(title2) && relationshipTerms.some(term => sentence.includes(term))
    ) || sentences2.some(sentence => 
      sentence.includes(title1) && relationshipTerms.some(term => sentence.includes(term))
    );

    return hasDirectMention || hasRelationshipTerm || hasSentenceRelation;
  }

  hasCommonTerms(text1, text2) {
    // List of significant terms that indicate relationship
    const significantTerms = ['derived', 'produced', 'made', 'processed', 'refined', 'extracted', 'source'];
    return significantTerms.some(term => text1.includes(term) && text2.includes(term));
  }

  determineRelationshipType(def1, def2, term1, term2) {
    if (def1.subFuels?.includes(term2) || def2.parentFuel === term1) {
      return 'parent-child';
    } else if (def2.subFuels?.includes(term1) || def1.parentFuel === term2) {
      return 'child-parent';
    } else if (def1.family === def2.family) {
      return 'same-family';
    } else if (def1.category === def2.category) {
      return 'same-category';
    } else if (def1.derivedFrom?.includes(term2) || def2.derivedFrom?.includes(term1)) {
      return 'derived';
    } else if (this.checkTextualRelationship(def1, def2)) {
      return 'textual';
    }
    return '';
  }

  createRelationshipResponse(isRelated, relationshipType, def1, def2, term1, term2, language) {
    const responses = relationshipPatterns[language]?.responses || relationshipPatterns[CONFIG.DEFAULT_LANGUAGE].responses;
    const responseList = isRelated ? responses.positive : responses.negative;
    
    const response = getRandomElement(responseList)
      .replace('{term1}', def1.title || term1)
      .replace('{term2}', def2.title || term2);

    return {
      isRelated,
      relationshipType,
      terms: [
        {term: term1, definition: def1},
        {term: term2, definition: def2}
      ],
      response,
      isRelationshipQuestion: true
    };
  }

  clearContext(userId, language) {
    const key = this.getConversationKey(userId, language);
    this.conversationHistory.delete(key);
  }
}

export const contextManager = new ContextManager();