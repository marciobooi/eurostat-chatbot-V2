/**
 * Utility for getting energy information from various sources
 */
import { energyDictionary } from "../data/energyDictionary";
import { extractTopicFromQuery } from "./nlpHelper";

// Example of path fixing for any API calls or asset loading
// Old: const API_URL = '/api/data'
// New:
const API_URL = import.meta.env.PROD
  ? "/eurostat-chatbot-V2/api/data"
  : "/api/data";

/**
 * Get energy information based on the user query
 * @param {string} query - User query
 * @param {string} language - Language code
 * @returns {Object} Response with answer, confidence and related data
 */
export const getEnergyInfo = async (query, language = "en") => {
  try {
    // For single-word queries like "oil", use them directly
    query = query.trim();
    let topic;

    if (query.split(" ").length === 1) {
      // If it's a single word query, use it directly as the topic
      topic = query.toLowerCase();
      console.log("Single word query detected:", topic);
    } else {
      // Otherwise extract the topic from the query
      topic = extractTopicFromQuery(query, language);
      console.log("Extracted topic:", topic);
    }

    if (!topic) {
      console.log("No topic extracted from query");
      return {
        answer: null,
        confidence: 0,
        key: null,
        baseTopic: null,
      };
    }

    console.log("Looking up topic:", topic);

    // Look for the topic in the dictionary
    let dictionaryData = getDictionaryEntry(topic, language);

    if (!dictionaryData) {
      // Try fallback to partial matches more aggressively
      const partialMatch = findPartialMatch(topic, language);

      if (partialMatch) {
        dictionaryData = partialMatch;
        console.log("Found partial match:", partialMatch.key);
      }
    }

    if (dictionaryData) {
      // We found a match in the dictionary
      console.log("Found dictionary match:", dictionaryData.key);
      return {
        answer: dictionaryData.text || dictionaryData.description,
        confidence: dictionaryData.score || 0.9,
        key: dictionaryData.key,
        baseTopic: topic,
        source: "dictionary",
      };
    }

    // No match found
    console.log("No dictionary match found for topic:", topic);
    return {
      answer: null,
      confidence: 0,
      key: null,
      baseTopic: topic,
    };
  } catch (error) {
    console.error("Error getting energy info:", error);
    return {
      answer: null,
      confidence: 0,
      key: null,
      error: error.message,
    };
  }
};

/**
 * Get a dictionary entry by topic
 * @param {string} topic - Topic to find
 * @param {string} language - Language code
 * @returns {Object|null} Dictionary entry or null if not found
 */
const getDictionaryEntry = (topic, language = "en") => {
  if (!topic) return null;

  // Get language-specific dictionary, fallback to English
  const dictionary = energyDictionary[language] || energyDictionary.en;

  // First try direct lookup by key
  if (dictionary[topic]) {
    return {
      ...dictionary[topic],
      key: topic,
    };
  }

  // Try case-insensitive match
  const normalizedTopic = topic.toLowerCase();

  const key = Object.keys(dictionary).find(
    (k) => k.toLowerCase() === normalizedTopic
  );

  if (key) {
    return {
      ...dictionary[key],
      key,
    };
  }

  return null;
};

/**
 * Find a partial match for a topic in the dictionary
 * @param {string} topic - Topic to find
 * @param {string} language - Language code
 * @returns {Object|null} Best partial match or null if none found
 */
const findPartialMatch = (topic, language = "en") => {
  if (!topic) return null;

  // Get language-specific dictionary, fallback to English
  const dictionary = energyDictionary[language] || energyDictionary.en;

  const normalizedTopic = topic.toLowerCase();
  let bestMatch = null;
  let bestScore = 0.2; // Lower threshold to catch more matches

  // Check each entry for partial matches
  Object.entries(dictionary).forEach(([key, entry]) => {
    const lowerKey = key.toLowerCase();

    // Check for partial matches in key, title, and description
    const keyMatch =
      lowerKey.includes(normalizedTopic) || normalizedTopic.includes(lowerKey);
    const titleMatch =
      entry.title &&
      (entry.title.toLowerCase().includes(normalizedTopic) ||
        normalizedTopic.includes(entry.title.toLowerCase()));

    // Check keywords
    const keywordMatch =
      entry.keywords &&
      entry.keywords.some((keyword) => {
        const lowerKeyword = keyword.toLowerCase();
        return (
          lowerKeyword.includes(normalizedTopic) ||
          normalizedTopic.includes(lowerKeyword)
        );
      });

    if (keyMatch || titleMatch || keywordMatch) {
      // Calculate match score
      const baseScore =
        Math.min(
          normalizedTopic.length / Math.max(lowerKey.length, 1),
          lowerKey.length / Math.max(normalizedTopic.length, 1)
        ) * 0.5;

      // Apply bonuses for different match types
      let finalScore = baseScore;
      if (keyMatch) finalScore += 0.2;
      if (titleMatch) finalScore += 0.15;
      if (keywordMatch) finalScore += 0.3;

      // Bonus for exact keyword match
      if (
        entry.keywords &&
        entry.keywords.some((k) => k.toLowerCase() === normalizedTopic)
      ) {
        finalScore += 0.2;
      }

      // Update best match if this is better
      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestMatch = {
          ...entry,
          key,
          score: parseFloat(finalScore.toFixed(2)),
        };
      }
    }
  });

  return bestMatch;
};

export default getEnergyInfo;
