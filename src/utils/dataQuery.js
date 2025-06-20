/**
 * Data Query Detection and Processing Utilities
 * 
 * This module handles the detection and processing of data queries that contain
 * country, date, and fuel/energy references. It provides functions to:
 * - Detect if a query contains all required components
 * - Extract entities from the query text
 * - Format responses for data queries
 */

import { extractCountry, containsCountry, getCountryCode } from '../data/Countries.js';
import { extractDate, containsDate, resolveRelativeDate } from '../data/DatePatterns.js';
import { energyKeywords, isEnergyRelated } from '../data/EnergyKeywords.js';
import { energyDefinitionsEn } from '../data/DefinitionsEn.js';

/**
 * Extract fuel terms from the energy definitions database
 * This dynamically generates compound fuel terms from actual Eurostat data
 */
const extractFuelTermsFromDefinitions = () => {
  const fuelTerms = [];
  
  // Extract titles and fuel codes from all definitions
  Object.values(energyDefinitionsEn).forEach(definition => {
    if (definition.title) {
      fuelTerms.push(definition.title.toLowerCase());
    }
    
    // Extract from key_concepts if available
    if (definition.key_concepts && Array.isArray(definition.key_concepts)) {
      definition.key_concepts.forEach(concept => {
        fuelTerms.push(concept.toLowerCase());
      });
    }
    
    // Extract from keywords if available
    if (definition.keywords && Array.isArray(definition.keywords)) {
      definition.keywords.forEach(keyword => {
        if (keyword.includes(' ')) { // Only multi-word keywords
          fuelTerms.push(keyword.toLowerCase());
        }
      });
    }
    
    // Extract from subFuels if available
    if (definition.subFuels && Array.isArray(definition.subFuels)) {
      definition.subFuels.forEach(subFuel => {
        fuelTerms.push(subFuel.toLowerCase());
      });
    }
  });
  
  // Remove duplicates and sort by length (longest first for better matching)
  const uniqueTerms = [...new Set(fuelTerms)];
  return uniqueTerms
    .filter(term => term.length > 2) // Filter out very short terms
    .sort((a, b) => b.length - a.length);
};

// Generate compound terms from the actual energy definitions
const COMPOUND_FUEL_TERMS = extractFuelTermsFromDefinitions();

/**
 * Check if text contains fuel/energy references using definitions data
 */
export const containsFuel = (text, tokens) => {
  const lowerText = text.toLowerCase();
  
  // Check compound terms from definitions first
  const hasCompoundTerm = COMPOUND_FUEL_TERMS.some(term => 
    lowerText.includes(term)
  );
  
  if (hasCompoundTerm) return true;
  
  // Fallback to existing energy keywords detection
  return isEnergyRelated(text) || tokens.some(token => isEnergyRelated(token));
};

/**
 * Extract fuel/energy type from text using actual definitions data
 */
export const extractFuel = (text) => {
  const lowerText = text.toLowerCase();
  
  // First try to find compound fuel terms from definitions (already sorted by length)
  for (const compound of COMPOUND_FUEL_TERMS) {
    if (lowerText.includes(compound)) {
      return compound;
    }
  }
  
  // If no compound term found, try individual keywords (sorted by length)
  const sortedEnergyKeywords = energyKeywords.sort((a, b) => b.length - a.length);
  for (const term of sortedEnergyKeywords) {
    if (lowerText.includes(term.toLowerCase())) {
      return term;
    }
  }
  
  return null;
};

/**
 * Get fuel code from fuel name using the definitions database
 */
export const getFuelCode = (fuelName) => {
  if (!fuelName) return null;
  
  const lowerFuelName = fuelName.toLowerCase();
  
  // Search through all definitions to find matching fuel
  for (const [key, definition] of Object.entries(energyDefinitionsEn)) {
    if (definition.title && definition.title.toLowerCase() === lowerFuelName) {
      return definition.fuelCode || null;
    }
    
    // Also check key_concepts for matches
    if (definition.key_concepts && Array.isArray(definition.key_concepts)) {
      for (const concept of definition.key_concepts) {
        if (concept.toLowerCase() === lowerFuelName) {
          return definition.fuelCode || null;
        }
      }
    }
  }
  
  return null;
};

/**
 * Check if input is a data query (contains country, date, and fuel)
 */
export const isDataQuery = (text, tokens) => {
  const hasCountry = containsCountry(text);
  const hasDate = containsDate(text);
  const hasFuel = containsFuel(text, tokens);
  
  return hasCountry && hasDate && hasFuel;
};

/**
 * Extract all entities (country, date, fuel) from a data query
 */
export const extractDataQueryEntities = (text, tokens) => {
  const country = extractCountry(text);
  const date = extractDate(text, tokens);
  const fuel = extractFuel(text);
  
  return {
    country: country || 'unspecified country',
    date: date || 'unspecified date',
    fuel: fuel || 'energy'
  };
};

/**
 * Format data query response with extracted entities
 */
export const formatDataQueryResponse = (text, tokens) => {
  const transformation = transformToStructuredFormat(text, tokens);
  const entities = transformation.entities;
  
  return {
    type: 'data_query_response',
    content: `I understand you're looking for data about **${entities.fuel}** in **${entities.country}** for **${entities.date}**. Let me fetch that information for you.`,
    entities: entities,
    transformation: transformation,
    hasVisualization: true,
    visualizationType: ['chart', 'table'],
    // Default dataset for energy data
    dataset: 'nrg_ind_id',
    indicator_type: 'INDIC_NRG',
    isError: false
  };
};

/**
 * Validate if extracted entities are meaningful for a data query
 */
export const validateDataQueryEntities = (entities) => {
  // Check if we have meaningful extracted values (not just defaults)
  const hasValidCountry = entities.country !== 'unspecified country';
  const hasValidDate = entities.date !== 'unspecified date';
  const hasValidFuel = entities.fuel !== 'energy';
  
  // At least 2 out of 3 should be valid for a meaningful data query
  const validCount = [hasValidCountry, hasValidDate, hasValidFuel].filter(Boolean).length;
  
  return {
    isValid: validCount >= 2,
    validCount,
    details: {
      hasValidCountry,
      hasValidDate,
      hasValidFuel
    }
  };
};

/**
 * Transform natural language query to structured format: "countryCode fuelCode year"
 * Example: "portugal solid fossil fuels this year" → "pt C0000X0350-0370 2025"
 */
export const transformToStructuredFormat = (text, tokens) => {
  const entities = extractDataQueryEntities(text, tokens);
  
  // Transform each component
  const countryCode = getCountryCode(entities.country) || entities.country;
  const fuelCode = getFuelCode(entities.fuel) || entities.fuel;
  const resolvedDate = resolveRelativeDate(entities.date) || entities.date;
  
  const structuredFormat = `${countryCode} ${fuelCode} ${resolvedDate}`;
  
  // Log the transformation for debugging
  console.log('🔄 Query Transformation:');
  console.log(`Original: "${text}"`);
  console.log(`Country: "${entities.country}" → "${countryCode}"`);
  console.log(`Fuel: "${entities.fuel}" → "${fuelCode}"`);
  console.log(`Date: "${entities.date}" → "${resolvedDate}"`);
  console.log(`Structured Format: "${structuredFormat}"`);
  console.log('─'.repeat(50));
  
  return {
    original: text,
    entities: entities,
    transformed: {
      countryCode,
      fuelCode,
      date: resolvedDate
    },
    structuredFormat,
    isValid: countryCode && fuelCode && resolvedDate
  };
};

/**
 * Get all available fuel terms for debugging/testing
 * @returns {object} Object containing compound terms and basic keywords
 */
export const getAvailableFuelTerms = () => {
  return {
    compoundTerms: COMPOUND_FUEL_TERMS.slice(0, 20), // First 20 for brevity
    totalCompoundTerms: COMPOUND_FUEL_TERMS.length,
    basicKeywords: energyKeywords.slice(0, 20), // First 20 for brevity
    totalBasicKeywords: energyKeywords.length  };
};