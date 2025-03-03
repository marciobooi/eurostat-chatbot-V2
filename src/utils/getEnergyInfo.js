import { extractTopicFromQuery, extractEntities } from "./nlpHelper";
import { calculateMatchScore } from "./tokenMatcher";
import { energyDictionary } from "../data/energyDictionary";
import { LanguageValidator } from "./languageUtils";
import { tokenize } from "./tokenMatcher";

// Reduce minimum match score for single-word queries
const MINIMUM_MATCH_SCORE = 0.15;
const SINGLE_WORD_MATCH_SCORE = 0.1;

const createErrorResponse = (error, language = "en") => ({
  key: "unknown",
  baseTopic: "unknown",
  isKnown: false,
  confidence: 0,
  error: error.message,
  language,
});

/**
 * Match a query to energy topics
 * @param {string} query - User's question
 * @param {string} language - Language code
 * @returns {Object} Match information
 */
export const getEnergyInfo = (query, language = "en") => {
  try {
    if (!query) {
      return { isKnown: false, confidence: 0 };
    }

    const topics = Object.keys(
      energyDictionary[language] || energyDictionary.en
    );

    // Extract topic from query using NLP
    const extractedTopic = extractTopicFromQuery(query, language);
    console.log("Extracted topic:", extractedTopic);

    // Check for exact matches first
    for (const topic of topics) {
      if (topic.toLowerCase() === extractedTopic.toLowerCase()) {
        return {
          isKnown: true,
          key: topic,
          confidence: 1.0,
          exactMatch: true,
        };
      }
    }

    // If no exact match, do semantic matching
    const queryTokens = tokenize(query, language);
    let bestMatch = null;
    let bestScore = 0;

    for (const topic of topics) {
      const topicData =
        energyDictionary[language][topic] || energyDictionary.en[topic];

      if (!topicData) continue;

      const keyTokens = tokenize(topic, language);
      const keywordTokens = tokenize(
        (topicData.keywords || []).join(" "),
        language
      );
      const synonymTokens = tokenize(
        (topicData.synonyms || []).join(" "),
        language
      );

      const matchResult = calculateMatchScore({
        query: queryTokens,
        key: keyTokens,
        keywords: keywordTokens,
        synonyms: synonymTokens,
      });

      console.log(`Match for ${topic}:`, matchResult.scores.total);

      if (matchResult.scores.total > bestScore) {
        bestScore = matchResult.scores.total;
        bestMatch = {
          key: topic,
          score: bestScore,
        };
      }
    }

    // Consider it a match if the score is above threshold
    const MATCH_THRESHOLD = 0.55;

    if (bestMatch && bestMatch.score >= MATCH_THRESHOLD) {
      console.log("Best match:", bestMatch);
      return {
        isKnown: true,
        key: bestMatch.key,
        confidence: bestMatch.score,
        exactMatch: false,
      };
    }

    // No good match found
    return {
      isKnown: false,
      confidence: bestMatch ? bestMatch.score : 0,
      baseTopic: extractedTopic,
    };
  } catch (error) {
    console.error("Error in getEnergyInfo:", error);
    return { isKnown: false, confidence: 0, error: true };
  }
};

// Export for debugging/testing purposes
export const getMatchScore = (query, language) => {
  try {
    const validLang = LanguageValidator.validate(language);

    const entries = energyDictionary[validLang];
    if (!entries) {
      throw new Error(`No dictionary entries found for language: ${validLang}`);
    }

    const topic = extractTopicFromQuery(query, validLang);
    const entities = extractEntities(query);

    return Object.entries(entries).map(([key, value]) => {
      try {
        const baseTopic = key.split(" ")[0];
        const normalizedTopic = LanguageValidator.normalizeText(
          baseTopic,
          validLang
        );

        return {
          key,
          score: calculateMatchScore(
            topic,
            {
              key: normalizedTopic,
              keywords: [
                ...value.keywords.map((kw) =>
                  LanguageValidator.normalizeText(kw, validLang)
                ),
                normalizedTopic,
                ...entities.organizations.filter((org) =>
                  value.keywords.some((kw) =>
                    LanguageValidator.normalizeText(org, validLang).includes(
                      LanguageValidator.normalizeText(kw, validLang)
                    )
                  )
                ),
              ],
              synonyms: (value.synonyms || []).map((syn) =>
                LanguageValidator.normalizeText(syn, validLang)
              ),
            },
            validLang
          ),
          language: validLang,
        };
      } catch (error) {
        console.warn(`Error getting match score for ${key}:`, error);
        return { key, score: 0, error: error.message, language: validLang };
      }
    });
  } catch (error) {
    console.warn("Error in getMatchScore:", error);
    return [];
  }
};
