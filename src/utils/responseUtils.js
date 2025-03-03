/**
 * Response utilities for generating dynamic bot responses
 */
import { botResponses } from "../data/botResponses";
import { followUpQuestions } from "../data/followUpQuestions";
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
 * @returns {string} Random welcome message
 */
export const getRandomWelcomeMessage = (language = "en") => {
  const greetings =
    botResponses.greeting?.[language] || botResponses.greeting?.en;
  if (!greetings || !greetings.length) {
    return "Welcome! How can I help you with energy statistics?";
  }
  return greetings[Math.floor(Math.random() * greetings.length)];
};

/**
 * Get a random farewell message
 * @param {string} language - Language code
 * @returns {string} Random farewell message
 */
export const getRandomFarewellMessage = (language = "en") => {
  const farewells =
    botResponses.farewell?.[language] || botResponses.farewell?.en;
  if (!farewells || !farewells.length) {
    return "Goodbye! Feel free to return if you have more questions.";
  }
  return farewells[Math.floor(Math.random() * farewells.length)];
};

/**
 * Get a random gratitude response
 * @param {string} language - Language code
 * @returns {string} Random gratitude response
 */
export const getRandomGratitudeResponse = (language = "en") => {
  const responses =
    botResponses.gratitude?.[language] || botResponses.gratitude?.en;
  if (!responses || !responses.length) {
    return "You're welcome! Happy to help.";
  }
  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Get a random prompt message
 * @param {string} language - Language code
 * @returns {string} Random prompt message
 */
export const getRandomPromptMessage = (language = "en") => {
  const prompts = botResponses.prompt?.[language] || botResponses.prompt?.en;
  if (!prompts || !prompts.length) {
    return "Is there something specific about energy statistics you'd like to know?";
  }
  return prompts[Math.floor(Math.random() * prompts.length)];
};

/**
 * Get a random error message
 * @param {string} language - Language code
 * @returns {string} Random error message
 */
export const getRandomErrorMessage = (language = "en") => {
  const errors = botResponses.error?.[language] || botResponses.error?.en;
  if (!errors || !errors.length) {
    return "I'm sorry, something went wrong. Could you try again?";
  }
  return errors[Math.floor(Math.random() * errors.length)];
};

/**
 * Get a random thinking message
 * @param {string} language - Language code
 * @returns {string} Random thinking message
 */
export const getRandomThinkingMessage = (language = "en") => {
  const thinking =
    botResponses.thinking?.[language] || botResponses.thinking?.en;
  if (!thinking || !thinking.length) {
    return "Let me think about that...";
  }
  return thinking[Math.floor(Math.random() * thinking.length)];
};

/**
 * Get a random unknown response
 * @param {string} language - Language code
 * @param {Object} matchInfo - Partial match information if available
 * @returns {string} Formatted unknown response
 */
export const getRandomUnknownResponse = (language = "en", matchInfo = null) => {
  const confused =
    botResponses.confused?.[language] || botResponses.confused?.en;
  if (!confused || !confused.length) {
    return "I'm not sure I understand. Could you rephrase that?";
  }

  const response = confused[Math.floor(Math.random() * confused.length)];

  // If we have partial match info, add a hint
  if (matchInfo && matchInfo.topic && matchInfo.score > 0.3) {
    const hint =
      language === "fr"
        ? `Est-ce que vous voulez savoir quelque chose sur "${matchInfo.topic}"?`
        : language === "de"
        ? `Möchten Sie etwas über "${matchInfo.topic}" wissen?`
        : `Are you asking about "${matchInfo.topic}"?`;

    return `${response} ${hint}`;
  }

  return response;
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

  // Simply return the answer if it's a direct question
  if (
    query.trim().endsWith("?") ||
    query.toLowerCase().startsWith("what") ||
    query.toLowerCase().startsWith("how") ||
    query.toLowerCase().startsWith("why") ||
    query.toLowerCase().startsWith("tell me")
  ) {
    return answer;
  }

  // Add a more conversational wrapper for non-question queries
  const wrappers = [
    `Here's what I know about that: ${answer}`,
    `${answer}`,
    `Regarding your question: ${answer}`,
    `${answer}`,
    `About that topic: ${answer}`,
  ];

  return wrappers[Math.floor(Math.random() * wrappers.length)];
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
  return topicQuestions[Math.floor(Math.random() * topicQuestions.length)];
};

export default {
  getRandomWelcomeMessage,
  getRandomFarewellMessage,
  getRandomGratitudeResponse,
  getRandomPromptMessage,
  getRandomErrorMessage,
  getRandomThinkingMessage,
  getRandomUnknownResponse,
  getContextAwareResponse,
  getFollowUpQuestion,
};
