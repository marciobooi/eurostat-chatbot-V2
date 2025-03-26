/**
 * Energy data handlers
 */
import { energyDictionary } from './energyDictionary';
import { findBestMatch } from './nlpHandlers';
import { NLP_CONFIG } from '../config/nlpConfig';
import { CONFIG } from '../i18n';
import { commonQuestionPhrases } from '../dictionaries/questionPhrases';

// Move to a separate UnitConversionService
class EnergyUnitConverter {
  static convert(value, fromUnit, toUnit) {
    // Conversion logic...
    return value;
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
      const cleanedText = text.toLowerCase().replace(/[?.,!]/g, '').trim();
      
      // Try exact match with cleaned text first
      if (dictionary[cleanedText]) {
        return {
          ...dictionary[cleanedText],
          fuelCode: cleanedText
        };
      }

      // Extract term from question patterns
      const questionPatterns = commonQuestionPhrases[language] || commonQuestionPhrases[NLP_CONFIG.languages.default];
      let extractedTerm = null;

      // Try to find a match using the question patterns
      for (const pattern of questionPatterns) {
        if (pattern instanceof RegExp) {
          const match = cleanedText.match(pattern);
          if (match && match[1]) {
            extractedTerm = match[1].trim();
            if (extractedTerm) {
              // Try exact match with extracted term
              if (dictionary[extractedTerm]) {
                return {
                  ...dictionary[extractedTerm],
                  fuelCode: extractedTerm
                };
              }

              // Try keyword match with extracted term
              const keywordMatch = Object.entries(dictionary).find(([_, def]) =>
                def.keywords?.some(k => k.toLowerCase() === extractedTerm)
              );
              if (keywordMatch) {
                return {
                  ...keywordMatch[1],
                  fuelCode: keywordMatch[0]
                };
              }
            }
          }
        }
      }

      // If we found a term but no match, try NLP-based matching with the extracted term
      if (extractedTerm) {
        const { matches, intent, entities } = await findBestMatch(extractedTerm, Object.keys(dictionary), language);
        const result = EnergyDefinitionFinder.processMatches(dictionary, matches, intent, entities);
        if (result) return result;
      }

      // As a fallback, try NLP-based matching with the full text
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

  static findDefinitionFromTerm(term, dictionary) {
    const normalizedTerm = term.toLowerCase();
    
    // Try exact match first (case-insensitive)
    const exactMatch = Object.entries(dictionary).find(
      ([key]) => key.toLowerCase() === normalizedTerm
    );
    if (exactMatch) {
      return {
        ...exactMatch[1],
        fuelCode: exactMatch[0]
      };
    }

    // Try keyword match
    const keywordMatch = Object.entries(dictionary).find(([_, def]) =>
      def.keywords?.some(k => k.toLowerCase() === normalizedTerm)
    );
    if (keywordMatch) {
      return {
        ...keywordMatch[1],
        fuelCode: keywordMatch[0]
      };
    }

    // Try partial matches as last resort
    const partialMatch = Object.entries(dictionary).find(([_, def]) =>
      def.keywords?.some(k => 
        k.toLowerCase().includes(normalizedTerm) || 
        normalizedTerm.includes(k.toLowerCase())
      )
    );
    if (partialMatch) {
      return {
        ...partialMatch[1],
        fuelCode: partialMatch[0]
      };
    }

    return null;
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

    // Sort entities by confidence
    const sortedEntities = [...entities.energyDomain.energyTypes]
      .sort((a, b) => (b.confidence || 0) - (a.confidence || 0));

    for (const entity of sortedEntities) {
      // Try canonical form first
      if (entity.canonical) {
        const canonicalMatch = this.findDefinitionFromTerm(entity.canonical, dictionary);
        if (canonicalMatch) return canonicalMatch;
      }
      
      // Try the entity text
      const textMatch = this.findDefinitionFromTerm(entity.text, dictionary);
      if (textMatch) return textMatch;
    }
    return null;
  }

  static findDefinitionFromMatches(dictionary, matches) {
    if (!matches.length) return null;

    for (const match of matches) {
      if (match.score >= NLP_CONFIG.questionProcessing.similarityThreshold) {
        const matchDefinition = this.findDefinitionFromTerm(match.candidate, dictionary);
        if (matchDefinition) return matchDefinition;
      }
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
        return {
          ...def,
          fuelCode: match.candidate
        };
      }
    }

    // Try all dictionary entries if no good matches
    for (const [key, def] of Object.entries(dictionary)) {
      if (intentHandler(def)) {
        return {
          ...def,
          fuelCode: key
        };
      }
    }

    return null;
  }

  static getSuggestions(definition) {
    const suggestions = [];

    // Add subfuels if available
    if (definition.subFuels && definition.subFuels.length > 0) {
      suggestions.push(...definition.subFuels);
    }

    // Add related topics
    if (definition.related && definition.related.length > 0) {
      suggestions.push(...definition.related);
    }

    return [...new Set(suggestions)];
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