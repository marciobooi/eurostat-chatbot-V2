import { welcomeMessages } from '../dictionaries/welcomeMessages';
import { unknownResponses } from '../dictionaries/unknownResponses';
import { energyDefinitionsEn } from '../dictionaries/energyDefinitions/en';
import { findEnergyDefinition } from '../utils/energyHandlers';
import { getRandomElement } from '../utils/randomUtils';
import { processText, analyzeSentiment, findBestMatch, extractEntities } from '../utils/nlpHandlers';
import { energyDictionary } from '../utils/energyDictionary';
import { affirmativePatterns } from '../dictionaries/affirmativeResponses';
import { datePatterns } from '../dictionaries/datePatterns';
import { questionWords } from '../dictionaries/questionWords';
import { filteredWords } from '../dictionaries/filteredWords';
import { farewellMessages } from '../dictionaries/farewellMessages';
import { gratitudeMessages } from '../dictionaries/gratitudeMessages';
import { errorMessages } from '../dictionaries/errorMessages';
import { empathyPhrases } from '../dictionaries/empathyPhrases';
import { followUpPhrases } from '../dictionaries/followUpQuestions';
import { goodbyeWords } from '../dictionaries/farewellWords';
import { gratitudeWords } from '../dictionaries/gratitudeWords';
import greetingPhrases from '../dictionaries/greetingPhrases';
import { CONFIG } from '../i18n';

export class MessageService {
  static instance = null;
  
  static getInstance() {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }
    return MessageService.instance;
  }

  static getRandomMessage(dictionary, language) {
    // Always use language fallback to default if needed
    const messages = dictionary[language] || dictionary[CONFIG.DEFAULT_LANGUAGE];
    return getRandomElement(messages);
  }

  static createWelcomeMessage(language) {
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

  static createBotResponse(definition, language) {
    if (!definition) {
      return this.createUnknownResponse(language);
    }

    // Use structured definition with language support
    const response = {
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

    return response;
  }

  static createUnknownResponse(language) {
    const unknownResponse = this.getRandomMessage(unknownResponses, language);
    const empathyPhrase = this.getRandomMessage(empathyPhrases, language);
    
    // Get main energy topics for suggestions using proper language fallback
    const dictionary = energyDictionary[language] || energyDictionary[CONFIG.DEFAULT_LANGUAGE];
    const mainTopics = Object.entries(dictionary)
      .filter(([_, def]) => def.isMainFuel)
      .map(([key]) => key)
      .slice(0, 3);

    return {
      sender: 'bot',
      text: unknownResponse,
      language,
      suggestions: mainTopics,
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
    // Always ensure valid language
    const processLanguage = CONFIG.SUPPORTED_LANGUAGES.includes(language) 
      ? language 
      : CONFIG.DEFAULT_LANGUAGE;

    const nlpResults = await processText(input, processLanguage);
    const sentiment = analyzeSentiment(input, processLanguage);
    const definition = await findEnergyDefinition(input.trim(), processLanguage);

    const userMessage = this.createUserMessage(input, processLanguage);

    if (this.isFarewellMessage(input, processLanguage)) {
      return [userMessage, this.createFarewellResponse(processLanguage)];
    }

    if (this.isGratitudeMessage(input, processLanguage)) {
      return [userMessage, this.createGratitudeResponse(processLanguage)];
    }

    const botResponse = definition ? 
      this.createBotResponse(definition, processLanguage) : 
      this.createUnknownResponse(processLanguage);

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