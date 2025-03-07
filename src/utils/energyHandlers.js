import { energyDefinitionsEn } from '../dictionaries/energyDefinitionsEn';

/**
 * Creates a definition result object from a dictionary entry
 * @param {Object} definition - The definition object from the dictionary
 * @returns {Object} Formatted definition result 
 */
const createDefinitionResult = (definition) => ({
  title: definition.title,
  text: definition.text || '',
  subFuels: definition.subFuels || [],
  keywords: definition.keywords || [],
  dataset: definition.dataset,
  hasVisualization: definition.hasVisualization,
  visualizationType: definition.visualizationType
});

/**
 * Searches for an energy definition based on a query
 * @param {string} query - The search query
 * @param {string} language - The language code (defaults to 'en')
 * @param {boolean} exactMatch - Whether to only look for exact matches
 * @returns {Object|null} The matching energy definition or null if not found
 */
export const findEnergyDefinition = (query, language = 'en', exactMatch = false) => {
  // Validate inputs
  if (!query || !energyDefinitionsEn) {
    return null;
  }

  const dict = energyDefinitionsEn;
  const searchQuery = query.toLowerCase().trim();
  
  // First check for exact matches on key or title
  for (const [key, definition] of Object.entries(dict)) {
    // Try an exact match on the key
    if (key.toLowerCase() === searchQuery) {
      return createDefinitionResult(definition);
    }
    
    // Try an exact match on the title
    if (definition.title?.toLowerCase() === searchQuery) {
      return createDefinitionResult(definition);
    }
  }
  
  // If we're doing an exact match only, stop here
  if (exactMatch) {
    return null;
  }
  
  // If no exact matches found and we're not requiring exact matches,
  // continue with the broader search logic
  for (const [key, definition] of Object.entries(dict)) {
    // Check if any of the fields include the search query
    if (
      key.toLowerCase().includes(searchQuery) ||
      definition.title?.toLowerCase().includes(searchQuery) ||
      definition.subFuels?.some(fuel => fuel.toLowerCase().includes(searchQuery)) ||
      definition.keywords?.some(k => k.toLowerCase().includes(searchQuery)) ||
      definition.key_concepts?.some(k => k.toLowerCase().includes(searchQuery)) ||
      definition.fuelCode?.toLowerCase().includes(searchQuery)
    ) {
      return createDefinitionResult(definition);
    }
  }
  
  return null;
};