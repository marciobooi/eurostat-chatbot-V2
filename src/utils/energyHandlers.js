import { energyDefinitionsEn } from '../dictionaries/energyDefinitionsEn';

/**
 * Searches for an energy definition based on a query
 * @param {string} query - The search query
 * @param {string} language - The language code (defaults to 'en')
 * @param {boolean} exactMatch - Whether to only look for exact matches
 * @returns {Object|null} The matching energy definition or null if not found
 */
export const findEnergyDefinition = (query, language = 'en', exactMatch = false) => {
  if (!energyDefinitionsEn) {
    return null;
  }

  const dict = energyDefinitionsEn;
  const searchQuery = query.toLowerCase().trim();
  
  // First check for exact matches on key or title
  for (const [key, definition] of Object.entries(dict)) {
    // Try an exact match on the key
    if (key.toLowerCase() === searchQuery) {
      return {
        title: definition.title,
        text: definition.text || '',
        subFuels: definition.subFuels || [],
        keywords: definition.keywords || [],
        dataset: definition.dataset,
        hasVisualization: definition.hasVisualization,
        visualizationType: definition.visualizationType
      };
    }
    
    // Try an exact match on the title
    if (definition.title?.toLowerCase() === searchQuery) {
      return {
        title: definition.title,
        text: definition.text || '',
        subFuels: definition.subFuels || [],
        keywords: definition.keywords || [],
        dataset: definition.dataset,
        hasVisualization: definition.hasVisualization,
        visualizationType: definition.visualizationType
      };
    }
  }
  
  // If we're doing an exact match only, stop here
  if (exactMatch) {
    return null;
  }
  
  // If no exact matches found and we're not requiring exact matches,
  // continue with the original search logic
  for (const [key, definition] of Object.entries(dict)) {
    const keyMatch = key.toLowerCase().includes(searchQuery);
    const titleMatch = definition.title?.toLowerCase().includes(searchQuery);
    const subFuelMatch = definition.subFuels?.some(fuel => fuel.toLowerCase().includes(searchQuery));
    const keywordMatch = definition.keywords?.some(k => k.toLowerCase().includes(searchQuery));
    const conceptMatch = definition.key_concepts?.some(k => k.toLowerCase().includes(searchQuery));
    const fuelCodeMatch = definition.fuelCode?.toLowerCase().includes(searchQuery);
    
    if (keyMatch || titleMatch || subFuelMatch || keywordMatch || conceptMatch || fuelCodeMatch) {
      return {
        title: definition.title,
        text: definition.text || '',
        subFuels: definition.subFuels || [],
        keywords: definition.keywords || [],
        dataset: definition.dataset,
        hasVisualization: definition.hasVisualization,
        visualizationType: definition.visualizationType
      };
    }
  }
  
  return null;
};