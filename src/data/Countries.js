/**
 * Country names and codes for data query detection
 * Organized by priority - full names first, then codes
 * Supports multilingual country names in English, French, and German
 */

import i18n from '../i18n/index.js';

const countryNamesData = {
  en: {
    // EU countries (full names - highest priority)
    fullNames: [
      'austria', 'belgium', 'bulgaria', 'croatia', 'cyprus', 'czechia', 'czech republic',
      'denmark', 'estonia', 'finland', 'france', 'germany', 'greece', 'hungary',
      'ireland', 'italy', 'latvia', 'lithuania', 'luxembourg', 'malta', 'netherlands',
      'poland', 'portugal', 'romania', 'slovakia', 'slovenia', 'spain', 'sweden',
      'united kingdom', 'united states', 'great britain'
    ],
    
    // Other major countries
    otherCountries: [
      'norway', 'switzerland', 'iceland', 'turkey', 'russia', 'china', 'japan', 
      'india', 'brazil', 'canada', 'australia', 'south africa', 'new zealand',
      'mexico', 'argentina', 'chile', 'south korea', 'indonesia', 'thailand'
    ],
    
    // Alternative names and common variations
    alternatives: {
      'usa': 'united states',
      'uk': 'united kingdom',
      'us': 'united states',
      'gb': 'great britain'
    }
  },
  
  fr: {
    // EU countries (French names)
    fullNames: [
      'autriche', 'belgique', 'bulgarie', 'croatie', 'chypre', 'tchéquie', 'république tchèque',
      'danemark', 'estonie', 'finlande', 'france', 'allemagne', 'grèce', 'hongrie',
      'irlande', 'italie', 'lettonie', 'lituanie', 'luxembourg', 'malte', 'pays-bas',
      'pologne', 'portugal', 'roumanie', 'slovaquie', 'slovénie', 'espagne', 'suède',
      'royaume-uni', 'états-unis', 'grande-bretagne'
    ],
    
    // Other major countries (French names)
    otherCountries: [
      'norvège', 'suisse', 'islande', 'turquie', 'russie', 'chine', 'japon',
      'inde', 'brésil', 'canada', 'australie', 'afrique du sud', 'nouvelle-zélande',
      'mexique', 'argentine', 'chili', 'corée du sud', 'indonésie', 'thaïlande'
    ],
    
    // Alternative names and common variations
    alternatives: {
      'usa': 'états-unis',
      'uk': 'royaume-uni',
      'us': 'états-unis',
      'gb': 'grande-bretagne',
      'allemagne': 'germany',
      'espagne': 'spain',
      'italie': 'italy',
      'pays-bas': 'netherlands',
      'pologne': 'poland'
    }
  },
  
  de: {
    // EU countries (German names)
    fullNames: [
      'österreich', 'belgien', 'bulgarien', 'kroatien', 'zypern', 'tschechien', 'tschechische republik',
      'dänemark', 'estland', 'finnland', 'frankreich', 'deutschland', 'griechenland', 'ungarn',
      'irland', 'italien', 'lettland', 'litauen', 'luxemburg', 'malta', 'niederlande',
      'polen', 'portugal', 'rumänien', 'slowakei', 'slowenien', 'spanien', 'schweden',
      'vereinigtes königreich', 'vereinigte staaten', 'großbritannien'
    ],
    
    // Other major countries (German names)
    otherCountries: [
      'norwegen', 'schweiz', 'island', 'türkei', 'russland', 'china', 'japan',
      'indien', 'brasilien', 'kanada', 'australien', 'südafrika', 'neuseeland',
      'mexiko', 'argentinien', 'chile', 'südkorea', 'indonesien', 'thailand'
    ],
    
    // Alternative names and common variations
    alternatives: {
      'usa': 'vereinigte staaten',
      'uk': 'vereinigtes königreich',
      'us': 'vereinigte staaten',
      'gb': 'großbritannien',
      'deutschland': 'germany',
      'frankreich': 'france',
      'italien': 'italy',
      'niederlande': 'netherlands',
      'polen': 'poland'
    }
  }
};

export const COUNTRIES = {
  // EU country codes (2-letter ISO codes)
  euCodes: [
    'at', 'be', 'bg', 'hr', 'cy', 'cz', 'dk', 'ee', 'fi', 'fr', 'de', 'gr', 'hu',
    'ie', 'it', 'lv', 'lt', 'lu', 'mt', 'nl', 'pl', 'pt', 'ro', 'sk', 'si', 'es', 'se'
  ],
  
  // Other country codes
  otherCodes: [
    'uk', 'us', 'gb', 'no', 'ch', 'is', 'tr', 'ru', 'cn', 'jp', 'in', 'br', 'ca',
    'mx', 'ar', 'cl', 'kr', 'id', 'th', 'za', 'nz', 'au'
  ]
};

// Function to get country names for current language
export const getCountryNames = () => {
  const currentLanguage = i18n.language || 'en';
  return countryNamesData[currentLanguage] || countryNamesData.en;
};

/**
 * Get all country patterns in order of priority (longest first)
 */
export const getAllCountryPatterns = () => {
  const countryNames = getCountryNames();
  const allPatterns = [
    ...countryNames.fullNames,
    ...countryNames.otherCountries,
    ...COUNTRIES.euCodes,
    ...COUNTRIES.otherCodes,
    ...Object.keys(countryNames.alternatives)
  ];
  
  // Sort by length (longest first) to prioritize more specific matches
  return allPatterns.sort((a, b) => b.length - a.length);
};

/**
 * Check if a string contains a country reference
 */
export const containsCountry = (text) => {
  const lowerText = text.toLowerCase();
  const patterns = getAllCountryPatterns();
  
  return patterns.some(country => lowerText.includes(country.toLowerCase()));
};

/**
 * Extract country from text
 */
export const extractCountry = (text) => {
  const lowerText = text.toLowerCase();
  const patterns = getAllCountryPatterns();
  const countryNames = getCountryNames();
  
  for (const country of patterns) {
    if (lowerText.includes(country.toLowerCase())) {
      return countryNames.alternatives[country] || country;
    }
  }
  
  return null;
};

/**
 * Mapping from country names to ISO 2-letter codes
 * Includes multilingual support for English, French, and German
 */
const COUNTRY_TO_CODE_MAP = {
  // EU countries - English
  'austria': 'at', 'belgium': 'be', 'bulgaria': 'bg', 'croatia': 'hr', 
  'cyprus': 'cy', 'czechia': 'cz', 'czech republic': 'cz', 'denmark': 'dk',
  'estonia': 'ee', 'finland': 'fi', 'france': 'fr', 'germany': 'de',
  'greece': 'gr', 'hungary': 'hu', 'ireland': 'ie', 'italy': 'it',
  'latvia': 'lv', 'lithuania': 'lt', 'luxembourg': 'lu', 'malta': 'mt',
  'netherlands': 'nl', 'poland': 'pl', 'portugal': 'pt', 'romania': 'ro',
  'slovakia': 'sk', 'slovenia': 'si', 'spain': 'es', 'sweden': 'se',
  
  // EU countries - French
  'autriche': 'at', 'belgique': 'be', 'bulgarie': 'bg', 'croatie': 'hr',
  'chypre': 'cy', 'tchéquie': 'cz', 'république tchèque': 'cz', 'danemark': 'dk',
  'estonie': 'ee', 'finlande': 'fi', 'allemagne': 'de', 'grèce': 'gr',
  'hongrie': 'hu', 'irlande': 'ie', 'italie': 'it', 'lettonie': 'lv',
  'lituanie': 'lt', 'malte': 'mt', 'pays-bas': 'nl', 'pologne': 'pl',
  'roumanie': 'ro', 'slovaquie': 'sk', 'slovénie': 'si', 'espagne': 'es',
  'suède': 'se',
  
  // EU countries - German
  'österreich': 'at', 'belgien': 'be', 'bulgarien': 'bg', 'kroatien': 'hr',
  'zypern': 'cy', 'tschechien': 'cz', 'tschechische republik': 'cz', 'dänemark': 'dk',
  'estland': 'ee', 'finnland': 'fi', 'frankreich': 'fr', 'deutschland': 'de',
  'griechenland': 'gr', 'ungarn': 'hu', 'irland': 'ie', 'italien': 'it',
  'lettland': 'lv', 'litauen': 'lt', 'luxemburg': 'lu', 'niederlande': 'nl',
  'polen': 'pl', 'rumänien': 'ro', 'slowakei': 'sk', 'slowenien': 'si',
  'spanien': 'es', 'schweden': 'se',
  
  // Other major countries - English
  'united kingdom': 'gb', 'great britain': 'gb', 'uk': 'gb',
  'united states': 'us', 'usa': 'us', 'us': 'us',
  'norway': 'no', 'switzerland': 'ch', 'iceland': 'is', 'turkey': 'tr',
  'russia': 'ru', 'china': 'cn', 'japan': 'jp', 'india': 'in',
  'brazil': 'br', 'canada': 'ca', 'australia': 'au', 'south africa': 'za',
  'new zealand': 'nz', 'mexico': 'mx', 'argentina': 'ar', 'chile': 'cl',
  'south korea': 'kr', 'indonesia': 'id', 'thailand': 'th',
  
  // Other major countries - French
  'royaume-uni': 'gb', 'grande-bretagne': 'gb', 'états-unis': 'us',
  'norvège': 'no', 'suisse': 'ch', 'islande': 'is', 'turquie': 'tr',
  'russie': 'ru', 'chine': 'cn', 'japon': 'jp', 'inde': 'in',
  'brésil': 'br', 'australie': 'au', 'afrique du sud': 'za',
  'nouvelle-zélande': 'nz', 'mexique': 'mx', 'argentine': 'ar',
  'corée du sud': 'kr', 'indonésie': 'id', 'thaïlande': 'th',
  
  // Other major countries - German
  'vereinigtes königreich': 'gb', 'großbritannien': 'gb', 'vereinigte staaten': 'us',
  'norwegen': 'no', 'schweiz': 'ch', 'island': 'is', 'türkei': 'tr',
  'russland': 'ru', 'japan': 'jp', 'indien': 'in', 'brasilien': 'br',
  'kanada': 'ca', 'australien': 'au', 'südafrika': 'za', 'neuseeland': 'nz',
  'mexiko': 'mx', 'argentinien': 'ar', 'südkorea': 'kr',
  'indonesien': 'id'
};

/**
 * Convert country name to ISO 2-letter code
 */
export const getCountryCode = (countryName) => {
  if (!countryName) return null;
  
  const lowerName = countryName.toLowerCase();
  
  // Check if it's already a code
  if (lowerName.length === 2 && COUNTRIES.euCodes.concat(COUNTRIES.otherCodes).includes(lowerName)) {
    return lowerName;
  }
  
  // Look up in the mapping
  return COUNTRY_TO_CODE_MAP[lowerName] || null;
};
