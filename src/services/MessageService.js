import { welcomeMessages } from '../dictionaries/welcomeMessages';
import { unknownResponses } from '../dictionaries/unknownResponses';
import { findEnergyDefinition } from '../utils/energyHandlers';
import { getRandomElement } from '../utils/randomUtils';
import { processText, clearContext, analyzeSentiment, extractEntities, findBestMatch } from '../utils/nlpHandlers';
import { energyDictionary } from '../utils/energyDictionary';
import { empathyPhrases } from '../dictionaries/empathyPhrases';
import { followUpPhrases } from '../dictionaries/followUpQuestions';
import { goodbyeWords } from '../dictionaries/farewellWords';
import { gratitudeWords } from '../dictionaries/gratitudeWords';
import { gratitudeMessages } from '../dictionaries/gratitudeMessages';
import { questionWords } from '../dictionaries/questionWords';
import greetingPhrases from '../dictionaries/greetingPhrases';
import { CONFIG } from '../i18n';
import { NLP_CONFIG } from '../config/nlpConfig';
import { contextManager } from '../utils/nlp/contextManager';
import { relationshipPatterns } from '../dictionaries/relationshipPatterns';
import { errorMessages } from '../dictionaries/errorMessages';
import { farewellMessages } from '../dictionaries/farewellMessages';
import { saveChatToCookie } from '../utils/storageHandlers';
import { affirmativePatterns } from '../dictionaries/affirmativeResponses';
import { datePatterns } from '../dictionaries/datePatterns';
import { filteredWords } from '../dictionaries/filteredWords';
import i18n from 'i18next';
import COUNTRY_MAP from '../dictionaries/countries';
import { commonQuestionPhrases } from '../dictionaries/questionPhrases';

export class MessageService {
  static instance = null;
  
  static getInstance() {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }
    return MessageService.instance;
  }

  static getRandomMessage(dictionary, language) {
    const messages = dictionary[language] || dictionary[CONFIG.DEFAULT_LANGUAGE];
    return getRandomElement(messages);
  }

  static createWelcomeMessage(language) {
    clearContext('default', language); // Reset context for new conversation
    return {
      sender: 'bot',
      text: this.getRandomMessage(welcomeMessages, language),
      language
    };
  }

  static createUserMessage(text, language) {
    return {
      sender: 'user',
      text: text.trim(),
      language
    };
  }

  static createBotResponse(definition, language, context = null) {
    if (!definition) {
      return this.createUnknownResponse(language, context);
    }

    // Check if we have a relationship question match
    if (context?.relationshipInfo) {
      const relationshipInfo = context.relationshipInfo;
      if (relationshipInfo.isRelationshipQuestion && relationshipInfo.terms?.length > 0) {
        return {
          sender: 'bot',
          text: relationshipInfo.response,
          language,
          suggestions: relationshipInfo.terms.map(t => t.term),
          isRelationship: true,
          relationshipType: relationshipInfo.relationshipType,
          terms: relationshipInfo.terms,
          hasVisualization: relationshipInfo.terms[0].definition.hasVisualization || false,
          visualizationType: relationshipInfo.terms[0].definition.visualizationType || [],
          dataset: relationshipInfo.terms[0].definition.dataset,
          fuelType: relationshipInfo.terms[0].term
        };
      }
    }

    const baseResponse = {
      sender: 'bot',
      title: definition.title,
      text: definition.text,
      language,
      suggestions: [...(definition.subFuels || []), ...(definition.related || [])],
      hasVisualization: definition.hasVisualization || false,
      visualizationType: definition.visualizationType || [],
      dataset: definition.dataset,
      link: definition.link,
      fuelType: definition.fuelCode,
      intent: context?.intent
    };

    // Add contextual enhancements if available
    if (context) {
      const { topicChain, entities } = context;
      
      if (topicChain?.length > 0) {
        baseResponse.relatedTopics = topicChain
          .map(topic => topic.mainTopic)
          .filter(topic => topic !== definition.fuelCode)
          .slice(0, NLP_CONFIG.questionProcessing.maxRelatedTopics);
      }

      if (entities?.energyDomain?.energyTypes) {
        const energyTypes = entities.energyDomain.energyTypes
          .map(entity => entity.text)
          .filter(text => text !== definition.fuelCode)
          .slice(0, NLP_CONFIG.questionProcessing.maxSuggestions);

        baseResponse.suggestions = [
          ...new Set([...baseResponse.suggestions, ...energyTypes])
        ];
      }

      // Add followup suggestions based on key concepts
      if (definition.key_concepts && definition.key_concepts.length > 0) {
        baseResponse.followupSuggestions = definition.key_concepts
          .slice(0, NLP_CONFIG.questionProcessing.maxFollowupSuggestions);
      }
    }

    return baseResponse;
  }

  static createUnknownResponse(language, context = null) {
    const unknownResponse = this.getRandomMessage(unknownResponses, language);
    const empathyPhrase = this.getRandomMessage(empathyPhrases, language);
    const followUpPhrase = this.getRandomMessage(followUpPhrases[language] || followUpPhrases[CONFIG.DEFAULT_LANGUAGE]);
    
    // Get suggestions based on context if available
    let suggestions = [];
    if (context) {
      const { entities, currentTopic } = context;
      
      if (currentTopic?.mainTopic) {
        // Add related topics from the energy dictionary
        const dictionary = energyDictionary[language] || energyDictionary[CONFIG.DEFAULT_LANGUAGE];
        const topic = dictionary[currentTopic.mainTopic];
        if (topic?.related) {
          suggestions.push(...topic.related);
        }
      }

      // Add energy types from entities
      if (entities?.energyDomain?.energyTypes) {
        suggestions.push(
          ...entities.energyDomain.energyTypes
            .map(entity => entity.text)
            .slice(0, 2)
        );
      }
    }

    // Fallback to main topics if no contextual suggestions
    if (suggestions.length === 0) {
      const dictionary = energyDictionary[language] || energyDictionary[CONFIG.DEFAULT_LANGUAGE];
      suggestions = Object.entries(dictionary)
        .filter(([_, def]) => def.isMainFuel)
        .map(([key]) => key)
        .slice(0, 3);
    }

    return {
      sender: 'bot',
      text: unknownResponse,
      language,
      suggestions: [...new Set(suggestions)],
      followUp: `${empathyPhrase} ${followUpPhrase}`
    };
  }

  static createVisualizationMessage(originalMessage, chartType, data, language) {
    const visualizationTypes = Array.isArray(originalMessage.visualizationType) 
      ? originalMessage.visualizationType 
      : originalMessage.visualizationType 
        ? [originalMessage.visualizationType]
        : [];

    return {
      ...originalMessage,
      sender: 'bot',
      isVisualization: true,
      visualizationType: visualizationTypes,
      currentVisualization: chartType,
      dataset: originalMessage.dataset,
      chartType: chartType,
      chartData: data || [],
      fuelType: originalMessage.fuelType,
      text: data?.length ? 
        `visualization.${chartType}.title` : 
        'visualization.loading',
      language,
      hasVisualization: true,
      suggestions: originalMessage.suggestions || []
    };
  }

  static createErrorResponse(language) {
    return {
      sender: 'bot',
      text: this.getRandomMessage(errorMessages, language),
      isError: true,
      language
    };
  }

  static createGratitudeResponse(language) {
    return {
      sender: 'bot',
      text: this.getRandomMessage(gratitudeMessages, language),
      language
    };
  }

  static createFarewellResponse(language) {
    return {
      sender: 'bot',
      text: this.getRandomMessage(farewellMessages, language),
      language
    };
  }

  static isGratitudeMessage(text, language) {
    const words = gratitudeWords[language] || gratitudeWords[CONFIG.DEFAULT_LANGUAGE];
    return words.some(word => 
      text.toLowerCase().includes(word.toLowerCase())
    );
  }

  static isFarewellMessage(text, language) {
    const words = goodbyeWords[language] || goodbyeWords[CONFIG.DEFAULT_LANGUAGE];
    return words.some(word => 
      text.toLowerCase().includes(word.toLowerCase())
    );
  }

  static isGreetingMessage(text, language) {
    const phrases = greetingPhrases[language] || greetingPhrases[CONFIG.DEFAULT_LANGUAGE];
    return phrases.some(phrase => 
      text.toLowerCase().includes(phrase.toLowerCase())
    );
  }

  static async processUserInput(input, language) {
    const processLanguage = CONFIG.SUPPORTED_LANGUAGES.includes(language) 
      ? language 
      : CONFIG.DEFAULT_LANGUAGE;

    // Create user message first
    const userMessage = this.createUserMessage(input, processLanguage);

    // Try to process as Eurostat query first before any other checks
    try {
      const eurostatResponse = await contextManager.processEurostatQuery(input, processLanguage);
      if (eurostatResponse?.isEurostatQuery) {
        const { queryType, country, dateInfo, energyBalance } = eurostatResponse.queryInfo;
        const { data } = eurostatResponse;

        // Use the actual dimension labels from the response
        const dimensions = data?.dimensions || {};
        const metadata = data?.metadata || {};

        // Format the message text with source in brackets
        const text = `Here's the ${data.bal.toLowerCase()} data for ${data.siec.toLowerCase()} in ${data.country} for ${data.year}: ${data.value} ${data.unit} [Source: Eurostat]`;

        const botResponse = {
          sender: 'bot',
          text: text,
          language: processLanguage,
          isEurostatQuery: true,
          link: data.metadata?.url || 'https://ec.europa.eu/eurostat/databrowser/view/nrg_cb_sff/default/table?lang=en',
          queryInfo: {
            ...eurostatResponse.queryInfo,
            dimensions,
            metadata
          }
        };

        const messages = [userMessage, botResponse];
        saveChatToCookie(messages);
        return messages;
      }
    } catch (error) {
      console.error('Error processing Eurostat query:', error);
      // Continue with normal processing if Eurostat query fails
    }

    // Check special message types after Eurostat check
    if (this.isGreetingMessage(input, processLanguage)) {
      const messages = [userMessage, this.createWelcomeMessage(processLanguage)];
      saveChatToCookie(messages);
      return messages;
    }

    if (this.isGratitudeMessage(input, processLanguage)) {
      const messages = [userMessage, this.createGratitudeResponse(processLanguage)];
      saveChatToCookie(messages);
      return messages;
    }

    if (this.isFarewellMessage(input, processLanguage)) {
      clearContext('default', processLanguage);
      const messages = [userMessage, this.createFarewellResponse(processLanguage)];
      saveChatToCookie(messages);
      return messages;
    }

    // First check if it's a relationship question, before doing any other processing
    const relationshipInfo = contextManager.checkRelationship(input, processLanguage);
    if (relationshipInfo?.isRelationshipQuestion) {
      const botResponse = {
        sender: 'bot',
        text: relationshipInfo.response,
        language: processLanguage,
        suggestions: relationshipInfo.suggestions || (relationshipInfo.terms ? relationshipInfo.terms.map(t => t.term) : []),
        isRelationship: true,
        relationshipType: relationshipInfo.relationshipType,
        terms: relationshipInfo.terms
      };

      const messages = [userMessage, botResponse];
      saveChatToCookie(messages);
      return messages;
    }

    // If not a relationship question, continue with NLP processing and definition lookup
    const nlpResult = await processText(input, processLanguage);
    const definition = await findEnergyDefinition(input.trim(), processLanguage);
    const botResponse = definition ? 
      this.createBotResponse(definition, processLanguage, nlpResult.context) : 
      this.createUnknownResponse(processLanguage, nlpResult.context);

    if (nlpResult.intent) {
      botResponse.intent = nlpResult.intent;
    }

    const messages = [userMessage, botResponse];
    saveChatToCookie(messages);
    return messages;
  }

  /**
   * Process and analyze an incoming message
   */
  static async analyzeMessage(message, language = CONFIG.DEFAULT_LANGUAGE) {
    const nlpResults = await Promise.all([
      processText(message, language),
      analyzeSentiment(message, language),
      extractEntities(message)
    ]);

    const [textAnalysis, sentiment, entities] = nlpResults;
    const dictionary = energyDictionary[language] || energyDictionary[CONFIG.DEFAULT_LANGUAGE];
    const topics = Object.keys(dictionary);
    const topicMatch = findBestMatch(message, topics);

    return {
      ...textAnalysis,
      sentiment,
      entities,
      topicMatch,
      isQuestion: this.isQuestion(message, language),
      dates: this.extractDates(message, language),
      affirmative: this.isAffirmative(message, language)
    };
  }

  /**
   * Check if message contains a question
   */
  static isQuestion(message, language) {
    // First check question word patterns
    const questionPatterns = questionWords[language] || questionWords.en;
    const hasQuestionWord = questionPatterns.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );

    if (hasQuestionWord) return true;

    // Then check complex question phrase patterns
    const phrasePatterns = commonQuestionPhrases[language] || commonQuestionPhrases.en;
    return phrasePatterns.some(pattern => pattern.test(message));
  }

  /**
   * Extract dates from message using language-specific patterns
   */
  extractDates(message, language) {
    const patterns = datePatterns[language] || datePatterns.en;
    const matches = message.match(patterns.regex);
    return matches || [];
  }

  /**
   * Check if message is affirmative
   */
  isAffirmative(message, language) {
    const patterns = affirmativePatterns[language] || affirmativePatterns.en;
    return patterns.some(pattern => pattern.test(message));
  }

  /**
   * Filter common/stop words from message
   */
  filterCommonWords(message, language) {
    const words = message.toLowerCase().split(/\s+/);
    const stopWords = filteredWords[language] || filteredWords.en;
    return words.filter(word => !stopWords.includes(word)).join(' ');
  }

  /**
   * Set the current language for the service
   */
  setLanguage(language) {
    this.language = language;
  }
}

export default MessageService;