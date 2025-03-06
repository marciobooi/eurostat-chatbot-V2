/**
 * API module for fetching data from Eurostat
 */

// Define the base URL for Eurostat API
const EUROSTAT_API_BASE_URL = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/';

/**
 * Fetch data from Eurostat API
 * @param {string} queryType - Type of data to fetch (e.g. 'energy_production', 'renewable_energy_production')
 * @param {Object} parameters - Additional parameters for the API call including dataset, siec, unit, nrg_bal
 * @returns {Promise<Object>} - The fetched data
 */
export const fetchEurostatData = async (queryType, parameters = {}) => {
  try {
    // Parse parameters from the energy dictionary
    const { dataset, siec, unit, nrg_bal, fuelCode, additionalDatasets, geo, latestDataOnly, fixedYear } = parameters;
    
    // Use the dataset provided in parameters or fallback to a default dataset
    let datasetCode = dataset;
    
    // If no dataset is provided, try to derive one from the query type
    if (!datasetCode) {
      console.warn(`No dataset specified for query type: ${queryType}, using nrg_bal_c as fallback`);
      datasetCode = 'nrg_bal_c'; // Default dataset as fallback
    }
    
    // Construct the API URL with the correct dataset
    let apiUrl = `${EUROSTAT_API_BASE_URL}${datasetCode}`;
    
    // Add query parameters
    const queryParams = new URLSearchParams();
    
    // Add format parameter first (JSON)
    queryParams.append('format', 'JSON');
    
    // Add dimension parameters in the correct order
    if (unit) queryParams.append('unit', unit);
    if (nrg_bal) queryParams.append('nrg_bal', nrg_bal);
    if (siec) queryParams.append('siec', siec);
    else if (fuelCode) queryParams.append('siec', fuelCode); // Use fuelCode as fallback for siec
    
    // For pie and bar charts, we only need the latest year's data
    if (latestDataOnly) {
      // Get last 5 time periods
      queryParams.append('lastTimePeriod', '5');
    } else if (fixedYear) {
      queryParams.append('lastTimePeriod', '1');
    } else {
      // Get all time periods
      // we dont add time parameter
    }
    
    // Handle geo parameter
    if (geo) {
      queryParams.append('geo', geo);
    } else if (queryType.includes('_consumption') || queryType.includes('_by_country')) {
      // For country distribution charts, get data for all countries
      queryParams.append('geo', '');
    }
    
    // Add language parameter
    queryParams.append('lang', 'en');
    
    // Append query parameters to URL
    apiUrl += `?${queryParams.toString()}`;
    
    console.log(`Fetching Eurostat data: ${apiUrl}`);
    
    try {
      // Make the actual API call
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        console.error(`Eurostat API error: ${response.status} ${response.statusText}`);
        return getMockDataForTopic(queryType);
      }
      
      const data = await response.json();
      console.log('Raw Eurostat response:', JSON.stringify(data));
      
      // Return the raw data directly for the transformation functions to handle
      // This gives us more flexibility in handling different data structures
      return data;
    } catch (fetchError) {
      console.error(`Error fetching from Eurostat API: ${fetchError.message}`);
      return getMockDataForTopic(queryType);
    }
    
  } catch (error) {
    console.error(`Error in fetchEurostatData (${queryType}):`, error);
    return getMockDataForTopic(queryType);
  }
};

// Add simple mock data for testing when API fails
const getMockDataForTopic = (queryType) => {
  console.log(`Providing mock data for ${queryType}`);
  
  if (queryType.includes('_consumption') || queryType.includes('_by_country')) {
    // For pie charts: mock with structure similar to Eurostat API response
    return {
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
