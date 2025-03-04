/**
 * Comprehensive dictionary of energy units and related terms in multiple languages
 * Used for entity extraction and NLP processing in Eurostat energy statistics
 */

export const energyUnitsDictionary = {
  en: [
    // Common energy units
    'kilowatt', 'kw', 'kilowatt hour', 'kwh', 'megawatt', 'mw',
    'megawatt hour', 'mwh', 'gigawatt', 'gw', 'gigawatt hour', 'gwh',
    'terawatt', 'tw', 'terawatt hour', 'twh', 'petajoule', 'pj',
    'toe', 'tonne of oil equivalent', 'ktoe', 'mtoe',
    'btu', 'british thermal unit', 'therms', 'barrel of oil equivalent', 'boe',
    
    // Additional energy-related terms
    'joule', 'kilojoule', 'megajoule', 'gigajoule',
    'calorie', 'kilocalorie', 'therm', 'quad',
    'watt', 'kilowatt-peak', 'kWp', 'volt', 'ampere',
    'renewable energy', 'fossil fuel', 'carbon intensity',
    'primary energy', 'final energy consumption',
    'energy efficiency', 'energy intensity'
  ],
  fr: [
    // Common energy units (technical units same in French)
    'kilowatt', 'kw', 'kilowattheure', 'kwh', 'mégawatt', 'mw',
    'mégawattheure', 'mwh', 'gigawatt', 'gw', 'gigawattheure', 'gwh',
    'térawatt', 'tw', 'térawattheure', 'twh', 'pétajoule', 'pj',
    'tep', 'tonne d\'équivalent pétrole', 'ktep', 'mtep',
    'btu', 'unité thermique britannique', 'thermies', 'baril équivalent pétrole', 'bep',
    
    // Additional energy-related terms in French
    'joule', 'kilojoule', 'mégajoule', 'gigajoule',
    'calorie', 'kilocalorie', 'thermie', 'quad',
    'watt', 'kilowatt-crête', 'kWc', 'volt', 'ampère',
    'énergie renouvelable', 'combustible fossile', 'intensité carbone',
    'énergie primaire', 'consommation finale d\'énergie',
    'efficacité énergétique', 'intensité énergétique'
  ],
  de: [
    // Common energy units (technical units same in German)
    'kilowatt', 'kw', 'kilowattstunde', 'kwh', 'megawatt', 'mw',
    'megawattstunde', 'mwh', 'gigawatt', 'gw', 'gigawattstunde', 'gwh',
    'terawatt', 'tw', 'terawattstunde', 'twh', 'petajoule', 'pj',
    'toe', 'tonne öleinheit', 'ktoe', 'mtoe',
    'btu', 'british thermal unit', 'therm', 'barrel öläquivalent', 'boe',
    
    // Additional energy-related terms in German
    'joule', 'kilojoule', 'megajoule', 'gigajoule',
    'kalorie', 'kilokalorie', 'therm', 'quad',
    'watt', 'kilowatt-peak', 'kWp', 'volt', 'ampere',
    'erneuerbare energie', 'fossiler brennstoff', 'kohlenstoffintensität',
    'primärenergie', 'endenergieverbrauch',
    'energieeffizienz', 'energieintensität'
  ]
};

/**
 * Gets energy units and related terms in the specified language
 * @param {string} language - Language code (en, fr, de)
 * @returns {string[]} Array of energy units and terms
 */
export const getEnergyUnits = (language = "en") => {
  return energyUnitsDictionary[language] || energyUnitsDictionary.en;
};

export default {
  energyUnitsDictionary,
  getEnergyUnits
};