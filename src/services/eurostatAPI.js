/**
 * Eurostat API Service
 * Handles data fetching and chart data preparation for energy statistics
 */

import axios from 'axios';

// Eurostat API configuration
const EUROSTAT_BASE_URL = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';
const API_TIMEOUT = 30000; // 30 seconds timeout

// Create axios instance with default configuration
const eurostatAPI = axios.create({
  timeout: API_TIMEOUT,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

/**
 * Fetch data from Eurostat API
 * @param {Object} params - API parameters
 * @param {string} params.dataset - Dataset identifier (e.g., 'nrg_ind_id')
 * @param {string} params.indicator_type - Indicator type field name (e.g., 'INDIC_NRG')
 * @param {string} params.fuelCode - Fuel code (e.g., 'C0000X0350-0370')
 * @returns {Promise<Object>} API response data
 */
export const fetchEurostatData = async ({ dataset, indicator_type, fuelCode }) => {
  try {
    const url = `${EUROSTAT_BASE_URL}/${dataset}`;
    const params = {
      format: 'JSON',
      [indicator_type]: fuelCode,
      lang: 'en'
    };

    console.log('🔍 Fetching Eurostat data:', { url, params });
      const response = await eurostatAPI.get(url, { params });
    
    if (response.data && response.data.value) {
      console.log('✅ Data fetched successfully');
      console.log('📊 API Response structure:', {
        hasValue: !!response.data.value,
        hasDimension: !!response.data.dimension,
        dimensionKeys: response.data.dimension ? Object.keys(response.data.dimension) : 'none',
        valueLength: response.data.value ? Object.keys(response.data.value).length : 0
      });
      return response.data;
    } else {
      throw new Error('No data found in response');
    }
  } catch (error) {
    console.error('❌ Error fetching Eurostat data:', error.message);

  }
};



/**
 * Process API data for line chart (country over time)
 * @param {Object} data - Eurostat API response
 * @param {string} selectedCountry - Country code (e.g., 'DE')
 * @returns {Object} Chart data for line chart
 */
export const processLineChartData = (data, selectedCountry) => {
  try {
    console.log('📈 Processing line chart data for country:', selectedCountry);
    
    if (!data?.value || !data?.dimension) {
      throw new Error('Invalid data structure for line chart');
    }

    const { value, dimension, size } = data;
    
    const geoIndex = dimension.geo.category.index;
    const timeIndex = dimension.time.category.index;
    const geoLabels = dimension.geo.category.label;
    const timeLabels = dimension.time.category.label;
    
    // Check if selected country exists in the data
    if (!geoIndex[selectedCountry]) {
      throw new Error(`Country ${selectedCountry} not found in data`);
    }
    
    const selectedGeoIdx = geoIndex[selectedCountry];
    const timeSize = size[4]; // time dimension size
    const chartData = [];
    
    // Get all time periods for the selected country
    Object.keys(timeIndex).forEach(timeKey => {
      const timeIdx = timeIndex[timeKey];
      const valueIndex = selectedGeoIdx * timeSize + timeIdx;
      const val = value[valueIndex];
      
      if (val !== null && val !== undefined && !isNaN(val)) {
        chartData.push({
          x: timeKey,
          y: parseFloat(val)
        });
      }
    });
    
    // Sort by time period
    chartData.sort((a, b) => a.x.localeCompare(b.x));
    
    if (chartData.length === 0) {
      throw new Error(`No data available for country: ${selectedCountry}`);
    }

    console.log('✅ Line chart data processed:', chartData.length, 'points');
    
    return {
      categories: chartData.map(item => timeLabels[item.x] || item.x),
      series: [{
        name: geoLabels[selectedCountry] || selectedCountry,
        data: chartData.map(item => item.y),
        color: '#4F46E5'
      }]
    };
  } catch (error) {
    console.error('Error processing line chart data:', error);
    throw error;
  }
};

/**
 * Process API data for bar chart (countries for latest year)
 * @param {Object} data - Eurostat API response
 * @param {number} maxCountries - Maximum number of countries to show
 * @returns {Object} Chart data for bar chart
 */
export const processBarChartData = (data, maxCountries = 10) => {
  try {
    console.log('📊 Processing bar chart data');
    
    if (!data?.value || !data?.dimension) {
      throw new Error('Invalid data structure for bar chart');
    }

    const { value, dimension, size } = data;
    
    const geoIndex = dimension.geo.category.index;
    const timeIndex = dimension.time.category.index;
    const geoLabels = dimension.geo.category.label;
    const timeLabels = dimension.time.category.label;
    
    // Get the latest time period
    const timeKeys = Object.keys(timeIndex);
    const latestTimeKey = timeKeys[timeKeys.length - 1];
    const latestTimeIdx = timeIndex[latestTimeKey];
    
    console.log('📅 Using latest time period for bar chart:', latestTimeKey);
    
    const timeSize = size[4]; // time dimension size
    const countryData = [];

    // Get data for all countries for the latest time period
    Object.keys(geoIndex).forEach(geoCode => {
      const geoIdx = geoIndex[geoCode];
      const valueIndex = geoIdx * timeSize + latestTimeIdx;
      const val = value[valueIndex];
      
      if (val !== null && val !== undefined && !isNaN(val) && val > 0) {
        countryData.push({
          name: geoLabels[geoCode] || geoCode,
          code: geoCode,
          value: parseFloat(val)
        });
      }
    });

    // Sort by value and take top countries
    countryData.sort((a, b) => b.value - a.value);
    const topCountries = countryData.slice(0, maxCountries);

    console.log('✅ Bar chart data processed:', topCountries.length, 'countries');

    return {
      categories: topCountries.map(item => item.name),
      series: [{
        name: `${timeLabels[latestTimeKey] || latestTimeKey}`,
        data: topCountries.map(item => item.value),
        color: '#4F46E5'
      }]
    };
  } catch (error) {
    console.error('Error processing bar chart data:', error);
    return { categories: [], series: [] };
  }
};

/**
 * Process API data for pie chart (fuel distribution for selected country)
 * @param {Object} data - Eurostat API response
 * @param {string} selectedCountry - Country code
 * @param {string} selectedFuel - Current fuel being viewed
 * @returns {Array} Chart data for pie chart
 */
export const processPieChartData = (data, selectedCountry, selectedFuel) => {
  try {
    console.log('🥧 Processing pie chart data:', { selectedCountry, selectedFuel });
    console.log('📊 Raw data structure:', data);

    if (!data?.value || !data?.dimension) {
      throw new Error('Invalid data structure for pie chart');
    }    const { value, dimension, size } = data;
    
    // Get the GEO dimension (countries) 
    if (!dimension.geo?.category?.label) {
      throw new Error('No geographic data available for pie chart');
    }

    const geoLabels = dimension.geo.category.label;
    const geoIndex = dimension.geo.category.index;
    const timeIndex = dimension.time.category.index;
    
    // Create pie chart data showing distribution across countries
    const pieData = [];
    
    // Get the latest time period
    const timeKeys = Object.keys(timeIndex);
    const latestTimeKey = timeKeys[timeKeys.length - 1];
    const latestTimeIdx = timeIndex[latestTimeKey];
    
    console.log('📅 Using latest time period:', latestTimeKey, 'at index:', latestTimeIdx);
    console.log('📏 Data dimensions size:', size);
    
    // Collect data for each country for the latest time period
    Object.keys(geoIndex).forEach((geoCode, idx) => {
      const geoIdx = geoIndex[geoCode];
      
      // Calculate the value index: geoIdx * timeSize + latestTimeIdx
      const timeSize = size[4]; // time dimension size
      const valueIndex = geoIdx * timeSize + latestTimeIdx;
      
      const val = value[valueIndex];
      
      if (val !== null && val !== undefined && !isNaN(val) && val > 0) {
        pieData.push({
          name: geoLabels[geoCode] || geoCode,
          y: parseFloat(val),
          color: ['#4F46E5', '#7C3AED', '#EC4899', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'][idx % 7]
        });
      }
    });

    // Sort by value and take top 8 for better visualization
    pieData.sort((a, b) => b.y - a.y);
    const topData = pieData.slice(0, 8);
    
    console.log('✅ Pie chart data processed:', topData);
    return topData;
  } catch (error) {
    console.error('Error processing pie chart data:', error);
    throw error;
  }
};

/**
 * Get available countries from API data
 * @param {Object} data - Eurostat API response
 * @returns {Array} List of available countries
 */
export const getAvailableCountries = (data) => {
  try {
    const { dimension } = data;
    const countries = dimension.GEO.category.label;
    
    return Object.entries(countries).map(([code, name]) => ({
      code,
      name
    }));
  } catch (error) {
    console.error('Error getting available countries:', error);
  }
};

/**
 * Main function to fetch and process chart data
 * @param {Object} params - Chart data parameters
 * @param {string} params.dataset - Dataset identifier
 * @param {string} params.indicator_type - Indicator type
 * @param {string} params.fuelCode - Fuel code
 * @param {string} params.chartType - Chart type ('line', 'bar', 'pie')
 * @param {string} params.selectedCountry - Selected country code
 * @param {string} params.selectedFuel - Selected fuel name
 * @returns {Promise<Object>} Processed chart data
 */
export const getChartData = async ({ 
  dataset, 
  indicator_type, 
  fuelCode, 
  chartType, 
  selectedCountry = 'EU27_2020', 
  selectedFuel = 'Solid fossil fuels' 
}) => {
  try {
    console.log('📊 Preparing chart data:', { chartType, selectedCountry, fuelCode });
    
    const data = await fetchEurostatData({ dataset, indicator_type, fuelCode });
    
    switch (chartType) {
      case 'line':
        return processLineChartData(data, selectedCountry);
      case 'bar':
        return processBarChartData(data);
      case 'pie':
        return processPieChartData(data, selectedCountry, selectedFuel);
      case 'stacked':
        return processStackedChartData(data);
      default:
        throw new Error(`Unsupported chart type: ${chartType}`);
    }
  } catch (error) {
    console.error('❌ Error getting chart data:', error);
    throw error; // Re-throw the error instead of returning fallback data
  }
};



/**
 * Process data for stacked bar chart
 * @param {Object} data - Raw Eurostat data
 * @param {number} maxCountries - Maximum number of countries to show
 * @returns {Object} Processed stacked bar chart data
 */
export const processStackedChartData = (data, maxCountries = 8) => {
  try {
    if (!data?.value || !data?.dimension) {
      throw new Error('Invalid data structure for stacked chart');
    }

    // Stacked charts require multi-fuel data which is not available from single fuel queries
    throw new Error('Stacked charts require multi-fuel dataset which is not available from single fuel queries');
  } catch (error) {
    console.error('Error processing stacked chart data:', error);
    throw error;
  }
};





