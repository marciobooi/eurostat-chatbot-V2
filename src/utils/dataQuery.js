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
import { fetchEurostatData } from '../services/eurostatAPI.js';

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
  
  console.log('📊 Data query detection:', {
    text,
    hasCountry,
    hasDate,
    hasFuel,
    isDataQuery: hasCountry && hasDate && hasFuel
  });
  
  // A data query needs all three: country, date, and fuel
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
 * Format data query response with extracted entities and actual API data
 */
export const formatDataQueryResponse = async (text, tokens) => {  const transformation = transformToStructuredFormat(text, tokens);
  const entities = transformation.entities;
  
  // Debug logging for data query entity extraction
  console.log('🔍 Data query entity extraction:', {
    originalText: text,
    extractedCountry: entities.country,
    extractedFuel: entities.fuel,
    extractedDate: entities.date,
    transformedCountryCode: transformation.transformed?.countryCode,
    transformedFuelCode: transformation.transformed?.fuelCode,
    transformedDate: transformation.transformed?.date
  });
  
  try {    // Get the fuel definition to extract dataset and indicator_type
    const fuelDefinition = getFuelDefinition(entities.fuel);
    
    // Debug logging for data queries
    console.log('🔍 Data query fuel definition lookup:', {
      fuelName: entities.fuel,
      foundDefinition: !!fuelDefinition,
      hasVisualization: fuelDefinition?.hasVisualization,
      visualizationType: fuelDefinition?.visualizationType,
      fuelCode: fuelDefinition?.fuelCode,
      nrgBal: fuelDefinition?.nrg_bal
    });
    
    // Use dynamic parameters from the fuel definition, with fallbacks
    const dataset = fuelDefinition?.dataset || 'nrg_bal_c';
    const indicator_type = fuelDefinition?.indicator_type || 'SIEC';
    
    // Extract visualization and chart parameters from fuel definition
    const hasVisualization = fuelDefinition?.hasVisualization || false;
    const visualizationType = fuelDefinition?.visualizationType || [];
    const fuelCode = fuelDefinition?.fuelCode || '';
    
    // Extract nrg_bal codes for stacked charts if available
    const nrgBalCodes = (fuelDefinition?.visualizationType && 
                         fuelDefinition.visualizationType.includes('stacked') && 
                         fuelDefinition.nrg_bal && 
                         Array.isArray(fuelDefinition.nrg_bal)) ? fuelDefinition.nrg_bal : null;
      // Get appropriate year for the dataset (hack for nrg_bal_c limitation)
    const availableYear = getAvailableYear(transformation.transformed?.date || transformation.entities?.date, dataset);
      // Debug: Log the transformation data
    console.log('🔍 Transformation data:', {
      entities: entities,
      countryCode: transformation.transformed?.countryCode,
      fuelCode: transformation.transformed?.fuelCode,
      year: transformation.transformed?.date,
      availableYear: availableYear,
      dataset: dataset
    });
    
    // Fetch actual data from Eurostat API with all required parameters
    const apiData = await fetchEurostatData({
      dataset: dataset,
      format: 'JSON',
      time: availableYear,
      geo: transformation.transformed?.countryCode ? transformation.transformed.countryCode.toUpperCase() : 'EU27_2020',
      unit: 'KTOE',
      nrg_bal: 'NRGSUP',
      siec: transformation.transformed?.fuelCode, // For nrg_bal_c dataset
      indic_nrg: indicator_type === 'INDIC_NRG' ? transformation.transformed?.fuelCode : undefined, // For nrg_ind_id dataset
      lang: 'en'
    });if (apiData && apiData.value) {
      // Extract the actual data value and meaningful information
      const dataValue = Object.values(apiData.value)[0]; // Get the actual value (5.233)
      const unit = apiData.dimension?.unit?.category?.label ? 
        Object.values(apiData.dimension.unit.category.label)[0] : 'units';
      const countryName = apiData.dimension?.geo?.category?.label ? 
        Object.values(apiData.dimension.geo.category.label)[0] : entities.country;
      const fuelName = apiData.dimension?.siec?.category?.label ? 
        Object.values(apiData.dimension.siec.category.label)[0] : entities.fuel;
      const balanceType = apiData.dimension?.nrg_bal?.category?.label ? 
        Object.values(apiData.dimension.nrg_bal.category.label)[0] : 'Total energy supply';
      
      // Check if we used a different year than requested
      const yearMessage = availableYear !== transformation.year ? 
        `**${entities.date}** (showing data for ${availableYear} - latest available)` : 
        `**${entities.date}**`;
        return {
        type: 'data_query_response',
        content: `Here's what I found for **${fuelName}** in **${countryName}** for ${yearMessage}:\n\n**${balanceType}**: ${dataValue} ${unit}\n\nThis data represents the energy supply from ${fuelName.toLowerCase()} in ${countryName} for the specified period.`,
        entities: entities,
        transformation: transformation,
        actualYear: availableYear,
        dataValue: dataValue,
        unit: unit,
        apiData: apiData,
        hasVisualization: hasVisualization,
        visualizationType: visualizationType,
        dataset: dataset,
        indicator_type: indicator_type,
        fuelCode: fuelCode,
        nrgBalCodes: nrgBalCodes,
        nrg_bal: 'NRGSUP',
        isError: false
      };
    } else {      return {
        type: 'data_query_response',
        content: `I searched for **${entities.fuel}** data in **${entities.country}** for **${entities.date}**, but couldn't find specific data for this combination. This might be because the data is not available for this time period or the specific fuel type.`,
        entities: entities,
        transformation: transformation,
        hasVisualization: hasVisualization,
        visualizationType: visualizationType,
        dataset: dataset,
        indicator_type: indicator_type,
        fuelCode: fuelCode,
        nrgBalCodes: nrgBalCodes,
        nrg_bal: 'NRGSUP',
        isError: false
      };
    }
  } catch (error) {
    console.error('Error fetching data:', error);    return {
      type: 'data_query_response', 
      content: `I tried to fetch **${entities.fuel}** data for **${entities.country}** in **${entities.date}**, but encountered an error accessing the Eurostat database. Please try again later.`,
      entities: entities,
      transformation: transformation,
      hasVisualization: false,
      visualizationType: [],
      dataset: dataset || 'nrg_bal_c',
      indicator_type: indicator_type || 'SIEC',
      fuelCode: fuelCode || '',
      nrgBalCodes: null,
      isError: true
    };
  }
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

/**
 * Get fuel definition from the energy definitions database
 */
const getFuelDefinition = (fuelName) => {
  const lowerFuelName = fuelName.toLowerCase();
  
  // Search through all definitions to find a match
  for (const [key, definition] of Object.entries(energyDefinitionsEn)) {
    // Check title match
    if (definition.title && definition.title.toLowerCase() === lowerFuelName) {
      return definition;
    }
    
    // Check key_concepts match
    if (definition.key_concepts && Array.isArray(definition.key_concepts)) {
      for (const concept of definition.key_concepts) {
        if (concept.toLowerCase() === lowerFuelName) {
          return definition;
        }
      }
    }
    
    // Check keywords match
    if (definition.keywords && Array.isArray(definition.keywords)) {
      for (const keyword of definition.keywords) {
        if (keyword.toLowerCase() === lowerFuelName) {
          return definition;
        }
      }
    }
  }
  
  return null;
};

/**
 * Get the appropriate year for API call, handling dataset limitations
 */
const getAvailableYear = (requestedYear, dataset) => {
  const currentYear = new Date().getFullYear();
  
  // For nrg_bal_c dataset, data is only available until 2023
  if (dataset === 'nrg_bal_c') {
    const maxAvailableYear = 2023;
    
    // If requested year is beyond available data, use the latest available
    if (parseInt(requestedYear) > maxAvailableYear) {
      console.log(`⚠️ Requested year ${requestedYear} not available for ${dataset}. Using latest available: ${maxAvailableYear}`);
      return maxAvailableYear.toString();
    }
    
    // If requested year is too old, use a reasonable fallback
    if (parseInt(requestedYear) < 2010) {
      console.log(`⚠️ Requested year ${requestedYear} too old for ${dataset}. Using 2010`);
      return '2010';
    }
  }
  
  // For other datasets, use the requested year
  return requestedYear;
};