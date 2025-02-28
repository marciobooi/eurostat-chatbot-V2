import { extractTopicFromQuery } from './nlpHelper';
import { calculateMatchScore } from './tokenMatcher';
import { energyDictionary } from '../data/energyDictionary';

const MINIMUM_MATCH_SCORE = 0.2;

export const getEnergyInfo = (query, language) => {
  const topic = extractTopicFromQuery(query, language);
  const entries = energyDictionary[language];
  
  let bestMatch = {
    key: 'unknown',
    score: 0
  };

  // Calculate scores for each dictionary entry
  Object.entries(entries).forEach(([key, value]) => {
    const baseTopic = key.split(' ')[0]; // Get base topic without 'definition'
    const entryData = {
      key: baseTopic,
      keywords: [...value.keywords, baseTopic],
      synonyms: value.synonyms
    };

    const score = calculateMatchScore(topic, entryData, language);
    console.log(`Match for ${key}:`, score);

    if (score > bestMatch.score) {
      bestMatch = { key, score };
    }
  });

  console.log('Best match:', bestMatch);
  
  return {
    key: bestMatch.key,
    baseTopic: bestMatch.key.split(' ')[0], // Add base topic to response
    isKnown: bestMatch.score >= MINIMUM_MATCH_SCORE
  };
};

// Export for debugging/testing purposes
export const getMatchScore = (query, language) => {
  const topic = extractTopicFromQuery(query, language);
  const entries = energyDictionary[language];
  
  return Object.entries(entries).map(([key, value]) => ({
    key,
    score: calculateMatchScore(topic, { key, keywords: value.keywords, synonyms: value.synonyms }, language)
  }));
};
