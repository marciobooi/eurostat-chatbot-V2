/**
 * API module for fetching data from Eurostat
 */
import { 
  getDatasetForFuelAndActivity, 
  prepareDatasetParameters, 
  datasetConfigurations,
  getActivityTypeFromQuery
} from '../utils/datasetHandler';
import { datasetDictionary, validateDatasetParams } from '../data/datasetDictionary';
import { getTimeParameters, extractTimePeriod } from '../utils/temporalHelper';

// Define the base URL for Eurostat API
const EUROSTAT_API_BASE_URL = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/';

/**
 * Build API URL with parameters
 * @param {string} dataset - Dataset identifier
 * @param {Object} params - Query parameters
 * @returns {string} Constructed API URL
 */
export const buildApiUrl = (dataset, params) => {
    const config = datasetDictionary[dataset];
    if (!config) {
        throw new Error(`Unknown dataset: ${dataset}`);
    }
    
    // Validate parameters
    const validation = validateDatasetParams(dataset, params);
    if (!validation.valid) {
        throw new Error(`Invalid parameters: ${validation.errors.join(', ')}`);
    }
    
    return config.buildUrl(params);
};

/**
 * Fetch data from Eurostat API
 * @param {string} dataset - Dataset identifier
 * @param {Object} params - Query parameters
 * @returns {Promise} Promise resolving to parsed data
 */
export const fetchEurostatData = async (dataset, params) => {
    try {
        const url = buildApiUrl(dataset, params);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const config = datasetDictionary[dataset];
        
        return config.parseResponse(data);
    } catch (error) {
        console.error(`Error fetching Eurostat data for ${dataset}:`, error);
        throw error;
    }
};

/**
 * Get data based on query parameters and time period
 * @param {Object} queryParams - Query parameters including fuel type and activity
 * @param {string} queryText - Original query text for temporal extraction
 * @returns {Promise} Promise resolving to data with temporal context
 */
export const getDataWithTimeContext = async (queryParams, queryText) => {
    // Extract time period information from query
    const timePeriod = extractTimePeriod(queryText);
    
    // Get appropriate dataset based on fuel type and activity
    const dataset = getDatasetForFuelAndActivity(
        queryParams.fuelType,
        queryParams.activityType,
        { frequency: timePeriod.frequency }
    );
    
    // Get time parameters based on extracted period
    const timeParams = getTimeParameters(timePeriod);
    
    // Merge all parameters
    const finalParams = {
        ...queryParams,
        ...timeParams
    };
    
    return fetchEurostatData(dataset, finalParams);
};

/**
 * Get data for comparing multiple time periods
 * @param {Object} queryParams - Base query parameters
 * @param {Array} periods - Array of time periods to compare
 * @returns {Promise} Promise resolving to array of data for each period
 */
export const getComparisonData = async (queryParams, periods) => {
    const dataset = getDatasetForFuelAndActivity(
        queryParams.fuelType,
        queryParams.activityType,
        { frequency: periods[0].frequency }
    );
    
    const requests = periods.map(period => {
        const timeParams = getTimeParameters(period);
        return fetchEurostatData(dataset, {
            ...queryParams,
            ...timeParams
        });
    });
    
    return Promise.all(requests);
};

/**
 * Get monthly data series
 * @param {Object} queryParams - Query parameters
 * @param {string} startDate - Start date (YYYY-MM)
 * @param {string} endDate - End date (YYYY-MM)
 * @returns {Promise} Promise resolving to monthly data series
 */
export const getMonthlyData = async (queryParams, startDate, endDate) => {
    const dataset = getDatasetForFuelAndActivity(
        queryParams.fuelType,
        queryParams.activityType,
        { frequency: 'monthly' }
    );
    
    // Ensure we're using a monthly dataset
    if (!dataset.endsWith('m')) {
        throw new Error('Monthly data not available for this query');
    }
    
    const timeParams = getTimeParameters({
        startDate,
        endDate,
        frequency: 'monthly'
    });
    
    return fetchEurostatData(dataset, {
        ...queryParams,
        ...timeParams
    });
};

/**
 * Extract fuel type from query string
 * @param {string} queryType - Query type string
 * @returns {string} - Extracted fuel type
 */
function extractFuelTypeFromQuery(queryType) {
  if (!queryType) return 'default';
  
  // Split by underscore and get the first part which is usually the fuel type
  const parts = queryType.split('_');
  if (parts.length > 0) {
    return parts[0];
  }
  return 'default';
}

// Add simple mock data for testing when API fails
const getMockDataForTopic = (queryType) => {
  console.log(`Providing mock data for ${queryType}`);
  
  // Special case for specific data queries
  if (queryType.includes('_specific_data')) {
    // For specific data queries, we want to return data that can be used to generate a meaningful response
    return {
      isMockData: true,
      value: {"0:0:0": 478.42},
      dimension: {
        time: {
          category: {
            index: {"2021": 0},
            label: {"2021": "2021"}
          },
          label: "Time"
        },
        geo: {
          category: {
            index: {"FR": 0},
            label: {"FR": "France"}
          },
          label: "Geopolitical entity (reporting)"
        },
        nrg_bal: {
          category: {
            index: {"IMP": 0},
            label: {"IMP": "Imports"}
          },
          label: "Energy balance"
        },
        unit: {
          category: {
            index: {"MIO_M3": 0},
            label: {"MIO_M3": "Million cubic meters"}
          },
          label: "Unit"
        }
      },
      source: "MOCK DATA FOR SPECIFIC QUERY"
    };
  } else if (queryType.includes('_consumption') || queryType.includes('_by_country')) {
    // For pie charts: mock with structure similar to Eurostat API response
    return {
      isMockData: true,
      value: {0: 104.3, 1: 78.6, 2: 65.2, 3: 59.8, 4: 31.4},
      dimension: {
        geo: {
          category: {
            index: {DE: 0, FR: 1, IT: 2, ES: 3, PL: 4},
            label: {DE: "Germany", FR: "France", IT: "Italy", ES: "Spain", PL: "Poland"}
          },
          label: "Geopolitical entity (reporting)"
        },
        time: {
          category: {
            index: {2023: 0},
            label: {2023: "2023"}
          },
          label: "Time"
        }
      },
      id: ["geo", "time"],
      size: [5, 1],
      source: "MOCK DATA"
    };
  } else if (queryType.includes('_timeline') || queryType.includes('_production_timeline')) {
    // For line charts: mock with structure similar to Eurostat API response
    return {
      isMockData: true,
      value: {0: 589.7, 1: 578.9, 2: 573.6, 3: 485.2, 4: 523.8},
      dimension: {
        time: {
          category: {
            index: {2017: 0, 2018: 1, 2019: 2, 2020: 3, 2021: 4},
            label: {2017: "2017", 2018: "2018", 2019: "2019", 2020: "2020", 2021: "2021"}
          },
          label: "Time"
        },
        geo: {
          category: {
            index: {EU27_2020: 0},
            label: {EU27_2020: "European Union (27 countries)"}
          },
          label: "Geopolitical entity (reporting)"
        }
      },
      id: ["time", "geo"],
      size: [5, 1],
      source: "MOCK DATA"
    };
  } else if (queryType.includes('_production_consumption')) {
    // For area charts: mock with structure similar to Eurostat API response
    return {
      isMockData: true,
      value: {
        "0:0": 589.7, "0:1": 650.2,
        "1:0": 578.9, "1:1": 645.1,
        "2:0": 573.6, "2:1": 637.8,
        "3:0": 485.2, "3:1": 512.5,
        "4:0": 523.8, "4:1": 592.3
      },
      dimension: {
        time: {
          category: {
            index: {2017: 0, 2018: 1, 2019: 2, 2020: 3, 2021: 4},
            label: {2017: "2017", 2018: "2018", 2019: "2019", 2020: "2020", 2021: "2021"}
          },
          label: "Time"
        },
        nrg_bal: {
          category: {
            index: {PRODUCTION: 0, CONSUMPTION: 1},
            label: {PRODUCTION: "Production", CONSUMPTION: "Consumption"}
          },
          label: "Energy balance"
        }
      },
      id: ["time", "nrg_bal"],
      size: [5, 2],
      source: "MOCK DATA"
    };
  }
  
  return {};
};

export default {
  buildApiUrl,
  fetchEurostatData,
  getDataWithTimeContext,
  getComparisonData,
  getMonthlyData
};
