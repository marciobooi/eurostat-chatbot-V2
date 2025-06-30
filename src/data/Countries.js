/**
 * Country names and codes for data query detection
 * Organized by priority - full names first, then codes
 */

export const COUNTRIES = {
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
  
  // EU country codes (2-letter ISO codes)
  euCodes: [
    'at', 'be', 'bg', 'hr', 'cy', 'cz', 'dk', 'ee', 'fi', 'fr', 'de', 'gr', 'hu',
    'ie', 'it', 'lv', 'lt', 'lu', 'mt', 'nl', 'pl', 'pt', 'ro', 'sk', 'si', 'es', 'se'
  ],
  
  // Other country codes
  otherCodes: [
    'uk', 'us', 'gb', 'no', 'ch', 'is', 'tr', 'ru', 'cn', 'jp', 'in', 'br', 'ca',
    'mx', 'ar', 'cl', 'kr', 'id', 'th', 'za', 'nz', 'au'
  ],
  
  // Alternative names and common variations
  alternatives: {
    'usa': 'united states',
    'uk': 'united kingdom',
    'us': 'united states',
    'gb': 'great britain',
    'deutschland': 'germany',
    'espana': 'spain',
    'france': 'france',
    'italia': 'italy',
    'nederland': 'netherlands',
    'polska': 'poland'
  }
};

/**
 * Get all country patterns in order of priority (longest first)
 */
export const getAllCountryPatterns = () => {
  const allPatterns = [
    ...COUNTRIES.fullNames,
    ...COUNTRIES.otherCountries,
    ...COUNTRIES.euCodes,
    ...COUNTRIES.otherCodes,
    ...Object.keys(COUNTRIES.alternatives)
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
  
  for (const country of patterns) {
    if (lowerText.includes(country.toLowerCase())) {
      return COUNTRIES.alternatives[country] || country;
    }
  }
  
  return null;
};

/**
 * Mapping from country names to ISO 2-letter codes
 */
const COUNTRY_TO_CODE_MAP = {
  // EU countries
  'austria': 'at', 'belgium': 'be', 'bulgaria': 'bg', 'croatia': 'hr', 
  'cyprus': 'cy', 'czechia': 'cz', 'czech republic': 'cz', 'denmark': 'dk',
  'estonia': 'ee', 'finland': 'fi', 'france': 'fr', 'germany': 'de',
  'greece': 'gr', 'hungary': 'hu', 'ireland': 'ie', 'italy': 'it',
  'latvia': 'lv', 'lithuania': 'lt', 'luxembourg': 'lu', 'malta': 'mt',
  'netherlands': 'nl', 'poland': 'pl', 'portugal': 'pt', 'romania': 'ro',
  'slovakia': 'sk', 'slovenia': 'si', 'spain': 'es', 'sweden': 'se',
  
  // Other major countries
  'united kingdom': 'gb', 'great britain': 'gb', 'uk': 'gb',
  'united states': 'us', 'usa': 'us', 'us': 'us',
  'norway': 'no', 'switzerland': 'ch', 'iceland': 'is', 'turkey': 'tr',
  'russia': 'ru', 'china': 'cn', 'japan': 'jp', 'india': 'in',
  'brazil': 'br', 'canada': 'ca', 'australia': 'au', 'south africa': 'za',
  'new zealand': 'nz', 'mexico': 'mx', 'argentina': 'ar', 'chile': 'cl',
  'south korea': 'kr', 'indonesia': 'id', 'thailand': 'th'
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
