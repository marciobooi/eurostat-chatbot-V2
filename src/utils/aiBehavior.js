import i18n from "../i18n";
// Update import to use the simpler random utility
import { getRandomNumber } from "./random";

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

// Updated to handle context properly or fall back to simpler calculation if no context
export const calculateThinkingTime = (input, contextManager = null) => {
  const baseTime = BASE_TIMING.THINKING.MEDIUM;
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

  const baseTime = text.length * BASE_TIMING.TYPING.SPEED;
  const variation = getRandomNumber(
    0,
    BASE_TIMING.TYPING.VARIATION * text.length
  );

  // If contextManager is provided and has speed functionality, use it
  if (contextManager && typeof contextManager.getTypingSpeed === "function") {
    const speedFactor = contextManager.getTypingSpeed() || 1;
    return Math.min(baseTime * speedFactor + variation, 4000);
  }

  // Simple fallback
  return Math.min(baseTime + variation, 4000); // Cap at 4 seconds
};

// Import from responseUtils instead
export { getContextAwareResponse } from "./responseUtils";
