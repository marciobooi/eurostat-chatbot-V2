import axios from 'axios';
import { energyDictionary } from './energyDictionary';
import { CONFIG } from '../i18n';
import { datasetRuller } from '../dictionaries/datasetDictionary';
import { transformPieChartData, transformLineChartData, transformBarChartData } from './chartDataTransformers';

const BASE_URL = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';

const DEFAULT_PARAMS = {
  geo: 'EU27_2020',
  lang: CONFIG.DEFAULT_LANGUAGE
};

export const fetchEurostatData = async (fuelType, queryType, chartType = null, language = CONFIG.DEFAULT_LANGUAGE) => {
  try {
    // Use language-specific dictionary with fallback
    const dictionary = energyDictionary[language] || energyDictionary[CONFIG.DEFAULT_LANGUAGE];
    
    // Find fuel definition by looking up in both the key and fuelCode
    const fuelDefinition = Object.values(dictionary).find(def => 
      def.fuelCode === fuelType || 
      def.title?.toLowerCase() === fuelType?.toLowerCase() ||
      def.fuelCode?.toLowerCase() === fuelType?.toLowerCase()
    );

    if (!fuelDefinition) {
      throw new Error(`Fuel type ${fuelType} not found in energy definitions`);
    }

    // Update default params with requested language
    const params = {
      ...DEFAULT_PARAMS,
      lang: language
    };

    // Handle different query types
    switch (queryType) {
      case 'visualization':
        return await fetchVisualizationData(fuelDefinition, chartType, params);
      case 'trends':
        throw new Error('Trend analysis not yet implemented');
      case 'comparison':
        throw new Error('Comparison queries not yet implemented');
      default:
        throw new Error(`Unknown query type: ${queryType}`);
    }
  } catch (error) {
    console.error('Error fetching Eurostat data:', error);
    throw error;
  }
};

const fetchVisualizationData = async (fuelDefinition, chartType, defaultParams) => {
  if (!chartType) {
    throw new Error('Chart type is required for visualization queries');
  }

  const { dataset, siec, unit, nrg_bal } = fuelDefinition;
  
  // Get required dimensions for this dataset
  const datasetConfig = datasetRuller[dataset];
  if (!datasetConfig) {
    throw new Error(`Dataset ${dataset} not found in dataset dictionary`);
  }

  // Create URLSearchParams object with format and default params
  const params = new URLSearchParams({
    format: 'JSON',
    ...defaultParams
  });

  // Add parameters based on chart type and dataset dimensions
  datasetConfig.dimensions.forEach(dim => {
    switch(dim) {
      case 'unit':
        if (unit) params.append('unit', unit);
        break;
      case 'siec':
        if (siec) params.append('siec', siec);
        break;
      case 'nrg_bal':
        if (chartType.toLowerCase() === 'pie' && nrg_bal) {
          // For pie charts, use energy balances
          nrg_bal.forEach(bal => {
            params.append('nrg_bal', bal);
          });
        }
        break;
    }
  });

  // For line and bar charts, don't set time parameter to get all available years
  if (chartType.toLowerCase() !== 'pie') {
    // Remove lastTimePeriod if it was added by default params
    params.delete('lastTimePeriod');
  } else {
    // For pie charts, we only want the latest period
    params.append('lastTimePeriod', '1');
  }

  const url = `${BASE_URL}/${dataset}?${params}`;
  console.log('Fetching visualization data from:', url);

  const response = await axios.get(url);
  console.log('API Response:', response.data);

  // Transform data based on chart type
  switch (chartType.toLowerCase()) {
    case 'pie':
      return { data: transformPieChartData(response.data, nrg_bal || []) };
    case 'bar':
      return { data: transformBarChartData(response.data) };
    case 'line':
      return { data: transformLineChartData(response.data) };
    default:
      throw new Error(`Unsupported chart type: ${chartType}`);
  }
};