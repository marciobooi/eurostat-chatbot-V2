/**
 * Dataset handler for Eurostat API
 * 
 * This module defines the specific configurations for each Eurostat dataset
 * to properly construct API queries based on their unique dimensions and parameters.
 */
import { energyDictionary } from "../data/energyDictionary";

/**
 * Generate dataset configurations for different Eurostat datasets
 * Uses the energy dictionary to get dataset mappings when possible
 * @returns {Object} Dataset configurations for API calls
 */
export const generateDatasetConfigurations = () => {
  const config = {
    // Energy balance dataset - most commonly used
    "nrg_bal_c": {
      validDimensions: ["unit", "nrg_bal", "siec", "geo", "time"],
      requiredDimensions: ["unit", "siec"],
      parameterMappings: {
        country: "geo",
        fuelCode: "siec",
        balanceType: "nrg_bal"
      },
      defaults: {
        unit: "TJ_GCV"
      }
    },
    
    // Natural gas trade by partner dataset - special case
    "nrg_ti_gas": {
      validDimensions: ["unit", "siec", "partner", "time"],
      requiredDimensions: ["unit", "siec"],
      parameterMappings: {
        country: "partner", // Uses partner instead of geo
        fuelCode: "siec"
        // No nrg_bal dimension
      },
      defaults: {
        unit: "MIO_M3",
        siec: "G3000" // Natural gas
      }
    },
    
    // Crude oil trade by partner dataset
    "nrg_ti_oil": {
      validDimensions: ["unit", "siec", "partner", "time"],
      requiredDimensions: ["unit", "siec"],
      parameterMappings: {
        country: "partner",
        fuelCode: "siec"
      },
      defaults: {
        unit: "THS_T",
        siec: "O4100" // Crude oil
      }
    },
    
    // Electricity and heat production dataset
    "nrg_ind_peh": {
      validDimensions: ["unit", "nrg_bal", "siec", "geo", "time"],
      requiredDimensions: ["unit", "nrg_bal", "siec"],
      parameterMappings: {
        country: "geo",
        fuelCode: "siec",
        balanceType: "nrg_bal"
      },
      defaults: {
        unit: "GWH"
      }
    },
    
    // Energy consumption in households dataset
    "nrg_d_hhq": {
      validDimensions: ["unit", "nrg_bal", "siec", "geo", "time"],
      requiredDimensions: ["unit", "siec", "nrg_bal"],
      parameterMappings: {
        country: "geo",
        fuelCode: "siec",
        balanceType: "nrg_bal"
      },
      defaults: {
        unit: "TJ_GCV",
        nrg_bal: "FC_OTH_HH_E"
      }
    }
  };
  
  // Add any dataset configurations from the energy dictionary
  // This allows for dynamic extension of dataset configurations
  const dict = energyDictionary.en; // Use English dictionary as primary source
  Object.entries(dict).forEach(([key, entry]) => {
    if (entry.dataset && !config[entry.dataset]) {
      // Add new dataset configuration based on any metadata in the dictionary
      config[entry.dataset] = {
        validDimensions: entry.dimensions || ["unit", "nrg_bal", "siec", "geo", "time"],
        requiredDimensions: entry.requiredDimensions || ["unit", "siec"],
        parameterMappings: {
          country: entry.geoParameter || "geo",
          fuelCode: "siec",
          balanceType: entry.balanceParameter || "nrg_bal"
        },
        defaults: {
          unit: entry.unit || "TJ_GCV",
          siec: entry.siec || entry.fuelCode
        }
      };
    }
  });
  
  return config;
};

/**
 * Dataset configurations for different Eurostat datasets
 * Each configuration specifies:
 * - validDimensions: dimensions that are valid for this dataset
 * - requiredDimensions: dimensions that must be included in the query
 * - parameterMappings: how to map standard parameters to dataset-specific ones
 * - defaults: default values for dimensions if not specified
 */
export const datasetConfigurations = generateDatasetConfigurations();

/**
 * Generate fuel dataset mappings from the energy dictionary
 * @returns {Object} Mapping of fuel types to appropriate datasets for different activities
 */
export const generateFuelDatasetMapping = () => {
  const mapping = {
    "default": "nrg_bal_c",
    // Natural gas mappings
    "natural gas": {
      imports: "nrg_ti_gas",
      exports: "nrg_ti_gas",
      production: "nrg_bal_c",
      consumption: "nrg_bal_c",
      monthly: "nrg_cb_gasm",
      balance: "nrg_bal_c"
    },
    "gas": {
      imports: "nrg_ti_gas",
      exports: "nrg_ti_gas",
      production: "nrg_bal_c",
      consumption: "nrg_bal_c",
      monthly: "nrg_cb_gasm",
      balance: "nrg_bal_c"
    },
    // Oil mappings
    "oil": {
      imports: "nrg_ti_oil",
      exports: "nrg_ti_oil",
      production: "nrg_cb_oil",
      consumption: "nrg_cb_oil",
      monthly: "nrg_cb_oilm",
      balance: "nrg_cb_oil"
    },
    // Electricity mappings
    "electricity": {
      production: "nrg_ind_peh",
      consumption: "nrg_cb_e",
      balance: "nrg_cb_e",
      monthly: "nrg_cb_e"
    },
    // Renewable energy mappings
    "renewable energy": {
      total: "nrg_ind_ren",
      transport: "nrg_ind_ren",
      electricity: "nrg_ind_ren",
      heating: "nrg_ind_ren",
      balance: "nrg_ind_ren"
    },
    // Energy efficiency mappings
    "energy efficiency": {
      consumption: "nrg_ind_eff",
      targets: "nrg_ind_eff",
      progress: "nrg_ind_eff"
    }
  };

  // Extract dataset mappings from the energy dictionary
  const dict = energyDictionary.en; // Use English dictionary as primary source
  Object.entries(dict).forEach(([key, entry]) => {
    if (key && entry) {
      // Initialize fuel mapping if not exists
      if (!mapping[key.toLowerCase()]) {
        mapping[key.toLowerCase()] = {};
      }
      
      // Add primary dataset
      if (entry.dataset) {
        mapping[key.toLowerCase()].default = entry.dataset;
      }
      
      // Add specialized datasets
      if (entry.additionalDatasets) {
        entry.additionalDatasets.forEach(datasetInfo => {
          // If additionalDatasets is an array of strings
          if (typeof datasetInfo === 'string') {
            // Use naming conventions to guess the purpose
            if (datasetInfo.includes('_ti_')) {
              mapping[key.toLowerCase()].imports = datasetInfo;
              mapping[key.toLowerCase()].exports = datasetInfo;
            } else if (datasetInfo.includes('_ind_peh')) {
              mapping[key.toLowerCase()].production = datasetInfo;
            } else if (datasetInfo.includes('_d_')) {
              mapping[key.toLowerCase()].consumption = datasetInfo;
            }
          } 
          // If additionalDatasets is an array of objects with purpose and dataset properties
          else if (datasetInfo.purpose && datasetInfo.dataset) {
            mapping[key.toLowerCase()][datasetInfo.purpose] = datasetInfo.dataset;
          }
        });
      }
      
      // Make sure default dataset is set if not already
      if (!mapping[key.toLowerCase()].default && entry.dataset) {
        mapping[key.toLowerCase()].default = entry.dataset;
      }
      
      // Set default imports/exports/production/consumption if not set
      const activityTypes = ['imports', 'exports', 'production', 'consumption'];
      activityTypes.forEach(activity => {
        if (!mapping[key.toLowerCase()][activity]) {
          mapping[key.toLowerCase()][activity] = mapping[key.toLowerCase()].default || mapping.default;
        }
      });
    }
  });
  
  // Explicitly define known mappings for important fuels (these can be overridden by the dictionary)
  const explicitMappings = {
    "natural gas": {
      imports: "nrg_ti_gas",
      exports: "nrg_ti_gas",
      production: "nrg_bal_c",
      consumption: "nrg_bal_c"
    },
    "oil": {
      imports: "nrg_ti_oil",
      exports: "nrg_ti_oil",
      production: "nrg_bal_c",
      consumption: "nrg_bal_c"
    },
    "gas": {  // Add 'gas' as alias for natural gas
      imports: "nrg_ti_gas",
      exports: "nrg_ti_gas",
      production: "nrg_bal_c",
      consumption: "nrg_bal_c"
    }
  };
  
  // Merge explicit mappings with dictionary-based mappings
  Object.entries(explicitMappings).forEach(([fuel, activities]) => {
    if (!mapping[fuel]) {
      mapping[fuel] = activities;
    } else {
      Object.entries(activities).forEach(([activity, dataset]) => {
        if (!mapping[fuel][activity]) {
          mapping[fuel][activity] = dataset;
        }
      });
    }
  });
  
  return mapping;
};

/**
 * Map of fuel types to appropriate datasets
 * Used to select the right dataset for a specific fuel and query type
 */
export const fuelDatasetMapping = generateFuelDatasetMapping();

/**
 * Generate balance type codes from the energy dictionary and statistical concepts
 * @returns {Object} Balance type codes for different activities
 */
export const generateBalanceTypeCodes = () => {
  // Start with default codes
  const balanceCodes = {
    imports: "IMP",
    exports: "EXP",
    production: "PROD",
    consumption: "FC_E",
    totalConsumption: "FC"
  };
  
  // Extract any balance codes from the energy dictionary
  const dict = energyDictionary.en; // Use English dictionary as primary source
  Object.values(dict).forEach(entry => {
    if (entry.balanceCodes) {
      // Merge any balance codes defined in the dictionary
      Object.assign(balanceCodes, entry.balanceCodes);
    }
  });
  
  return balanceCodes;
};

/**
 * Balance type codes for different activities
 */
export const balanceTypeCodes = generateBalanceTypeCodes();

/**
 * Map common oil-related terms to their SIEC codes
 * This helps translate user queries to the correct technical codes
 */
export const oilProductMappings = {
    // Crude oil and primary products
    "crude oil": "O4100_TOT",
    "petroleum": "O4000",
    "oil": "O4000",
    
    // Refined products
    "gasoline": "O4651",
    "petrol": "O4651",
    "diesel": "O4671",
    "jet fuel": "O4661",
    "kerosene": "O4669",
    "fuel oil": "O4680",
    "heating oil": "O4680",
    "lpg": "O4630",
    "liquefied petroleum gas": "O4630",
    
    // Special products
    "lubricants": "O4692",
    "bitumen": "O4695",
    "petroleum coke": "O4694",
    
    // Biofuel exclusions
    "oil excluding biofuels": "O4000XBIO",
    "petroleum excluding biofuels": "O4000XBIO"
};

/**
 * Get SIEC code for an oil product term
 * @param {string} term - Oil product term (e.g. "crude oil", "gasoline")
 * @returns {string} SIEC code or default code if not found
 */
export const getOilProductSiecCode = (term) => {
    const normalizedTerm = term.toLowerCase();
    return oilProductMappings[normalizedTerm] || "O4000"; // Default to total oil if not found
};

/**
 * Get the appropriate dataset for a specific fuel and activity
 * @param {string} fuelType - Type of fuel (e.g. "natural gas", "oil")
 * @param {string} activityType - Type of activity (e.g. "imports", "production")
 * @param {Object} options - Additional options (e.g. frequency: "monthly")
 * @returns {string} Dataset code
 */
export const getDatasetForFuelAndActivity = (fuelType, activityType, options = {}) => {
  const normalizedFuel = (fuelType || '').toLowerCase();
  const normalizedActivity = (activityType || '').toLowerCase();
  const mapping = generateFuelDatasetMapping();
  
  // Special handling for renewable energy queries
  if (normalizedFuel === 'renewable energy' || normalizedFuel === 'renewables') {
    if (normalizedActivity === 'transport') return 'nrg_ind_ren';
    if (normalizedActivity === 'electricity') return 'nrg_ind_ren';
    if (normalizedActivity === 'heating') return 'nrg_ind_ren';
    return 'nrg_ind_ren';
  }
  
  // Special handling for efficiency queries
  if (normalizedFuel === 'energy efficiency' || normalizedActivity === 'efficiency') {
    return 'nrg_ind_eff';
  }
  
  // Check for electricity production specifically
  if (normalizedFuel === 'electricity' && normalizedActivity === 'production') {
    return 'nrg_ind_peh';
  }
  
  // Check for gas-related queries
  if ((normalizedFuel === 'natural gas' || normalizedFuel === 'gas')) {
    if (normalizedActivity === 'imports' || normalizedActivity === 'exports') {
      return 'nrg_ti_gas';
    }
    
    // Check if monthly data is requested
    if (options.frequency === 'monthly') {
      return 'nrg_cb_gasm';
    }
    
    // For other gas activities, use the balance dataset
    return 'nrg_bal_c';
  }
  
  // Handle oil-related queries
  if (normalizedFuel === 'oil' || normalizedFuel === 'petroleum') {
    if (normalizedActivity === 'imports' || normalizedActivity === 'exports') {
      return 'nrg_ti_oil';
    }
    
    // Check if monthly data is requested
    if (options.frequency === 'monthly') {
      return 'nrg_cb_oilm';
    }
    
    return 'nrg_cb_oil';
  }
  
  // Default to the energy balance dataset
  return mapping[normalizedFuel]?.[normalizedActivity] || 'nrg_bal_c';
};

/**
 * Get activity type from a query string or topic
 * @param {string} query - Query string or topic
 * @returns {string} Activity type (imports, exports, production, consumption)
 */
export const getActivityTypeFromQuery = (query) => {
  const normalizedQuery = (query || '').toLowerCase();
  
  // Check for activity-related keywords
  if (normalizedQuery.includes('import')) {
    return 'imports';
  } else if (normalizedQuery.includes('export')) {
    return 'exports';
  } else if (normalizedQuery.includes('produc')) {
    return 'production';
  } else if (normalizedQuery.includes('consum') || normalizedQuery.includes('use')) {
    return 'consumption';
  }
  
  // Default to consumption
  return 'consumption';
};

/**
 * Get balance type code for an activity
 * @param {string} activityType - Activity type (imports, exports, production, consumption)
 * @returns {string} Balance type code for Eurostat API
 */
export const getBalanceTypeForActivity = (activityType) => {
  const normalizedActivity = (activityType || '').toLowerCase();
  return balanceTypeCodes[normalizedActivity] || balanceTypeCodes.consumption;
};

/**
 * Prepare parameters for a specific dataset
 * @param {string} datasetCode - Dataset code (e.g. "nrg_bal_c", "nrg_ti_gas")
 * @param {Object} parameters - Generic parameters 
 * @returns {Object} Dataset-specific parameters
 */
export const prepareDatasetParameters = (datasetCode, parameters) => {
  const config = datasetConfigurations[datasetCode] || datasetConfigurations.nrg_bal_c;
  const result = { ...config.defaults };
  
  // Special case for natural gas imports through nrg_ti_gas
  if (datasetCode === 'nrg_ti_gas' && parameters.activityType === 'imports') {
    result.siec = 'G3000'; // Natural gas code
    
    // Use TJ_GCV as unit for consistency, or MIO_M3 for cubic meters
    if (!parameters.unit) {
      result.unit = 'MIO_M3'; // Default to millions of cubic meters
    }
    
    // For trade datasets, use geo parameter for specific country queries
    // and leave partner empty to get total imports for that country
    if (parameters.country || parameters.geo) {
      // Set geo to the country code (don't set partner)
      result.geo = parameters.country || parameters.geo;
      delete result.partner; // Make sure partner is not set
    }
  }
  
  // Special case for oil imports through nrg_ti_oil
  if (datasetCode === 'nrg_ti_oil' && parameters.activityType === 'imports') {
    // Use the appropriate SIEC code for oil (O4600 = Crude oil)
    result.siec = 'O4600'; // Crude oil
    
    // Use THS_T (thousand tonnes) as default unit for oil
    if (!parameters.unit) {
      result.unit = 'THS_T'; // Default to thousand tonnes
    }
    
    // For trade datasets, use geo parameter for specific country queries
    // and leave partner empty to get total imports for that country
    if (parameters.country || parameters.geo) {
      // Set geo to the country code (don't set partner)
      result.geo = parameters.country || parameters.geo;
      delete result.partner; // Make sure partner is not set
    }
  }
  
  // Handle oil-specific datasets
  if (datasetCode === 'nrg_ti_oil' || datasetCode === 'nrg_cb_oil') {
    // If we have a specific oil product term, use its SIEC code
    if (parameters.fuelType) {
        result.siec = getOilProductSiecCode(parameters.fuelType);
    }
    
    // Use THS_T as default unit for oil
    if (!parameters.unit) {
        result.unit = 'THS_T';
    }
    
    // For trade dataset, handle geo/partner correctly
    if (datasetCode === 'nrg_ti_oil' && (parameters.country || parameters.geo)) {
        result.geo = parameters.country || parameters.geo;
        // Don't set partner to get total imports/exports
        delete result.partner;
    }
  }
  
  // Map generic parameters to dataset-specific ones
  Object.entries(parameters).forEach(([key, value]) => {
    // Skip partner parameter for trade datasets when we have a geo/country parameter
    if ((key === 'partner' && (parameters.country || parameters.geo)) &&
        (datasetCode === 'nrg_ti_gas' || datasetCode === 'nrg_ti_oil')) {
      return;
    }
    
    // If there's a specific mapping for this parameter, use it
    const mappedKey = config.parameterMappings[key] || key;
    
    // Only add parameters that are valid for this dataset
    if (config.validDimensions.includes(mappedKey) && value) {
      result[mappedKey] = value;
    }
  });
  
  // Add any specific handling for the activity type
  const activityType = parameters.activityType || 'consumption';
  if (config.specificHandling && config.specificHandling[activityType]) {
    const specificConfig = config.specificHandling[activityType];
    
    // Add additional filters
    if (specificConfig.additionalFilters) {
      Object.assign(result, specificConfig.additionalFilters);
    }
  }
  
  // For specific data queries, ensure we're getting the correct time period
  if (parameters.fixedYear && parameters.time) {
    result.time = parameters.time;
  }
  
  // For trade datasets, make sure we're setting parameters correctly for the dataset
  if (datasetCode === 'nrg_ti_gas' || datasetCode === 'nrg_ti_oil') {
    // For these datasets, country is stored in geo, not in partner
    if (!result.geo && parameters.country) {
      result.geo = parameters.country;
    }
  }
  
  console.log(`Prepared parameters for ${datasetCode}:`, result);
  
  return result;
};

/**
 * Helper functions for handling temporal aspects of datasets
 */

/**
 * Check if a dataset supports monthly data
 * @param {string} datasetCode - Dataset identifier
 * @returns {boolean} True if dataset supports monthly data
 */
export const supportsMonthlyData = (datasetCode) => {
    return datasetCode.endsWith('m') || datasetCode.includes('_m_');
};

/**
 * Format time parameter for monthly datasets
 * @param {string|number} year - Year
 * @param {string|number} month - Month (1-12)
 * @returns {string} Formatted time parameter (YYYY-MM)
 */
export const formatMonthlyTime = (year, month) => {
    const paddedMonth = month.toString().padStart(2, '0');
    return `${year}-${paddedMonth}`;
};

/**
 * Get temporal frequency from dataset code
 * @param {string} datasetCode - Dataset identifier
 * @returns {string} Temporal frequency ('monthly', 'annual', etc.)
 */
export const getDatasetFrequency = (datasetCode) => {
    if (supportsMonthlyData(datasetCode)) {
        return 'monthly';
    }
    return 'annual';
};

// Add helper function for determining data frequency requirements
export const getDataFrequencyFromQuery = (query) => {
  const normalizedQuery = query.toLowerCase();
  
  if (normalizedQuery.includes('monthly') || 
      normalizedQuery.includes('per month') ||
      normalizedQuery.includes('month by month')) {
    return 'monthly';
  }
  
  return 'annual';
};

export default {
  datasetConfigurations,
  fuelDatasetMapping,
  balanceTypeCodes,
  getDatasetForFuelAndActivity,
  prepareDatasetParameters,
  getActivityTypeFromQuery,
  getBalanceTypeForActivity,
  supportsMonthlyData,
  formatMonthlyTime,
  getDatasetFrequency,
  getDataFrequencyFromQuery
};