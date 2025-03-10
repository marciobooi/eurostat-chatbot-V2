import axios from 'axios';
import { energyDefinitionsEn } from '../dictionaries/energyDefinitionsEn';
import { datasetRuller } from '../dictionaries/datasetDictionary';
import { transformPieChartData, transformLineChartData, transformBarChartData } from './chartDataTransformers';

const BASE_URL = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';

const DEFAULT_PARAMS = {
  geo: 'EU27_2020',
  lang: 'en'
};

export const fetchEurostatData = async (fuelType, queryType, chartType = null) => {
  try {
    // Get fuel definition from the dictionary
    const fuelDefinition = energyDefinitionsEn[fuelType.toLowerCase()];
    if (!fuelDefinition) {
      throw new Error(`Fuel type ${fuelType} not found in energy definitions`);
    }

    // Handle different query types
    switch (queryType) {
      case 'visualization':
        return await fetchVisualizationData(fuelDefinition, chartType);
      // Prepare for future query types
      case 'trends':
        // TODO: Implement trend analysis queries
        throw new Error('Trend analysis not yet implemented');
      case 'comparison':
        // TODO: Implement comparison queries
        throw new Error('Comparison queries not yet implemented');
      default:
        throw new Error(`Unknown query type: ${queryType}`);
    }
  } catch (error) {
    console.error('Error fetching Eurostat data:', error);
    throw error;
  }
};

const fetchVisualizationData = async (fuelDefinition, chartType) => {
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
    ...DEFAULT_PARAMS
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
      return transformPieChartData(response.data, nrg_bal);
    case 'bar':
      return transformBarChartData(response.data);
    case 'line':
      return transformLineChartData(response.data);
    default:
      throw new Error(`Unsupported chart type: ${chartType}`);
  }
};