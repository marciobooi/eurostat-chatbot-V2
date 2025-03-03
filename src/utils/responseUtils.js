/**
 * Response utilities for generating dynamic bot responses
 */
import botResponses from "../data/botResponses";

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
  const messages = botResponses.prompt?.[language] || botResponses.prompt?.en;
  return getRandomFromArray(messages) || i18n.t("responses.default_prompt");
};

/**
 * Get a random error message
 * @param {string} language - Language code
 * @returns {string} Random error message
 */
export const getRandomErrorMessage = (language = "en") => {
  const messages = botResponses.error?.[language] || botResponses.error?.en;
  return getRandomFromArray(messages) || i18n.t("responses.default_error");
};

/**
 * Get a random thinking message
 * @param {string} language - Language code
 * @returns {string} Random thinking message
 */
export const getRandomThinkingMessage = (language = "en") => {
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
  const messages =
    botResponses.confused?.[language] || botResponses.confused?.en;
  const response =
    getRandomFromArray(messages) || i18n.t("responses.default_unknown");

  if (matchInfo && matchInfo.topic && matchInfo.score > 0.3) {
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
  const phrases = botResponses.empathy?.[language] || botResponses.empathy?.en;
  return getRandomFromArray(phrases) || i18n.t("responses.default_empathy");
};

/**
 * Get random reassurance phrase
 * @param {string} language - Language code
 * @returns {string} Random reassurance phrase
 */
export const getRandomReassurancePhrase = (language = "en") => {
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
  if (!topic) return [];

  const suggestionTemplates =
    followUpSuggestions[language] || followUpSuggestions.en;

  return suggestionTemplates.map((template) =>
    template.replace("{topic}", topic)
  );
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

  const isQuestion = containsQuestionWord
    ? containsQuestionWord(query, language)
    : isQuestionUsingDictionary(query, language);

  if (isQuestion) {
    return answer;
  }

  const empathyPhrase =
    Math.random() > 0.7 ? `${getRandomEmpathyPhrase(language)} ` : "";
  const reassurancePhrase =
    Math.random() > 0.7 ? ` ${getRandomReassurancePhrase(language)}` : "";

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

  if (text.includes("?")) return true;

  const langQuestionWords = questionWords[language] || questionWords.en;

  const lowerText = text.toLowerCase();

  for (const word of langQuestionWords) {
    if (lowerText.startsWith(word.toLowerCase())) {
      return true;
    }
  }

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

  const questions = followUpQuestions[language] || followUpQuestions.en;
  if (!questions) return null;

  const topicQuestions = questions[topic.toLowerCase()] || questions.general;
  if (!topicQuestions || !topicQuestions.length) return null;

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

  if (addEmpathy && Math.random() > 0.5) {
    response = `${getRandomEmpathyPhrase(language)} ${response}`;
  }

  if (topic && Math.random() > 0.7) {
    const topicConnection = getTopicConnectionPhrase(topic, language);
    if (topicConnection) {
      response = `${response} ${topicConnection}`;
    }
  }

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
