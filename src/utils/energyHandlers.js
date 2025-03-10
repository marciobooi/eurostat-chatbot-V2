import { energyDictionary } from './energyDictionary';
import { processText, findBestMatch, analyzeSentiment } from './nlpHandlers';

/**
 * Find an energy definition based on user input
 */
export const findEnergyDefinition = async (input, language = 'en') => {
  // Process the input text with NLP
  const nlpResults = await processText(input, language);
  const sentiment = analyzeSentiment(input, language);

  // Get all topics and their keywords from the dictionary
  const dictionary = energyDictionary[language] || energyDictionary.en;
  const topics = Object.keys(dictionary);

  // Clean and normalize the input
  const cleanedInput = input.toLowerCase().trim();

  // Direct topic match (case insensitive)
  const directTopicMatch = topics.find(topic => topic.toLowerCase() === cleanedInput);
  if (directTopicMatch) {
    return dictionary[directTopicMatch];
  }

  // Create an extended topics list that includes keywords
  const extendedTopics = topics.reduce((acc, topic) => {
    const def = dictionary[topic];
    if (def.keywords) {
      acc.push(...def.keywords.map(keyword => ({ keyword, topic })));
    }
    if (def.key_concepts) {
      acc.push(...def.key_concepts.map(concept => ({ keyword: concept.toLowerCase(), topic })));
    }
    return acc;
  }, []);

  // Find best matches among topics and keywords
  const directMatch = findBestMatch(cleanedInput, topics);
  const keywordMatch = findBestMatch(cleanedInput, extendedTopics.map(et => et.keyword));

  // Use a higher threshold for matching
  const MATCH_THRESHOLD = 0.6;

  // Determine the best overall match
  let matchedTopic;
  if (directMatch.rating > MATCH_THRESHOLD) {
    matchedTopic = topics[directMatch.bestMatchIndex];
  } else if (keywordMatch.rating > MATCH_THRESHOLD) {
    matchedTopic = extendedTopics[keywordMatch.bestMatchIndex].topic;
  }

  return matchedTopic ? dictionary[matchedTopic] : null;
};

/**
 * Get related topics based on energy definition
 */
export const getRelatedTopics = (topic, language = 'en') => {
  const dictionary = energyDictionary[language] || energyDictionary.en;
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
export const hasVisualization = (topic, language = 'en') => {
  const dictionary = energyDictionary[language] || energyDictionary.en;
  return dictionary[topic]?.hasVisualization || false;
};

/**
 * Get available visualization types for a topic
 */
export const getVisualizationTypes = (topic, language = 'en') => {
  const dictionary = energyDictionary[language] || energyDictionary.en;
  return dictionary[topic]?.visualizationType || [];
};

/**
 * Get dataset information for a topic
 */
export const getDatasetInfo = (topic, language = 'en') => {
  const dictionary = energyDictionary[language] || energyDictionary.en;
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