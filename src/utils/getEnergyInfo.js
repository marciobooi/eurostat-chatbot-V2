/**
 * Utility for getting energy information from various sources
 */
import { energyDictionary } from "../data/energyDictionary";
import { extractTopicFromQuery, findIntent } from "./nlpHelper";
import { extractEntities } from "./entityExtractor";
import { fetchEurostatData } from "../api/eurostatApi";
import { countryCodes } from "../data/countryCodes";
import { 
  getActivityTypeFromQuery, 
  getBalanceTypeForActivity 
} from "./datasetHandler";

/**
 * Get energy information based on the user query
 * @param {string} query - User query
 * @param {string} language - Language code
 * @returns {Object} Response with answer, confidence and related data
 */
export const getEnergyInfo = async (query, language = "en") => {
  try {
    query = query.trim();
    
    // First, check if this is a specific data query like "how much oil did France import in 2021"
    const specificData = await getSpecificEnergyData(query, language);
    if (specificData && specificData.hasSpecificData) {
      //console.log("Returning specific data response");
      return specificData;
    }
    
    // Continue with the existing general topic flow if no specific data
    let topic;
    if (query.split(" ").length === 1) {
      // If it's a single word query, use it directly as the topic
      topic = query.toLowerCase();
      //console.log("Single word query detected:", topic);
    } else {
      // Otherwise extract the topic from the query
      topic = extractTopicFromQuery(query, language);
      //console.log("Extracted topic:", topic);
    }
    
    if (!topic) {
      //console.log("No topic extracted from query");
      return {
        answer: null,
        confidence: 0,
        key: null,
        baseTopic: null,
      };
    }

    //console.log("Looking up topic:", topic);

    // Look for the topic in the dictionary
    let dictionaryData = getDictionaryEntry(topic, language);

    if (!dictionaryData) {
      // Try fallback to partial matches more aggressively
      const partialMatch = findPartialMatch(topic, language);

      if (partialMatch) {
        dictionaryData = partialMatch;
        //console.log("Found partial match:", partialMatch.key);
      }
    }

    if (dictionaryData) {
      // We found a match in the dictionary
      //console.log("Found dictionary match:", dictionaryData.key);
      return {
        answer: dictionaryData.text || dictionaryData.description,
        confidence: dictionaryData.score || 0.9,
        key: dictionaryData.key,
        baseTopic: topic,
        source: "dictionary",
      };
    }

    // No match found
    //console.log("No dictionary match found for topic:", topic);
    return {
      answer: null,
      confidence: 0,
      key: null,
      baseTopic: topic,
    };
  } catch (error) {
    console.error("Error getting energy info:", error);
    return {
      answer: null,
      confidence: 0,
      key: null,
      error: error.message,
    };
  }
};

/**
 * Get specific energy data from query that asks for particular statistics
 * @param {string} query - User query like "how much oil did France import in 2021"
 * @param {string} language - Language code
 * @returns {Object} Response with specific data if found
 */
const getSpecificEnergyData = async (query, language = "en") => {
  try {
    // Extract entities from the query
    const entities = extractEntities(query, language);
    console.log("Extracted entities for specific data query:", entities);
    
    // Check if we have essential elements for a specific query
    const hasFuel = entities.statisticalConcepts && entities.statisticalConcepts.length > 0;
    const hasCountry = entities.countries && entities.countries.length > 0;
    const hasYear = entities.dates && entities.dates.length > 0;
    
    // For specific data queries we need at least a fuel/topic and either a country or year
    if (!(hasFuel && (hasCountry || hasYear))) {
      console.log("Not enough entities for specific data query");
      return { hasSpecificData: false };
    }
    
    // Get the main entities - prioritize fuel types from the energy dictionary
    let fuelType = null;
    
    // Try to find a fuel type that exists in the energy dictionary
    if (hasFuel) {
      const dictionary = energyDictionary[language] || energyDictionary.en;
      for (const concept of entities.statisticalConcepts) {
        if (dictionary[concept.toLowerCase()]) {
          fuelType = concept.toLowerCase();
          break;
        }
      }
      
      // If we couldn't find a match in the dictionary, use the first statistical concept
      if (!fuelType && entities.statisticalConcepts.length > 0) {
        fuelType = entities.statisticalConcepts[0].toLowerCase();
      }
    }
    
    const country = hasCountry ? entities.countries[0] : null;
    const year = hasYear ? extractYear(entities.dates[0]) : null;
    
    console.log(`Looking for specific data: ${fuelType} in ${country} for ${year}`);
    
    // Determine the activity type and balance type from the query using our utility functions
    const activityType = getActivityTypeFromQuery(query);
    const balanceType = getBalanceTypeForActivity(activityType);
    
    console.log(`Detected activity type: ${activityType}, balance type: ${balanceType}`);
    
    // Find the fuel code in the energy dictionary
    const fuelDetails = findFuelDetails(fuelType, language);
    if (!fuelDetails || !fuelDetails.siec) {
      console.log("Could not find fuel SIEC code for:", fuelType);
      return { hasSpecificData: false };
    }
    
    // Find the country code
    const countryCode = country ? findCountryCode(country) : null;
    if (country && !countryCode) {
      console.log("Could not find country code for:", country);
      return { hasSpecificData: false };
    }
    
    // Prepare parameters for Eurostat API call using the dataset handler
    const parameters = {
      fuelType: fuelType,
      activityType: activityType,
      balanceType: balanceType,
      siec: fuelDetails.siec,
      unit: fuelDetails.unit || 'TJ_GCV', // Provide default unit if missing
      country: countryCode,
      geo: countryCode || 'EU27_2020', // Some datasets use geo, some use partner
      fixedYear: !!year,  // Boolean flag for the API to handle
    };
    
    // Add year filter if present
    if (year) {
      parameters.time = year.toString();
    }
    
    // Call Eurostat API with the specific data query type
    console.log("Calling Eurostat API with parameters:", parameters);
    const response = await fetchEurostatData(`${fuelType}_specific_data`, parameters);
    
    console.log("API response:", response.error ? "Error" : "Success", 
                response.isMockData ? "(Mock Data)" : "");
    
    // Handle error responses from the API
    if (response.error) {
      console.error("API error:", response.message);
      
      // If we have mock data, we can still return a response based on it
      if (response.isMockData) {
        console.log("Using mock data as fallback");
        const mockDataPoint = extractDataPointFromResponse(response, countryCode, year, balanceType);
        
        if (mockDataPoint) {
          const fuelName = fuelDetails.title || fuelType;
          const countryName = country || "the EU";
          const yearStr = year || "the latest available year";
          
          // Create a response with a disclaimer that this is estimated data
          return {
            hasSpecificData: true,
            answer: `Based on our estimates, ${countryName}'s ${fuelName} ${activityType} in ${yearStr} was approximately ${formatNumber(mockDataPoint.value)} ${mockDataPoint.unit}. (Note: This is estimated data as specific Eurostat figures were unavailable.)`,
            confidence: 0.6, // Lower confidence for mock data
            key: fuelType,
            baseTopic: fuelType,
            source: "eurostat",
            isMockData: true,
            specificData: {
              fuel: fuelName,
              country: countryName,
              year: yearStr,
              value: mockDataPoint.value,
              unit: mockDataPoint.unit,
              activityType: activityType
            }
          };
        }
      }
      
      // If there's no suitable mock data, return false
      return { hasSpecificData: false };
    }
    
    // Process the API response to get the specific value
    const dataPoint = extractDataPointFromResponse(response, countryCode, year, balanceType);
    
    if (dataPoint) {
      // Create a response with the specific data point
      const fuelName = fuelDetails.title || fuelType;
      const countryName = country || "the EU";
      const yearStr = year || "the latest available year";
      
      // Use the activity type directly (it's already normalized to a human-readable form)
      const specificAnswer = `Based on Eurostat data, ${countryName}'s ${fuelName} ${activityType} in ${yearStr} was ${formatNumber(dataPoint.value)} ${dataPoint.unit}.`;
      
      return {
        hasSpecificData: true,
        answer: specificAnswer,
        confidence: 0.9,
        key: fuelType,
        baseTopic: fuelType,
        source: "eurostat",
        isMockData: response.isMockData,
        specificData: {
          fuel: fuelName,
          country: countryName,
          year: yearStr,
          value: dataPoint.value,
          unit: dataPoint.unit,
          activityType: activityType
        }
      };
    }
    
    return { hasSpecificData: false };
  } catch (error) {
    console.error("Error getting specific energy data:", error);
    return { hasSpecificData: false, error: error.message };
  }
};

/**
 * Extract a specific data point from an Eurostat API response
 * @param {Object} response - Eurostat API response
 * @param {string} countryCode - Country code to find
 * @param {number} year - Year to find
 * @param {string} balanceType - Balance type code (IMP, EXP, etc.)
 * @returns {Object|null} Data point with value and unit if found
 */
const extractDataPointFromResponse = (response, countryCode, year, balanceType) => {
  try {
    if (!response || !response.value || !response.dimension) {
      return null;
    }
    
    const { value, dimension } = response;
    
    // Extract dimensions and labels
    const times = dimension.time?.category?.index || {};
    const timeLabels = dimension.time?.category?.label || {};
    const countries = dimension.geo?.category?.index || {};
    // Also check for partner dimension which is used in some datasets instead of geo
    const partners = dimension.partner?.category?.index || {};
    const countryLabels = dimension.geo?.category?.label || 
                         dimension.partner?.category?.label || {};
    const balances = dimension.nrg_bal?.category?.index || {};
    const units = dimension.unit?.category?.label || {};
    const unitType = Object.keys(units)[0] || "unknown unit";
    
    // Detect if this is a trade dataset (import/export) based on the response structure
    const isTradeDataset = dimension.partner !== undefined || 
                          (balanceType && (balanceType === 'IMP' || balanceType === 'EXP' || 
                                         balanceType.includes('IMP') || balanceType.includes('EXP')));
    
    // If this is a simple value object format (commonly seen in trade datasets)
    if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).every(k => !k.includes(':'))) {
      console.log("Found simple value object structure - aggregating values");
      
      // Sum up all non-zero values as this appears to be a collection of values that should be aggregated
      let totalValue = 0;
      for (const key in value) {
        if (value[key] && !isNaN(parseFloat(value[key]))) {
          totalValue += parseFloat(value[key]);
        }
      }
      
      console.log(`Aggregated value: ${totalValue} ${unitType}`);
      
      // If we have a valid total, return it
      if (totalValue > 0) {
        return {
          value: totalValue,
          unit: unitType
        };
      }
    }
    
    // Find the correct indices
    let yearIdx = null;
    let countryIdx = null;
    let balanceIdx = null;
    
    // Find the year index (use latest if not specified)
    if (year) {
      yearIdx = times[year.toString()];
    } else {
      // Use the latest year
      const yearCodes = Object.keys(times);
      if (yearCodes.length > 0) {
        const latestYear = yearCodes.sort().pop();
        yearIdx = times[latestYear];
      }
    }
    
    // Find the country index - check both geo and partner dimensions
    if (countryCode) {
      countryIdx = countries[countryCode] !== undefined ? countries[countryCode] : partners[countryCode];
    } else {
      // Use the first country (usually EU total)
      countryIdx = Object.values(countries).length > 0 ? Object.values(countries)[0] : 
                   Object.values(partners).length > 0 ? Object.values(partners)[0] : 0;
    }
    
    // Find the balance index
    if (balanceType && balances) {
      // Look for exact match or partial match
      const balKey = Object.keys(balances).find(k => 
        k === balanceType || k.includes(balanceType));
      
      if (balKey) {
        balanceIdx = balances[balKey];
      }
    }
    
    console.log("Found indices:", { yearIdx, countryIdx, balanceIdx });
    
    // For trade datasets, we need special handling
    if (isTradeDataset) {
      // For imports/exports with multiple partners, we need to aggregate values
      if ((yearIdx !== undefined) && 
          (countryCode || countryIdx !== undefined)) {
        
        console.log("Processing trade dataset for", countryCode || "Unknown country");
        
        let totalValue = 0;
        let valueCount = 0;
        
        // The structure could vary significantly between datasets
        // Here we try different approaches
        
        // For complex structured data
        if (Object.keys(value).some(k => k.includes(':'))) {
          // Try to find all entries for the specific year and country
          for (const key in value) {
            // Different index patterns in different datasets
            const isRelevantEntry = (
              (key.includes(`${yearIdx}:`) && countryCode) || // time first
              (key.includes(`:${yearIdx}:`) && countryCode) || // time in middle
              (key.includes(`:${yearIdx}`) && countryCode) || // time at end
              (countryIdx !== undefined && key.includes(`:${countryIdx}:`)) || // specific country index
              (countryIdx !== undefined && key.startsWith(`${countryIdx}:`)) || // country first
              (countryIdx !== undefined && key.endsWith(`:${countryIdx}`)) // country last
            );
            
            if (isRelevantEntry && value[key] && !isNaN(parseFloat(value[key]))) {
              totalValue += parseFloat(value[key]);
              valueCount++;
            }
          }
        } 
        // For simple key-value data
        else {
          // If we can't find structured indices, just sum all values
          for (const key in value) {
            if (value[key] && !isNaN(parseFloat(value[key]))) {
              totalValue += parseFloat(value[key]);
              valueCount++;
            }
          }
        }
        
        if (valueCount > 0) {
          console.log(`Found ${valueCount} trade values, total: ${totalValue} ${unitType}`);
          return {
            value: totalValue,
            unit: unitType
          };
        }
      }
    }
    
    // If we couldn't find all required indices
    if (yearIdx === undefined || countryIdx === undefined || 
        (balanceIdx === undefined && balanceType && dimension.nrg_bal)) {
      console.log("Missing indices:", { yearIdx, countryIdx, balanceIdx });
      
      // If we have simple structure with direct mappings
      if (Object.keys(value).some(k => !k.includes(':'))) {
        // For very simple structures, try to calculate the total value
        let totalValue = 0;
        let valueCount = 0;
        
        for (const key in value) {
          if (value[key] && !isNaN(parseFloat(value[key]))) {
            totalValue += parseFloat(value[key]);
            valueCount++;
          }
        }
        
        if (valueCount > 0) {
          console.log(`Found ${valueCount} values, total: ${totalValue} ${unitType}`);
          return {
            value: totalValue,
            unit: unitType
          };
        }
        
        // If we couldn't aggregate values, just return the first non-zero value
        for (const key in value) {
          if (value[key] && parseFloat(value[key]) > 0) {
            return {
              value: parseFloat(value[key]),
              unit: unitType
            };
          }
        }
      }
      
      // For mock data with a simple structure
      if (response.isMockData && Object.keys(value)[0]) {
        return {
          value: parseFloat(value[Object.keys(value)[0]]),
          unit: unitType
        };
      }
      
      return null;
    }
    
    // Try different value key formats based on the dimension order in the response
    let dataKey = null;
    const possibleKeys = [];
    
    // Generate all possible key combinations based on the dimensions present in the response
    if (yearIdx !== undefined && countryIdx !== undefined) {
      if (balanceIdx !== undefined) {
        // Three-dimensional keys with all dimensions
        possibleKeys.push(
          `${yearIdx}:${countryIdx}:${balanceIdx}`, // time:geo:balance
          `${countryIdx}:${balanceIdx}:${yearIdx}`, // geo:balance:time
          `${balanceIdx}:${countryIdx}:${yearIdx}`, // balance:geo:time
          `${yearIdx}:${balanceIdx}:${countryIdx}`, // time:balance:geo
          `${countryIdx}:${yearIdx}:${balanceIdx}`, // geo:time:balance
          `${balanceIdx}:${yearIdx}:${countryIdx}`  // balance:time:geo
        );
      } else {
        // Two-dimensional keys for datasets without balance
        possibleKeys.push(
          `${yearIdx}:${countryIdx}`, // time:geo
          `${countryIdx}:${yearIdx}`  // geo:time
        );
      }
    }
    
    // Try all possible key formats
    for (const key of possibleKeys) {
      if (value[key] !== undefined) {
        dataKey = key;
        console.log(`Found matching key: ${dataKey} with value: ${value[dataKey]}`);
        break;
      }
    }
    
    // If we found a matching key
    if (dataKey) {
      return {
        value: parseFloat(value[dataKey]),
        unit: unitType
      };
    }
    
    // If we still haven't found a value, try to aggregate values for activity-specific logic
    if (balanceType) {
      console.log(`Trying to aggregate values for ${balanceType}...`);
      let totalValue = 0;
      let foundValues = false;
      
      for (const key in value) {
        // For imports/exports, aggregate values that match the year and seem relevant
        if ((balanceType.includes('IMP') || balanceType.includes('EXP')) && 
            (yearIdx !== undefined) && key.includes(`${yearIdx}`)) {
          const val = parseFloat(value[key]);
          if (!isNaN(val) && val > 0) {
            totalValue += val;
            foundValues = true;
          }
        }
      }
      
      if (foundValues) {
        console.log(`Total aggregated value for ${balanceType}: ${totalValue} ${unitType}`);
        return {
          value: totalValue,
          unit: unitType
        };
      }
    }
    
    // Last resort: if this is a trade dataset and we couldn't find a specific value,
    // just return the sum of all positive values as a rough estimate
    if (isTradeDataset) {
      let totalValue = 0;
      let foundValues = false;
      
      for (const key in value) {
        const val = parseFloat(value[key]);
        if (!isNaN(val) && val > 0) {
          totalValue += val;
          foundValues = true;
        }
      }
      
      if (foundValues) {
        console.log(`Total estimated value (fallback): ${totalValue} ${unitType}`);
        return {
          value: totalValue,
          unit: unitType
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error extracting data point:", error);
    return null;
  }
};

/**
 * Find fuel details from the energy dictionary
 * @param {string} fuelType - Fuel type (e.g. "oil", "natural gas")
 * @param {string} language - Language code
 * @returns {Object|null} Fuel details from dictionary
 */
const findFuelDetails = (fuelType, language) => {
  const dictionary = energyDictionary[language] || energyDictionary.en;
  
  // Try direct lookup first
  if (dictionary[fuelType]) {
    return {
      ...dictionary[fuelType],
      siec: dictionary[fuelType].siec || dictionary[fuelType].fuelCode
    };
  }
  
  // Try fuzzy matching
  const normalizedFuel = fuelType.toLowerCase();
  let bestMatch = null;
  
  Object.entries(dictionary).forEach(([key, entry]) => {
    // Check key, title, and keywords
    const matchesKey = key.toLowerCase().includes(normalizedFuel) || normalizedFuel.includes(key.toLowerCase());
    const matchesTitle = entry.title && (entry.title.toLowerCase().includes(normalizedFuel) || normalizedFuel.includes(entry.title.toLowerCase()));
    const matchesKeywords = entry.keywords && entry.keywords.some(k => 
      k.toLowerCase().includes(normalizedFuel) || normalizedFuel.includes(k.toLowerCase())
    );
    
    if (matchesKey || matchesTitle || matchesKeywords) {
      if (!bestMatch || key.length < bestMatch.key.length) {
        bestMatch = {
          ...entry,
          key,
          siec: entry.siec || entry.fuelCode
        };
      }
    }
  });
  
  return bestMatch;
};

/**
 * Find country code for a country name
 * @param {string} countryName - Country name
 * @returns {string|null} ISO country code if found
 */
const findCountryCode = (countryName) => {
  if (!countryName) return null;
  
  const normalizedName = countryName.toLowerCase().trim();
  
  // Direct lookup in countryCodes dictionary
  for (const [code, names] of Object.entries(countryCodes)) {
    if (Array.isArray(names)) {
      // Check all alternative names
      if (names.some(name => name.toLowerCase() === normalizedName)) {
        return code;
      }
    } else if (typeof names === 'string' && names.toLowerCase() === normalizedName) {
      return code;
    }
  }
  
  // Check for partial matches
  for (const [code, names] of Object.entries(countryCodes)) {
    if (Array.isArray(names)) {
      if (names.some(name => 
        name.toLowerCase().includes(normalizedName) || 
        normalizedName.includes(name.toLowerCase())
      )) {
        return code;
      }
    } else if (typeof names === 'string' && 
      (names.toLowerCase().includes(normalizedName) || 
       normalizedName.includes(names.toLowerCase()))) {
      return code;
    }
  }
  
  // Special cases
  if (normalizedName.includes('eu') || 
      normalizedName.includes('europe') || 
      normalizedName.includes('union')) {
    return 'EU27_2020';
  }
  
  return null;
};

/**
 * Extract year from date string
 * @param {string} dateStr - Date string
 * @returns {number|null} Year if found
 */
const extractYear = (dateStr) => {
  if (!dateStr) return null;
  
  // Extract 4-digit year from the string
  const yearMatch = dateStr.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) {
    return parseInt(yearMatch[0], 10);
  }
  
  return null;
};

/**
 * Format number for display
 * @param {number} value - Number to format
 * @returns {string} Formatted number
 */
const formatNumber = (value) => {
  if (value === undefined || value === null) return "N/A";
  
  // Format large numbers with commas and 2 decimal places if needed
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(value);
};

/**
 * Get a dictionary entry by topic
 * @param {string} topic - Topic to find
 * @param {string} language - Language code
 * @returns {Object|null} Dictionary entry or null if not found
 */
const getDictionaryEntry = (topic, language = "en") => {
  if (!topic) return null;

  // Get language-specific dictionary, fallback to English
  const dictionary = energyDictionary[language] || energyDictionary.en;

  // First try direct lookup by key
  if (dictionary[topic]) {
    return {
      ...dictionary[topic],
      key: topic,
    };
  }

  // Try case-insensitive match
  const normalizedTopic = topic.toLowerCase();

  const key = Object.keys(dictionary).find(
    (k) => k.toLowerCase() === normalizedTopic
  );

  if (key) {
    return {
      ...dictionary[key],
      key,
    };
  }

  return null;
};

/**
 * Find a partial match for a topic in the dictionary
 * @param {string} topic - Topic to find
 * @param {string} language - Language code
 * @returns {Object|null} Best partial match or null if none found
 */
const findPartialMatch = (topic, language = "en") => {
  if (!topic) return null;

  // Get language-specific dictionary, fallback to English
  const dictionary = energyDictionary[language] || energyDictionary.en;

  const normalizedTopic = topic.toLowerCase();
  let bestMatch = null;
  let bestScore = 0.2; // Lower threshold to catch more matches

  // Check each entry for partial matches
  Object.entries(dictionary).forEach(([key, entry]) => {
    const lowerKey = key.toLowerCase();

    // Check for partial matches in key, title, and description
    const keyMatch =
      lowerKey.includes(normalizedTopic) || normalizedTopic.includes(lowerKey);
    const titleMatch =
      entry.title &&
      (entry.title.toLowerCase().includes(normalizedTopic) ||
        normalizedTopic.includes(entry.title.toLowerCase()));

    // Check keywords
    const keywordMatch =
      entry.keywords &&
      entry.keywords.some((keyword) => {
        const lowerKeyword = keyword.toLowerCase();
        return (
          lowerKeyword.includes(normalizedTopic) ||
          normalizedTopic.includes(lowerKeyword)
        );
      });

    if (keyMatch || titleMatch || keywordMatch) {
      // Calculate match score
      const baseScore =
        Math.min(
          normalizedTopic.length / Math.max(lowerKey.length, 1),
          lowerKey.length / Math.max(normalizedTopic.length, 1)
        ) * 0.5;

      // Apply bonuses for different match types
      let finalScore = baseScore;
      if (keyMatch) finalScore += 0.2;
      if (titleMatch) finalScore += 0.15;
      if (keywordMatch) finalScore += 0.3;

      // Bonus for exact keyword match
      if (
        entry.keywords &&
        entry.keywords.some((k) => k.toLowerCase() === normalizedTopic)
      ) {
        finalScore += 0.2;
      }

      // Update best match if this is better
      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestMatch = {
          ...entry,
          key,
          score: parseFloat(finalScore.toFixed(2)),
        };
      }
    }
  });

  return bestMatch;
};

export default getEnergyInfo;
