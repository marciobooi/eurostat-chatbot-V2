/**
 * Energy-related keywords for context-aware spell correction
 * Used to prefer energy-related suggestions when multiple spell corrections are available
 * Now supports multiple languages for better international coverage
 */

import i18n from '../i18n/index.js';

export const ENERGY_KEYWORDS = {
  en: [
    // Primary energy terms
    'energy', 'power', 'fuel', 'electricity', 'electric', 'electrical',
    
    // Fuel types
    'gas', 'oil', 'coal', 'petroleum', 'gasoline', 'diesel', 'kerosene', 
    'propane', 'butane', 'methane', 'hydrogen', 'biomass', 'biogas', 
    'biofuel', 'biodiesel', 'ethanol',
    
    // Renewable energy
    'renewable', 'sustainable', 'clean', 'green', 'alternative', 'solar', 
    'wind', 'hydro', 'hydroelectric', 'geothermal', 'tidal', 'wave', 'ocean',
    
    // Nuclear energy
    'nuclear', 'atomic', 'uranium', 'plutonium', 'reactor', 'fission', 'fusion',
    
    // Fossil fuels
    'fossil', 'carbon', 'anthracite', 'lignite', 'bituminous', 'peat', 
    'crude', 'refinery', 'petrochemical',
    
    // Energy processes
    'generation', 'production', 'consumption', 'distribution', 'transmission', 
    'transformation', 'conversion', 'combustion', 'burning', 'heating', 'cooling',
    
    // Energy efficiency
    'efficiency', 'conservation', 'saving', 'optimization', 'performance', 
    'thermal', 'insulation',
    
    // Energy infrastructure
    'grid', 'plant', 'station', 'facility', 'pipeline', 'turbine', 'generator', 
    'transformer', 'battery', 'storage',
    
    // Energy measurements
    'watt', 'kilowatt', 'megawatt', 'gigawatt', 'terawatt', 'joule', 'calorie', 
    'btu', 'therm', 'kwh', 'mwh', 'gwh', 'twh',
    
    // Environmental terms
    'emission', 'emissions', 'carbon', 'dioxide', 'greenhouse', 'climate', 
    'pollution', 'environment', 'environmental', 'footprint', 'offset', 
    'neutral', 'sustainability'
  ],
  
  fr: [
    // Primary energy terms in French
    'énergie', 'puissance', 'combustible', 'carburant', 'électricité', 'électrique',
    
    // Fuel types in French
    'gaz', 'pétrole', 'charbon', 'essence', 'gazole', 'diesel', 'kérosène', 
    'propane', 'butane', 'méthane', 'hydrogène', 'biomasse', 'biogaz', 
    'biocarburant', 'biodiesel', 'éthanol',
    
    // Renewable energy in French
    'renouvelable', 'durable', 'propre', 'vert', 'verte', 'alternatif', 
    'alternative', 'solaire', 'éolien', 'éolienne', 'hydro', 'hydroélectrique', 
    'géothermique', 'marémotrice', 'vague', 'océanique',
    
    // Nuclear energy in French
    'nucléaire', 'atomique', 'uranium', 'plutonium', 'réacteur', 'fission', 'fusion',
    
    // Fossil fuels in French
    'fossile', 'carbone', 'anthracite', 'lignite', 'bitumineux', 'tourbe', 
    'brut', 'raffinerie', 'pétrochimique',
    
    // Energy processes in French
    'génération', 'production', 'consommation', 'distribution', 'transmission', 
    'transformation', 'conversion', 'combustion', 'brûlage', 'chauffage', 'refroidissement',
    
    // Energy efficiency in French
    'efficacité', 'rendement', 'conservation', 'économie', 'optimisation', 
    'performance', 'thermique', 'isolation',
    
    // Energy infrastructure in French
    'réseau', 'centrale', 'station', 'installation', 'pipeline', 'turbine', 
    'générateur', 'transformateur', 'batterie', 'stockage',
    
    // Energy measurements in French
    'watt', 'kilowatt', 'mégawatt', 'gigawatt', 'térawatt', 'joule', 'calorie', 
    'btu', 'therm', 'kwh', 'mwh', 'gwh', 'twh',
    
    // Environmental terms in French
    'émission', 'émissions', 'carbone', 'dioxyde', 'serre', 'climat', 
    'pollution', 'environnement', 'environnemental', 'empreinte', 'compensation', 
    'neutre', 'durabilité'
  ],
  
  de: [
    // Primary energy terms in German
    'energie', 'kraft', 'leistung', 'brennstoff', 'treibstoff', 'elektrizität', 'elektrisch',
    
    // Fuel types in German
    'gas', 'erdgas', 'öl', 'erdöl', 'kohle', 'benzin', 'diesel', 'kerosin', 
    'propan', 'butan', 'methan', 'wasserstoff', 'biomasse', 'biogas', 
    'biokraftstoff', 'biodiesel', 'ethanol',
    
    // Renewable energy in German
    'erneuerbar', 'nachhaltig', 'sauber', 'grün', 'alternativ', 'solar', 
    'wind', 'hydro', 'wasserkraft', 'geothermisch', 'gezeiten', 'welle', 'ozean',
    
    // Nuclear energy in German
    'nuklear', 'atomkraft', 'atom', 'uran', 'plutonium', 'reaktor', 'spaltung', 'fusion',
    
    // Fossil fuels in German
    'fossil', 'kohlenstoff', 'anthrazit', 'braunkohle', 'steinkohle', 'torf', 
    'rohöl', 'raffinerie', 'petrochemisch',
    
    // Energy processes in German
    'erzeugung', 'produktion', 'verbrauch', 'verteilung', 'übertragung', 
    'umwandlung', 'konversion', 'verbrennung', 'heizung', 'kühlung',
    
    // Energy efficiency in German
    'effizienz', 'wirkungsgrad', 'einsparung', 'optimierung', 'leistung', 
    'thermisch', 'isolierung', 'dämmung',
    
    // Energy infrastructure in German
    'netz', 'kraftwerk', 'anlage', 'station', 'pipeline', 'turbine', 
    'generator', 'transformator', 'batterie', 'speicher', 'speicherung',
    
    // Energy measurements in German
    'watt', 'kilowatt', 'megawatt', 'gigawatt', 'terawatt', 'joule', 'kalorie', 
    'btu', 'therm', 'kwh', 'mwh', 'gwh', 'twh',
    
    // Environmental terms in German
    'emission', 'emissionen', 'ausstoß', 'kohlenstoff', 'kohlendioxid', 
    'treibhaus', 'klima', 'verschmutzung', 'umwelt', 'umweltfreundlich', 
    'fußabdruck', 'ausgleich', 'neutral', 'nachhaltigkeit'
  ]
};

/**
 * Get energy keywords for the current language
 */
export const getEnergyKeywords = () => {
  const currentLanguage = i18n.language || 'en';
  return ENERGY_KEYWORDS[currentLanguage] || ENERGY_KEYWORDS.en;
};

// Legacy export for backwards compatibility
export const energyKeywords = getEnergyKeywords();

/**
 * Check if a term is energy-related in the current language
 * @param {string} term - The term to check
 * @returns {boolean} - True if the term is energy-related
 */
export const isEnergyRelated = (term) => {
  const lowerTerm = term.toLowerCase();
  const keywords = getEnergyKeywords();
  
  // Also check all languages for broader coverage in multilingual contexts
  const allKeywords = [
    ...ENERGY_KEYWORDS.en,
    ...ENERGY_KEYWORDS.fr,
    ...ENERGY_KEYWORDS.de
  ];
  
  return allKeywords.some(keyword => 
    lowerTerm.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(lowerTerm)
  );
};

/**
 * Check if a term is energy-related in a specific language
 * @param {string} term - The term to check
 * @param {string} language - The language to check ('en', 'fr', 'de')
 * @returns {boolean} - True if the term is energy-related in that language
 */
export const isEnergyRelatedInLanguage = (term, language = 'en') => {
  const lowerTerm = term.toLowerCase();
  const keywords = ENERGY_KEYWORDS[language] || ENERGY_KEYWORDS.en;
  
  return keywords.some(keyword => 
    lowerTerm.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(lowerTerm)
  );
};

/**
 * Create a regex pattern for energy-related terms in the current language
 * @returns {RegExp} - Regex pattern for energy terms
 */
export const createEnergyRegex = () => {
  const keywords = getEnergyKeywords();
  const pattern = keywords.join('|');
  return new RegExp(`(${pattern})`, 'i');
};

/**
 * Create a regex pattern for energy-related terms in all languages
 * @returns {RegExp} - Regex pattern for energy terms across all languages
 */
export const createMultilingualEnergyRegex = () => {
  const allKeywords = [
    ...ENERGY_KEYWORDS.en,
    ...ENERGY_KEYWORDS.fr,
    ...ENERGY_KEYWORDS.de
  ];
  const pattern = allKeywords.join('|');
  return new RegExp(`(${pattern})`, 'i');
};

/**
 * Get energy keywords for a specific language
 * @param {string} language - The language code ('en', 'fr', 'de')
 * @returns {string[]} - Array of energy keywords for the specified language
 */
export const getEnergyKeywordsByLanguage = (language) => {
  return ENERGY_KEYWORDS[language] || ENERGY_KEYWORDS.en;
};
