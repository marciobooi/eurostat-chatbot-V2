/**
 * Energy data handlers
 */
import { energyDictionary } from './energyDictionary';
import { findBestMatch } from './nlpHandlers';
import { NLP_CONFIG } from '../config/nlpConfig';
import { CONFIG } from '../i18n';

// Move to a separate UnitConversionService
class EnergyUnitConverter {
  static CONVERSION_FACTORS = {
    KTOE_TO_THS_T: 1000/0.7,
    THS_T_TO_KTOE: 0.7/1000
  };

  static convert(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) return value;
    
    const conversionKey = `${fromUnit}_TO_${toUnit}`;
    const factor = this.CONVERSION_FACTORS[conversionKey];
    
    if (!factor) {
      console.warn(`Unsupported unit conversion: ${fromUnit} to ${toUnit}`);
      return value;
    }

    return value * factor;
  }
}

// Intent handlers with single responsibility
const IntentHandlers = {
  query_production: (def) => def.isMainFuel && def.hasProduction,
  query_consumption: (def) => def.isMainFuel && def.hasConsumption,
  query_trade: (def) => def.isMainFuel && (def.hasImports || def.hasExports),
  query_comparison: (def) => def.isMainFuel,
  query_trend: (def) => def.hasHistoricalData,
  request_visualization: (def) => def.hasVisualization,
  topic_request: () => true
};

class EnergyDefinitionFinder {
  static async findDefinitionByIntent(text, language = CONFIG.DEFAULT_LANGUAGE) {
    try {
      const dictionary = EnergyDefinitionFinder.getDictionaryForLanguage(language);
      const { matches, intent, entities } = await findBestMatch(text, Object.keys(dictionary), language);
      
      return EnergyDefinitionFinder.processMatches(dictionary, matches, intent, entities);
    } catch (error) {
      console.error('Error finding energy definition:', error);
      return null;
    }
  }

  static getDictionaryForLanguage(language) {
    return energyDictionary[language] || energyDictionary[CONFIG.DEFAULT_LANGUAGE];
  }

  static processMatches(dictionary, matches, intent, entities) {
    const mainDefinition = EnergyDefinitionFinder.findMainDefinition(dictionary, matches, intent, entities);
    if (!mainDefinition) return null;

    const suggestions = EnergyDefinitionFinder.getSuggestions(mainDefinition);
    return { ...mainDefinition, suggestions };
  }

  static findMainDefinition(dictionary, matches, intent, entities) {
    // Try entity-based match first
    const entityMatch = EnergyDefinitionFinder.findDefinitionFromEntities(dictionary, entities);
    if (entityMatch) return entityMatch;

    // Try direct matches next
    const directMatch = EnergyDefinitionFinder.findDefinitionFromMatches(dictionary, matches);
    if (directMatch) return directMatch;

    // Finally try intent-based match
    return EnergyDefinitionFinder.findDefinitionFromIntent(dictionary, intent, matches);
  }

  static findDefinitionFromEntities(dictionary, entities) {
    if (!entities?.energyDomain?.energyTypes) return null;

    for (const entity of entities.energyDomain.energyTypes) {
      if (entity.canonical && dictionary[entity.canonical]) {
        return {
          ...dictionary[entity.canonical],
          fuelCode: entity.canonical
        };
      }
    }
    return null;
  }

  static findDefinitionFromMatches(dictionary, matches) {
    if (!matches.length) return null;

    const topMatch = matches[0];
    if (topMatch.score >= NLP_CONFIG.questionProcessing.similarityThreshold) {
      return {
        ...dictionary[topMatch.candidate],
        fuelCode: topMatch.candidate
      };
    }
    return null;
  }

  static findDefinitionFromIntent(dictionary, intent, matches) {
    if (!intent) return null;

    const intentHandler = IntentHandlers[intent];
    if (!intentHandler) return null;

    // Try matches with good scores first
    const goodMatches = matches.filter(m => m.score >= 0.3);
    for (const match of goodMatches) {
      const def = dictionary[match.candidate];
      if (def && intentHandler(def)) {
        return { ...def, fuelCode: match.candidate };
      }
    }

    // Try all dictionary entries if no good matches
    for (const [key, def] of Object.entries(dictionary)) {
      if (intentHandler(def)) {
        return { ...def, fuelCode: key };
      }
    }

    return null;
  }

  static getSuggestions(definition) {
    return definition.isMainFuel && definition.subFuels ? definition.subFuels : [];
  }
}

// Public API
export const findEnergyDefinition = EnergyDefinitionFinder.findDefinitionByIntent;
export const convertUnits = EnergyUnitConverter.convert;

export const getDefinitionByFuelCode = (fuelCode, language = CONFIG.DEFAULT_LANGUAGE) => {
  const dictionary = EnergyDefinitionFinder.getDictionaryForLanguage(language);
  return dictionary[fuelCode] || null;
};

export const getRelatedTopics = (fuelCode, language = CONFIG.DEFAULT_LANGUAGE) => {
  const definition = getDefinitionByFuelCode(fuelCode, language);
  return definition?.related || [];
};

export const hasVisualization = (topic, language = CONFIG.DEFAULT_LANGUAGE) => {
  const dictionary = EnergyDefinitionFinder.getDictionaryForLanguage(language);
  return dictionary[topic]?.hasVisualization || false;
};

export const getVisualizationTypes = (topic, language = CONFIG.DEFAULT_LANGUAGE) => {
  const dictionary = EnergyDefinitionFinder.getDictionaryForLanguage(language);
  return dictionary[topic]?.visualizationType || [];
};

export const getDatasetInfo = (topic, language = CONFIG.DEFAULT_LANGUAGE) => {
  const dictionary = EnergyDefinitionFinder.getDictionaryForLanguage(language);
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

export const getNormalizedValue = (value, fromUnit, toUnit = 'THS_T') => {
  return EnergyUnitConverter.convert(value, fromUnit, toUnit);
};