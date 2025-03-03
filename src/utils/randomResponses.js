import i18n from "../i18n";
import { getRandomFromArray } from "./random";

// Welcome messages in different languages
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

// Unknown response messages
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

// Contextual response prefixes/suffixes
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
