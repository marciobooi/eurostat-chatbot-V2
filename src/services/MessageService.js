import { welcomeMessages } from '../dictionaries/welcomeMessages';
import { unknownResponses } from '../dictionaries/unknownResponses';
import { energyDefinitionsEn } from '../dictionaries/energyDefinitionsEn';
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

export class MessageService {
  static instance = null;
  
  static getInstance() {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }
    return MessageService.instance;
  }

  static getRandomMessage(dictionary, language = 'en') {
    const messages = dictionary[language] || dictionary.en;
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

    const response = {
      sender: 'bot',
      title: definition.title,
      text: typeof definition.text === 'string' ? definition.text : JSON.stringify(definition.text),
      language,
      suggestions: definition.subFuels || [],
      hasVisualization: definition.hasVisualization || false,
      visualizationType: definition.visualizationType || [], // Keep as array for available types
      dataset: definition.dataset,
      link: definition.link,
      fuelType: definition.fuelCode
    };

    return response;
  }

  static createUnknownResponse(language) {
    const unknownResponse = this.getRandomMessage(unknownResponses, language);
    const empathyPhrase = this.getRandomMessage(empathyPhrases, language);
    
    // Get main energy topics for suggestions
    const mainTopics = Object.entries(energyDictionary[language] || energyDictionary.en)
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
    // Get the array of visualization types from the original message
    const visualizationTypes = Array.isArray(originalMessage.visualizationType) 
      ? originalMessage.visualizationType 
      : originalMessage.visualizationType 
        ? [originalMessage.visualizationType]
        : [];

    return {
      ...originalMessage,
      sender: 'bot',
      isVisualization: true,
      visualizationType: visualizationTypes, // Keep all available visualization types
      currentVisualization: chartType, // Add current visualization type
      dataset: originalMessage.dataset,
      chartType: chartType, // Add explicit chart type for visualization components
      chartData: data || [], // Keep the transformed chart data
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

  static isGratitudeMessage(text) {
    return text.toLowerCase().includes('thank') || 
           text.toLowerCase().includes('thanks') || 
           text.toLowerCase().includes('appreciate');
  }

  static isFarewellMessage(text) {
    return text.toLowerCase().includes('bye') || 
           text.toLowerCase().includes('goodbye') || 
           text.toLowerCase().includes('see you');
  }

  static async processUserInput(input, language) {
    const nlpResults = await processText(input, language);
    const sentiment = analyzeSentiment(input, language);
    const definition = await findEnergyDefinition(input.trim(), language);

    const userMessage = this.createUserMessage(input, language);

    // Handle special message types
    if (this.isFarewellMessage(input)) {
      return [userMessage, this.createFarewellResponse(language)];
    }

    if (this.isGratitudeMessage(input)) {
      return [userMessage, this.createGratitudeResponse(language)];
    }

    // Handle normal responses
    const botResponse = definition ? 
      this.createBotResponse(definition, language) : 
      this.createUnknownResponse(language);

    return [userMessage, botResponse];
  }

  /**
   * Process and analyze an incoming message
   */
  async analyzeMessage(message) {
    const nlpResults = await Promise.all([
      processText(message, this.language),
      analyzeSentiment(message, this.language),
      extractEntities(message)
    ]);

    const [textAnalysis, sentiment, entities] = nlpResults;
    const topics = Object.keys(energyDictionary[this.language] || energyDictionary.en);
    const topicMatch = findBestMatch(message, topics);

    return {
      ...textAnalysis,
      sentiment,
      entities,
      topicMatch,
      isQuestion: this.isQuestion(message),
      dates: this.extractDates(message),
      affirmative: this.isAffirmative(message)
    };
  }

  /**
   * Check if message contains a question
   */
  isQuestion(message) {
    const questionPatterns = questionWords[this.language] || questionWords.en;
    return questionPatterns.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  /**
   * Extract dates from message using language-specific patterns
   */
  extractDates(message) {
    const patterns = datePatterns[this.language] || datePatterns.en;
    const matches = message.match(patterns.regex);
    return matches || [];
  }

  /**
   * Check if message is affirmative
   */
  isAffirmative(message) {
    const patterns = affirmativePatterns[this.language] || affirmativePatterns.en;
    return patterns.some(pattern => pattern.test(message));
  }

  /**
   * Filter common/stop words from message
   */
  filterCommonWords(message) {
    const words = message.toLowerCase().split(/\s+/);
    const stopWords = filteredWords[this.language] || filteredWords.en;
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