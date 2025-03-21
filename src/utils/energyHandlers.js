/**
 * Energy data handlers
 */
import { energyDictionary, getDictionary } from './energyDictionary';
import { findBestMatch } from './nlpHandlers';
import { NLP_CONFIG } from '../config/nlpConfig';
import { CONFIG } from '../i18n';

// Unit conversion constants
const UNIT_CONVERSIONS = {
  KTOE_TO_THS_T: 1000/0.7, // Approximate conversion factor
  THS_T_TO_KTOE: 0.7/1000
};

/**
 * Convert input value to different units
 */
export const convertUnits = (value, fromUnit, toUnit) => {
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
 * Find energy definition based on text input and language
 */
export const findEnergyDefinition = async (text, language = CONFIG.DEFAULT_LANGUAGE) => {
  try {
    const dictionary = energyDictionary[language] || energyDictionary[CONFIG.DEFAULT_LANGUAGE];
    const candidates = Object.keys(dictionary);

    // Find best match using NLP
    const { matches, intent, entities } = await findBestMatch(text, candidates, language);
    
    if (matches.length === 0 && !entities?.energyDomain?.energyTypes) {
      return null;
    }

    let mainDefinition = null;
    let suggestions = [];

    // First try to find a match using detected energy types
    if (entities?.energyDomain?.energyTypes) {
      for (const entity of entities.energyDomain.energyTypes) {
        if (entity.canonical && dictionary[entity.canonical]) {
          mainDefinition = {
            ...dictionary[entity.canonical],
            fuelCode: entity.canonical
          };
          // Only include subFuels if this is a main fuel
          if (mainDefinition.isMainFuel && mainDefinition.subFuels) {
            suggestions = mainDefinition.subFuels;
          }
          break;
        }
      }
    }

    // If no match found through entities, try direct matches
    if (!mainDefinition && matches.length > 0) {
      const topMatch = matches[0];
      if (topMatch.score >= NLP_CONFIG.questionProcessing.similarityThreshold) {
        mainDefinition = {
          ...dictionary[topMatch.candidate],
          fuelCode: topMatch.candidate
        };
        // Only include subFuels if this is a main fuel
        if (mainDefinition.isMainFuel && mainDefinition.subFuels) {
          suggestions = mainDefinition.subFuels;
        }
      }
    }

    // Try to find a match based on intent if other methods fail
    if (!mainDefinition && intent) {
      const intentBasedMatch = findMatchByIntent(intent, dictionary, matches);
      if (intentBasedMatch) {
        mainDefinition = {
          ...dictionary[intentBasedMatch],
          fuelCode: intentBasedMatch
        };
        // Only include subFuels if this is a main fuel
        if (mainDefinition.isMainFuel && mainDefinition.subFuels) {
          suggestions = mainDefinition.subFuels;
        }
      }
    }

    if (mainDefinition) {
      return {
        ...mainDefinition,
        suggestions: suggestions
      };
    }

    return null;
  } catch (error) {
    console.error('Error finding energy definition:', error);
    return null;
  }
};

/**
 * Find a match based on intent and available matches
 */
const findMatchByIntent = (intent, dictionary, matches) => {
  // Map intents to relevant dictionary sections
  const intentMappings = {
    'query_production': (def) => def.isMainFuel && def.hasProduction,
    'query_consumption': (def) => def.isMainFuel && def.hasConsumption,
    'query_trade': (def) => def.isMainFuel && (def.hasImports || def.hasExports),
    'query_comparison': (def) => def.isMainFuel,
    'query_trend': (def) => def.hasHistoricalData,
    'request_visualization': (def) => def.hasVisualization,
    'topic_request': (def) => true // Always consider the definition for direct topic requests
  };

  const filter = intentMappings[intent];
  if (!filter) {
    return null;
  }

  // First try matches that have a decent score
  const goodMatches = matches.filter(m => m.score >= 0.3);
  
  for (const match of goodMatches) {
    const def = dictionary[match.candidate];
    if (def && filter(def)) {
      return match.candidate;
    }
  }

  // If no good matches, try all dictionary entries
  for (const [key, def] of Object.entries(dictionary)) {
    if (filter(def)) {
      return key;
    }
  }

  return null;
};

/**
 * Get definition by fuel code
 */
export const getDefinitionByFuelCode = (fuelCode, language = CONFIG.DEFAULT_LANGUAGE) => {
  const dictionary = energyDictionary[language] || energyDictionary[CONFIG.DEFAULT_LANGUAGE];
  return dictionary[fuelCode] || null;
};

/**
 * Get related topics for a fuel code
 */
export const getRelatedTopics = (fuelCode, language = CONFIG.DEFAULT_LANGUAGE) => {
  const definition = getDefinitionByFuelCode(fuelCode, language);
  if (!definition) {
    return [];
  }

  return definition.related || [];
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