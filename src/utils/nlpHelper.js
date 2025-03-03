/**
 * Natural Language Processing helper functions for the chatbot
 * Uses separate dictionary files for data
 */
import { questionWords } from "../data/questionWords";
import { stopWords } from "../data/stopWords";
import {
  analyzeSentiment as getSentiment,
  getCompromisePattern,
} from "../data/sentimentPatterns";
import { energyDictionary, getRelatedTopics } from "../data/energyDictionary";
import { isGreeting as checkGreeting } from "../data/greetingPhrases";
import { extractDateReferences } from "../data/datePatterns";
import { stemWord as applyStemming } from "../data/stemmingRules";
import { getIntent } from "../data/intentPatterns";
import nlp from "compromise";
import sentences from "compromise-sentences";
import numbers from "compromise-numbers";
import dates from "compromise-dates";

// Initialize Compromise with plugins
nlp.extend(sentences);
nlp.extend(numbers);
nlp.extend(dates);

// Helper function to safely get tokens from Compromise
const safeTokenize = (text) => {
  if (!text || typeof text !== "string") return [];
  try {
    const doc = nlp(text);
    return doc
      .terms()
      .out("array")
      .map((term) => term.toLowerCase());
  } catch (error) {
    console.warn("Error in safeTokenize:", error);
    return text.toLowerCase().split(/\s+/); // Fallback to simple tokenization
  }
};

/**
 * Stem a word using language-specific rules
 * @param {string} word - Word to stem
 * @param {string} language - Language code (en, fr, de)
 * @returns {string} Stemmed word
 */
const stemWord = (word, language = "en") => {
  return applyStemming(word, language);
};

/**
 * Find the intent of a user input
 * @param {string} input - User input
 * @param {string} language - Language code
 * @returns {Object} Intent information
 */
export const findIntent = (input, language = "en") => {
  return getIntent(input, language);
};

/**
 * Clean and normalize a query
 * @param {string} query - User input to clean
 * @returns {string} Cleaned query
 */
export const cleanQuery = (query = "") => {
  if (!query) return "";

  try {
    const tokens = safeTokenize(query);
    return tokens.filter(Boolean).join(" ").toLowerCase().trim();
  } catch (error) {
    console.warn("Error in cleanQuery:", error);
    return query.toLowerCase().trim();
  }
};

/**
 * Check if text contains a question word
 * @param {string} text - Text to check
 * @param {string} language - Language code
 * @returns {boolean} True if the text contains a question word
 */
export const containsQuestionWord = (text, language = "en") => {
  if (!text) return false;

  const words = text.toLowerCase().split(/\s+/);
  const langQuestionWords = questionWords[language] || questionWords.en;

  // Check for question words
  for (const word of words) {
    if (langQuestionWords.includes(word)) {
      return true;
    }
  }

  // Also check for question marks
  return text.includes("?");
};

/**
 * Check if text is a greeting
 * @param {string} text - Text to check
 * @param {string} language - Language code
 * @returns {boolean} True if the text is a greeting
 */
export const isGreeting = (text, language = "en") => {
  return checkGreeting(text, language);
};

/**
 * Extract key topic from a query using the energyDictionary
 * @param {string} query - User query
 * @param {string} language - Language code
 * @returns {string} Extracted topic
 */
export const extractTopicFromQuery = (query, language = "en") => {
  if (!query) return "";

  // Get stopwords for the specified language
  const langStopwords = stopWords[language] || stopWords.en;

  // Convert to lowercase and remove punctuation
  const cleanQuery = query
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .replace(/\s{2,}/g, " ");

  // Tokenize
  const words = cleanQuery.split(" ").filter((word) => word.length > 1);

  // Remove stopwords and question words
  const langQuestionWords = questionWords[language] || questionWords.en;
  const contentWords = words.filter(
    (word) => !langStopwords.includes(word) && !langQuestionWords.includes(word)
  );

  // Apply stemming to each content word with language-specific rules
  const stemmedContentWords = contentWords.map((word) =>
    stemWord(word, language)
  );

  // Check for direct matches in energyDictionary
  const dictionaryTopics = Object.keys(
    energyDictionary[language] || energyDictionary.en
  );

  // Look for exact topic matches first
  for (const topic of dictionaryTopics) {
    if (cleanQuery.includes(topic.toLowerCase())) {
      return topic;
    }
  }

  // Look for stemmed word matches next
  for (const stemmedWord of stemmedContentWords) {
    for (const topic of dictionaryTopics) {
      const stemmedTopic = stemWord(topic, language).toLowerCase();
      if (
        stemmedTopic.includes(stemmedWord) ||
        (stemmedWord.length > 3 &&
          stemmedTopic.split(" ").some((part) => part.includes(stemmedWord)))
      ) {
        return topic;
      }
    }
  }

  // Try original words if stems didn't match
  for (const word of contentWords) {
    for (const topic of dictionaryTopics) {
      if (
        topic.toLowerCase().includes(word) ||
        (word.length > 3 &&
          topic
            .toLowerCase()
            .split(" ")
            .some((part) => part.includes(word)))
      ) {
        return topic;
      }
    }
  }

  // Get related topics if available
  for (const word of contentWords) {
    const relatedTopics = getRelatedTopics(word, language);
    if (relatedTopics && relatedTopics.length > 0) {
      return relatedTopics[0]; // Return the first related topic
    }
  }

  // If no energy term found, return the first content word or empty string
  return contentWords.length > 0 ? contentWords[0] : "";
};

/**
 * Extract entities from text with language support
 * @param {string} text - Text to analyze
 * @param {string} language - Language code
 * @returns {Object} Extracted entities
 */
export const extractEntities = (text, language = "en") => {
  if (!text) return { organizations: [], places: [], numbers: [], dates: [] };

  try {
    const doc = nlp(text);

    // Initialize with empty arrays
    const entities = {
      organizations: [],
      places: [],
      numbers: [],
      dates: [],
    };

    // Extract organizations (fallback to nouns starting with capital letters)
    const orgs = doc.match("#Organization+").out("array");
    entities.organizations = orgs.length
      ? orgs
      : doc.match("[A-Z][a-z]+").out("array");

    // Extract places
    entities.places = doc.places().out("array");

    // Extract numbers using the numbers plugin
    entities.numbers = doc.numbers().out("array");

    // Extract dates using the dates plugin, with fallback
    try {
      entities.dates = doc.dates().out("array");
    } catch (error) {
      console.warn("Date extraction failed, using fallback:", error);
      // Use our datePatterns module instead of inline patterns
      entities.dates = extractDateReferences(text, language);
    }

    return entities;
  } catch (error) {
    console.warn("Error in extractEntities:", error);
    return { organizations: [], places: [], numbers: [], dates: [] };
  }
};

/**
 * Get sentence sentiment score using compromise and sentiment patterns
 * @param {string} text - Text to analyze
 * @param {string} language - Language code
 * @returns {number} Sentiment score between -1 and 1
 */
export const getSentenceSentiment = (text, language = "en") => {
  if (!text) return 0;

  try {
    const doc = nlp(text);

    // Get patterns from sentimentPatterns instead of hardcoding
    const positivePattern = getCompromisePattern("positive", language);
    const negativePattern = getCompromisePattern("negative", language);

    // Match against the patterns
    const positive = doc.match(positivePattern).length;
    const negative = doc.match(negativePattern).length;

    return (positive - negative) / (positive + negative + 1);
  } catch (error) {
    console.warn("Error in getSentenceSentiment:", error);
    return 0;
  }
};

/**
 * Extract key phrases from text
 * @param {string} text - Text to analyze
 * @returns {Array} Extracted phrases
 */
export const extractKeyPhrases = (text) => {
  if (!text) return [];

  try {
    const doc = nlp(text);
    return doc
      .phrases()
      .json()
      .map((phrase) => phrase.text)
      .filter((phrase) => phrase.split(" ").length > 1);
  } catch (error) {
    console.warn("Error in extractKeyPhrases:", error);
    return [];
  }
};

/**
 * Check if text contains date references
 * @param {string} text - Text to check
 * @param {string} language - Language code
 * @returns {boolean} True if the text contains date references
 */
export const containsDateReference = (text, language = "en") => {
  if (!text) return false;

  const dates = extractDateReferences(text, language);
  return dates.length > 0;
};

/**
 * Analyze sentiment of text
 * @param {string} text - Text to analyze
 * @param {string} language - Language code
 * @returns {Object} Sentiment analysis results
 */
export const analyzeSentiment = (text, language = "en") => {
  return getSentiment(text, language);
};

export default {
  containsQuestionWord,
  isGreeting,
  extractTopicFromQuery,
  extractEntities,
  analyzeSentiment,
  cleanQuery,
  getSentenceSentiment,
  extractKeyPhrases,
  containsDateReference,
  extractDateReferences,
  stemWord,
  findIntent,
};
