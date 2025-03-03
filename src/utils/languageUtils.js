/**
 * Language utility functions for language detection and processing
 */
import { questionWords } from "../data/questionWords";
import { intentPatterns } from "../data/intentPatterns";
import {
  greetingDictionary,
  farewellDictionary,
  gratitudeDictionary,
} from "../data/intentDictionaries";
import { commonWords } from "../data/commonWords";
import { energyDictionary } from "../data/energyDictionary";

// Supported languages and default language
export const SUPPORTED_LANGUAGES = ["en", "fr", "de"];
export const DEFAULT_LANGUAGE = "en";

/**
 * Get all words for a specific language from our dictionaries
 * @param {string} language Language code (en, fr, de)
 * @returns {string[]} Array of words for the specified language
 */
const getAllWordsForLanguage = (language) => {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    console.warn(
      `Language '${language}' not supported, using default language`
    );
    language = DEFAULT_LANGUAGE;
  }

  // Collect words from all our dictionaries
  const words = new Set();

  // Add words from common words dictionary
  if (commonWords[language]) {
    commonWords[language].forEach((word) => words.add(word.toLowerCase()));
  }

  // Add words from question dictionaries
  if (questionWords[language]) {
    questionWords[language].forEach((word) => words.add(word.toLowerCase()));
  }

  // Add words from intent dictionaries (greetings, farewell, gratitude, etc.)
  const dictionaries = [
    greetingDictionary,
    farewellDictionary,
    gratitudeDictionary,
  ];

  dictionaries.forEach((dict) => {
    if (dict[language]) {
      dict[language].forEach((word) => words.add(word.toLowerCase()));
    }
  });

  // Add pattern words from intent patterns
  Object.entries(intentPatterns).forEach(([, langPatterns]) => {
    if (langPatterns[language]) {
      langPatterns[language].forEach((pattern) => {
        // Split patterns into words
        pattern
          .toLowerCase()
          .split(/\s+/)
          .forEach((word) => {
            if (word.length > 2) words.add(word);
          });
      });
    }
  });

  return Array.from(words);
};

/**
 * Language validation utility class
 */
export class LanguageValidator {
  /**
   * Validate a language code and return a supported language
   * @param {string} language - Language code to validate
   * @returns {string} Valid language code
   */
  static validate(language) {
    if (!language || !SUPPORTED_LANGUAGES.includes(language)) {
      console.warn(
        `Language '${language}' not supported, using default language`
      );
      return DEFAULT_LANGUAGE;
    }
    return language;
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
 * Detect language from text using all available dictionaries
 * @param {string} text - Text to analyze
 * @returns {string} Detected language code or default language
 */
export const detectLanguage = (text) => {
  if (!text || typeof text !== "string") {
    return DEFAULT_LANGUAGE;
  }

  // Get words for each supported language
  const languageWords = {};
  SUPPORTED_LANGUAGES.forEach((lang) => {
    languageWords[lang] = getAllWordsForLanguage(lang);
  });

  // Simple language detection based on word matching
  const lowerText = text.toLowerCase().trim();
  const wordMatches = {};

  // Initialize counts for each language
  SUPPORTED_LANGUAGES.forEach((lang) => {
    wordMatches[lang] = 0;
  });

  // Check each language's words against the text
  SUPPORTED_LANGUAGES.forEach((lang) => {
    languageWords[lang].forEach((word) => {
      // Check for whole word match (with word boundaries)
      // This is more accurate than just checking for substring inclusion
      const regex = new RegExp(`\\b${word}\\b`, "i");
      if (regex.test(lowerText)) {
        wordMatches[lang]++;
      }
    });
  });

  // Find language with highest match count
  let detectedLanguage = DEFAULT_LANGUAGE;
  let highestCount = 0;

  SUPPORTED_LANGUAGES.forEach((lang) => {
    if (wordMatches[lang] > highestCount) {
      highestCount = wordMatches[lang];
      detectedLanguage = lang;
    }
  });

  // Only use detection if we have a minimum number of matches
  // Otherwise return default language
  return highestCount > 2 ? detectedLanguage : DEFAULT_LANGUAGE;
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

/**
 * Helper function for word mappings from the energy dictionary
 * Maps words (keywords, synonyms, titles) to their respective topics
 * @param {string} language Language code
 * @returns {Object} Word mappings for the language (word -> topic array)
 */
export const getWordMappings = (language = DEFAULT_LANGUAGE) => {
  // Get the appropriate language dictionary, fallback to English
  const dictionary = energyDictionary[language] || energyDictionary.en;
  const mappings = {};

  // Process each topic in the dictionary
  Object.entries(dictionary).forEach(([topicKey, topicData]) => {
    // Add the topic key itself as a mapping
    addMapping(mappings, topicKey.toLowerCase(), topicKey);

    // Add the title if available
    if (topicData.title) {
      addMapping(mappings, topicData.title.toLowerCase(), topicKey);
    }

    // Add all keywords if available
    if (Array.isArray(topicData.keywords)) {
      topicData.keywords.forEach((keyword) => {
        addMapping(mappings, keyword.toLowerCase(), topicKey);
      });
    }

    // Add all synonyms if available
    if (Array.isArray(topicData.synonyms)) {
      topicData.synonyms.forEach((synonym) => {
        addMapping(mappings, synonym.toLowerCase(), topicKey);
      });
    }

    // Add multi-word variations for better matching
    // For example: "renewable energy" -> also add "renewable" and "energy" individually
    if (topicKey.includes(" ")) {
      topicKey.split(" ").forEach((word) => {
        if (word.length > 3) {
          // Only add meaningful words
          addMapping(mappings, word.toLowerCase(), topicKey);
        }
      });
    }
  });

  return mappings;
};

/**
 * Helper function to add a mapping from a word to a topic
 * @param {Object} mappings - The mappings object to modify
 * @param {string} word - The word to map
 * @param {string} topic - The topic to associate with the word
 */
const addMapping = (mappings, word, topic) => {
  if (!word || word.length < 2) return; // Skip very short words

  if (!mappings[word]) {
    mappings[word] = [];
  }

  // Only add the topic if it's not already in the array
  if (!mappings[word].includes(topic)) {
    mappings[word].push(topic);
  }
};

export default {
  LanguageValidator,
  detectLanguage,
  formatTextByLanguage,
  getLanguageName,
  findMatchingTopics,
  getWordMappings,
  getAllWordsForLanguage, // Export the function for use elsewhere
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
};
