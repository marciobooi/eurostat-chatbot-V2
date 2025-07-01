/**
 * Question patterns for definition detection
 * 
 * This dictionary contains patterns for identifying definition questions
 * to distinguish them from ambiguous inputs that need clarification.
 * 
 * Patterns are organized by language and type for better maintainability and 
 * potential future expansion for different question types.
 */

import i18n from '../i18n/index.js';

export const QUESTION_PATTERNS = {
  en: {
    // Definition question patterns
    definition: [
      /^what\s+(is|are)\s+/i,
      /^define\s+/i,
      /^definition\s+of\s+/i,
      /^explain\s+/i,
      /^tell\s+me\s+about\s+/i,
      /^describe\s+/i,
      /^what\s+does\s+.+\s+mean\??$/i,
      /^meaning\s+of\s+/i,
      /^can\s+you\s+explain\s+/i,
      /^could\s+you\s+explain\s+/i,
      /^help\s+me\s+understand\s+/i,
      /^i\s+need\s+to\s+know\s+about\s+/i,
      /^show\s+me\s+information\s+about\s+/i
    ],
    
    // General question indicators (question marks, question words)
    general: [
      /\?\s*$/,  // Ends with question mark
      /^how\s+/i,
      /^why\s+/i,
      /^when\s+/i,
      /^where\s+/i,
      /^which\s+/i,
      /^who\s+/i
    ],
    
    // Information seeking patterns
    information: [
      /^show\s+me\s+/i,
      /^give\s+me\s+/i,
      /^provide\s+/i,
      /^i\s+want\s+to\s+know\s+/i,
      /^i\s+would\s+like\s+to\s+know\s+/i,
      /^information\s+about\s+/i,
      /^details\s+about\s+/i,
      /^more\s+about\s+/i
    ],
    
    // Question starters for cleaning
    starters: [
      /^what\s+(is|are)\s+/i,
      /^define\s+/i,
      /^definition\s+of\s+/i,
      /^explain\s+/i,
      /^tell\s+me\s+about\s+/i,
      /^describe\s+/i,
      /^meaning\s+of\s+/i,
      /^can\s+you\s+explain\s+/i,
      /^could\s+you\s+explain\s+/i,
      /^help\s+me\s+understand\s+/i,
      /^i\s+need\s+to\s+know\s+about\s+/i,
      /^show\s+me\s+(information\s+about\s+)?/i,
      /^give\s+me\s+(information\s+about\s+)?/i,
      /^provide\s+(information\s+about\s+)?/i,
      /^i\s+want\s+to\s+know\s+(about\s+)?/i,
      /^i\s+would\s+like\s+to\s+know\s+(about\s+)?/i,
      /^information\s+about\s+/i,
      /^details\s+about\s+/i,
      /^more\s+about\s+/i
    ]
  },
  
  fr: {
    // Definition question patterns in French
    definition: [
      /^qu'est(-|\s+)ce\s+que\s+/i,
      /^que\s+(sont|est)\s+/i,
      /^définir\s+/i,
      /^définition\s+(de|du|des)\s+/i,
      /^expliquer\s+/i,
      /^expliquez(-|\s+)moi\s+/i,
      /^dites(-|\s+)moi\s+/i,
      /^décrivez\s+/i,
      /^que\s+signifie\s+/i,
      /^signification\s+(de|du|des)\s+/i,
      /^pouvez(-|\s+)vous\s+expliquer\s+/i,
      /^pourriez(-|\s+)vous\s+expliquer\s+/i,
      /^aidez(-|\s+)moi\s+à\s+comprendre\s+/i,
      /^j'ai\s+besoin\s+de\s+savoir\s+/i,
      /^montrez(-|\s+)moi\s+(des\s+)?informations\s+sur\s+/i
    ],
    
    // General question indicators in French
    general: [
      /\?\s*$/,  // Ends with question mark
      /^comment\s+/i,
      /^pourquoi\s+/i,
      /^quand\s+/i,
      /^où\s+/i,
      /^quel(le)?(s)?\s+/i,
      /^qui\s+/i
    ],
    
    // Information seeking patterns in French
    information: [
      /^montrez(-|\s+)moi\s+/i,
      /^donnez(-|\s+)moi\s+/i,
      /^fournir\s+/i,
      /^je\s+veux\s+savoir\s+/i,
      /^j'aimerais\s+savoir\s+/i,
      /^informations\s+sur\s+/i,
      /^détails\s+sur\s+/i,
      /^plus\s+sur\s+/i
    ],
    
    // Question starters for cleaning in French
    starters: [
      /^qu'est(-|\s+)ce\s+que\s+/i,
      /^que\s+(sont|est)\s+/i,
      /^définir\s+/i,
      /^définition\s+(de|du|des)\s+/i,
      /^expliquer\s+/i,
      /^expliquez(-|\s+)moi\s+/i,
      /^dites(-|\s+)moi\s+/i,
      /^décrivez\s+/i,
      /^signification\s+(de|du|des)\s+/i,
      /^pouvez(-|\s+)vous\s+expliquer\s+/i,
      /^pourriez(-|\s+)vous\s+expliquer\s+/i,
      /^aidez(-|\s+)moi\s+à\s+comprendre\s+/i,
      /^j'ai\s+besoin\s+de\s+savoir\s+/i,
      /^montrez(-|\s+)moi\s+(des\s+)?(informations\s+sur\s+)?/i,
      /^donnez(-|\s+)moi\s+(des\s+)?(informations\s+sur\s+)?/i,
      /^fournir\s+(des\s+)?(informations\s+sur\s+)?/i,
      /^je\s+veux\s+savoir\s+(sur\s+)?/i,
      /^j'aimerais\s+savoir\s+(sur\s+)?/i,
      /^informations\s+sur\s+/i,
      /^détails\s+sur\s+/i,
      /^plus\s+sur\s+/i
    ]
  },
  
  de: {
    // Definition question patterns in German
    definition: [
      /^was\s+(ist|sind)\s+/i,
      /^definieren\s+(sie\s+)?/i,
      /^definition\s+(von|der|des)\s+/i,
      /^erklären\s+(sie\s+)?/i,
      /^erklären\s+sie\s+mir\s+/i,
      /^sagen\s+sie\s+mir\s+/i,
      /^beschreiben\s+(sie\s+)?/i,
      /^was\s+bedeutet\s+/i,
      /^bedeutung\s+(von|der|des)\s+/i,
      /^können\s+sie\s+erklären\s+/i,
      /^könnten\s+sie\s+erklären\s+/i,
      /^helfen\s+sie\s+mir\s+zu\s+verstehen\s+/i,
      /^ich\s+muss\s+wissen\s+/i,
      /^zeigen\s+sie\s+mir\s+(informationen\s+(über|zu)\s+)?/i
    ],
    
    // General question indicators in German
    general: [
      /\?\s*$/,  // Ends with question mark
      /^wie\s+/i,
      /^warum\s+/i,
      /^wann\s+/i,
      /^wo\s+/i,
      /^welche?(r|s)?\s+/i,
      /^wer\s+/i
    ],
    
    // Information seeking patterns in German
    information: [
      /^zeigen\s+sie\s+mir\s+/i,
      /^geben\s+sie\s+mir\s+/i,
      /^bereitstellen\s+/i,
      /^ich\s+möchte\s+wissen\s+/i,
      /^ich\s+würde\s+gerne\s+wissen\s+/i,
      /^informationen\s+(über|zu)\s+/i,
      /^details\s+(über|zu)\s+/i,
      /^mehr\s+(über|zu)\s+/i
    ],
    
    // Question starters for cleaning in German
    starters: [
      /^was\s+(ist|sind)\s+/i,
      /^definieren\s+(sie\s+)?/i,
      /^definition\s+(von|der|des)\s+/i,
      /^erklären\s+(sie\s+)?/i,
      /^erklären\s+sie\s+mir\s+/i,
      /^sagen\s+sie\s+mir\s+/i,
      /^beschreiben\s+(sie\s+)?/i,
      /^bedeutung\s+(von|der|des)\s+/i,
      /^können\s+sie\s+erklären\s+/i,
      /^könnten\s+sie\s+erklären\s+/i,
      /^helfen\s+sie\s+mir\s+zu\s+verstehen\s+/i,
      /^ich\s+muss\s+wissen\s+/i,
      /^zeigen\s+sie\s+mir\s+(informationen\s+(über|zu)\s+)?/i,
      /^geben\s+sie\s+mir\s+(informationen\s+(über|zu)\s+)?/i,
      /^bereitstellen\s+(informationen\s+(über|zu)\s+)?/i,
      /^ich\s+möchte\s+wissen\s+(über|zu\s+)?/i,
      /^ich\s+würde\s+gerne\s+wissen\s+(über|zu\s+)?/i,
      /^informationen\s+(über|zu)\s+/i,
      /^details\s+(über|zu)\s+/i,
      /^mehr\s+(über|zu)\s+/i
    ]
  }
};

/**
 * Get question patterns for the current language
 */
const getCurrentLanguagePatterns = () => {
  const currentLanguage = i18n.language || 'en';
  return QUESTION_PATTERNS[currentLanguage] || QUESTION_PATTERNS.en;
};

/**
 * Check if text matches any definition question pattern
 * @param {string} text - The text to check
 * @returns {boolean} True if it's a definition question
 */
export const isDefinitionQuestion = (text) => {
  const trimmedText = text.trim();
  const patterns = getCurrentLanguagePatterns();
  
  // Check if it matches definition patterns
  const matchesDefinitionPattern = patterns.definition.some(pattern => 
    pattern.test(trimmedText)
  );
  
  if (!matchesDefinitionPattern) {
    return false;
  }
  
  // Even if it matches a definition pattern, if it contains country + date + fuel,
  // it's likely a data query phrased as a question
  const hasCountryDateFuel = hasDataQueryContext(trimmedText);
  if (hasCountryDateFuel) {
    return false;
  }
  
  return true;
};

/**
 * Check if text contains country, date, and fuel context suggesting a data query
 * @param {string} text - The text to check
 * @returns {boolean} True if it contains data query context
 */
const hasDataQueryContext = (text) => {
  // Simple checks for year patterns and common country names
  const hasYear = /\b(19|20)\d{2}\b/.test(text);
  
  // Multilingual country keywords
  const countryKeywords = {
    en: /\b(spain|france|germany|italy|uk|usa|canada|belgium|netherlands|sweden|denmark|portugal|greece|austria|ireland|finland|poland|czechia|hungary|slovakia|slovenia|croatia|romania|bulgaria|lithuania|latvia|estonia|luxembourg|malta|cyprus)\b/i,
    fr: /\b(espagne|france|allemagne|italie|royaume(-|\s+)uni|états(-|\s+)unis|canada|belgique|pays(-|\s+)bas|suède|danemark|portugal|grèce|autriche|irlande|finlande|pologne|tchéquie|hongrie|slovaquie|slovénie|croatie|roumanie|bulgarie|lituanie|lettonie|estonie|luxembourg|malte|chypre)\b/i,
    de: /\b(spanien|frankreich|deutschland|italien|vereinigtes\s+königreich|usa|kanada|belgien|niederlande|schweden|dänemark|portugal|griechenland|österreich|irland|finnland|polen|tschechien|ungarn|slowakei|slowenien|kroatien|rumänien|bulgarien|litauen|lettland|estland|luxemburg|malta|zypern)\b/i
  };
  
  // Multilingual data keywords
  const dataKeywords = {
    en: /\b(consumption|production|data|statistics|values|numbers|figures|amounts|quantities|in\s+\w+\s+in\s+\d{4})\b/i,
    fr: /\b(consommation|production|données|statistiques|valeurs|chiffres|montants|quantités|en\s+\w+\s+en\s+\d{4})\b/i,
    de: /\b(verbrauch|produktion|daten|statistiken|werte|zahlen|mengen|in\s+\w+\s+in\s+\d{4})\b/i
  };
  
  const currentLanguage = i18n.language || 'en';
  const hasCountryKeywords = countryKeywords[currentLanguage] ? countryKeywords[currentLanguage].test(text) : countryKeywords.en.test(text);
  const hasDataKeywords = dataKeywords[currentLanguage] ? dataKeywords[currentLanguage].test(text) : dataKeywords.en.test(text);
  
  return hasYear && (hasCountryKeywords || hasDataKeywords);
};

/**
 * Check if text matches any general question pattern
 * @param {string} text - The text to check
 * @returns {boolean} True if it's a question
 */
export const isQuestion = (text) => {
  const trimmedText = text.trim();
  const patterns = getCurrentLanguagePatterns();
  
  return Object.values(patterns).flat().some(pattern => 
    pattern.test(trimmedText)
  );
};

/**
 * Get the type of question pattern matched
 * @param {string} text - The text to check
 * @returns {string|null} The type of question or null if no match
 */
export const getQuestionType = (text) => {
  const trimmedText = text.trim();
  const patterns = getCurrentLanguagePatterns();
  
  for (const [type, patternArray] of Object.entries(patterns)) {
    if (patternArray.some(pattern => pattern.test(trimmedText))) {
      return type;
    }
  }
  
  return null;
};

/**
 * Clean question text for better definition matching
 * Removes question words and patterns to extract the core term
 * @param {string} text - The question text to clean
 * @returns {string} Cleaned text for definition lookup
 */
export const cleanQuestionForDefinition = (text) => {
  let cleanedText = text.trim();
  const patterns = getCurrentLanguagePatterns();
  
  // Remove question mark
  cleanedText = cleanedText.replace(/\?+\s*$/, '');
  
  // Apply cleaning patterns for the current language
  if (patterns.starters) {
    for (const pattern of patterns.starters) {
      cleanedText = cleanedText.replace(pattern, '');
    }
  }
  
  // Language-specific cleaning for trailing question indicators
  const currentLanguage = i18n.language || 'en';
  
  if (currentLanguage === 'en') {
    cleanedText = cleanedText.replace(/\s+mean$/i, '');
    cleanedText = cleanedText.replace(/^what\s+does\s+/i, '');
    cleanedText = cleanedText.replace(/\s+mean\??$/i, '');
  } else if (currentLanguage === 'fr') {
    cleanedText = cleanedText.replace(/\s+signifie$/i, '');
    cleanedText = cleanedText.replace(/^que\s+signifie\s+/i, '');
    cleanedText = cleanedText.replace(/\s+signifie\??$/i, '');
  } else if (currentLanguage === 'de') {
    cleanedText = cleanedText.replace(/\s+bedeutet$/i, '');
    cleanedText = cleanedText.replace(/^was\s+bedeutet\s+/i, '');
    cleanedText = cleanedText.replace(/\s+bedeutet\??$/i, '');
  }
  
  // Clean up extra whitespace
  cleanedText = cleanedText.trim().replace(/\s+/g, ' ');
  
  return cleanedText;
};
