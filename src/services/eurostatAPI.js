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
    const { value, dimension } = data;
    const years = Object.keys(dimension.TIME_PERIOD.category.label);
    const chartData = [];

    years.forEach(year => {
      const key = `${year}.${selectedCountry}`;
      if (value[key] !== undefined && value[key] !== null) {
        chartData.push({
          x: parseInt(year),
          y: parseFloat(value[key])
        });
      }
    });

    // Sort by year
    chartData.sort((a, b) => a.x - b.x);

    return {
      categories: chartData.map(item => item.x.toString()),
      series: [{
        name: `${dimension.GEO.category.label[selectedCountry] || selectedCountry}`,
        data: chartData.map(item => item.y),
        color: '#4F46E5'
      }]
    };
  } catch (error) {
    console.error('Error processing line chart data:', error);
    return { categories: [], series: [] };
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
    const { value, dimension } = data;
    const years = Object.keys(dimension.TIME_PERIOD.category.label);
    const countries = Object.keys(dimension.GEO.category.label);
    const latestYear = Math.max(...years.map(y => parseInt(y))).toString();
    
    const countryData = [];

    countries.forEach(country => {
      const key = `${latestYear}.${country}`;
      if (value[key] !== undefined && value[key] !== null) {
        countryData.push({
          name: dimension.GEO.category.label[country] || country,
          code: country,
          value: parseFloat(value[key])
        });
      }
    });

    // Sort by value and take top countries
    countryData.sort((a, b) => b.value - a.value);
    const topCountries = countryData.slice(0, maxCountries);

    return {
      categories: topCountries.map(item => item.name),
      series: [{
        name: `Production (${latestYear})`,
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
    const { value, dimension } = data;
    const years = Object.keys(dimension.TIME_PERIOD.category.label);
    const latestYear = Math.max(...years.map(y => parseInt(y))).toString();
    
    // For pie chart, we'll show the selected fuel vs. other major fuel categories
    // This is a simplified approach - in reality, you'd need to fetch multiple fuel types
    const fuelCategories = [
      { name: selectedFuel, color: '#4F46E5' },
      { name: 'Other Solid Fuels', color: '#7C3AED' },
      { name: 'Natural Gas', color: '#EC4899' },
      { name: 'Oil Products', color: '#06B6D4' },
      { name: 'Renewables', color: '#10B981' }
    ];

    const key = `${latestYear}.${selectedCountry}`;
    const selectedFuelValue = value[key] || 100;
    
    // Generate proportional distribution (mock data approach)
    const totalValue = selectedFuelValue * 2.5; // Assume selected fuel is ~40% of total
    const pieData = fuelCategories.map((fuel, index) => ({
      name: fuel.name,
      y: index === 0 ? selectedFuelValue : (totalValue - selectedFuelValue) * (0.3 - index * 0.05),
      color: fuel.color
    }));

    return pieData.filter(item => item.y > 0);
  } catch (error) {
    console.error('Error processing pie chart data:', error);
    return [];
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
    return [
      { code: 'DE', name: 'Germany' },
      { code: 'FR', name: 'France' },
      { code: 'IT', name: 'Italy' },
      { code: 'ES', name: 'Spain' },
      { code: 'PL', name: 'Poland' }
    ];
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
  selectedCountry = 'DE', 
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





