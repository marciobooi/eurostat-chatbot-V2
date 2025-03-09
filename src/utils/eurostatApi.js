import axios from 'axios';
import { energyDefinitionsEn } from '../dictionaries/energyDefinitionsEn';
import { datasetRuller } from '../dictionaries/datasetDictionary';

const BASE_URL = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';

const DEFAULT_PARAMS = {
  geo: 'EU27_2020',
  lang: 'en',
  lastTimePeriod: '1'
};

const transformPieChartData = (data, nrg_bal) => {
  if (!data?.value || !data?.dimension?.nrg_bal?.category?.index) {
    console.error('Invalid data structure received:', data);
    return [];
  }

  const values = data.value;
  const indexes = data.dimension.nrg_bal.category.index;
  const labels = data.dimension.nrg_bal.category.label || {};
  
  return nrg_bal.map(bal => ({
    name: labels[bal] || bal,
    value: values[indexes[bal]] || 0,
    code: bal
  }));
};

const transformBarChartData = (data, nrg_bal) => {
  if (!data?.value || !data?.dimension?.nrg_bal?.category?.index) {
    console.error('Invalid data structure received:', data);
    return [];
  }

  const values = data.value;
  const indexes = data.dimension.nrg_bal.category.index;
  const labels = data.dimension.nrg_bal.category.label || {};
  
  return nrg_bal.map(bal => ({
    name: labels[bal] || bal,
    value: values[indexes[bal]] || 0,
    code: bal
  }));
};

const transformLineChartData = (data, nrg_bal) => {
  if (!data?.value || !data?.dimension?.nrg_bal?.category?.index) {
    console.error('Invalid data structure received:', data);
    return [];
  }

  const values = data.value;
  const indexes = data.dimension.nrg_bal.category.index;
  const labels = data.dimension.nrg_bal.category.label || {};
  
  return nrg_bal.map(bal => ({
    name: labels[bal] || bal,
    value: values[indexes[bal]] || 0,
    code: bal
  }));
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
  const searchParams = new URLSearchParams({
    format: 'JSON',
    ...DEFAULT_PARAMS
  });

  // Add parameters that exist in fuel definition and are required by dataset
  datasetConfig.dimensions.forEach(dim => {
    switch(dim) {
      case 'unit':
        if (unit) searchParams.append('unit', unit);
        break;
      case 'siec':
        if (siec) searchParams.append('siec', siec);
        break;
      case 'nrg_bal':
        // Add each nrg_bal value as a separate parameter
        if (nrg_bal) {
          nrg_bal.forEach(bal => {
            searchParams.append('nrg_bal', bal);
          });
        }
        break;
    }
  });

  const url = `${BASE_URL}/${dataset}?${searchParams}`;
  console.log('Fetching visualization data from:', url);

  const response = await axios.get(url);
  console.log('API Response:', response.data);
  
  if (!response.data?.dimension?.nrg_bal?.category?.index) {
    throw new Error('Invalid response structure from Eurostat API');
  }

  // Transform data based on chart type
  switch (chartType.toLowerCase()) {
    case 'pie':
      return transformPieChartData(response.data, nrg_bal);
    case 'bar':
      return transformBarChartData(response.data, nrg_bal);
    case 'line':
      return transformLineChartData(response.data, nrg_bal);
    default:
      throw new Error(`Unsupported chart type: ${chartType}`);
  }
};