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
 * @param {string} params.dataset - Dataset identifier (e.g., 'nrg_bal_c')
 * @param {string} params.format - Response format (default: 'JSON')
 * @param {string} params.time - Time period (e.g., '2023')
 * @param {string} params.geo - Geographic area (e.g., 'EU27_2020', 'PT')
 * @param {string} params.unit - Unit of measurement (e.g., 'KTOE')
 * @param {string|Array} params.nrg_bal - Energy balance (e.g., 'TOTAL', 'NRGSUP') or array of codes
 * @param {string} params.siec - Energy product code (e.g., 'C0000X0350-0370')
 * @param {string} params.indic_nrg - Indicator code (for some datasets)
 * @param {string} params.lang - Language (default: 'en')
 * @returns {Promise<Object>} API response data
 */
export const fetchEurostatData = async (params) => {
  try {
    const { dataset, nrg_bal, ...otherParams } = params;
    const url = `${EUROSTAT_BASE_URL}/${dataset}`;
    
    // Filter out undefined parameters
    const cleanParams = Object.fromEntries(
      Object.entries(otherParams).filter(([key, value]) => value !== undefined)
    );

    // Handle multiple nrg_bal values - Eurostat expects repeated parameters
    if (Array.isArray(nrg_bal)) {
      // For multiple nrg_bal codes, we need to construct the URL manually
      // because axios doesn't handle repeated parameter names correctly
      const baseUrl = `${url}?${new URLSearchParams(cleanParams).toString()}`;
      const nrgBalParams = nrg_bal.map(code => `nrg_bal=${encodeURIComponent(code)}`).join('&');
      const finalUrl = `${baseUrl}&${nrgBalParams}`;
      
      console.log('🔍 Fetching Eurostat data with multiple nrg_bal:', { url: finalUrl, nrg_bal });
      const response = await eurostatAPI.get(finalUrl);
      
      if (response.data && response.data.value) {
        console.log('✅ Data fetched successfully with multiple nrg_bal');
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
    } else {
      // Single nrg_bal value - use normal axios params
      if (nrg_bal !== undefined) {
        cleanParams.nrg_bal = nrg_bal;
      }
      
      console.log('🔍 Fetching Eurostat data:', { url, params: cleanParams });
      const response = await eurostatAPI.get(url, { params: cleanParams });
    
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
    }
  } catch (error) {
    console.error('❌ Error fetching Eurostat data:', error.message);
    throw error; // Re-throw the error so it can be handled by the calling function
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
    }    const { value, dimension, size } = data;
    
    // Debug the data structure
    console.log('📈 Data dimensions:', Object.keys(dimension));
    console.log('📏 Size array:', size);
    console.log('💾 Value object keys:', Object.keys(value));
    console.log('💾 Value object length:', Object.keys(value).length);
    
    const geoIndex = dimension.geo.category.index;
    const timeIndex = dimension.time.category.index;
    const geoLabels = dimension.geo.category.label;
    const timeLabels = dimension.time.category.label;
      console.log('🌍 Available geo codes:', Object.keys(geoIndex));
    console.log('� GeoIndex object:', geoIndex);
    console.log('�📅 Available time periods:', Object.keys(timeIndex));
      // Check if selected country exists in the data
    if (!(selectedCountry in geoIndex)) {
      console.log('❌ Country not found. Looking for:', selectedCountry);
      console.log('📋 Available countries in geoIndex:', Object.keys(geoIndex));
      throw new Error(`Country ${selectedCountry} not found in data`);
    }
    
    const selectedGeoIdx = geoIndex[selectedCountry];
    console.log('🎯 Selected country index:', selectedGeoIdx);
    
    // If there are no values, return empty data
    if (Object.keys(value).length === 0) {
      console.log('⚠️ No data values found in response');
      throw new Error(`No data available for country: ${selectedCountry}`);    }
    
    const timeSize = size[size.length - 1]; // time dimension is usually last
    const chartData = [];
    
    // Get all time periods for the selected country
    Object.keys(timeIndex).forEach(timeKey => {
      const timeIdx = timeIndex[timeKey];
      const valueIndex = selectedGeoIdx * timeSize + timeIdx;
      
      console.log(`🔍 Checking ${timeKey} (idx: ${timeIdx}): valueIndex = ${valueIndex}`);
      
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
    
    const timeSize = size[size.length - 1]; // time dimension is usually last
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
    }

    const { value, dimension, size } = data;
    
    // Debug the data structure
    console.log('📈 Data dimensions:', Object.keys(dimension));
    console.log('📏 Size array:', size);
    console.log('💾 Value object keys:', Object.keys(value));
    console.log('💾 Value object length:', Object.keys(value).length);
    
    // Get the GEO dimension (countries) 
    if (!dimension.geo?.category?.label) {
      throw new Error('No geographic data available for pie chart');
    }

    const geoLabels = dimension.geo.category.label;
    const geoIndex = dimension.geo.category.index;
    const timeIndex = dimension.time.category.index;
    
    console.log('🌍 Available geo codes:', Object.keys(geoIndex));
    console.log('📅 Available time periods:', Object.keys(timeIndex));
    
    // Create pie chart data showing distribution across countries
    const pieData = [];
    
    // Get the latest time period
    const timeKeys = Object.keys(timeIndex);
    const latestTimeKey = timeKeys[timeKeys.length - 1];
    const latestTimeIdx = timeIndex[latestTimeKey];
    
    console.log('📅 Using latest time period:', latestTimeKey, 'at index:', latestTimeIdx);
    console.log('📏 Data dimensions size:', size);
    
    // If there are no values, return empty data
    if (Object.keys(value).length === 0) {
      console.log('⚠️ No data values found in response');
      return [];
    }
    
    // Collect data for each country for the latest time period
    Object.keys(geoIndex).forEach((geoCode, idx) => {
      const geoIdx = geoIndex[geoCode];
      
      // Calculate the value index: geoIdx * timeSize + latestTimeIdx
      const timeSize = size[size.length - 1]; // time dimension is usually last
      const valueIndex = geoIdx * timeSize + latestTimeIdx;
      
      console.log(`🔍 Checking ${geoCode} (idx: ${geoIdx}): valueIndex = ${valueIndex}`);
      
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
 * Build chart-specific API parameters based on chart type
 * @param {Object} params - Chart parameters
 * @param {string} params.dataset - Dataset identifier
 * @param {string} params.fuelCode - Fuel code (siec parameter)
 * @param {string} params.chartType - Chart type
 * @param {string} params.selectedCountry - Selected country code
 * @returns {Object} Eurostat API parameters
 */
const buildChartAPIParams = ({ dataset, fuelCode, chartType, selectedCountry, nrgBalCodes }) => {
  const baseParams = {
    dataset,
    format: 'JSON',
    unit: 'KTOE',
    siec: fuelCode,
    lang: 'en'
  };

  // Different parameter sets based on chart type
  switch (chartType) {
    case 'line':
      // Line chart: one country, all available years
      return {
        ...baseParams,
        nrg_bal: 'NRGSUP',
        geo: selectedCountry
        // No time parameter = get all available years
      };
    
    case 'bar':
      // Bar chart: all countries, latest year
      return {
        ...baseParams,
        nrg_bal: 'NRGSUP',
        time: '2023'
        // No geo parameter = get all available countries
      };
    
    case 'pie':
      // Pie chart: all countries, latest year
      return {
        ...baseParams,        nrg_bal: 'NRGSUP',
        time: '2023'
        // No geo parameter = get all available countries
      };
      
    case 'stacked':
      // Stacked chart: all countries, multiple energy balance types, latest year
      return {
        ...baseParams,
        nrg_bal: nrgBalCodes || ['PPRD', 'IMP', 'EXP'],
        time: '2023'
        // No geo parameter = get all available countries
      };
    
    default:
      return {
        ...baseParams,
        nrg_bal: 'NRGSUP'
      };
  }
};

/**
 * Main function to fetch and process chart data
 * @param {Object} params - Chart data parameters
 * @param {string} params.dataset - Dataset identifier
 * @param {string} params.indicator_type - Indicator type (legacy parameter)
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
  selectedFuel = 'Solid fossil fuels',
  nrgBalCodes = null
}) => {
  try {
    console.log('📊 Preparing chart data:', { chartType, selectedCountry, fuelCode, nrgBalCodes });
    
    // Build proper API parameters for charts
    const apiParams = buildChartAPIParams({ 
      dataset, 
      fuelCode, 
      chartType, 
      selectedCountry,
      nrgBalCodes
    });
    
    console.log('🔧 Using chart API parameters:', apiParams);
    
    const data = await fetchEurostatData(apiParams);
    
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
    console.log('📚 Processing stacked chart data');
    
    if (!data?.value || !data?.dimension) {
      throw new Error('Invalid data structure for stacked chart');
    }

    const { value, dimension, size } = data;
    
    // Debug the data structure
    console.log('📈 Stacked Data dimensions:', Object.keys(dimension));
    console.log('📏 Stacked Size array:', size);
    console.log('💾 Stacked Value object length:', Object.keys(value).length);
    
    const geoIndex = dimension.geo.category.index;
    const nrgBalIndex = dimension.nrg_bal.category.index;
    const timeIndex = dimension.time.category.index;
    const geoLabels = dimension.geo.category.label;
    const nrgBalLabels = dimension.nrg_bal.category.label;
    const timeLabels = dimension.time.category.label;
    
    console.log('🌍 Available geo codes:', Object.keys(geoIndex));
    console.log('⚡ Available energy balance types:', Object.keys(nrgBalIndex));
    console.log('📅 Available time periods:', Object.keys(timeIndex));
    
    // Get the latest time period
    const timeKeys = Object.keys(timeIndex);
    const latestTimeKey = timeKeys[timeKeys.length - 1];
    const latestTimeIdx = timeIndex[latestTimeKey];
    
    console.log('📅 Using latest time period for stacked chart:', latestTimeKey);
    
    // Calculate dimension sizes
    const timeSize = size[size.length - 1]; // time dimension is usually last
    const nrgBalSize = size[size.length - 3]; // nrg_bal dimension (assuming order: freq, nrg_bal, siec, unit, geo, time)
    const geoSize = size[size.length - 2]; // geo dimension
    
    // Collect data for all countries and energy balance types
    const countryData = [];
    
    Object.keys(geoIndex).forEach(geoCode => {
      const geoIdx = geoIndex[geoCode];
      const countryValues = {};
      let totalValue = 0;
      
      // Get data for each energy balance type for this country
      Object.keys(nrgBalIndex).forEach(nrgBalCode => {
        const nrgBalIdx = nrgBalIndex[nrgBalCode];
        
        // Calculate the value index for this combination
        const valueIndex = nrgBalIdx * geoSize * timeSize + geoIdx * timeSize + latestTimeIdx;
        
        const val = value[valueIndex];
        
        if (val !== null && val !== undefined && !isNaN(val) && val > 0) {
          countryValues[nrgBalCode] = parseFloat(val);
          totalValue += parseFloat(val);
        } else {
          countryValues[nrgBalCode] = 0;
        }
      });
      
      if (totalValue > 0) {
        countryData.push({
          name: geoLabels[geoCode] || geoCode,
          code: geoCode,
          values: countryValues,
          total: totalValue
        });
      }
    });

    // Sort by total value and take top countries
    countryData.sort((a, b) => b.total - a.total);
    const topCountries = countryData.slice(0, maxCountries);

    // Build series data for each energy balance type
    const series = Object.keys(nrgBalIndex).map((nrgBalCode, idx) => ({
      name: nrgBalLabels[nrgBalCode] || nrgBalCode,
      data: topCountries.map(country => country.values[nrgBalCode] || 0),
      color: ['#4F46E5', '#7C3AED', '#EC4899', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'][idx % 7]
    }));

    console.log('✅ Stacked chart data processed:', topCountries.length, 'countries');

    return {
      categories: topCountries.map(item => item.name),
      series: series
    };
  } catch (error) {
    console.error('Error processing stacked chart data:', error);
    throw error;
  }
};





