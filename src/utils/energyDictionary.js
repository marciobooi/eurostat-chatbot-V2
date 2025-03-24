/**
 * Energy dictionary with multilingual support
 * Contains information about energy topics across multiple languages
 */

import { energyDefinitionsEn } from '../dictionaries/energyDefinitionsEn.js';
import { CONFIG } from '../i18n.js';

export const energyDictionary = {
  en: energyDefinitionsEn,
  // Add other languages here
};

/**
 * Get dictionary for specific language with fallback
 */
export const getDictionary = (language = CONFIG.DEFAULT_LANGUAGE) => {
  console.log('Getting dictionary for language:', language);
  const dict = energyDictionary[language] || energyDictionary[CONFIG.DEFAULT_LANGUAGE];
  console.log('Dictionary entries:', Object.keys(dict));
  return dict;
};

/**
 * Get related topics for a specific topic
 * @param {string} topic - The topic to find related topics for
 * @param {string} language - The language code
 * @returns {string[]} - Array of related topics
 */
export const getRelatedTopics = (topic, language = CONFIG.DEFAULT_LANGUAGE) => {
  const dict = getDictionary(language);
  return dict[topic.toLowerCase()]?.related || [];
};

/**
 * Get keywords for a specific topic
 * @param {string} topic - The topic to find keywords for
 * @param {string} language - The language code
 * @returns {string[]} - Array of keywords
 */
export const getKeywords = (topic, language = CONFIG.DEFAULT_LANGUAGE) => {
  console.log('Looking up keywords for topic:', topic);
  const dict = getDictionary(language);
  const entry = dict[topic.toLowerCase()];
  console.log('Found entry:', entry);
  return entry?.keywords || [];
};

/**
 * Get synonyms for a specific topic
 * @param {string} topic - The topic to find synonyms for
 * @param {string} language - The language code
 * @returns {string[]} - Array of synonyms
 */
export const getSynonyms = (topic, language = CONFIG.DEFAULT_LANGUAGE) => {
  const dict = getDictionary(language);
  return dict[topic.toLowerCase()]?.synonyms || [];
};

/**
 * Get statistical concepts for a topic
 * @param {string} topic - The topic to find statistical concepts for
 * @param {string} language - The language code
 * @returns {string[]} - Array of statistical concepts
 */
export const getStatisticalConcepts = (topic, language = CONFIG.DEFAULT_LANGUAGE) => {
  const dict = getDictionary(language);
  return dict[topic.toLowerCase()]?.statisticalConcepts || [];
};

/**
 * Get key concepts for a topic
 * @param {string} topic - The topic to find key concepts for
 * @param {string} language - The language code
 * @returns {string[]} - Array of key concepts
 */
export const getKeyConcepts = (topic, language = CONFIG.DEFAULT_LANGUAGE) => {
  const dict = getDictionary(language);
  return dict[topic.toLowerCase()]?.key_concepts || [];
};

/**
 * Check if a topic exists in a specific language
 * @param {string} topic - The topic to check
 * @param {string} language - The language code
 * @returns {boolean} - True if the topic exists, false otherwise
 */
export const topicExists = (topic, language = CONFIG.DEFAULT_LANGUAGE) => {
  const dict = getDictionary(language);
  return !!dict[topic.toLowerCase()];
};

/**
 * Get available languages for a topic
 * @param {string} topic - The topic to find available languages for
 * @returns {string[]} - Array of available languages
 */
export const getAvailableLanguages = (topic) => {
  return Object.keys(energyDictionary).filter(lang => 
    !!energyDictionary[lang][topic.toLowerCase()]
  );
};