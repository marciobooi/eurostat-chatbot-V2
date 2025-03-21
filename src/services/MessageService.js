import { welcomeMessages } from '../dictionaries/welcomeMessages';
import { unknownResponses } from '../dictionaries/unknownResponses';
import { energyDefinitionsEn } from '../dictionaries/energyDefinitions/en';
import { findEnergyDefinition } from '../utils/energyHandlers';
import { getRandomElement } from '../utils/randomUtils';
import { processText, clearContext } from '../utils/nlpHandlers';
import { energyDictionary } from '../utils/energyDictionary';
import { affirmativePatterns } from '../dictionaries/affirmativeResponses';
import { datePatterns } from '../dictionaries/datePatterns';
import { empathyPhrases } from '../dictionaries/empathyPhrases';
import { followUpPhrases } from '../dictionaries/followUpQuestions';
import { goodbyeWords } from '../dictionaries/farewellWords';
import { gratitudeWords } from '../dictionaries/gratitudeWords';
import greetingPhrases from '../dictionaries/greetingPhrases';
import { CONFIG } from '../i18n';
import { NLP_CONFIG } from '../config/nlpConfig';

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

    // Enhance response with context awareness
    const baseResponse = {
      sender: 'bot',
      title: definition.title,
      text: typeof definition.text === 'string' ? definition.text : JSON.stringify(definition.text),
      language,
      suggestions: definition.subFuels || [],
      hasVisualization: definition.hasVisualization || false,
      visualizationType: definition.visualizationType || [],
      dataset: definition.dataset,
      link: definition.link,
      fuelType: definition.fuelCode
    };

    // Add contextual enhancements if available
    if (context) {
      const { topicChain, entities } = context;
      
      // Add related topics from conversation history
      if (topicChain?.length > 0) {
        baseResponse.relatedTopics = topicChain
          .map(topic => topic.mainTopic)
          .filter(topic => topic !== definition.fuelCode)
          .slice(0, 3);
      }

      // Add most referenced energy types as suggestions
      if (entities?.energyDomain?.energyTypes) {
        const energyTypes = entities.energyDomain.energyTypes
          .map(entity => entity.text)
          .filter(text => text !== definition.fuelCode)
          .slice(0, 2);

        baseResponse.suggestions = [
          ...new Set([...baseResponse.suggestions, ...energyTypes])
        ];
      }
    }

    return baseResponse;
  }

  static createUnknownResponse(language, context = null) {
    const unknownResponse = this.getRandomMessage(unknownResponses, language);
    const empathyPhrase = this.getRandomMessage(empathyPhrases, language);
    
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
      followUp: empathyPhrase
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

    // Process text with enhanced NLP
    const nlpResult = await processText(input, processLanguage);
    const userMessage = this.createUserMessage(input, processLanguage);

    // Handle special message types
    if (this.isGratitudeMessage(input, processLanguage)) {
      return [userMessage, this.createGratitudeResponse(processLanguage)];
    }

    if (this.isFarewellMessage(input, processLanguage)) {
      clearContext('default', processLanguage);
      return [userMessage, this.createFarewellResponse(processLanguage)];
    }

    // Direct topic request detection - if the message is very short and the intent is topic_request
    if (nlpResult.intent && 
        nlpResult.intent.primaryIntent === 'topic_request' && 
        input.trim().split(/\s+/).length <= 3) {
      // Try to find an exact match for the topic
      const definition = await findEnergyDefinition(input.trim(), processLanguage);
      if (definition) {
        return [userMessage, this.createBotResponse(definition, processLanguage, nlpResult.context)];
      }
    }

    // Get energy definition for normal processing
    const definition = await findEnergyDefinition(input.trim(), processLanguage);
    const botResponse = definition ? 
      this.createBotResponse(definition, processLanguage, nlpResult.context) : 
      this.createUnknownResponse(processLanguage, nlpResult.context);

    // Add intent information for better follow-up handling
    if (nlpResult.intent) {
      botResponse.intent = nlpResult.intent;
    }

    return [userMessage, botResponse];
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
  isQuestion(message, language) {
    const questionPatterns = questionWords[language] || questionWords.en;
    return questionPatterns.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );
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