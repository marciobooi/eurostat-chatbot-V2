/**
 * Energy dictionary with multilingual support
 * Contains information about energy topics across multiple languages
 */

import { energyDefinitionsEn } from './energyDefinitionsEn';
import { energyDefinitionsFr } from './energyDefinitionsFr';
import { energyDefinitionsDe } from './energyDefinitionsDe';

export const energyDictionary = {
  en: energyDefinitionsEn,
  fr: energyDefinitionsFr,
  de: energyDefinitionsDe
};

/**
 * Get related topics for a specific topic
 * @param {string} topic - The topic to find related topics for
 * @param {string} language - Language code (en, fr, de)
 * @returns {Array} Array of related topics
 */
export const getRelatedTopics = (topic, language = "en") => {
  const dictionary = energyDictionary[language] || energyDictionary.en;

  // Check if topic exists in the dictionary
  if (dictionary[topic] && dictionary[topic].related) {
    return dictionary[topic].related;
  }

  // Try case-insensitive search
  const normalizedTopic = topic.toLowerCase();

  for (const [key, entry] of Object.entries(dictionary)) {
    if (key.toLowerCase() === normalizedTopic && entry.related) {
      return entry.related;
    }
  }

  return [];
};

export default energyDictionary;
