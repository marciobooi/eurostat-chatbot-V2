/**
 * Energy dictionary with multilingual support
 * Contains information about energy topics across multiple languages
 */

import { energyDefinitionsEn } from '../dictionaries/energyDefinitionsEn.js';


export const energyDictionary = {
  en: energyDefinitionsEn,

};

/**
 * Get related topics for a specific topic
 * @param {string} topic - The topic to find related topics for
 * @param {string} language - The language code
 * @returns {string[]} - Array of related topics
 */
export const getRelatedTopics = (topic, language = 'en') => {
  const dict = energyDictionary[language] || energyDictionary.en;
  return dict[topic.toLowerCase()]?.related || [];
};

/**
 * Get keywords for a specific topic
 * @param {string} topic - The topic to find keywords for
 * @param {string} language - The language code
 * @returns {string[]} - Array of keywords
 */
export const getKeywords = (topic, language = 'en') => {
  const dict = energyDictionary[language] || energyDictionary.en;
  return dict[topic.toLowerCase()]?.keywords || [];
};

/**
 * Get synonyms for a specific topic
 * @param {string} topic - The topic to find synonyms for
 * @param {string} language - The language code
 * @returns {string[]} - Array of synonyms
 */
export const getSynonyms = (topic, language = 'en') => {
  const dict = energyDictionary[language] || energyDictionary.en;
  return dict[topic.toLowerCase()]?.synonyms || [];
};