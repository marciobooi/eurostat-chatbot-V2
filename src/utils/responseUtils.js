/**
 * Response utility functions that use the separate dictionary files
 */
import { getRandomFromArray } from "./random";

// Import each response dictionary from its own file
import { welcomeMessages } from "../data/welcomeMessages";
import { unknownResponses } from "../data/unknownResponses";
import { empathyPhrases } from "../data/empathyPhrases";
import { reassurancePhrases } from "../data/reassurancePhrases";
import { followUpSuggestions } from "../data/followUpSuggestions";
import { topicConnectionPhrases } from "../data/topicConnectionPhrases";
import { farewellMessages } from "../data/farewellMessages";
import { gratitudeMessages } from "../data/gratitudeMessages";
import { thinkingMessages } from "../data/thinkingMessages";
import { promptMessages } from "../data/promptMessages";
import { errorMessages } from "../data/errorMessages";

import i18n from "../i18n";

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
 * @param {Object} matchInfo - Optional match information for partial matches
 * @returns {string} Unknown response message
 */
export const getRandomUnknownResponse = (language = "en", matchInfo = null) => {
  const responses = unknownResponses[language] || unknownResponses.en;
  let response = getRandomFromArray(responses);

  // Add suggestion based on partial match if available
  if (matchInfo && matchInfo.topic && matchInfo.score > 0.3) {
    const suggestions = followUpSuggestions[language] || followUpSuggestions.en;
    const matchSuggestion = getRandomFromArray(suggestions).replace(
      "{topic}",
      matchInfo.topic
    );

    response += " " + matchSuggestion;
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

  const currentLang = i18n.language || "en";
  let response = baseResponse;

  // Add contextual enhancements if available
  try {
    if (contextManager.getContextualSuggestions) {
      const contextInfo = contextManager.getContextualSuggestions();
      const mood = contextManager.getCurrentMood?.() || { engagement: 1.0 };

      // Add empathetic prefix for engaged users
      if (mood.engagement > 0.8) {
        const empathies = empathyPhrases[currentLang] || empathyPhrases.en;
        const prefix = getRandomFromArray(empathies);
        response = prefix + " " + response;
      }

      // Add contextual connection if there are related previous topics
      if (contextInfo && contextInfo.recentTopics?.length > 0) {
        const recentTopic = contextInfo.recentTopics[0];
        const connections =
          topicConnectionPhrases[currentLang] || topicConnectionPhrases.en;
        const connectionPhrase = getRandomFromArray(connections).replace(
          "{topic}",
          recentTopic
        );

        response += " " + connectionPhrase;
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
  const messages = farewellMessages[language] || farewellMessages.en;
  return getRandomFromArray(messages);
};

/**
 * Get a random gratitude response message
 * @param {string} language - Language code
 * @returns {string} Gratitude response message
 */
export const getRandomGratitudeResponse = (language = "en") => {
  const messages = gratitudeMessages[language] || gratitudeMessages.en;
  return getRandomFromArray(messages);
};

/**
 * Get a random thinking message
 * @param {string} language - Language code
 * @returns {string} Thinking message
 */
export const getRandomThinkingMessage = (language = "en") => {
  const messages = thinkingMessages[language] || thinkingMessages.en;
  return getRandomFromArray(messages);
};

/**
 * Get a random error message
 * @param {string} language - Language code
 * @returns {string} Error message
 */
export const getRandomErrorMessage = (language = "en") => {
  const messages = errorMessages[language] || errorMessages.en;
  return getRandomFromArray(messages);
};

/**
 * Get a random prompt message
 * @param {string} language - Language code
 * @returns {string} Prompt message
 */
export const getRandomPromptMessage = (language = "en") => {
  const messages = promptMessages[language] || promptMessages.en;
  return getRandomFromArray(messages);
};

/**
 * Get a random reassurance phrase
 * @param {string} language - Language code
 * @returns {string} Reassurance phrase
 */
export const getRandomReassurancePhrase = (language = "en") => {
  const phrases = reassurancePhrases[language] || reassurancePhrases.en;
  return getRandomFromArray(phrases);
};
