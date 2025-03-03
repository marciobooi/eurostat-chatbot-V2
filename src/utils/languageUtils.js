/**
 * Language utilities for the chatbot
 */
import { energyDictionary } from "../data/energyDictionary";

// All supported languages in the application
const SUPPORTED_LANGUAGES = ["en", "fr", "de"];
const DEFAULT_LANGUAGE = "en";

/**
 * Extract all synonyms and keywords from energyDictionary
 * @param {string} language - Language code
 * @returns {Object} Object with words mapped to their related topics
 */
export const getWordMappings = (language = DEFAULT_LANGUAGE) => {
  const validLang = SUPPORTED_LANGUAGES.includes(language)
    ? language
    : DEFAULT_LANGUAGE;
  const langDict =
    energyDictionary[validLang] || energyDictionary[DEFAULT_LANGUAGE];
  const mappings = {};

  // Process each topic in the dictionary
  Object.entries(langDict).forEach(([topic, data]) => {
    // Add keywords
    if (data.keywords && Array.isArray(data.keywords)) {
      data.keywords.forEach((keyword) => {
        const normalizedKeyword = keyword.toLowerCase().trim();
        if (!mappings[normalizedKeyword]) {
          mappings[normalizedKeyword] = [];
        }
        if (!mappings[normalizedKeyword].includes(topic)) {
          mappings[normalizedKeyword].push(topic);
        }
      });
    }

    // Add synonyms
    if (data.synonyms && Array.isArray(data.synonyms)) {
      data.synonyms.forEach((synonym) => {
        const normalizedSynonym = synonym.toLowerCase().trim();
        if (!mappings[normalizedSynonym]) {
          mappings[normalizedSynonym] = [];
        }
        if (!mappings[normalizedSynonym].includes(topic)) {
          mappings[normalizedSynonym].push(topic);
        }
      });
    }

    // Add the topic itself as a keyword
    const normalizedTopic = topic.toLowerCase().trim();
    if (!mappings[normalizedTopic]) {
      mappings[normalizedTopic] = [topic];
    }
  });

  return mappings;
};

/**
 * Language validator utility functions
 */
export class LanguageValidator {
  /**
   * Check if a language code is supported
   * @param {string} langCode - Language code to validate
   * @returns {boolean} True if the language is supported
   */
  static isSupported(langCode) {
    if (!langCode || typeof langCode !== "string") {
      return false;
    }
    return SUPPORTED_LANGUAGES.includes(langCode.toLowerCase());
  }

  /**
   * Validate and return a supported language code
   * @param {string} langCode - Language code to validate
   * @returns {string} Valid language code or default language
   */
  static validate(langCode) {
    if (this.isSupported(langCode)) {
      return langCode.toLowerCase();
    }
    return DEFAULT_LANGUAGE;
  }

  /**
   * Get all supported languages
   * @returns {Array} Array of supported language codes
   */
  static getSupportedLanguages() {
    return [...SUPPORTED_LANGUAGES];
  }

  /**
   * Get the default language
   * @returns {string} Default language code
   */
  static getDefaultLanguage() {
    return DEFAULT_LANGUAGE;
  }
}

/**
 * Find matching topics based on input text
 * @param {string} text - Input text to match against
 * @param {string} language - Language code
 * @returns {Array} Array of matching topics
 */
export const findMatchingTopics = (text, language = DEFAULT_LANGUAGE) => {
  if (!text) return [];

  // Get word mappings from energyDictionary
  const mappings = getWordMappings(language);
  const normalizedText = text.toLowerCase().trim();
  const matches = [];

  // Check for exact matches
  Object.entries(mappings).forEach(([key, topics]) => {
    if (normalizedText.includes(key)) {
      topics.forEach((topic) => {
        if (!matches.includes(topic)) {
          matches.push(topic);
        }
      });
    }
  });

  return matches;
};

/**
 * Detect language from text
 * @param {string} text - Text to analyze
 * @returns {string} Detected language code or default language
 */
export const detectLanguage = (text) => {
  if (!text || typeof text !== "string") {
    return DEFAULT_LANGUAGE;
  }

  // Simple language detection based on common words
  const lowerText = text.toLowerCase();

  // French indicators
  const frenchWords = [
    "je",
    "tu",
    "il",
    "elle",
    "nous",
    "vous",
    "ils",
    "elles",
    "le",
    "la",
    "les",
    "un",
    "une",
    "des",
    "est",
    "sont",
    "et",
    "ou",
    "mais",
    "donc",
    "car",
    "pour",
    "avec",
    "sans",
    "bonjour",
    "merci",
    "parce que",
  ];

  // German indicators
  const germanWords = [
    "ich",
    "du",
    "er",
    "sie",
    "es",
    "wir",
    "ihr",
    "sie",
    "ein",
    "eine",
    "der",
    "die",
    "das",
    "ist",
    "sind",
    "und",
    "oder",
    "aber",
    "denn",
    "weil",
    "für",
    "mit",
    "ohne",
    "hallo",
    "danke",
    "weil",
  ];

  let frCount = 0;
  let deCount = 0;

  // Count occurrences of indicator words
  frenchWords.forEach((word) => {
    if (
      lowerText.includes(` ${word} `) ||
      lowerText.startsWith(`${word} `) ||
      lowerText.endsWith(` ${word}`)
    ) {
      frCount++;
    }
  });

  germanWords.forEach((word) => {
    if (
      lowerText.includes(` ${word} `) ||
      lowerText.startsWith(`${word} `) ||
      lowerText.endsWith(` ${word}`)
    ) {
      deCount++;
    }
  });

  // Determine language based on counts
  if (frCount > deCount && frCount > 1) {
    return "fr";
  } else if (deCount > frCount && deCount > 1) {
    return "de";
  }

  // Default to English if no clear detection
  return DEFAULT_LANGUAGE;
};

/**
 * Format text according to language rules
 * @param {string} text - Text to format
 * @param {string} language - Language code
 * @returns {string} Formatted text
 */
export const formatTextByLanguage = (text, language = DEFAULT_LANGUAGE) => {
  if (!text) return "";

  switch (language.toLowerCase()) {
    case "fr":
      // Add French-specific formatting (e.g., spaces before punctuation)
      return text.replace(/([?!:;])/g, " $1");

    case "de":
      // Add German-specific formatting (e.g., capitalize nouns)
      // This is a simplified approach
      return text;

    default:
      return text;
  }
};

/**
 * Get language name from code
 * @param {string} langCode - Language code
 * @returns {string} Language name
 */
export const getLanguageName = (langCode) => {
  const names = {
    en: "English",
    fr: "Français",
    de: "Deutsch",
  };

  return names[langCode.toLowerCase()] || names[DEFAULT_LANGUAGE];
};

export default {
  LanguageValidator,
  detectLanguage,
  formatTextByLanguage,
  getLanguageName,
  findMatchingTopics,
  getWordMappings,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
};
