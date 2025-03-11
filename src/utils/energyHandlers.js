import { energyDictionary } from './energyDictionary';
import { processText, findBestMatch, analyzeSentiment } from './nlpHandlers';
import { CONFIG } from '../i18n';

// Unit conversion constants
const UNIT_CONVERSIONS = {
  KTOE_TO_THS_T: 1000/0.7, // Approximate conversion factor
  THS_T_TO_KTOE: 0.7/1000
};

/**
 * Convert between energy units
 */
const convertUnits = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;
  
  switch(`${fromUnit}_TO_${toUnit}`) {
    case 'KTOE_TO_THS_T':
      return value * UNIT_CONVERSIONS.KTOE_TO_THS_T;
    case 'THS_T_TO_KTOE':
      return value * UNIT_CONVERSIONS.THS_T_TO_KTOE;
    default:
      console.warn(`Unsupported unit conversion: ${fromUnit} to ${toUnit}`);
      return value;
  }
};

/**
 * Find an energy definition based on user input
 */
export const findEnergyDefinition = async (input, language = CONFIG.DEFAULT_LANGUAGE) => {
  // Process the input text with NLP
  const nlpResults = await processText(input, language);

  // Get language-specific dictionary with fallback
  const dictionary = energyDictionary[language] || energyDictionary[CONFIG.DEFAULT_LANGUAGE];
  const topics = Object.keys(dictionary);

  // Clean and normalize the input
  const cleanedInput = input.toLowerCase().trim();

  // Direct topic match (case insensitive)
  const directTopicMatch = topics.find(topic => topic.toLowerCase() === cleanedInput);
  if (directTopicMatch) {
    return dictionary[directTopicMatch];
  }

  // Create an extended topics list that includes keywords and concepts
  const extendedTopics = topics.reduce((acc, topic) => {
    const def = dictionary[topic];
    if (def.keywords) {
      acc.push(...def.keywords.map(keyword => ({ keyword: keyword.toLowerCase(), topic })));
    }
    if (def.key_concepts) {
      acc.push(...def.key_concepts.map(concept => ({ keyword: concept.toLowerCase(), topic })));
    }
    return acc;
  }, []);

  // Find best matches among topics and keywords
  const directMatch = findBestMatch(cleanedInput, topics, language);
  const keywordMatch = findBestMatch(cleanedInput, extendedTopics.map(et => et.keyword), language);

  // Use a higher threshold for matching
  const MATCH_THRESHOLD = 0.6;

  // Determine the best overall match
  let matchedTopic;
  if (directMatch.score > MATCH_THRESHOLD) {
    matchedTopic = topics[directMatch.topic];
  } else if (keywordMatch.score > MATCH_THRESHOLD) {
    matchedTopic = extendedTopics[keywordMatch.topic]?.topic;
  }

  return matchedTopic ? dictionary[matchedTopic] : null;
};

/**
 * Get related topics based on energy definition
 */
export const getRelatedTopics = (topic, language = CONFIG.DEFAULT_LANGUAGE) => {
  const dictionary = energyDictionary[language] || energyDictionary[CONFIG.DEFAULT_LANGUAGE];
  const definition = dictionary[topic];
  
  if (!definition) return [];
  
  const related = new Set([
    ...(definition.related || []),
    ...(definition.subFuels || [])
  ]);
  
  return Array.from(related);
};

/**
 * Check if a topic has visualization support
 */
export const hasVisualization = (topic, language = CONFIG.DEFAULT_LANGUAGE) => {
  const dictionary = energyDictionary[language] || energyDictionary[CONFIG.DEFAULT_LANGUAGE];
  return dictionary[topic]?.hasVisualization || false;
};

/**
 * Get available visualization types for a topic
 */
export const getVisualizationTypes = (topic, language = CONFIG.DEFAULT_LANGUAGE) => {
  const dictionary = energyDictionary[language] || energyDictionary[CONFIG.DEFAULT_LANGUAGE];
  return dictionary[topic]?.visualizationType || [];
};

/**
 * Get dataset information for a topic
 */
export const getDatasetInfo = (topic, language = CONFIG.DEFAULT_LANGUAGE) => {
  const dictionary = energyDictionary[language] || energyDictionary[CONFIG.DEFAULT_LANGUAGE];
  const definition = dictionary[topic];
  
  if (!definition) return null;
  
  return {
    dataset: definition.dataset,
    fuelCode: definition.fuelCode,
    nrg_bal: definition.nrg_bal,
    siec: definition.siec,
    unit: definition.unit
  };
};

/**
 * Get normalized value in a specific unit
 */
export const getNormalizedValue = (value, fromUnit, toUnit = 'THS_T') => {
  return convertUnits(value, fromUnit, toUnit);
};