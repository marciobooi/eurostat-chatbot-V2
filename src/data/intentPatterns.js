/**
 * Intent detection patterns for identifying user intent
 * Using comprehensive dictionaries from intentDictionaries.js
 */
import {
  greetingDictionary,
  farewellDictionary,
  gratitudeDictionary,
  helpDictionary,
  confirmationDictionary,
  negationDictionary,
  questionDictionary,
  infoDictionary,
  comparisonDictionary,
  dataDictionary,
} from "./intentDictionaries";

// Define intent patterns using the comprehensive dictionaries
export const intentPatterns = {
  greeting: greetingDictionary,
  farewell: farewellDictionary,
  gratitude: gratitudeDictionary,
  help: helpDictionary,
  confirmation: confirmationDictionary,
  negation: negationDictionary,
  question: questionDictionary,
  info: infoDictionary,
  comparison: comparisonDictionary,
  data: dataDictionary,
};

/**
 * Find the intent of a user input
 * @param {string} input - User input
 * @param {string} language - Language code
 * @returns {Object} Intent information
 */
export const getIntent = (input, language = "en") => {
  if (!input) return { intent: "unknown", confidence: 0 };

  const normalizedInput = input.toLowerCase().trim();
  const validLanguage = ["en", "fr", "de"].includes(language) ? language : "en";

  let highestScore = 0;
  let detectedIntent = "unknown";

  // Check each intent type
  Object.entries(intentPatterns).forEach(([intent, langPatterns]) => {
    const patterns = langPatterns[validLanguage] || langPatterns.en;

    if (!patterns || !patterns.length) return;

    for (const pattern of patterns) {
      if (normalizedInput.includes(pattern)) {
        // Calculate confidence based on pattern length and position
        let score = pattern.length / Math.max(normalizedInput.length, 1);

        // Boost score if pattern is at the beginning of input (more significant)
        if (normalizedInput.indexOf(pattern) === 0) {
          score *= 1.5;
        }

        // Discount score slightly if pattern is very short (potential false positive)
        if (pattern.length < 3) {
          score *= 0.8;
        }

        // Cap score at 1.0
        score = Math.min(score, 1.0);

        if (score > highestScore) {
          highestScore = score;
          detectedIntent = intent;
        }
      }
    }
  });

  return {
    intent: detectedIntent,
    confidence: parseFloat(highestScore.toFixed(2)),
  };
};

export default intentPatterns;
