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

  extractTermsFromMessage(input, dictionary) {
    const words = input.toLowerCase().split(/\s+/);
    const terms = new Set();
    const partialMatches = new Set();

    // First pass: try to find exact energy terms
    Object.entries(dictionary).forEach(([term, def]) => {
      const termLower = term.toLowerCase();
      if (words.includes(termLower) || input.includes(termLower)) {
        terms.add(term);
      }
    });

    // Second pass: try alternative names and partial matches
    if (terms.size === 0) {
      Object.entries(dictionary).forEach(([term, def]) => {
        const termLower = term.toLowerCase();
        const title = def.title?.toLowerCase() || '';
        
        // Check for partial matches in the term or title
        if (words.some(word => {
          const isPartialMatch = termLower.includes(word) || title.includes(word);
          if (isPartialMatch) partialMatches.add(term);
          return isPartialMatch;
        })) {
          terms.add(term);
        }
        
        // Check in text content
        if (def.text?.toLowerCase().includes(input)) {
          terms.add(term);
          // Store all related fuels as partial matches
          if (def.subFuels) partialMatches.add(...def.subFuels);
          if (def.related) partialMatches.add(...def.related);
        }
      });
    }

    const result = Array.from(terms);
    return {
      exactMatches: result,
      partialMatches: Array.from(partialMatches).filter(match => !result.includes(match))
    };
  }

  checkRelationship(message, language = CONFIG.DEFAULT_LANGUAGE) {
    if (!message) return null;

    const lowercaseInput = message.toLowerCase();
    const dictionary = energyDictionary[language] || energyDictionary[CONFIG.DEFAULT_LANGUAGE];
    const relationshipDict = relationshipPatterns[language] || relationshipPatterns[CONFIG.DEFAULT_LANGUAGE];
    
    // Check if the message matches any relationship pattern
    const isRelationshipQuestion = relationshipDict.patterns.some(pattern => pattern.test(lowercaseInput));

    if (!isRelationshipQuestion) return null;

    // Extract terms from the input with partial matches
    const { exactMatches: terms, partialMatches } = this.extractTermsFromMessage(lowercaseInput, dictionary);
    
    // If we have no energy terms at all but have partial matches, suggest the main category
    if (terms.length === 0 && partialMatches.length > 0) {
      const mainTerm = partialMatches[0];
      const def = dictionary[mainTerm];
      
      if (!def) return null;

      // Get related terms for suggestions
      const suggestions = [
        ...(def.subFuels || []),
        ...(def.related || [])
      ].filter(term => term !== mainTerm);

      return {
        isRelationshipQuestion: true,
        isRelated: false,
        relationshipType: 'suggestion',
        terms: [{
          term: mainTerm,
          definition: def
        }],
        suggestions,
        response: getRandomElement(relationshipDict.responses.suggestion || relationshipDict.responses.single_term)
          .replace('{term1}', def.title || mainTerm)
      };
    }

    // If we have no exact matches at all, return null
    if (terms.length === 0) return null;

    // If we found only one energy term
    if (terms.length === 1) {
      const [energyTerm] = terms;
      const def = dictionary[energyTerm];
      
      // Get related terms for suggestions
      const suggestions = [
        ...(def.subFuels || []),
        ...(def.related || [])
      ].filter(term => term !== energyTerm);

      return {
        isRelationshipQuestion: true,
        isRelated: false,
        relationshipType: 'single_term',
        terms: [{
          term: energyTerm,
          definition: def
        }],
        suggestions,
        response: getRandomElement(relationshipDict.responses.single_term)
          .replace('{term1}', def.title || energyTerm)
      };
    }

    // For multiple terms, we'll only consider the first two valid energy terms
    const [term1, term2] = terms;
    const def1 = dictionary[term1];
    const def2 = dictionary[term2];

    // Both terms must be valid energy terms
    if (!def1 || !def2) {
      const validTerm = def1 ? term1 : (def2 ? term2 : null);
      if (validTerm) {
        const def = dictionary[validTerm];
        return {
          isRelationshipQuestion: true,
          isRelated: false,
          relationshipType: 'single_term',
          terms: [{
            term: validTerm,
            definition: def
          }],
          response: getRandomElement(relationshipDict.responses.invalid_comparison)
            .replace('{term1}', def.title || validTerm)
        };
      }
      return null;
    }

    const isRelated = this.checkTermRelationship(def1, def2, term1, term2);
    const relationshipType = this.determineRelationshipType(def1, def2, term1, term2);
    
    const response = this.createRelationshipResponse(isRelated, relationshipType, def1, def2, term1, term2, language);

    // Add relationship details to context without recursion
    this.addRelationshipToHistory('default', message, {
      intent: 'relationship_query',
      energyTypes: [term1, term2]
    }, language);

    return response;
  }

  // New helper method to safely add relationship to history
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

  findTermsInDefinitions(input, dictionary, terms) {
    Object.entries(dictionary).forEach(([term, def]) => {
      if (def.text && def.text.toLowerCase().includes(input)) {
        terms.push(term);
      }
    });
  }

  checkTermRelationship(def1, def2, term1, term2) {
    return (
      this.hasDirectRelationship(def1, def2, term1, term2) ||
      this.hasHierarchicalRelationship(def1, def2, term1, term2) ||
      this.hasCategoryRelationship(def1, def2) ||
      this.hasTextualRelationship(def1, def2)
    );
  }

  hasDirectRelationship(def1, def2, term1, term2) {
    return def1.related?.includes(term2) || def2.related?.includes(term1);
  }

  hasHierarchicalRelationship(def1, def2, term1, term2) {
    return (
      def1.subFuels?.includes(term2) ||
      def2.subFuels?.includes(term1) ||
      def1.parentFuel === term2 ||
      def2.parentFuel === term1 ||
      def1.derivedFrom?.includes(term2) ||
      def2.derivedFrom?.includes(term1)
    );
  }

  hasCategoryRelationship(def1, def2) {
    return (
      def1.category === def2.category ||
      def1.family === def2.family ||
      def1.subFamily === def2.subFamily
    );
  }

  hasTextualRelationship(def1, def2) {
    const text1 = def1.text?.toLowerCase() || '';
    const text2 = def2.text?.toLowerCase() || '';
    const title1 = def1.title?.toLowerCase() || '';
    const title2 = def2.title?.toLowerCase() || '';

    // Get relationship terms from dictionary
    const allTerms = Object.values(relationshipPatterns[CONFIG.DEFAULT_LANGUAGE].terms).flat();

    // Direct mention check
    const hasDirectMention = text1.includes(title2) || text2.includes(title1);

    // Term relationship check
    const hasTermRelation = allTerms.some(term => 
      (text1.includes(term) && text1.includes(title2)) ||
      (text2.includes(term) && text2.includes(title1))
    );

    // Sentence level check
    const sentences1 = text1.split(/[.!?]+/);
    const sentences2 = text2.split(/[.!?]+/);

    const hasSentenceRelation = sentences1.some(sentence => 
      sentence.includes(title2) && allTerms.some(term => sentence.includes(term))
    ) || sentences2.some(sentence => 
      sentence.includes(title1) && allTerms.some(term => sentence.includes(term))
    );

    return hasDirectMention || hasTermRelation || hasSentenceRelation;
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
    } else if (this.hasTextualRelationship(def1, def2)) {
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