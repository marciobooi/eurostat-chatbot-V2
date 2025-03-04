/**
 * Enhanced entity extractor for Eurostat terminology
 * Uses the custom compromise.js plugins to extract specialized entities
 */
import nlp from "compromise";
import sentences from "compromise-sentences";
import numbers from "compromise-numbers";
import dates from "compromise-dates";
import eurostatTerminology from "./plugins/eurostatTerminology";
import { datePatterns } from "../data/datePatterns";
import { getCountryCodes } from "../data/countryCodes";
import { getStatisticalConcepts } from "../data/statisticalConcepts";
import { getEnergyUnits } from "../data/energyUnits";
import { getTimePeriods } from "../data/timePeriods";

// Initialize compromise with all necessary plugins
nlp.extend(sentences);
nlp.extend(numbers);
nlp.extend(dates);
nlp.extend(eurostatTerminology);

/**
 * Extract all types of entities from text with language support
 * @param {string} text - Text to analyze
 * @param {string} language - Language code
 * @returns {Object} Comprehensive extracted entities
 */
export const extractEntities = (text, language = "en") => {
  if (!text) return {
    organizations: [],
    places: [],
    numbers: [],
    dates: [],
    statisticalConcepts: [],
    energyUnits: [],
    countries: [],
    timePeriods: []
  };

  try {
    // Create a document instance from the text
    const doc = nlp(text);
    
    // Get terms from dictionaries based on language
    const statisticalConcepts = getStatisticalConcepts(language);
    const energyUnits = getEnergyUnits(language);
    const countryCodes = getCountryCodes(language);
    const timePeriods = getTimePeriods(language);
    
    // Initialize entities object with empty arrays
    const entities = {
      organizations: [],
      places: [],
      numbers: [],
      dates: [],
      statisticalConcepts: [],
      energyUnits: [],
      countries: [],
      timePeriods: []
    };

    // Extract organizations (fallback to nouns starting with capital letters)
    const orgs = doc.match("#Organization+").out("array");
    entities.organizations = orgs.length
      ? orgs
      : doc.match("[A-Z][a-z]+").out("array");

    // Extract places
    entities.places = doc.places().out("array");

    // Extract numbers using the numbers plugin
    entities.numbers = doc.numbers().out("array");

    // Extract dates using the dates plugin, with fallback
    try {
      entities.dates = doc.dates().out("array");
    } catch (error) {
      console.warn("Date extraction failed, using fallback:", error);
      entities.dates = extractDateReferences(text, language);
    }

    // Direct pattern matching for each entity type
    // For statistical concepts
    if (statisticalConcepts && statisticalConcepts.length > 0) {
      statisticalConcepts.forEach(concept => {
        const regex = new RegExp(`\\b${concept}\\b`, 'i');
        if (regex.test(text.toLowerCase())) {
          if (!entities.statisticalConcepts.includes(concept)) {
            entities.statisticalConcepts.push(concept);
          }
        }
      });
    }
    
    // For countries and country codes
    if (countryCodes && countryCodes.length > 0) {
      countryCodes.forEach(country => {
        const regex = new RegExp(`\\b${country}\\b`, 'i');
        if (regex.test(text.toLowerCase())) {
          if (!entities.countries.includes(country)) {
            entities.countries.push(country);
          }
        }
      });
    }
    
    // For energy units
    if (energyUnits && energyUnits.length > 0) {
      energyUnits.forEach(unit => {
        const regex = new RegExp(`\\b${unit}\\b`, 'i');
        if (regex.test(text.toLowerCase())) {
          if (!entities.energyUnits.includes(unit)) {
            entities.energyUnits.push(unit);
          }
        }
      });
    }
    
    // For time periods
    if (timePeriods && timePeriods.length > 0) {
      timePeriods.forEach(period => {
        const regex = new RegExp(`\\b${period}\\b`, 'i');
        if (regex.test(text.toLowerCase())) {
          if (!entities.timePeriods.includes(period)) {
            entities.timePeriods.push(period);
          }
        }
      });
    }

    return entities;
  } catch (error) {
    console.warn("Error in extractEntities:", error);
    return {
      organizations: [],
      places: [],
      numbers: [],
      dates: [],
      statisticalConcepts: [],
      energyUnits: [],
      countries: [],
      timePeriods: []
    };
  }
};

/**
 * Extract energy-specific entities from text
 * @param {string} text - Text to analyze
 * @param {string} language - Language code
 * @returns {Object} Energy-related entities
 */
export const extractEnergyEntities = (text, language = "en") => {
  if (!text) return { energyUnits: [], countries: [], timePeriods: [] };

  try {
    const energyUnits = getEnergyUnits(language);
    const countryCodes = getCountryCodes(language);
    const timePeriods = getTimePeriods(language);
    
    const entities = {
      energyUnits: [],
      countries: [],
      timePeriods: []
    };
    
    // Direct pattern matching for energy units
    if (energyUnits && energyUnits.length > 0) {
      energyUnits.forEach(unit => {
        const regex = new RegExp(`\\b${unit}\\b`, 'i');
        if (regex.test(text.toLowerCase())) {
          if (!entities.energyUnits.includes(unit)) {
            entities.energyUnits.push(unit);
          }
        }
      });
    }
    
    // Direct pattern matching for countries
    if (countryCodes && countryCodes.length > 0) {
      countryCodes.forEach(country => {
        const regex = new RegExp(`\\b${country}\\b`, 'i');
        if (regex.test(text.toLowerCase())) {
          if (!entities.countries.includes(country)) {
            entities.countries.push(country);
          }
        }
      });
    }
    
    // Direct pattern matching for time periods
    if (timePeriods && timePeriods.length > 0) {
      timePeriods.forEach(period => {
        const regex = new RegExp(`\\b${period}\\b`, 'i');
        if (regex.test(text.toLowerCase())) {
          if (!entities.timePeriods.includes(period)) {
            entities.timePeriods.push(period);
          }
        }
      });
    }
    
    return entities;
  } catch (error) {
    console.warn("Error in extractEnergyEntities:", error);
    return { energyUnits: [], countries: [], timePeriods: [] };
  }
};

/**
 * Extract statistical concepts from text
 * @param {string} text - Text to analyze
 * @param {string} language - Language code
 * @returns {string[]} Array of statistical concepts found in the text
 */
export const extractStatisticalConcepts = (text, language = "en") => {
  if (!text) return [];

  try {
    const statisticalConcepts = getStatisticalConcepts(language);
    const foundConcepts = [];
    
    // Direct pattern matching for statistical concepts
    if (statisticalConcepts && statisticalConcepts.length > 0) {
      statisticalConcepts.forEach(concept => {
        const regex = new RegExp(`\\b${concept}\\b`, 'i');
        if (regex.test(text.toLowerCase())) {
          if (!foundConcepts.includes(concept)) {
            foundConcepts.push(concept);
          }
        }
      });
    }
    
    return foundConcepts;
  } catch (error) {
    console.warn("Error in extractStatisticalConcepts:", error);
    return [];
  }
};

/**
 * Extract time periods and date ranges from text
 * @param {string} text - Text to analyze
 * @param {string} language - Language code
 * @returns {Object} Extracted time information
 */
export const extractTimeInformation = (text, language = "en") => {
  if (!text) return { dates: [], timePeriods: [], ranges: [] };

  try {
    const doc = nlp(text);
    const timePeriods = getTimePeriods(language);
    
    const result = {
      dates: [],
      timePeriods: [],
      ranges: []
    };

    // Extract standard dates
    try {
      result.dates = doc.dates().out("array");
    } catch (error) {
      console.warn("Date extraction failed, using fallback:", error);
      result.dates = extractDateReferences(text, language);
    }

    // Direct pattern matching for time periods
    if (timePeriods && timePeriods.length > 0) {
      timePeriods.forEach(period => {
        const regex = new RegExp(`\\b${period}\\b`, 'i');
        if (regex.test(text.toLowerCase())) {
          if (!result.timePeriods.includes(period)) {
            result.timePeriods.push(period);
          }
        }
      });
    }
    
    // Try to identify date ranges (from X to Y)
    const rangeMatches = doc.match('from [0-9]{4} (to|until|through) [0-9]{4}').out('array');
    if (rangeMatches.length) {
      result.ranges = rangeMatches;
    }

    return result;
  } catch (error) {
    console.warn("Error in extractTimeInformation:", error);
    return { dates: [], timePeriods: [], ranges: [] };
  }
};

/**
 * Extract country information from text
 * @param {string} text - Text to analyze
 * @param {string} language - Language code
 * @returns {string[]} Array of countries mentioned
 */
export const extractCountries = (text, language = "en") => {
  if (!text) return [];

  try {
    const countryCodes = getCountryCodes(language);
    const foundCountries = [];
    
    // Direct pattern matching for countries
    if (countryCodes && countryCodes.length > 0) {
      countryCodes.forEach(country => {
        const regex = new RegExp(`\\b${country}\\b`, 'i');
        if (regex.test(text.toLowerCase())) {
          if (!foundCountries.includes(country)) {
            foundCountries.push(country);
          }
        }
      });
    }
    
    return foundCountries;
  } catch (error) {
    console.warn("Error in extractCountries:", error);
    return [];
  }
};

// Helper function for extracting dates if plugin fails
function extractDateReferences(text, language = "en") {
  // Use language-specific date patterns from datePatterns.js
  const patterns = datePatterns[language] || datePatterns.en;
  const dates = [];
  
  // Try each pattern
  patterns.forEach(pattern => {
    const regex = new RegExp(pattern, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      dates.push(match[0]);
    }
  });
  
  // Also try to extract years directly
  const yearRegex = /\b(20\d{2}|19\d{2})\b/g;
  let yearMatch;
  while ((yearMatch = yearRegex.exec(text)) !== null) {
    dates.push(yearMatch[0]);
  }
  
  return dates;
}

export default {
  extractEntities,
  extractEnergyEntities,
  extractStatisticalConcepts,
  extractTimeInformation,
  extractCountries
};