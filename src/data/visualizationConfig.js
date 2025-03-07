/**
 * Configuration for fuel-specific visualizations
 */
import { fetchEurostatData, getDataWithTimeContext, getMonthlyData } from '../api/eurostatApi';
import { energyDefinitionsEn } from './energyDefinitionsEn';
import i18n from '../i18n'; // Import the existing i18n system

// Helper functions to transform Eurostat data into visualization-ready format
const transformToPieChartData = (rawData, topN = 5) => {
  // Check if we have the expected Eurostat API response structure
  if (rawData && rawData.value && rawData.dimension) {
    console.log("Processing Eurostat API data for pie chart");
    
    // Extract dimensions and values
    const { value, dimension } = rawData;
    
    // For pie chart with geo dimension, extract country codes and names
    if (dimension.geo && dimension.geo.category) {
      const geoIndex = dimension.geo.category.index;
      const geoLabels = dimension.geo.category.label;
      
      // Map indices to country codes and get values
      return Object.entries(geoIndex)
        .map(([countryCode, index]) => ({
          name: geoLabels[countryCode] || countryCode, // Use label if available, otherwise code
          value: value[index] || 0
        }))
        .sort((a, b) => b.value - a.value) // Sort by value in descending order
        .slice(0, topN); // Take top N entries
    }
    
    // For time-based pie chart (fallback)
    if (dimension.time && dimension.time.category) {
      const timeIndex = dimension.time.category.index;
      const timeLabels = dimension.time.category.label;
      
      return Object.entries(timeIndex)
        .map(([year, index]) => ({
          name: timeLabels[year] || year,
          value: value[index] || 0
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, topN);
    }
  }
  
  // Fallback for simple object format or unexpected data structure
  console.log("Using fallback pie chart data transformation");
  return Object.entries(rawData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([name, value]) => ({ name, value }));
};

const transformToLineChartData = (rawData) => {
  // Check if we have the expected Eurostat API response structure
  if (rawData && rawData.value && rawData.dimension) {
    console.log("Processing Eurostat API data for line chart");
    
    // Extract dimensions and values
    const { value, dimension } = rawData;
    
    // Check if time dimension exists
    if (dimension.time && dimension.time.category) {
      const timeIndex = dimension.time.category.index;
      const timeLabels = dimension.time.category.label;
      
      // Process data based on the structure of the value object
      // If values are direct mapping to time indices
      if (Object.keys(value).every(key => !key.includes(':'))) {
        return Object.entries(timeIndex)
          .map(([year, index]) => ({
            year: timeLabels[year] || year,
            value: parseFloat(value[index]) || 0
          }))
          .sort((a, b) => a.year.localeCompare(b.year));
      }
      
      // If values are indexed with a combination (e.g. "0:0")
      // Assume first dimension is geo and second is time
      const geoIndex = dimension.geo?.category?.index || {};
      const geoCode = Object.keys(geoIndex)[0]; // Use first geo entity
      
      if (geoCode) {
        const geoIdx = geoIndex[geoCode];
        
        return Object.entries(timeIndex)
          .map(([year, timeIdx]) => {
            // Try different value index formats based on the order of dimensions
            let valueKey = `${timeIdx}:${geoIdx}`; // time:geo format
            if (value[valueKey] === undefined) {
              valueKey = `${geoIdx}:${timeIdx}`; // geo:time format
            }
            
            return {
              year: timeLabels[year] || year,
              value: parseFloat(value[valueKey]) || 0
            };
          })
          .sort((a, b) => a.year.localeCompare(b.year));
      }
    }
  }
  
  // If we can't determine the structure, use a direct approach with the data
  console.log("Using fallback line chart data transformation");
  
  // Check if rawData is directly structured as {year: value} pairs
  if (typeof rawData === 'object' && !Array.isArray(rawData)) {
    return Object.entries(rawData)
      .map(([year, value]) => ({
        year: year.toString(),
        value: typeof value === 'number' ? value : 0
      }))
      .sort((a, b) => a.year.localeCompare(b.year));
  }
  
  // Return empty array if no suitable data format found
  return [];
};

const transformToBarChartData = (rawData, topN = 5) => {
  // Check if we have the expected Eurostat API response structure
  if (rawData && rawData.value && rawData.dimension && rawData.dimension.geo) {
    console.log("Processing Eurostat API data for bar chart");
    
    // Extract dimensions and values
    const { value, dimension } = rawData;
    const geoIndex = dimension.geo.category.index;
    const geoLabels = dimension.geo.category.label;
    
    // Map country indices to values
    return Object.entries(geoIndex)
      .map(([countryCode, index]) => ({
        country: geoLabels[countryCode] || countryCode,
        value: value[index] || 0
      }))
      .sort((a, b) => b.value - a.value) // Sort by value in descending order
      .slice(0, topN); // Take top N entries
  }
  
  // Fallback for simple object format
  console.log("Using fallback bar chart data transformation");
  return Object.entries(rawData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([country, value]) => ({ country, value }));
};

const transformToAreaChartData = (rawData) => {
  // Check if we have the expected Eurostat API response structure
  if (rawData && rawData.value && rawData.dimension) {
    console.log("Processing Eurostat API data for area chart");
    
    // Extract dimensions and values
    const { value, dimension } = rawData;
    
    // Check for time dimension
    if (dimension.time && dimension.time.category) {
      const timeIndex = dimension.time.category.index;
      const timeLabels = dimension.time.category.label;
      
      // Check for energy balance dimension
      if (dimension.nrg_bal && dimension.nrg_bal.category) {
        const balanceIndex = dimension.nrg_bal.category.index;
        const balanceLabels = dimension.nrg_bal.category.label;
        
        // Find production and consumption-like balance codes
        let productionCode = null;
        let consumptionCode = null;
        
        // Find suitable balance codes for production and consumption
        Object.keys(balanceIndex).forEach(code => {
          const label = balanceLabels[code]?.toLowerCase() || '';
          if (code.includes('PROD') || label.includes('production') || label.includes('supply')) {
            productionCode = code;
          }
          if (code.includes('FC_E') || code.includes('CONS') || 
              label.includes('consumption') || label.includes('demand')) {
            consumptionCode = code;
          }
        });
        
        // If we found appropriate balance codes
        if (productionCode && consumptionCode) {
          const prodIdx = balanceIndex[productionCode];
          const consIdx = balanceIndex[consumptionCode];
          
          // Get country/geo index if applicable
          let geoIdx = '0';
          if (dimension.geo && dimension.geo.category) {
            const geoCode = Object.keys(dimension.geo.category.index)[0];
            if (geoCode) {
              geoIdx = dimension.geo.category.index[geoCode];
            }
          }
          
          // Build data for each year
          return Object.entries(timeIndex)
            .map(([year, timeIdx]) => {
              let prodValue = 0;
              let consValue = 0;
              
              // Try different value index formats
              // For time:bal:geo format
              let prodKey = `${timeIdx}:${prodIdx}:${geoIdx}`;
              let consKey = `${timeIdx}:${consIdx}:${geoIdx}`;
              
              // If not found, try bal:geo:time format
              if (value[prodKey] === undefined) {
                prodKey = `${prodIdx}:${geoIdx}:${timeIdx}`;
                consKey = `${consIdx}:${geoIdx}:${timeIdx}`;
              }
              
              // If still not found, try bal:time format
              if (value[prodKey] === undefined) {
                prodKey = `${prodIdx}:${timeIdx}`;
                consKey = `${consIdx}:${timeIdx}`;
              }
              
              // If still not found, try time:bal format
              if (value[prodKey] === undefined) {
                prodKey = `${timeIdx}:${prodIdx}`;
                consKey = `${timeIdx}:${consIdx}`;
              }
              
              // Get the values if they exist
              if (value[prodKey] !== undefined) {
                prodValue = parseFloat(value[prodKey]) || 0;
              }
              
              if (value[consKey] !== undefined) {
                consValue = parseFloat(value[consKey]) || 0;
              }
              
              return {
                year: timeLabels[year] || year,
                pipeline: prodValue, // Use "pipeline" as production
                lng: consValue      // Use "lng" as consumption
              };
            })
            .sort((a, b) => a.year.localeCompare(b.year));
        }
      }
    }
  }
  
  // Fallback for simple object format
  console.log("Using fallback area chart data transformation");
  if (typeof rawData === 'object' && !Array.isArray(rawData)) {
    return Object.entries(rawData)
      .map(([year, data]) => {
        // Handle different data structures
        let pipeline = 0;
        let lng = 0;
        
        if (typeof data === 'object') {
          // Object with production/consumption properties
          pipeline = data.pipeline || data.production || 0;
          lng = data.lng || data.consumption || 0;
        } else {
          // Just use the value for pipeline
          pipeline = parseFloat(data) || 0;
        }
        
        return {
          year: year.toString(),
          pipeline,
          lng
        };
      })
      .sort((a, b) => a.year.localeCompare(b.year));
  }
  
  // Return empty array if no suitable data format found
  return [];
};

// Dynamic visualization configuration generator
export const getVisualizationConfig = async (topic, language = 'en', parameters = {}) => {
  // Convert topic to lowercase for case-insensitive matching
  const normalizedTopic = topic.toLowerCase();
  
  // Get the language-specific dictionary
  const languageDictionary = energyDefinitionsEn;
  
  // Check if the requested topic exists in our energy dictionary
  if (!languageDictionary[normalizedTopic]) {
    console.warn(`No configuration found for topic: ${normalizedTopic}`);
    return {
      visualizations: [],
      nextTopics: Object.keys(languageDictionary).slice(0, 3) // Suggest a few default topics
    };
  }

  // Get energy type specific data from the dictionary
  const energyInfo = languageDictionary[normalizedTopic];
  
  // Use visualization types specified in the dictionary or default to standard types
  const visualizationTypes = energyInfo.visualizationType || ['pie', 'line', 'bar'];
  
  // Default country parameter to EU27_2020 if not provided
  // Make sure we pass all required parameters from the energy definition
  const enhancedParameters = {
    dataset: energyInfo.dataset || 'nrg_bal_c', // Ensure dataset is always provided
    siec: energyInfo.siec || energyInfo.fuelCode,
    unit: energyInfo.unit,
    nrg_bal: energyInfo.nrg_bal,
    fuelCode: energyInfo.fuelCode,
    ...parameters,
    geo: parameters.geo || 'EU27_2020'
  };
  
  console.log(`Visualizing topic: ${normalizedTopic} with params:`, enhancedParameters);
  
  // Make sure i18n instance is ready to translate
  await i18n.loadNamespaces(['translations']);
  
  // Set the current language for i18n
  i18n.changeLanguage(language);
  
  const visualizations = [];
  
  // Only add visualizations if specified in the dictionary
  if (energyInfo.hasVisualization) {
    if (visualizationTypes.includes('pie')) {
      visualizations.push({
        type: 'pie',
        label: i18n.t('topConsumersChart', { topic: energyInfo.title }),
        description: i18n.t('visualization.consumptionDistributionDesc', { topic: energyInfo.title }),
        getData: async () => {
          try {
            // For pie charts, we want country distribution data, so we don't specify a country filter
            const data = await fetchEurostatData(energyInfo.queryType || `${normalizedTopic}_consumption`, {
              ...enhancedParameters,
              geo: undefined, // Remove country filter to get data for all countries
              latestDataOnly: true // Only get the latest year's data
            });
            console.log(`Pie chart data for ${normalizedTopic}:`, data);
            return transformToPieChartData(data, 5);
          } catch (error) {
            console.error(`Error getting pie chart data for ${normalizedTopic}:`, error);
            return [];
          }
        }
      });
    }
    
    if (visualizationTypes.includes('line')) {
      visualizations.push({
        type: 'line',
        label: i18n.t('consumptionTimelineChart', { topic: energyInfo.title }),
        description: i18n.t('historicalTrendsDesc', { topic: energyInfo.title }),
        getData: async () => {
          const data = await fetchEurostatData(energyInfo.queryType || `${normalizedTopic}_consumption_timeline`, enhancedParameters);
          return transformToLineChartData(data);
        }
      });
    }
    
    if (visualizationTypes.includes('bar')) {
      visualizations.push({
        type: 'bar',
        label: i18n.t('byCountryChart', { topic: energyInfo.title }),
        description: i18n.t('countryStatisticsDesc', { topic: energyInfo.title }),
        getData: async () => {
          const data = await fetchEurostatData(energyInfo.queryType || `${normalizedTopic}_by_country`, {
            ...enhancedParameters,
            geo: undefined, // Remove country filter to get data for all countries
            latestDataOnly: true // Only get the latest year's data
          });
          return transformToBarChartData(data, 5);
        }
      });
    }
    
    if (visualizationTypes.includes('area')) {
      visualizations.push({
        type: 'area',
        label: i18n.t('productionConsumptionChart', { topic: energyInfo.title }),
        description: i18n.t('productionConsumptionDesc', { topic: energyInfo.title }),
        getData: async () => {
          const data = await fetchEurostatData(energyInfo.queryType || `${normalizedTopic}_production_consumption`, enhancedParameters);
          return transformToAreaChartData(data);
        }
      });
    }
  }
  
  return {
    visualizations,
    // Use related topics from the dictionary
    nextTopics: energyInfo.related || []
  };
};

// Export the module's main function and configuration object
export const visualizationConfig = {
    getVisualizationConfig,
    "natural-gas": {
        title: "Natural Gas Statistics",
        description: "Visualizations for natural gas production, trade, and consumption",
        visualizations: [
            {
                type: "line",
                label: "Monthly Gas Balance",
                description: "Monthly natural gas balance trends",
                getData: async () => {
                    const endDate = new Date();
                    const startDate = new Date();
                    startDate.setFullYear(endDate.getFullYear() - 1); // Last 12 months
                    
                    return getMonthlyData({
                        fuelType: "natural gas",
                        activityType: "balance",
                        siec: "G3000"
                    }, startDate, endDate);
                }
            },
            {
                type: "bar",
                label: "Gas Imports by Country",
                description: "Natural gas imports by partner country",
                getData: async () => getDataWithTimeContext({
                    fuelType: "natural gas",
                    activityType: "imports",
                    siec: "G3000"
                }, "current year")
            },
            {
                type: "pie",
                label: "Gas Consumption Distribution",
                description: "Distribution of natural gas consumption",
                getData: async () => getDataWithTimeContext({
                    fuelType: "natural gas",
                    activityType: "consumption",
                    siec: "G3000"
                }, "current year")
            }
        ]
    },
    "oil": {
        title: "Oil Statistics",
        description: "Visualizations for crude oil and petroleum products",
        visualizations: [
            {
                type: "line",
                label: "Monthly Oil Balance",
                description: "Monthly crude oil balance trends",
                getData: async () => {
                    const endDate = new Date();
                    const startDate = new Date();
                    startDate.setFullYear(endDate.getFullYear() - 1); // Last 12 months
                    
                    return getMonthlyData({
                        fuelType: "oil",
                        activityType: "balance",
                        siec: "O4100_TOT"
                    }, startDate, endDate);
                }
            },
            {
                type: "bar",
                label: "Oil Imports by Country",
                description: "Crude oil imports by partner country",
                getData: async () => getDataWithTimeContext({
                    fuelType: "oil",
                    activityType: "imports",
                    siec: "O4100_TOT"
                }, "current year")
            },
            {
                type: "pie",
                label: "Oil Products Consumption",
                description: "Distribution of oil products consumption",
                getData: async () => getDataWithTimeContext({
                    fuelType: "oil",
                    activityType: "consumption",
                    siec: "O4000"
                }, "current year")
            }
        ]
    },
    "electricity": {
        title: "Electricity Statistics",
        description: "Visualizations for electricity production and consumption",
        visualizations: [
            {
                type: "line",
                label: "Electricity Production by Source",
                description: "Electricity production trends by source",
                getData: async () => getDataWithTimeContext({
                    fuelType: "electricity",
                    activityType: "production",
                    nrg_bal: "GEP", // Gross electricity production
                    unit: "GWH"
                }, "current year")
            },
            {
                type: "pie",
                label: "Production Mix",
                description: "Distribution of electricity production by source",
                getData: async () => getDataWithTimeContext({
                    fuelType: "electricity",
                    activityType: "production",
                    nrg_bal: "GEP",
                    unit: "GWH"
                }, "current year")
            },
            {
                type: "bar",
                label: "Consumption by Sector",
                description: "Electricity consumption by sector",
                getData: async () => getDataWithTimeContext({
                    fuelType: "electricity",
                    activityType: "consumption",
                    unit: "GWH"
                }, "current year")
            }
        ]
    },
    "nrg_cb_sff": {
        defaultChartType: "bar",
        availableChartTypes: ["bar", "line", "pie"],
        dimensions: {
            x: "time",
            y: "values",
            groupBy: "nrg_bal"
        },
        options: {
            bar: {
                stacked: true,
                title: "Solid Fossil Fuels Balance",
                xAxisLabel: "Year",
                yAxisLabel: "Thousand tonnes"
            },
            line: {
                title: "Solid Fossil Fuels Trends",
                xAxisLabel: "Year",
                yAxisLabel: "Thousand tonnes"
            },
            pie: {
                title: "Solid Fossil Fuels Distribution",
                showLegend: true
            }
        }
    },

    "nrg_ind_pehnf": {
        defaultChartType: "bar",
        availableChartTypes: ["bar", "line", "pie"],
        dimensions: {
            x: "time",
            y: "values",
            groupBy: "siec"
        },
        options: {
            bar: {
                stacked: true,
                title: "Non-Fossil Heat Production",
                xAxisLabel: "Year",
                yAxisLabel: "Unit"
            },
            line: {
                title: "Non-Fossil Heat Production Trends",
                xAxisLabel: "Year",
                yAxisLabel: "Unit"
            },
            pie: {
                title: "Non-Fossil Heat Sources Distribution",
                showLegend: true
            }
        },
        colorScheme: {
            "RA100": "#4e79a7", // Hydro
            "RA200": "#f28e2b", // Geothermal
            "RA300": "#76b7b2", // Wind
            "RA410": "#edc948", // Solar PV
            "RA420": "#ff9da7", // Solar thermal
            "RA500": "#9c755f", // Tide, wave, ocean
            "RA600": "#bab0ab", // Ambient heat
            "N9000": "#d37295"  // Nuclear heat
        }
    },

    "nrg_ind_ren": {
        defaultChartType: "line",
        availableChartTypes: ["line", "bar"],
        dimensions: {
            x: "time",
            y: "values",
            groupBy: "nrg_bal"
        },
        options: {
            line: {
                title: "Renewable Energy Share",
                xAxisLabel: "Year",
                yAxisLabel: "Percentage",
                showMarkers: true,
                includeTarget: true,
                targetValue: 32 // 2030 target
            },
            bar: {
                title: "Renewable Energy Share by Sector",
                xAxisLabel: "Year",
                yAxisLabel: "Percentage",
                showTarget: true
            }
        },
        colorScheme: {
            "REN": "#2ecc71", // Total renewables
            "REN_TRA": "#3498db", // Transport
            "REN_ELC": "#e67e22", // Electricity
            "REN_HEAT_CL": "#e74c3c", // Heating and cooling
            "TARGET": "#95a5a6" // Target line
        }
    },

    "nrg_ind_eff": {
        defaultChartType: "line",
        availableChartTypes: ["line", "bar"],
        dimensions: {
            x: "time",
            y: "values",
            groupBy: "nrg_bal"
        },
        options: {
            line: {
                title: "Energy Efficiency Progress",
                xAxisLabel: "Year",
                yAxisLabel: "Million tonnes of oil equivalent",
                showMarkers: true,
                includeTarget: true
            },
            bar: {
                title: "Energy Consumption by Type",
                xAxisLabel: "Year",
                yAxisLabel: "Million tonnes of oil equivalent",
                showTarget: true
            }
        },
        colorScheme: {
            "PEC_EED": "#3498db", // Primary energy consumption
            "FEC_EED": "#2ecc71", // Final energy consumption
            "PEC2020-2030": "#95a5a6", // Primary target
            "FEC2020-2030": "#7f8c8d", // Final target
            "PEC_DT2030": "#e74c3c", // Distance to primary target
            "FEC_DT2030": "#c0392b"  // Distance to final target
        }
    }
};

// Export the config as default as well
export default visualizationConfig;