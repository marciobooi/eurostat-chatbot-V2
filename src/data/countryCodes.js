/**
 * Comprehensive dictionary of EU country codes and names in multiple languages
 * Used for entity extraction and NLP processing
 */

export const countryCodesDictionary = {
  en: [
    // Country codes
    'at', 'be', 'bg', 'hr', 'cy', 'cz', 'dk', 'ee', 'fi', 'fr', 
    'de', 'gr', 'hu', 'ie', 'it', 'lv', 'lt', 'lu', 'mt', 'nl', 
    'pl', 'pt', 'ro', 'sk', 'si', 'es', 'se', 'eu', 'eu27', 'eu28', 
    // Country names
    'austria', 'belgium', 'bulgaria', 'croatia', 'cyprus', 'czech republic', 
    'denmark', 'estonia', 'finland', 'france', 'germany', 'greece', 
    'hungary', 'ireland', 'italy', 'latvia', 'lithuania', 'luxembourg', 
    'malta', 'netherlands', 'poland', 'portugal', 'romania', 'slovakia', 
    'slovenia', 'spain', 'sweden', 'european union'
  ],
  fr: [
    // Country codes (same as EN)
    'at', 'be', 'bg', 'hr', 'cy', 'cz', 'dk', 'ee', 'fi', 'fr', 
    'de', 'gr', 'hu', 'ie', 'it', 'lv', 'lt', 'lu', 'mt', 'nl', 
    'pl', 'pt', 'ro', 'sk', 'si', 'es', 'se', 'eu', 'eu27', 'eu28',
    // Country names in French
    'autriche', 'belgique', 'bulgarie', 'croatie', 'chypre', 'république tchèque', 
    'danemark', 'estonie', 'finlande', 'france', 'allemagne', 'grèce', 
    'hongrie', 'irlande', 'italie', 'lettonie', 'lituanie', 'luxembourg', 
    'malte', 'pays-bas', 'pologne', 'portugal', 'roumanie', 'slovaquie', 
    'slovénie', 'espagne', 'suède', 'union européenne'
  ],
  de: [
    // Country codes (same as EN)
    'at', 'be', 'bg', 'hr', 'cy', 'cz', 'dk', 'ee', 'fi', 'fr', 
    'de', 'gr', 'hu', 'ie', 'it', 'lv', 'lt', 'lu', 'mt', 'nl', 
    'pl', 'pt', 'ro', 'sk', 'si', 'es', 'se', 'eu', 'eu27', 'eu28',
    // Country names in German
    'österreich', 'belgien', 'bulgarien', 'kroatien', 'zypern', 'tschechische republik', 
    'dänemark', 'estland', 'finnland', 'frankreich', 'deutschland', 'griechenland', 
    'ungarn', 'irland', 'italien', 'lettland', 'litauen', 'luxemburg', 
    'malta', 'niederlande', 'polen', 'portugal', 'rumänien', 'slowakei', 
    'slowenien', 'spanien', 'schweden', 'europäische union'
  ]
};

/**
 * Map for country names to Eurostat country codes
 * Used for API queries and data extraction
 */
export const countryCodes = {
  // Primary EU member states
  'AT': ['Austria', 'Österreich', 'Autriche'],
  'BE': ['Belgium', 'Belgien', 'Belgique'],
  'BG': ['Bulgaria', 'Bulgarien', 'Bulgarie'],
  'HR': ['Croatia', 'Kroatien', 'Croatie'],
  'CY': ['Cyprus', 'Zypern', 'Chypre'],
  'CZ': ['Czech Republic', 'Tschechische Republik', 'République tchèque'],
  'DK': ['Denmark', 'Dänemark', 'Danemark'],
  'EE': ['Estonia', 'Estland', 'Estonie'],
  'FI': ['Finland', 'Finnland', 'Finlande'],
  'FR': ['France', 'Frankreich', 'France'],
  'DE': ['Germany', 'Deutschland', 'Allemagne'],
  'GR': ['Greece', 'Griechenland', 'Grèce'],
  'HU': ['Hungary', 'Ungarn', 'Hongrie'],
  'IE': ['Ireland', 'Irland', 'Irlande'],
  'IT': ['Italy', 'Italien', 'Italie'],
  'LV': ['Latvia', 'Lettland', 'Lettonie'],
  'LT': ['Lithuania', 'Litauen', 'Lituanie'],
  'LU': ['Luxembourg', 'Luxemburg', 'Luxembourg'],
  'MT': ['Malta', 'Malta', 'Malte'],
  'NL': ['Netherlands', 'Niederlande', 'Pays-Bas'],
  'PL': ['Poland', 'Polen', 'Pologne'],
  'PT': ['Portugal', 'Portugal', 'Portugal'],
  'RO': ['Romania', 'Rumänien', 'Roumanie'],
  'SK': ['Slovakia', 'Slowakei', 'Slovaquie'],
  'SI': ['Slovenia', 'Slowenien', 'Slovénie'],
  'ES': ['Spain', 'Spanien', 'Espagne'],
  'SE': ['Sweden', 'Schweden', 'Suède'],
  // EU aggregates
  'EU27_2020': ['EU', 'European Union', 'EU27', 'EU-27', 'Europa', 'Europe', 
                'Europäische Union', 'Union européenne']
};

/**
 * Gets country codes and names in the specified language
 * @param {string} language - Language code (en, fr, de)
 * @returns {string[]} Array of country codes and names
 */
export const getCountryCodes = (language = "en") => {
  return countryCodesDictionary[language] || countryCodesDictionary.en;
};

export default {
  countryCodesDictionary,
  getCountryCodes,
  countryCodes
};