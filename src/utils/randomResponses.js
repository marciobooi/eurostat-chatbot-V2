/**
 * Response utilities that use the centralized botResponses dictionary
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
 * @param {Object} matchInfo - Optional match information
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
 * Get a random gratitude response
 * @param {string} language - Language code
 * @returns {string} Gratitude response
 */
export const getRandomGratitudeResponse = (language = "en") => {
  const messages =
    botResponses.gratitude[language] || botResponses.gratitude.en;
  return getRandomFromArray(messages);
};

/**
 * Get a random thinking message
 * @param {string} language - Language code
 * @returns {string} Thinking message
 */
export const getRandomThinkingMessage = (language = "en") => {
  const messages = botResponses.thinking[language] || botResponses.thinking.en;
  return getRandomFromArray(messages);
};

/**
 * Get a random error message
 * @param {string} language - Language code
 * @returns {string} Error message
 */
export const getRandomErrorMessage = (language = "en") => {
  const messages = botResponses.error[language] || botResponses.error.en;
  return getRandomFromArray(messages);
};

/**
 * Get a random prompt message
 * @param {string} language - Language code
 * @returns {string} Prompt message
 */
export const getRandomPromptMessage = (language = "en") => {
  const messages = botResponses.prompt[language] || botResponses.prompt.en;
  return getRandomFromArray(messages);
};
