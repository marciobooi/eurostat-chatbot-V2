import { intentPatterns } from '../../dictionaries/intentPatterns';
import { datePatterns } from '../../dictionaries/datePatterns';
import COUNTRY_MAP from '../../dictionaries/countries';
import { energyDefinitionsEn } from '../../dictionaries/energyDefinitionsEn';
import axios from 'axios';

class EurostatQueryModule {
  constructor(contextManager) {
    this.contextManager = contextManager;
    this.currentLanguage = 'en'; // Default language
    this.energyDefinitions = energyDefinitionsEn; // Use the imported definitions
    
    // Keep only the indicator patterns, rest comes from energyDefinitionsEn
    this.energyBalanceIndicators = {
      IMP: {
        patterns: ['import', 'imports', 'importing', 'imported'],
        intent: 'query_trade'
      },
      EXP: {
        patterns: ['export', 'exports', 'exporting', 'exported'],
        intent: 'query_trade'
      },
      STK_CHG: {
        patterns: ['stock', 'stocks', 'stock change', 'stock changes', 'inventory', 'reserves'],
        intent: 'query_production'
      },
      GAE: {
        patterns: ['gross available energy', 'available energy', 'energy availability', 'available'],
        intent: 'query_production'
      },
      GIC: {
        patterns: ['gross inland consumption', 'inland consumption', 'domestic consumption', 'internal consumption'],
        intent: 'query_consumption'
      },
      FC: {
        patterns: ['final consumption', 'end use', 'end-use consumption', 'final energy consumption'],
        intent: 'query_consumption'
      }
    };

    // Build fuel types dynamically from energyDefinitionsEn
    this.fuelTypes = {};
    for (const [key, def] of Object.entries(this.energyDefinitions)) {
      if (def.keywords && def.keywords.length > 0) {
        this.fuelTypes[key.replace(/\s+/g, '')] = def.keywords;
      }
    }
  }

  setLanguage(lang) {
    this.currentLanguage = lang;
  }

  async processQuery(query) {
    try {
      const energyBalanceInfo = this.extractEnergyBalanceIndicator(query);
      const intent = this.extractIntent(query, energyBalanceInfo);
      const country = this.extractCountry(query);
      const dateInfo = this.extractDateInfo(query);
      const fuelType = this.extractFuelType(query);
      
      if (intent.length === 0) {
        return null;
      }

      const dbParams = this.extractDatabaseParams(fuelType, energyBalanceInfo?.indicator);

      if (!dbParams) {
        return null;
      }
      
      const queryType = this.determineQueryType(intent, energyBalanceInfo, query);
      const eurostatData = await this.fetchEurostatData(dbParams, country, dateInfo);

      return {
        isEurostatQuery: true,
        queryInfo: {
          intent,
          country,
          dateInfo,
          queryType,
          energyBalance: energyBalanceInfo,
          dbParams
        },
        data: eurostatData
      };
    } catch (error) {
      return null;
    }
  }

  extractEnergyBalanceIndicator(query) {
    const queryLower = query.toLowerCase();
    for (const [indicator, info] of Object.entries(this.energyBalanceIndicators)) {
      if (info.patterns.some(pattern => queryLower.includes(pattern.toLowerCase()))) {
        return {
          indicator,
          type: info.intent
        };
      }
    }
    return null;
  }

  extractIntent(query, energyBalanceInfo = null) {
    const patterns = intentPatterns[this.currentLanguage];
    const matchedIntents = new Set();
    const queryLower = query.toLowerCase();

    // First check for energy balance indicators (most specific)
    for (const [indicator, info] of Object.entries(this.energyBalanceIndicators)) {
      if (info.patterns.some(pattern => queryLower.includes(pattern.toLowerCase()))) {
        matchedIntents.add(info.intent);
        break;
      }
    }

    // Check for fuel types
    let hasFuelType = false;
    for (const [fuelType, patterns] of Object.entries(this.fuelTypes)) {
      if (patterns.some(pattern => queryLower.includes(pattern.toLowerCase()))) {
        hasFuelType = true;
        break;
      }
    }

    // If we found a fuel type but no specific intent yet, check for statistics/data request patterns
    if (hasFuelType && matchedIntents.size === 0) {
      const statsPattern = /\b(?:statistics|statistical|data|figures|numbers|information|show|tell|give)\b/i;
      if (statsPattern.test(queryLower)) {
        // Default to query_production if no other intent is clear
        matchedIntents.add('query_production');
      }
    }

    // Check general intent patterns
    for (const [intent, patternList] of Object.entries(patterns)) {
      for (const pattern of patternList) {
        if (pattern.test(queryLower)) {
          matchedIntents.add(intent);
        }
      }
    }

    return Array.from(matchedIntents);
  }

  extractCountry(query) {
    const queryLower = query.toLowerCase();
    
    for (const [code, names] of Object.entries(COUNTRY_MAP)) {
      if (names.some(name => queryLower.includes(name.toLowerCase()))) {
        return code;
      }
    }

    return 'EU27_2020'; // Default to EU27 if no country specified
  }

  extractDateInfo(query) {
    const patterns = datePatterns[this.currentLanguage];
    const dateInfo = {
      type: null,
      value: null
    };

    // First check for explicit years or year ranges
    const yearPattern = /\b(19|20)\d{2}\b/g;
    const years = query.match(yearPattern);
    
    if (years && years.length > 0) {
      if (years.length === 1) {
        dateInfo.type = 'year';
        dateInfo.value = years[0];
      } else {
        dateInfo.type = 'yearRange';
        dateInfo.value = years.sort().join('-');
      }
      return dateInfo;
    }

    // Check for relative time patterns
    const relativePatterns = patterns.relative;
    for (const [timeType, pattern] of Object.entries(relativePatterns)) {
      const match = query.match(pattern);
      if (match) {
        dateInfo.type = 'relative';
        dateInfo.value = timeType;
        return dateInfo;
      }
    }

    dateInfo.type = 'relative';
    dateInfo.value = 'latest';
    return dateInfo;
  }

  determineQueryType(intents, energyBalanceInfo = null, query = '') {
    const fuelType = this.extractFuelType(query);

    // If we have an energy balance indicator, use its specific type
    if (energyBalanceInfo) {
      const dbParams = this.extractDatabaseParams(fuelType, energyBalanceInfo.indicator);
      return {
        type: energyBalanceInfo.type,
        indicator: energyBalanceInfo.indicator,
        dataset: dbParams?.dataset || 'nrg_bal',
        fuelType,
        dbParams
      };
    }

    // Get database parameters for the query context
    const dbParams = this.extractDatabaseParams(fuelType);

    // Determine query type with fuel type context
    const queryInfo = {
      dataset: dbParams?.dataset || 'nrg_bal',
      fuelType,
      dbParams
    };

    if (intents.includes('query_trade')) return { ...queryInfo, type: 'trade', indicator: 'IMP' };
    if (intents.includes('query_production')) return { ...queryInfo, type: 'production' };
    if (intents.includes('query_consumption')) return { ...queryInfo, type: 'consumption' };
    if (intents.includes('query_comparison')) return { ...queryInfo, type: 'comparison' };
    if (intents.includes('query_trend')) return { ...queryInfo, type: 'trends' };
    return { ...queryInfo, type: 'general' };
  }

  extractFuelType(query) {
    const queryLower = query.toLowerCase();
    
    // Specific fuel types to check first (ordered by specificity)
    const specificFuels = [
      'hard coal',
      'brown coal',
      'coal products',
      'anthracite',
      'coking coal',
      'other bituminous coal',
      'sub bituminous coal',
      'lignite',
      'patent fuel',
      'coke oven coke',
      'gas coke',
      'coal tar',
      'brown coal briquettes'
    ];

    // First try exact matches with specific fuels
    for (const specificFuel of specificFuels) {
      if (queryLower.includes(specificFuel)) {
        return specificFuel;
      }
    }

    // Then try exact matches with the dictionary keys
    for (const [key] of Object.entries(this.energyDefinitions)) {
      const normalizedKey = key.toLowerCase().replace(/[_\s]+/g, ' ');
      if (queryLower.includes(normalizedKey)) {
        return key;
      }
    }

    // Then try exact phrase matches from keywords
    let bestMatch = null;
    let bestMatchLength = 0;

    for (const [key, def] of Object.entries(this.energyDefinitions)) {
      if (def.keywords) {
        for (const keyword of def.keywords) {
          const keywordLower = keyword.toLowerCase();
          if (queryLower.includes(keywordLower) && keywordLower.length > bestMatchLength) {
            bestMatch = key;
            bestMatchLength = keywordLower.length;
          }
        }
      }
    }

    if (bestMatch) {
      return bestMatch;
    }

    return null;
  }

  getDefaultDatabaseParams() {
    const defaultFuel = this.energyDefinitions['solid fossil fuels'];
    if (!defaultFuel) {
      return null;
    }

    return {
      dataset: defaultFuel.dataset,
      siec: defaultFuel.siec || defaultFuel.fuelCode,
      unit: defaultFuel.unit,
      nrg_bal: defaultFuel.nrg_bal[0],
      fuelCode: defaultFuel.fuelCode || defaultFuel.siec
    };
  }

  extractDatabaseParams(fuelType, indicator) {
    try {
      if (!fuelType) {
        return this.getDefaultDatabaseParams();
      }

      let fuelDefinition = this.energyDefinitions[fuelType];
      
      if (!fuelDefinition) {
        const normalizedKey = fuelType.toLowerCase().replace(/[_\s]+/g, ' ');
        
        const exactMatch = Object.entries(this.energyDefinitions).find(
          ([key]) => key.toLowerCase() === normalizedKey
        );

        if (exactMatch) {
          fuelDefinition = exactMatch[1];
        } else {
          const keywordMatch = Object.entries(this.energyDefinitions).find(
            ([_, def]) => def.keywords && def.keywords.some(keyword =>
              keyword.toLowerCase() === normalizedKey ||
              normalizedKey.includes(keyword.toLowerCase())
            )
          );

          if (keywordMatch) {
            fuelDefinition = keywordMatch[1];
          }
        }
      }

      if (!fuelDefinition) {
        return this.getDefaultDatabaseParams();
      }

      const validIndicator = indicator && fuelDefinition.nrg_bal.includes(indicator) ?
        indicator : fuelDefinition.nrg_bal[0];

      return {
        dataset: fuelDefinition.dataset,
        siec: fuelDefinition.siec,
        unit: fuelDefinition.unit,
        nrg_bal: indicator || validIndicator,
        fuelCode: fuelDefinition.siec
      };
    } catch (error) {
      return this.getDefaultDatabaseParams();
    }
  }

  async fetchEurostatData(dbParams, country, dateInfo) {
    if (!dbParams) {
      return {
        value: 'N/A',
        unit: 'Unknown',
        year: dateInfo?.value || 'latest',
        metadata: {
          source: 'Eurostat',
          error: 'Invalid database parameters'
        }
      };
    }

    const BASE_URL = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';
    
    const params = new URLSearchParams();
    params.append('format', 'JSON');

    if (dbParams.nrg_bal) params.append('nrg_bal', dbParams.nrg_bal);
    if (dbParams.siec) params.append('siec', dbParams.siec);
    if (dbParams.unit) params.append('unit', dbParams.unit);
    params.append('geo', country || 'EU27_2020');

    if (dateInfo?.value && dateInfo.type === 'year') {
      params.append('time', dateInfo.value);
    } else if (dateInfo?.value && dateInfo.type === 'yearRange') {
      const [startYear, endYear] = dateInfo.value.split('-');
      params.append('time', `${startYear}-${endYear}`);
    } else {
      params.append('lastTimePeriod', '1');
    }

    try {
      const url = `${BASE_URL}/${dbParams.dataset}`;
      const response = await axios.get(url, { params });
      
      const dimension = response.data.dimension;
      const labels = {
        dataset: response.data.label,
        nrg_bal: dimension.nrg_bal?.label || {},
        siec: dimension.siec?.label || {},
        unit: dimension.unit?.label || {},
        geo: dimension.geo?.label || {},
        time: dimension.time?.label || {}
      };

      const selectedLabels = {
        nrg_bal: dimension.nrg_bal?.category?.label?.[dbParams.nrg_bal] || '',
        siec: dimension.siec?.category?.label?.[dbParams.siec] || '',
        unit: dimension.unit?.category?.label?.[dbParams.unit] || '',
        geo: dimension.geo?.category?.label?.[country] || ''
      };
      
      const processedData = this.processEurostatResponse(response.data, dbParams.unit);
      return {
        value: processedData.value,
        unit: dbParams.unit,
        year: dateInfo?.value || processedData.year,
        country: selectedLabels.geo || country,
        siec: selectedLabels.siec,
        bal: selectedLabels.nrg_bal,
        metadata: {
          source: 'Eurostat',
          url: `https://ec.europa.eu/eurostat/databrowser/product/view/${dbParams.dataset}?lang=${this.currentLanguage}`,
          datasetLabel: labels.dataset,
          dimensions: selectedLabels,
          updated: response.data.updated
        }
      };
    } catch (error) {
      return {
        value: 'N/A',
        unit: dbParams.unit || 'KTOE',
        year: dateInfo?.value || 'latest',
        metadata: {
          source: 'Eurostat',
          error: error.message
        }
      };
    }
  }

  processEurostatResponse(data, unit) {
    try {
      const values = data.value || {};
      const firstValue = Object.values(values)[0];
      const year = Object.keys(data.dimension.time.category.label)[0];

      return {
        value: parseFloat(firstValue).toFixed(2),
        year: year
      };
    } catch (error) {
      return {
        value: 'N/A',
        year: 'latest'
      };
    }
  }
}

export default EurostatQueryModule;