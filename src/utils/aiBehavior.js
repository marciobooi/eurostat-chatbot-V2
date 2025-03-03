import i18n from "../i18n";
import { getRandomFromArray, getRandomNumber } from "./random";
import {
  getRandomWelcomeMessage,
  getRandomUnknownResponse,
} from "./randomResponses";

const MOOD_ADJUSTMENT = {
  POSITIVE: 0.8, // Faster response for positive mood
  NEGATIVE: 1.2, // Slower, more careful response for negative mood
  NEUTRAL: 1.0,
};

const BASE_TIMING = {
  THINKING: {
    SHORT: 1000,
    MEDIUM: 1500,
    LONG: 2000,
  },
  TYPING: {
    SPEED: 50, // Base typing speed (ms per character)
    VARIATION: 20, // Random variation
  },
};

const thinkingTimes = [1000, 1500, 2000]; // Thinking time in milliseconds
const typingSpeed = 50; // Base typing speed (ms per character)
const typingVariation = 20; // Random variation in typing speed

// Updated to handle context properly or fall back to simpler calculation if no context
export const calculateThinkingTime = (input, contextManager = null) => {
  const baseTime = getRandomFromArray(thinkingTimes);
  const inputComplexity = input.length / 10; // Longer inputs = more thinking time

  // If contextManager is provided and has mood functionality, use it
  if (contextManager && typeof contextManager.getCurrentMood === "function") {
    const mood = contextManager.getCurrentMood();
    const moodFactor = mood?.urgency || 1;
    return Math.min(baseTime + (inputComplexity * 100) / moodFactor, 3000);
  }

  // Simple fallback if no contextManager or no mood functionality
  return Math.min(baseTime + inputComplexity * 100, 3000); // Cap at 3 seconds
};

export const calculateTypingTime = (text, contextManager = null) => {
  if (!text) return 0;

  const baseTime = text.length * typingSpeed;
  const variation = getRandomNumber(0, typingVariation * text.length);

  // If contextManager is provided and has speed functionality, use it
  if (contextManager && typeof contextManager.getTypingSpeed === "function") {
    const speedFactor = contextManager.getTypingSpeed() || 1;
    return Math.min(baseTime * speedFactor + variation, 4000);
  }

  // Simple fallback
  return Math.min(baseTime + variation, 4000); // Cap at 4 seconds
};

export const getContextAwareResponse = (query, contextManager, energyInfo) => {
  const currentLang = i18n.language;
  const context = contextManager.getContextualSuggestions();
  const mood = contextManager.getCurrentMood();

  let response = energyInfo;

  // Add emotional awareness to response
  if (mood.isNegative) {
    response = i18n.t("empathyPrefix") + " " + response;
  }

  // Add context-aware prefixes/suffixes
  if (context.currentIntent === "question") {
    if (context.needsReassurance) {
      response = i18n.t("reassurancePrefix") + " " + response;
    }
  } else if (context.currentIntent === "gratitude") {
    response = response + " " + i18n.t("gratitudeSuffix");
  }

  // Add follow-up suggestions based on context
  if (context.shouldFollowUp && context.recentTopics.length > 0) {
    const relatedTopic = context.recentTopics[0];
    response += " " + i18n.t("followUpSuggestion", { topic: relatedTopic });
  }

  return response;
};
