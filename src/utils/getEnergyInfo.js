import { extractTopicFromQuery, extractEntities } from './nlpHelper';
import { calculateMatchScore } from './tokenMatcher';
import { energyDictionary } from '../data/energyDictionary';

// Reduce minimum match score for single-word queries
const MINIMUM_MATCH_SCORE = 0.15;
const SINGLE_WORD_MATCH_SCORE = 0.1; // Even lower threshold for single words

const SUPPORTED_LANGUAGES = ['en', 'fr', 'de'];

const validateLanguage = (language) => {
  if (!language) {
    throw new Error('Language parameter is required');
  }
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    throw new Error(`Unsupported language: ${language}. Supported languages are: ${SUPPORTED_LANGUAGES.join(', ')}`);
  }
};

const createErrorResponse = (error, language = 'en') => ({
  key: 'unknown',
  baseTopic: 'unknown',
  isKnown: false,
  confidence: 0,
  error: error.message,
  language
});

export const getEnergyInfo = (query, language) => {
  try {
    validateLanguage(language);

    const entries = energyDictionary[language];
    if (!entries || Object.keys(entries).length === 0) {
      throw new Error(`No dictionary entries found for language: ${language}`);
    }

    const topic = extractTopicFromQuery(query, language);
    if (!topic) {
      return createErrorResponse(new Error('No topic could be extracted from query'), language);
    }

    const entities = extractEntities(query);
    let bestMatch = { key: 'unknown', score: 0 };
    const isSingleWord = !query.trim().includes(' ');

    // Calculate scores for each dictionary entry
    Object.entries(entries).forEach(([key, value]) => {
      try {
        const baseTopic = key.split(' ')[0];
        const entryData = {
          key: baseTopic,
          keywords: [
            ...value.keywords, 
            baseTopic,
            ...entities.organizations.filter(org => 
              value.keywords.some(kw => org.toLowerCase().includes(kw.toLowerCase()))
            )
          ],
          synonyms: value.synonyms || []
        };

        const score = calculateMatchScore(topic, entryData, language);
        if (score > bestMatch.score) {
          bestMatch = { key, score };
        }
      } catch (error) {
        console.warn(`Error processing entry ${key}:`, error);
      }
    });

    // Use different threshold for single-word queries
    const threshold = isSingleWord ? SINGLE_WORD_MATCH_SCORE : MINIMUM_MATCH_SCORE;

    return {
      key: bestMatch.key,
      baseTopic: bestMatch.key.split(' ')[0],
      isKnown: bestMatch.score >= threshold,
      confidence: bestMatch.score,
      language
    };
  } catch (error) {
    console.warn('Error in getEnergyInfo:', error);
    return createErrorResponse(error, language);
  }
};

// Export for debugging/testing purposes
export const getMatchScore = (query, language) => {
  try {
    validateLanguage(language);

    const entries = energyDictionary[language];
    if (!entries) {
      throw new Error(`No dictionary entries found for language: ${language}`);
    }

    const topic = extractTopicFromQuery(query, language);
    const entities = extractEntities(query);
    
    return Object.entries(entries).map(([key, value]) => {
      try {
        const baseTopic = key.split(' ')[0];
        return {
          key,
          score: calculateMatchScore(topic, {
            key: baseTopic,
            keywords: [
              ...value.keywords,
              baseTopic,
              ...entities.organizations.filter(org => 
                value.keywords.some(kw => org.toLowerCase().includes(kw.toLowerCase()))
              )
            ],
            synonyms: value.synonyms || []
          }, language),
          language
        };
      } catch (error) {
        console.warn(`Error getting match score for ${key}:`, error);
        return { key, score: 0, error: error.message, language };
      }
    });
  } catch (error) {
    console.warn('Error in getMatchScore:', error);
    return [];
  }
};
