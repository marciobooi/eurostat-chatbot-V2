/**
 * Token matching utilities for semantic matching between user queries and energy topics
 */
import { stopWords } from "../data/stopWords"; // Fixed import path

/**
 * Tokenize a string and remove stopwords
 * @param {string} text - Text to tokenize
 * @param {string} language - Language code
 * @returns {Array} Array of tokens
 */
export const tokenize = (text, language = "en") => {
  if (!text || typeof text !== "string") return [];

  // Convert to lowercase and remove special characters
  const cleanText = text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  // Split into words
  const tokens = cleanText.split(" ").filter((token) => token.length > 1);

  // Remove stopwords
  const langStopwords = stopWords[language] || stopWords.en;
  return tokens.filter((token) => !langStopwords.includes(token));
};

/**
 * Calculate match score between tokens
 * @param {Object} options - Match options containing token arrays
 * @returns {Object} Match result with scores
 */
export const calculateMatchScore = (options) => {
  const { query = [], key = [], keywords = [], synonyms = [] } = options;

  if (!query.length)
    return {
      isMatch: false,
      scores: { key: 0, keywords: 0, synonyms: 0, total: 0 },
    };

  // Count exact matches for each category
  const keyMatches = countMatches(query, key);
  const keywordMatches = countMatches(query, keywords);
  const synonymMatches = countMatches(query, synonyms);

  // Calculate individual scores (0-1)
  const keyScore = key.length ? keyMatches / Math.max(key.length, 1) : 0;
  const keywordScore = keywords.length
    ? keywordMatches / Math.max(query.length, 1)
    : 0;
  const synonymScore = synonyms.length
    ? synonymMatches / Math.max(query.length, 1)
    : 0;

  // Calculate total score with different weightings
  const weightedScore =
    keyScore * 0.5 + keywordScore * 0.3 + synonymScore * 0.2;

  // Determine if it's a match (score >= threshold)
  const isMatch = weightedScore >= 0.6;

  return {
    isMatch,
    scores: {
      key: parseFloat(keyScore.toFixed(2)),
      keywords: parseFloat(keywordScore.toFixed(2)),
      synonyms: parseFloat(synonymScore.toFixed(2)),
      total: parseFloat(weightedScore.toFixed(2)),
    },
  };
};

/**
 * Count the number of matches between two arrays
 * @param {Array} tokens1 - First array of tokens
 * @param {Array} tokens2 - Second array of tokens
 * @returns {number} Number of matches
 */
const countMatches = (tokens1, tokens2) => {
  if (!tokens1 || !tokens2 || !tokens1.length || !tokens2.length) return 0;

  let matches = 0;

  // Check each token from first array against second array
  for (const token of tokens1) {
    for (const compareToken of tokens2) {
      // Exact match or token is part of compareToken or vice versa
      if (
        token === compareToken ||
        (token.length > 3 && compareToken.includes(token)) ||
        (compareToken.length > 3 && token.includes(compareToken))
      ) {
        matches++;
        break; // Count only once per token in tokens1
      }
    }
  }

  return matches;
};

/**
 * Check if query contains all required terms
 * @param {Array} queryTokens - Tokenized query
 * @param {Array} requiredTokens - Tokens that must be present
 * @returns {boolean} True if all required tokens are present
 */
export const containsAllTerms = (queryTokens, requiredTokens) => {
  if (!requiredTokens || !requiredTokens.length) return true;
  if (!queryTokens || !queryTokens.length) return false;

  return requiredTokens.every((required) =>
    queryTokens.some(
      (token) =>
        token === required ||
        (token.length > 3 && token.includes(required)) ||
        (required.length > 3 && required.includes(token))
    )
  );
};

/**
 * Check if query contains any exclusion terms
 * @param {Array} queryTokens - Tokenized query
 * @param {Array} exclusionTokens - Tokens that must not be present
 * @returns {boolean} True if any exclusion token is present
 */
export const containsExclusionTerms = (queryTokens, exclusionTokens) => {
  if (!exclusionTokens || !exclusionTokens.length) return false;
  if (!queryTokens || !queryTokens.length) return false;

  return exclusionTokens.some((excluded) =>
    queryTokens.some(
      (token) =>
        token === excluded ||
        (token.length > 3 && token.includes(excluded)) ||
        (excluded.length > 3 && excluded.includes(token))
    )
  );
};
