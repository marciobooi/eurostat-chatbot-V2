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
 * Gets country codes and names in the specified language
 * @param {string} language - Language code (en, fr, de)
 * @returns {string[]} Array of country codes and names
 */
export const getCountryCodes = (language = "en") => {
  return countryCodesDictionary[language] || countryCodesDictionary.en;
};

export default {
  countryCodesDictionary,
  getCountryCodes
};