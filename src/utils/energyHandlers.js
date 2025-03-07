import { energyDefinitionsEn } from '../dictionaries/energyDefinitionsEn';

/**
 * Searches for an energy definition based on a query
 * @param {string} query - The search query
 * @param {string} language - The language code (defaults to 'en')
 * @returns {Object|null} The matching energy definition or null if not found
 */
export const findEnergyDefinition = (query, language = 'en') => {
  if (!energyDefinitionsEn) {
    return null;
  }

  const dict = energyDefinitionsEn;
  const searchQuery = query.toLowerCase().trim();
  
  // First try exact match on key, title, or subFuels
  for (const [key, definition] of Object.entries(dict)) {
    const keyMatch = key.toLowerCase() === searchQuery;
    const titleMatch = definition.title?.toLowerCase() === searchQuery;
    const subFuelMatch = definition.subFuels?.some(fuel => fuel.toLowerCase() === searchQuery);
    
    if (keyMatch || titleMatch || subFuelMatch) {
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
  
  // If no exact match, try partial matches
  for (const [key, definition] of Object.entries(dict)) {
    if (key.toLowerCase().includes(searchQuery) || 
        definition.title?.toLowerCase().includes(searchQuery) ||
        definition.key_concepts?.some(k => k.toLowerCase().includes(searchQuery)) ||
        definition.fuelCode?.toLowerCase().includes(searchQuery) ||
        definition.keywords?.some(k => k.toLowerCase().includes(searchQuery)) ||
        definition.subFuels?.some(fuel => fuel.toLowerCase().includes(searchQuery))) {
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