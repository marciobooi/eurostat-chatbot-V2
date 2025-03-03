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
 * Extract energy information based on query
 * @param {string} query - User query
 * @param {string} language - Language code
 * @returns {Object} Energy info response
 */
export const getEnergyInfo = (query, language = "en") => {
  try {
    if (!query) {
      return { isKnown: false, key: "unknown", confidence: 0 };
    }

    // Use the dictionary for the requested language, or fallback to English
    const dictionary = energyDictionary[language] || energyDictionary.en;

    // Tokenize the query
    const queryTokens = tokenize(query, language);
    if (queryTokens.length === 0) {
      return { isKnown: false, key: "unknown", confidence: 0 };
    }

    // Track best match
    let bestMatch = { key: null, score: 0 };

    // Process each entry in the dictionary
    Object.entries(dictionary).forEach(([key, entry]) => {
      try {
        if (!entry) return;

        // Prepare tokens for matching
        const keyTokens = tokenize(key, language);
        const keywordTokens =
          entry.keywords?.map((kw) => tokenize(kw, language)).flat() || [];
        const synonymTokens =
          entry.synonyms?.map((s) => tokenize(s, language)).flat() || [];

        // Calculate match score
        const matchResult = calculateMatchScore({
          query: queryTokens,
          key: keyTokens,
          keywords: keywordTokens,
          synonyms: synonymTokens,
        });

        const matchScore = matchResult.scores.total;
        console.log("Match scores:", matchResult);
        console.log(`Match for ${key}: ${matchScore}`);

        // Update best match if better score found
        if (matchScore > bestMatch.score) {
          bestMatch = { key, score: matchScore };
        }
      } catch (entryError) {
        console.error(`Error processing entry ${key}:`, entryError);
      }
    });

    console.log("Best match:", bestMatch);

    // Return result
    if (bestMatch.score >= 0.4) {
      return {
        isKnown: true,
        key: bestMatch.key,
        confidence: bestMatch.score,
      };
    } else if (bestMatch.score >= 0.2) {
      return {
        isKnown: false,
        key: "unknown",
        baseTopic: bestMatch.key,
        confidence: bestMatch.score,
      };
    } else {
      return { isKnown: false, key: "unknown", confidence: 0 };
    }
  } catch (error) {
    console.error("Error in getEnergyInfo:", error);
    return { isKnown: false, key: "unknown", confidence: 0 };
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
