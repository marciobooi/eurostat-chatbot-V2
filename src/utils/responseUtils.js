/**
 * Response utilities for generating dynamic bot responses
 */
import botResponses, { getResponseByType } from "../data/botResponses";
import { followUpQuestions } from "../data/followUpQuestions";
import { getRandomFromArray } from "./random";
import { containsQuestionWord } from "./nlpHelper";
import { questionWords } from "../data/questionWords";
import { followUpSuggestions } from "../data/followUpSuggestions";
import { topicConnectionPhrases } from "../data/topicConnectionPhrases";

import i18n from "../i18n";

/**
 * Get a random welcome message
 * @param {string} language - Language code
 * @returns {string} Random welcome message
 */
export const getRandomWelcomeMessage = (language = "en") => {
  // Use the consolidated botResponses directly (not through getResponseByType)
  const messages =
    botResponses.greeting?.[language] || botResponses.greeting?.en;
  return getRandomFromArray(messages) || i18n.t("responses.default_welcome");
};

/**
 * Get a random farewell message
 * @param {string} language - Language code
 * @returns {string} Random farewell message
 */
export const getRandomFarewellMessage = (language = "en") => {
  // Use the consolidated botResponses directly
  const messages =
    botResponses.farewell?.[language] || botResponses.farewell?.en;
  return getRandomFromArray(messages) || i18n.t("responses.default_farewell");
};

/**
 * Get a random gratitude response
 * @param {string} language - Language code
 * @returns {string} Random gratitude response
 */
export const getRandomGratitudeResponse = (language = "en") => {
  // Use the consolidated botResponses directly
  const messages =
    botResponses.gratitude?.[language] || botResponses.gratitude?.en;
  return getRandomFromArray(messages) || i18n.t("responses.default_gratitude");
};

/**
 * Get a random prompt message
 * @param {string} language - Language code
 * @returns {string} Random prompt message
 */
export const getRandomPromptMessage = (language = "en") => {
  // Use the consolidated botResponses directly
  const messages = botResponses.prompt?.[language] || botResponses.prompt?.en;
  return getRandomFromArray(messages) || i18n.t("responses.default_prompt");
};

/**
 * Get a random error message
 * @param {string} language - Language code
 * @returns {string} Random error message
 */
export const getRandomErrorMessage = (language = "en") => {
  // Use the consolidated botResponses directly
  const messages = botResponses.error?.[language] || botResponses.error?.en;
  return getRandomFromArray(messages) || i18n.t("responses.default_error");
};

/**
 * Get a random thinking message
 * @param {string} language - Language code
 * @returns {string} Random thinking message
 */
export const getRandomThinkingMessage = (language = "en") => {
  // Use the consolidated botResponses directly
  const messages =
    botResponses.thinking?.[language] || botResponses.thinking?.en;
  return getRandomFromArray(messages) || i18n.t("responses.default_thinking");
};

/**
 * Get a random unknown response
 * @param {string} language - Language code
 * @param {Object} matchInfo - Partial match information if available
 * @returns {string} Formatted unknown response
 */
export const getRandomUnknownResponse = (language = "en", matchInfo = null) => {
  // Use the consolidated botResponses directly
  const messages =
    botResponses.confused?.[language] || botResponses.confused?.en;
  const response =
    getRandomFromArray(messages) || i18n.t("responses.default_unknown");

  // If we have partial match info, add a hint using translations
  if (matchInfo && matchInfo.topic && matchInfo.score > 0.3) {
    // Use translations instead of hardcoded strings
    const hint = i18n.t("responses.topic_hint", { topic: matchInfo.topic });
    return `${response} ${hint}`;
  }

  return response;
};

/**
 * Get random empathy phrase
 * @param {string} language - Language code
 * @returns {string} Random empathy phrase
 */
export const getRandomEmpathyPhrase = (language = "en") => {
  // Use the consolidated botResponses directly
  const phrases = botResponses.empathy?.[language] || botResponses.empathy?.en;
  return getRandomFromArray(phrases) || i18n.t("responses.default_empathy");
};

/**
 * Get random reassurance phrase
 * @param {string} language - Language code
 * @returns {string} Random reassurance phrase
 */
export const getRandomReassurancePhrase = (language = "en") => {
  // Use the consolidated botResponses directly
  const phrases =
    botResponses.reassurance?.[language] || botResponses.reassurance?.en;
  return getRandomFromArray(phrases) || i18n.t("responses.default_reassurance");
};

/**
 * Get topic connection phrase with topic inserted
 * @param {string} topic - The topic to insert
 * @param {string} language - Language code
 * @returns {string} Formatted connection phrase
 */
export const getTopicConnectionPhrase = (topic, language = "en") => {
  if (!topic) return "";

  const phrases = topicConnectionPhrases[language] || topicConnectionPhrases.en;
  const template =
    getRandomFromArray(phrases) || "Speaking of {topic}, did you know...";

  return template.replace("{topic}", topic);
};

/**
 * Get follow-up suggestions for a topic
 * @param {string} topic - The topic to get suggestions for
 * @param {string} language - Language code
 * @returns {Array} Array of suggestion strings
 */
export const getFollowUpSuggestionsForTopic = (topic, language = "en") => {
  const suggestions = followUpSuggestions[language] || followUpSuggestions.en;
  const topicSuggestions = suggestions[topic] || suggestions.general;

  return topicSuggestions || [];
};

/**
 * Get context-aware response
 * @param {string} query - User's query
 * @param {Object} contextManager - Context manager instance
 * @param {string} answer - Base answer to include
 * @returns {string} Context-aware response
 */
export const getContextAwareResponse = (query, contextManager, answer) => {
  if (!answer) return getRandomUnknownResponse();

  const language = i18n?.language || "en";

  // Use containsQuestionWord from nlpHelper or use our own check with questionWords dictionary
  const isQuestion = containsQuestionWord
    ? containsQuestionWord(query, language)
    : isQuestionUsingDictionary(query, language);

  // Simply return the answer if it's a direct question
  if (isQuestion) {
    return answer;
  }

  // Add a more conversational wrapper for non-question queries
  const empathyPhrase =
    Math.random() > 0.7 ? `${getRandomEmpathyPhrase(language)} ` : "";
  const reassurancePhrase =
    Math.random() > 0.7 ? ` ${getRandomReassurancePhrase(language)}` : "";

  // Combine elements with appropriate spacing
  return `${empathyPhrase}${answer}${reassurancePhrase}`.trim();
};

/**
 * Check if text contains a question word using the dictionary
 * @param {string} text - Text to check
 * @param {string} language - Language code
 * @returns {boolean} True if the text contains a question word or question mark
 */
const isQuestionUsingDictionary = (text, language = "en") => {
  if (!text) return false;

  // Check for question mark first
  if (text.includes("?")) return true;

  // Get question words for the specified language or fall back to English
  const langQuestionWords = questionWords[language] || questionWords.en;

  // Convert to lowercase for case-insensitive comparison
  const lowerText = text.toLowerCase();

  // Check if text starts with any question word
  for (const word of langQuestionWords) {
    if (lowerText.startsWith(word.toLowerCase())) {
      return true;
    }
  }

  // Check for phrases like "tell me about"
  const tellMePhrases = {
    en: ["tell me", "explain", "describe"],
    fr: ["dis-moi", "explique", "parle-moi de", "décris"],
    de: ["sag mir", "erzähl mir", "erkläre", "beschreibe"],
  };

  const phrasesToCheck = tellMePhrases[language] || tellMePhrases.en;

  for (const phrase of phrasesToCheck) {
    if (lowerText.startsWith(phrase.toLowerCase())) {
      return true;
    }
  }

  return false;
};

/**
 * Get a follow-up question based on topic
 * @param {string} topic - The current topic
 * @param {string} language - Language code
 * @returns {string|null} Follow-up question or null if none available
 */
export const getFollowUpQuestion = (topic, language = "en") => {
  if (!topic || !followUpQuestions) return null;

  // Get language-specific questions or fall back to English
  const questions = followUpQuestions[language] || followUpQuestions.en;
  if (!questions) return null;

  // Try to get topic-specific questions
  const topicQuestions = questions[topic.toLowerCase()] || questions.general;
  if (!topicQuestions || !topicQuestions.length) return null;

  // Return a random question
  return getRandomFromArray(topicQuestions);
};

/**
 * Format a response with appropriate humanizing elements
 * @param {string} baseResponse - The core information to convey
 * @param {Object} options - Formatting options
 * @returns {string} The formatted response
 */
export const formatResponse = (baseResponse, options = {}) => {
  const {
    topic = null,
    addEmpathy = false,
    addReassurance = false,
    language = "en",
  } = options;

  let response = baseResponse;

  // Add empathy phrase if requested
  if (addEmpathy && Math.random() > 0.5) {
    response = `${getRandomEmpathyPhrase(language)} ${response}`;
  }

  // Add topic connection if provided
  if (topic && Math.random() > 0.7) {
    const topicConnection = getTopicConnectionPhrase(topic, language);
    if (topicConnection) {
      response = `${response} ${topicConnection}`;
    }
  }

  // Add reassurance phrase if requested
  if (addReassurance && Math.random() > 0.5) {
    response = `${response} ${getRandomReassurancePhrase(language)}`;
  }

  return response.trim();
};

export default {
  getRandomWelcomeMessage,
  getRandomFarewellMessage,
  getRandomGratitudeResponse,
  getRandomPromptMessage,
  getRandomErrorMessage,
  getRandomThinkingMessage,
  getRandomUnknownResponse,
  getRandomEmpathyPhrase,
  getRandomReassurancePhrase,
  getTopicConnectionPhrase,
  getFollowUpSuggestionsForTopic,
  getContextAwareResponse,
  getFollowUpQuestion,
  formatResponse,
};
