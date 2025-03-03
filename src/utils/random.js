import i18n from "../i18n";

/**
 * Pure utility functions for randomization
 * No hardcoded responses - only utility functions
 */

/**
 * Get a random item from an array
 * @param {Array} array - The array to get a random item from
 * @returns {*} A random item from the array
 */
export const getRandomFromArray = (array) => {
  if (!Array.isArray(array) || array.length === 0) return null;
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

/**
 * Get a random number between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number between min and max
 */
export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Randomly shuffle an array
 * @param {Array} array - The array to shuffle
 * @returns {Array} New shuffled array
 */
export const shuffleArray = (array) => {
  if (!Array.isArray(array)) return [];
  return [...array].sort(() => Math.random() - 0.5);
};

// ============== RESPONSE DICTIONARIES ==============

/**
 * Welcome messages in different languages
 */
const welcomeMessages = {
  en: [
    "Hello! How can I help you with energy statistics?",
    "Hi there! I can provide information about energy consumption and production.",
    "Greetings! Need help with energy statistics? I'm your assistant.",
    "Welcome! How may I assist you with energy data today?",
  ],
  fr: [
    "Bonjour ! Comment puis-je vous aider avec les statistiques énergétiques ?",
    "Salut ! Je peux vous fournir des informations sur la consommation et la production d'énergie.",
    "Bienvenue ! Besoin d'aide avec les statistiques énergétiques ?",
  ],
  de: [
    "Hallo! Wie kann ich Ihnen mit Energiestatistiken helfen?",
    "Guten Tag! Ich kann Ihnen Informationen über Energieverbrauch und -produktion geben.",
    "Willkommen! Brauchen Sie Hilfe mit Energiestatistiken?",
  ],
};

/**
 * Unknown response messages
 */
const unknownResponses = {
  en: [
    "I specialize in energy statistics. Could you rephrase your question about energy data?",
    "That's beyond my knowledge, but feel free to ask me about energy consumption or production.",
    "I'm focused on energy topics. How can I help you with energy-related questions?",
  ],
  fr: [
    "Je suis spécialisé dans les statistiques énergétiques. Pourriez-vous reformuler votre question ?",
    "Cela dépasse mes connaissances, mais n'hésitez pas à me poser des questions sur l'énergie.",
    "Je me concentre sur les sujets énergétiques. Comment puis-je vous aider ?",
  ],
  de: [
    "Ich bin auf Energiestatistiken spezialisiert. Könnten Sie Ihre Frage zur Energie umformulieren?",
    "Das übersteigt mein Wissen, aber fragen Sie mich gerne zur Energienutzung oder -produktion.",
    "Ich konzentriere mich auf Energiethemen. Wie kann ich Ihnen mit energiebezogenen Fragen helfen?",
  ],
};

/**
 * Contextual response templates
 */
const contextualResponses = {
  en: {
    empathyPrefix: "I understand your interest in this topic.",
    reassurancePrefix: "Here's what I know about that:",
    gratitudeSuffix: "Hope that helps!",
    followUpSuggestion: "Would you like to know more about {topic}?",
  },
  fr: {
    empathyPrefix: "Je comprends votre intérêt pour ce sujet.",
    reassurancePrefix: "Voici ce que je sais à ce sujet :",
    gratitudeSuffix: "J'espère que cela vous aide !",
    followUpSuggestion: "Souhaitez-vous en savoir plus sur {topic} ?",
  },
  de: {
    empathyPrefix: "Ich verstehe Ihr Interesse an diesem Thema.",
    reassurancePrefix: "Hier ist, was ich darüber weiß:",
    gratitudeSuffix: "Ich hoffe, das hilft Ihnen weiter!",
    followUpSuggestion: "Möchten Sie mehr über {topic} erfahren?",
  },
};

/**
 * Error response messages
 */
const errorResponses = {
  en: [
    "I'm sorry, I encountered an error while processing your request.",
    "Oops, something went wrong. Could you try asking in a different way?",
    "I'm having trouble understanding that. Could you rephrase?",
  ],
  fr: [
    "Je suis désolé, j'ai rencontré une erreur lors du traitement de votre demande.",
    "Oups, quelque chose s'est mal passé. Pourriez-vous essayer de demander différemment ?",
    "J'ai du mal à comprendre. Pourriez-vous reformuler ?",
  ],
  de: [
    "Es tut mir leid, bei der Verarbeitung Ihrer Anfrage ist ein Fehler aufgetreten.",
    "Ups, etwas ist schiefgelaufen. Könnten Sie es anders formulieren?",
    "Ich habe Schwierigkeiten, das zu verstehen. Könnten Sie es umformulieren?",
  ],
};

// ============== RESPONSE GENERATION FUNCTIONS ==============

/**
 * Get a random welcome message
 * @param {string} language - Language code
 * @returns {string} Welcome message
 */
export const getRandomWelcomeMessage = (language = "en") => {
  const messages = welcomeMessages[language] || welcomeMessages.en;
  return getRandomFromArray(messages);
};

/**
 * Get a random unknown response
 * @param {string} language - Language code
 * @param {Object} matchInfo - Optional match information
 * @returns {string} Unknown response message
 */
export const getRandomUnknownResponse = (language = "en", matchInfo = null) => {
  const responses = unknownResponses[language] || unknownResponses.en;
  let response = getRandomFromArray(responses);

  // Add suggestion based on partial match if available
  if (matchInfo && matchInfo.topic && matchInfo.score > 0.3) {
    const suggestionText = i18n.t("partialMatchSuggestion", {
      topic: matchInfo.topic,
      lng: language,
    });
    response += " " + suggestionText;
  }

  return response;
};

/**
 * Get a random error response
 * @param {string} language - Language code
 * @returns {string} Error response message
 */
export const getRandomErrorResponse = (language = "en") => {
  const responses = errorResponses[language] || errorResponses.en;
  return getRandomFromArray(responses);
};

/**
 * Get context-aware response
 * @param {string} query - User query
 * @param {Object} contextManager - Context manager instance
 * @param {string} baseResponse - Base response text
 * @returns {string} Context-aware response
 */
export const getContextAwareResponse = (
  query,
  contextManager,
  baseResponse
) => {
  if (!contextManager || !baseResponse) return baseResponse;

  const currentLang = i18n.language || "en";
  const contextResponses =
    contextualResponses[currentLang] || contextualResponses.en;

  let response = baseResponse;

  // Get context information if available
  try {
    const contextInfo = contextManager.getContextualSuggestions();
    const mood = contextManager.getCurrentMood();

    // Add emotional awareness based on mood
    if (mood && mood.engagement < 0.8) {
      response = contextResponses.empathyPrefix + " " + response;
    }

    // Add contextual suggestions if available
    if (
      contextInfo &&
      contextInfo.shouldFollowUp &&
      contextInfo.recentTopics.length > 0
    ) {
      const recentTopic = contextInfo.recentTopics[0];
      const followUpText = contextResponses.followUpSuggestion.replace(
        "{topic}",
        recentTopic
      );
      response = response + " " + followUpText;
    }
  } catch (error) {
    console.error("Error in getContextAwareResponse:", error);
  }

  return response;
};
