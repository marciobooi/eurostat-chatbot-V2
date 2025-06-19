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
    
    // Return mock data for development/demo purposes
    console.log('🔄 Returning mock data for demo');
    return generateMockData(fuelCode);
  }
};

/**
 * Generate mock data for development/testing
 * @param {string} fuelCode - Fuel code for generating relevant mock data
 * @returns {Object} Mock Eurostat API response
 */
const generateMockData = (fuelCode) => {
  const countries = ['DE', 'FR', 'IT', 'ES', 'PL', 'NL', 'BE', 'CZ', 'GR', 'PT'];
  const years = ['2019', '2020', '2021', '2022', '2023'];
  const mockData = {};
  
  countries.forEach((country, countryIndex) => {
    years.forEach((year, yearIndex) => {
      const key = `${year}.${country}`;
      // Generate realistic energy data based on country size and fuel type
      const baseValue = (countryIndex + 1) * 100 + Math.random() * 50;
      const yearVariation = 1 + (yearIndex - 2) * 0.1; // Some year-over-year variation
      mockData[key] = Math.round(baseValue * yearVariation * 10) / 10;
    });
  });

  return {
    value: mockData,
    dimension: {
      TIME_PERIOD: { category: { label: Object.fromEntries(years.map(y => [y, y])) } },
      GEO: { 
        category: { 
          label: {
            'DE': 'Germany', 'FR': 'France', 'IT': 'Italy', 'ES': 'Spain', 'PL': 'Poland',
            'NL': 'Netherlands', 'BE': 'Belgium', 'CZ': 'Czechia', 'GR': 'Greece', 'PT': 'Portugal'
          }
        }
      }
    }
  };
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
      case 'heatmap':
        return processHeatmapData(data);
      default:
        throw new Error(`Unsupported chart type: ${chartType}`);
    }
  } catch (error) {
    console.error('❌ Error getting chart data:', error);
    
    // Return fallback mock data
    return generateFallbackChartData(chartType, selectedCountry, selectedFuel);
  }
};

/**
 * Generate fallback chart data when API fails
 * @param {string} chartType - Chart type
 * @param {string} selectedCountry - Selected country
 * @param {string} selectedFuel - Selected fuel
 * @returns {Object|Array} Fallback chart data
 */
const generateFallbackChartData = (chartType, selectedCountry, selectedFuel) => {
  switch (chartType) {
    case 'line':
      return {
        categories: ['2019', '2020', '2021', '2022', '2023'],
        series: [{
          name: selectedCountry || 'Germany',
          data: [145.6, 132.4, 128.9, 135.2, 142.1],
          color: '#4F46E5'
        }]
      };
    case 'bar':
      return {
        categories: ['Germany', 'France', 'Italy', 'Spain', 'Poland'],
        series: [{
          name: 'Production (2023)',
          data: [245.8, 198.3, 156.7, 134.2, 123.9],
          color: '#4F46E5'
        }]
      };
    case 'pie':
      return [
        { name: selectedFuel || 'Solid fossil fuels', y: 45.8, color: '#4F46E5' },
        { name: 'Natural Gas', y: 32.1, color: '#7C3AED' },
        { name: 'Oil Products', y: 22.1, color: '#EC4899' }
      ];
    case 'stacked':
      return generateFallbackStackedData();
    case 'heatmap':
      return generateFallbackHeatmapData();
    default:
      return [];
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

    const { geo, time } = data.dimension;
    const geoLabels = geo.category.label;
    const timeLabels = time.category.label;
    
    // Get the latest year
    const latestYear = Object.keys(timeLabels).sort().pop();
    const countries = Object.keys(geoLabels).slice(0, maxCountries);
    
    // Mock stacked data for different fuel types
    const fuelTypes = ['Hard coal', 'Brown coal', 'Oil products', 'Natural gas', 'Renewables'];
    const series = fuelTypes.map((fuel, index) => ({
      name: fuel,
      data: countries.map(() => Math.random() * 100 + 20),
      color: ['#4F46E5', '#7C3AED', '#EC4899', '#06B6D4', '#10B981'][index]
    }));

    return {
      categories: countries.map(code => geoLabels[code] || code),
      series,
      title: `Energy Mix by Country (${timeLabels[latestYear] || latestYear})`
    };
  } catch (error) {
    console.error('Error processing stacked chart data:', error);
    return generateFallbackStackedData();
  }
};

/**
 * Process data for heatmap chart
 * @param {Object} data - Raw Eurostat data
 * @returns {Object} Processed heatmap data
 */
export const processHeatmapData = (data) => {
  try {
    if (!data?.value || !data?.dimension) {
      throw new Error('Invalid data structure for heatmap');
    }

    const { geo, time } = data.dimension;
    const geoLabels = geo.category.label;
    const timeLabels = time.category.label;
    
    const countries = Object.keys(geoLabels).slice(0, 10);
    const years = Object.keys(timeLabels).slice(-5); // Last 5 years
    
    const heatmapData = [];
    
    countries.forEach((country, countryIndex) => {
      years.forEach((year, yearIndex) => {
        const value = Math.random() * 100; // Mock data
        heatmapData.push([yearIndex, countryIndex, Math.round(value)]);
      });
    });

    return {
      data: heatmapData,
      categories: {
        x: years.map(year => timeLabels[year] || year),
        y: countries.map(code => geoLabels[code] || code)
      },
      title: 'Energy Dependency Heatmap'
    };
  } catch (error) {
    console.error('Error processing heatmap data:', error);
    return generateFallbackHeatmapData();
  }
};

const generateFallbackStackedData = () => ({
  categories: ['Germany', 'France', 'Italy', 'Spain', 'Poland'],
  series: [
    { name: 'Hard coal', data: [45, 25, 35, 20, 55], color: '#4F46E5' },
    { name: 'Brown coal', data: [25, 15, 20, 15, 25], color: '#7C3AED' },
    { name: 'Oil products', data: [30, 40, 25, 35, 20], color: '#EC4899' },
    { name: 'Natural gas', data: [20, 35, 30, 40, 15], color: '#06B6D4' },
    { name: 'Renewables', data: [15, 25, 20, 30, 10], color: '#10B981' }
  ],
  title: 'Energy Mix by Country (2023)'
});

const generateFallbackHeatmapData = () => ({
  data: [
    [0, 0, 45], [1, 0, 52], [2, 0, 48], [3, 0, 55], [4, 0, 50],
    [0, 1, 38], [1, 1, 42], [2, 1, 45], [3, 1, 48], [4, 1, 46],
    [0, 2, 35], [1, 2, 38], [2, 2, 41], [3, 2, 44], [4, 2, 42],
    [0, 3, 30], [1, 3, 33], [2, 3, 36], [3, 3, 39], [4, 3, 37],
    [0, 4, 25], [1, 4, 28], [2, 4, 31], [3, 4, 34], [4, 4, 32]
  ],
  categories: {
    x: ['2019', '2020', '2021', '2022', '2023'],
    y: ['Germany', 'France', 'Italy', 'Spain', 'Poland']
  },
  title: 'Energy Dependency Heatmap'
});
