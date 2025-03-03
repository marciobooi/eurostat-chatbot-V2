/**
 * Response utility functions that use proper i18n translations
 */
import { getRandomFromArray } from "./random";
import { botResponses } from "../data/botResponses";
import i18n from "../i18n";

/**
 * Get a random welcome message
 * @param {string} language - Language code
 * @returns {string} Welcome message
 */
export const getRandomWelcomeMessage = (language = "en") => {
  const messages = botResponses.greeting[language] || botResponses.greeting.en;
  return getRandomFromArray(messages);
};

/**
 * Get a random unknown response
 * @param {string} language - Language code
 * @param {Object} matchInfo - Optional match information for partial matches
 * @returns {string} Unknown response message
 */
export const getRandomUnknownResponse = (language = "en", matchInfo = null) => {
  const responses = botResponses.confused[language] || botResponses.confused.en;
  let response = getRandomFromArray(responses);

  // Add suggestion based on partial match if available
  if (matchInfo && matchInfo.topic && matchInfo.score > 0.3) {
    response +=
      " " +
      i18n.t("responses.partialMatch", {
        topic: matchInfo.topic,
        defaultValue: `I found some information about "${matchInfo.topic}" that might be relevant. Would you like to know more about that instead?`,
      });
  }

  return response;
};

/**
 * Get context-aware response by enhancing a base response with context
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

  let response = baseResponse;

  // Add contextual enhancements if available
  try {
    if (contextManager.getContextualSuggestions) {
      const contextInfo = contextManager.getContextualSuggestions();
      const mood = contextManager.getCurrentMood?.() || { engagement: 1.0 };

      // Add empathetic prefix for engaged users
      if (mood.engagement > 0.8) {
        response =
          i18n.t("responses.engagedPrefix", {
            defaultValue: "I understand your interest in this topic. ",
          }) + response;
      }

      // Add contextual connection if there are related previous topics
      if (contextInfo && contextInfo.recentTopics?.length > 0) {
        const recentTopic = contextInfo.recentTopics[0];
        response +=
          " " +
          i18n.t("responses.topicConnection", {
            topic: recentTopic,
            defaultValue: `This is also related to our previous discussion about ${recentTopic}.`,
          });
      }
    }
  } catch (error) {
    console.error("Error in getContextAwareResponse:", error);
  }

  return response;
};

/**
 * Get a random farewell message
 * @param {string} language - Language code
 * @returns {string} Farewell message
 */
export const getRandomFarewellMessage = (language = "en") => {
  const messages = botResponses.farewell[language] || botResponses.farewell.en;
  return getRandomFromArray(messages);
};

/**
 * Get a random gratitude response message
 * @param {string} language - Language code
 * @returns {string} Gratitude response message
 */
export const getRandomGratitudeResponse = (language = "en") => {
  const messages =
    botResponses.gratitude[language] || botResponses.gratitude.en;
  return getRandomFromArray(messages);
};

/**
 * Get a prompt message for the user
 * @param {string} language - Language code
 * @returns {string} Prompt message
 */
export const getRandomPromptMessage = (language = "en") => {
  const messages = botResponses.prompt[language] || botResponses.prompt.en;
  return getRandomFromArray(messages);
};
