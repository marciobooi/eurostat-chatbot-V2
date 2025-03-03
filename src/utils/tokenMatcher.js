import { getStopWords } from "../data/stopWords";

/**
 * Tokenize a string into words and remove stop words
 * @param {string} text - Text to tokenize
 * @param {string} language - Language code
 * @returns {string[]} Array of tokens
 */
export const tokenize = (text, language = "en") => {
  if (!text) return [];

  const normalizedText = text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  const words = normalizedText.split(/\s+/);
  const languageStopWords = getStopWords(language);

  return words.filter(
    (word) => word.length > 1 && !languageStopWords.includes(word)
  );
};

/**
 * Get term weight using TF-IDF principle
 * @param {string} term - Term to calculate weight for
 * @param {string[]} terms - All terms in the document
 * @returns {number} Term weight
 */
export const getTermWeight = (term, terms) => {
  if (!terms || !Array.isArray(terms) || terms.length === 0) return 0;

  // Simple term frequency
  const termCount = terms.filter((t) => t === term).length;
  const termFrequency = termCount / terms.length;

  // Simple inverse document frequency (higher weight for less common terms)
  const documentFrequency = terms.some((t) => t === term) ? 1 : 0;
  const inverseDocumentFrequency = documentFrequency
    ? Math.log(terms.length / documentFrequency)
    : 0;

  return termFrequency * inverseDocumentFrequency;
};

/**
 * Calculate semantic similarity between two sets of tokens
 * @param {string[]} tokensA - First set of tokens
 * @param {string[]} tokensB - Second set of tokens
 * @returns {number} Similarity score (0-1)
 */
export const calculateSemanticSimilarity = (tokensA, tokensB) => {
  if (!tokensA?.length || !tokensB?.length) return 0;

  try {
    // Convert tokens to unique terms
    const uniqueA = [...new Set(tokensA)];
    const uniqueB = [...new Set(tokensB)];

    // Calculate weights for each term
    const weightsA = uniqueA.map((term) => ({
      term,
      weight: getTermWeight(term, [...tokensA, ...tokensB]) || 0.5,
    }));

    const weightsB = uniqueB.map((term) => ({
      term,
      weight: getTermWeight(term, [...tokensA, ...tokensB]) || 0.5,
    }));

    // Calculate matches
    let matchScore = 0;
    let totalPossible = 0;

    weightsA.forEach(({ term: termA, weight: weightA }) => {
      totalPossible += weightA;

      // Find exact matches
      const exactMatch = weightsB.find(({ term }) => term === termA);
      if (exactMatch) {
        matchScore += weightA * 1.0; // Full weight for exact match
      } else {
        // Find partial matches (substring or edit distance)
        const partialMatches = weightsB.filter(
          ({ term: termB }) =>
            termA.includes(termB) ||
            termB.includes(termA) ||
            levenshteinDistance(termA, termB) /
              Math.max(termA.length, termB.length) <
              0.3
        );

        if (partialMatches.length > 0) {
          // Take the best partial match
          const bestPartialMatch = Math.max(
            ...partialMatches.map(({ weight }) => weight)
          );
          matchScore += weightA * 0.6 * bestPartialMatch; // Partial credit for partial matches
        }
      }
    });

    // Normalize score
    return totalPossible > 0 ? matchScore / totalPossible : 0;
  } catch (error) {
    console.error("Error calculating semantic similarity:", error);
    return 0;
  }
};

/**
 * Calculate edit distance between two strings
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Edit distance
 */
export const levenshteinDistance = (a, b) => {
  if (!a || !a.length) return b ? b.length : 0;
  if (!b || !b.length) return a.length;

  let matrix = [];

  // Initialize matrix
  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[a.length][b.length];
};

/**
 * Calculate overall match score between query and key/keywords/synonyms
 * @param {Object} params - Parameters
 * @param {string[]} params.query - Query tokens
 * @param {string[]} params.key - Key tokens
 * @param {string[]} params.keywords - Keyword tokens
 * @param {string[]} params.synonyms - Synonym tokens
 * @returns {Object} Match scores
 */
export const calculateMatchScore = ({ query, key, keywords, synonyms }) => {
  try {
    // Calculate different match types with different weights
    const keyScore = calculateSemanticSimilarity(query, key) * 1.0; // 100% weight for key match
    const keywordScore = calculateSemanticSimilarity(query, keywords) * 0.8; // 80% weight for keyword match
    const synonymScore = calculateSemanticSimilarity(query, synonyms) * 0.6; // 60% weight for synonym match

    // Calculate total score (average of all non-zero scores)
    const scores = [
      { type: "key", score: keyScore },
      { type: "keywords", score: keywordScore },
      { type: "synonyms", score: synonymScore },
    ];

    const nonZeroScores = scores.filter((s) => s.score > 0);
    const totalScore =
      nonZeroScores.length > 0
        ? nonZeroScores.reduce((sum, s) => sum + s.score, 0) /
          nonZeroScores.length
        : 0;

    return {
      query,
      key,
      keywords,
      synonyms,
      scores: {
        key: keyScore,
        keywords: keywordScore,
        synonyms: synonymScore,
        total: totalScore,
      },
    };
  } catch (error) {
    console.error("Error calculating match score:", error);
    return {
      query,
      key,
      keywords,
      synonyms,
      scores: {
        key: 0,
        keywords: 0,
        synonyms: 0,
        total: 0,
      },
    };
  }
};
