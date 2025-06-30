/**
 * Question patterns for definition detection
 * 
 * This dictionary contains patterns for identifying definition questions
 * to distinguish them from ambiguous inputs that need clarification.
 * 
 * Patterns are organized by type for better maintainability and 
 * potential future expansion for different question types.
 */

export const QUESTION_PATTERNS = {
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
  ]
};

/**
 * Check if text matches any definition question pattern
 * @param {string} text - The text to check
 * @returns {boolean} True if it's a definition question
 */
export const isDefinitionQuestion = (text) => {
  const trimmedText = text.trim();
  console.log('🔍 Checking if definition question:', trimmedText);
  
  // Check if it matches definition patterns
  const matchesDefinitionPattern = QUESTION_PATTERNS.definition.some(pattern => {
    const matches = pattern.test(trimmedText);
    console.log(`🔍 Pattern ${pattern} matches: ${matches}`);
    return matches;
  });
  
  if (!matchesDefinitionPattern) {
    console.log('🔍 No definition pattern matched');
    return false;
  }
  
  // Even if it matches a definition pattern, if it contains country + date + fuel,
  // it's likely a data query phrased as a question
  const hasCountryDateFuel = hasDataQueryContext(trimmedText);
  if (hasCountryDateFuel) {
    console.log('🔍 Contains country/date/fuel context - likely a data query, not pure definition');
    return false;
  }
  
  console.log('🔍 Final definition question result: true (pattern matched, no data context)');
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
  const hasCountryKeywords = /\b(spain|france|germany|italy|uk|usa|canada|belgium|netherlands|sweden|denmark|portugal|greece|austria|ireland|finland|poland|czechia|hungary|slovakia|slovenia|croatia|romania|bulgaria|lithuania|latvia|estonia|luxembourg|malta|cyprus)\b/i.test(text);
  const hasDataKeywords = /\b(consumption|production|data|statistics|values|numbers|figures|amounts|quantities|in\s+\w+\s+in\s+\d{4})\b/i.test(text);
  
  const result = hasYear && (hasCountryKeywords || hasDataKeywords);
  console.log('🔍 Data query context check:', {
    hasYear,
    hasCountryKeywords,
    hasDataKeywords,
    result
  });
  
  return result;
};

/**
 * Check if text matches any general question pattern
 * @param {string} text - The text to check
 * @returns {boolean} True if it's a question
 */
export const isQuestion = (text) => {
  const trimmedText = text.trim();
  
  return Object.values(QUESTION_PATTERNS).flat().some(pattern => 
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
  
  for (const [type, patterns] of Object.entries(QUESTION_PATTERNS)) {
    if (patterns.some(pattern => pattern.test(trimmedText))) {
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
  
  // Remove question mark
  cleanedText = cleanedText.replace(/\?+\s*$/, '');
  
  // Remove common question starters
  const questionStarters = [
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
  ];
  
  // Apply cleaning patterns
  for (const pattern of questionStarters) {
    cleanedText = cleanedText.replace(pattern, '');
  }
  
  // Remove trailing question indicators
  cleanedText = cleanedText.replace(/\s+mean$/i, '');
  cleanedText = cleanedText.replace(/^what\s+does\s+/i, '');
  cleanedText = cleanedText.replace(/\s+mean\??$/i, '');
  
  // Clean up extra whitespace
  cleanedText = cleanedText.trim().replace(/\s+/g, ' ');
  
  console.log(`🧹 Question cleaning: "${text}" → "${cleanedText}"`);
  
  return cleanedText;
};
