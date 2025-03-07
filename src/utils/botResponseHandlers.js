/**
 * Handlers for creating and managing bot responses
 */

/**
 * Creates a bot response object from an energy definition
 * @param {Object} definition - The energy definition object
 * @param {string} language - The current language code
 * @returns {Object|null} The formatted bot response object
 */
export const createBotResponse = (definition, language) => {
  if (!definition) {
    return null;
  }
  
  return {
    sender: 'bot',
    title: definition.title,
    text: definition.text,
    language,
    suggestions: definition.subFuels || [],
    hasVisualization: definition.hasVisualization,
    visualizationType: definition.visualizationType
  };
};