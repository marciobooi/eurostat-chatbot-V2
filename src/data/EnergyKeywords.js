/**
 * Energy-related keywords for context-aware spell correction
 * Used to prefer energy-related suggestions when multiple spell corrections are available
 */
export const energyKeywords = [
  // Primary energy terms
  'energy',
  'power',
  'fuel',
  'electricity',
  'electric',
  'electrical',
  
  // Fuel types
  'gas',
  'oil',
  'coal',
  'petroleum',
  'gasoline',
  'diesel',
  'kerosene',
  'propane',
  'butane',
  'methane',
  'hydrogen',
  'biomass',
  'biogas',
  'biofuel',
  'biodiesel',
  'ethanol',
  
  // Renewable energy
  'renewable',
  'sustainable',
  'clean',
  'green',
  'alternative',
  'solar',
  'wind',
  'hydro',
  'hydroelectric',
  'geothermal',
  'tidal',
  'wave',
  'ocean',
  
  // Nuclear energy
  'nuclear',
  'atomic',
  'uranium',
  'plutonium',
  'reactor',
  'fission',
  'fusion',
  
  // Fossil fuels
  'fossil',
  'carbon',
  'anthracite',
  'lignite',
  'bituminous',
  'peat',
  'crude',
  'refinery',
  'petrochemical',
  
  // Energy processes
  'generation',
  'production',
  'consumption',
  'distribution',
  'transmission',
  'transformation',
  'conversion',
  'combustion',
  'burning',
  'heating',
  'cooling',
  
  // Energy efficiency
  'efficiency',
  'conservation',
  'saving',
  'optimization',
  'performance',
  'thermal',
  'insulation',
  
  // Energy infrastructure
  'grid',
  'plant',
  'station',
  'facility',
  'pipeline',
  'turbine',
  'generator',
  'transformer',
  'battery',
  'storage',
  
  // Energy measurements
  'watt',
  'kilowatt',
  'megawatt',
  'gigawatt',
  'terawatt',
  'joule',
  'calorie',
  'btu',
  'therm',
  'kwh',
  'mwh',
  'gwh',
  'twh',
  
  // Environmental terms
  'emission',
  'emissions',
  'carbon',
  'dioxide',
  'greenhouse',
  'climate',
  'pollution',
  'environment',
  'environmental',
  'footprint',
  'offset',
  'neutral',
  'sustainability'
];

/**
 * Check if a term is energy-related
 * @param {string} term - The term to check
 * @returns {boolean} - True if the term is energy-related
 */
export const isEnergyRelated = (term) => {
  const lowerTerm = term.toLowerCase();
  return energyKeywords.some(keyword => 
    lowerTerm.includes(keyword) || keyword.includes(lowerTerm)
  );
};

/**
 * Create a regex pattern for energy-related terms
 * @returns {RegExp} - Regex pattern for energy terms
 */
export const createEnergyRegex = () => {
  const pattern = energyKeywords.join('|');
  return new RegExp(`(${pattern})`, 'i');
};
