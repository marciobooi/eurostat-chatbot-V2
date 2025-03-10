/**
 * Handlers for creating and managing bot responses
 */
import { unknownResponses } from '../dictionaries/unknownResponses';
import { energyDefinitionsEn } from '../dictionaries/energyDefinitionsEn';

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
  // Handle case when no definition is found
  if (!definition) {
    return {
      sender: 'bot',
      text: getRandomUnknownResponse(language),
      language
    };
  }
  
  // Get the fuel type from the definition key
  const fuelType = Object.entries(energyDefinitionsEn).find(
    ([_, def]) => def.title === definition.title
  )?.[0] || definition.title?.toLowerCase();
  
  // Create structured bot response with all available information
  return {
    sender: 'bot',
    title: definition.title,
    text: definition.text,
    language,
    suggestions: definition.subFuels || [],
    hasVisualization: definition.hasVisualization || false,
    visualizationType: definition.visualizationType || [],
    dataset: definition.dataset,
    link: definition.link,
    fuelType // Include the fuel type in the response
  };
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