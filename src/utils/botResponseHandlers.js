/**
 * Handlers for creating and managing bot responses
 */
import { unknownResponses } from '../dictionaries/unknownResponses';
import { energyDefinitionsEn } from '../dictionaries/energyDefinitionsEn';
import { processText, analyzeSentiment, findBestMatch, processQuestion } from './nlpHandlers';
import { energyDictionary } from './energyDictionary';
import { welcomeMessages } from '../dictionaries/welcomeMessages';
import { farewellMessages } from '../dictionaries/farewellMessages';
import { gratitudeMessages } from '../dictionaries/gratitudeMessages';
import { errorMessages } from '../dictionaries/errorMessages';
import { empathyPhrases } from '../dictionaries/empathyPhrases';
import { followUpPhrases } from '../dictionaries/followUpQuestions';
import { getRandomElement } from './randomUtils';

/**
 * Get a random response when the bot doesn't understand the query
 * @param {string} language - The current language code
 * @returns {string} A random unknown response message
 */
export const getRandomUnknownResponse = (language = 'en') => {
  const responses = unknownResponses[language] || unknownResponses.en;
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
};

/**
 * Creates a bot response object from an energy definition
 * @param {Object|null} definition - The energy definition object
 * @param {string} definition.title - Title of the energy topic
 * @param {string} definition.text - Description text of the energy topic
 * @param {string[]} [definition.subFuels] - Array of related subtopics
 * @param {boolean} [definition.hasVisualization] - Whether the topic has visualizations
 * @param {string[]} [definition.visualizationType] - Types of visualizations available
 * @param {string} language - The current language code
 * @returns {Object} The formatted bot response object
 */
export const createBotResponse = (definition, language = 'en') => {
  try {
    // Helper function to ensure text is a string
    const ensureString = (text) => {
      if (text === undefined || text === null) return '';
      return typeof text === 'string' ? text : JSON.stringify(text);
    };

    // If no definition or it's just a text response
    if (!definition || (!definition.title && !definition.text)) {
      return {
        sender: 'bot',
        text: definition?.text ? ensureString(definition.text) : getRandomElement(unknownResponses[language] || unknownResponses.en),
        language
      };
    }

    // Return full bot response with all energy definition data
    return {
      sender: 'bot',
      title: definition.title,
      text: ensureString(definition.text),
      language,
      suggestions: definition.subFuels || [],
      hasVisualization: definition.hasVisualization || false,
      visualizationType: definition.visualizationType || [],
      dataset: definition.dataset,
      link: definition.link,
      fuelType: definition.fuelCode
    };
  } catch (error) {
    console.error('Error creating bot response:', error);
    return {
      sender: 'bot',
      text: getRandomElement(unknownResponses[language] || unknownResponses.en),
      language
    };
  }
};

/**
 * Creates an error response from the bot
 * @param {string} errorMessage - The error message to display
 * @param {string} language - The current language code
 * @returns {Object} The formatted error response object
 */
export const createErrorResponse = (errorMessage, language = 'en') => {
  return {
    sender: 'bot',
    text: errorMessage,
    isError: true,
    language
  };
};

export const processUserMessage = async (message, language = 'en') => {
  try {
    const nlpResults = processText(message, language);
    const questionAnalysis = processQuestion(message, language);
    const sentiment = analyzeSentiment(message, language);

    // Get all available topics from energy dictionary
    const topics = Object.keys(energyDefinitionsEn);
    
    // Find best matching topic
    const cleanedMessage = message.toLowerCase().trim();
    const topicMatch = findBestMatch(cleanedMessage, topics);

    // Get the matching topic definition
    const matchedTopic = topicMatch.rating > 0.4 ? energyDefinitionsEn[topics[topicMatch.bestMatchIndex]] : null;

    return {
      isQuestion: questionAnalysis.questionType !== 'statement',
      topic: matchedTopic,
      nlpData: {
        ...nlpResults,
        ...questionAnalysis,
        sentiment
      }
    };
  } catch (error) {
    console.error('Error processing message:', error);
    return {
      isQuestion: false,
      topic: null,
      nlpData: {
        sentiment: { score: 0, comparative: 0 }
      }
    };
  }
};

export const generateBotResponse = (processedMessage, language = 'en') => {
  try {
    const { nlpData, topic, isQuestion } = processedMessage;
    
    // Handle farewells first as they should take priority
    const text = nlpData.topics?.[0]?.text?.toLowerCase() || '';
    if (text.includes('bye') || text.includes('goodbye') || text.includes('see you')) {
      const farewell = getRandomElement(farewellMessages[language] || farewellMessages.en);
      return {
        sender: 'bot',
        text: farewell,
        language
      };
    }

    // Then handle gratitude expressions
    if (text.includes('thank') || text.includes('thanks') || text.includes('appreciate')) {
      const gratitude = getRandomElement(gratitudeMessages[language] || gratitudeMessages.en);
      return {
        sender: 'bot',
        text: gratitude,
        language
      };
    }
    
    // If we have a matching topic, return the full definition
    if (topic) {
      const response = {
        sender: 'bot',
        title: topic.title,
        text: typeof topic.text === 'string' ? topic.text : JSON.stringify(topic.text),
        language,
        suggestions: topic.subFuels || [],
        hasVisualization: topic.hasVisualization || false,
        visualizationType: topic.visualizationType || [],
        dataset: topic.dataset,
        link: topic.link,
        fuelType: topic.fuelCode
      };

      // Add follow-up question if appropriate
      if (isQuestion && followUpPhrases[language]) {
        response.followUp = getRandomElement(followUpPhrases[language]);
      }

      return response;
    }
  
    // For unknown topics, combine unknown response with empathy and suggestions
    const unknownResponse = getRandomElement(unknownResponses[language] || unknownResponses.en);
    const empathyPhrase = getRandomElement(empathyPhrases[language] || empathyPhrases.en);
    
    // Get some main energy topics for suggestions
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

  } catch (error) {
    console.error('Error generating response:', error);
    const errorMessage = getRandomElement(errorMessages[language] || errorMessages.en);
    return createErrorResponse(errorMessage, language);
  }
};