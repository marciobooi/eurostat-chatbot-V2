/**
 * Multilingual date patterns and relative date terms for data query detection
 * Supports English, French, and German
 */

import i18n from '../i18n/index.js';

const datePatternsData = {
  en: {
    // Regex patterns for absolute dates
    regex: [
      // Years (1990-2030)
      /\b(19[9]\d|20[0-3]\d)\b/,
      // Date formats (MM/YYYY, YYYY-MM, etc.)
      /\b\d{1,2}\/\d{4}\b/,
      /\b\d{4}-\d{1,2}\b/,
      /\b\d{1,2}-\d{4}\b/,
      // Quarter formats (Q1 2023, 2023 Q1, etc.)
      /\b(q[1-4]\s+\d{4}|\d{4}\s+q[1-4])\b/i
    ],
    
    // Month names (full and abbreviated)
    months: {
      full: [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
      ],
      abbreviated: [
        'jan', 'feb', 'mar', 'apr', 'may', 'jun',
        'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
      ]
    },
    
    // Relative date terms
    relative: {
      current: [
        'current year', 'this year', 'present year', 'now', 'today',
        'current quarter', 'this quarter', 'present quarter'
      ],
      past: [
        'last year', 'previous year', 'past year', 'year ago',
        'last quarter', 'previous quarter', 'past quarter', 'quarter ago',
        'last month', 'previous month', 'past month', 'month ago',
        'yesterday', 'last week', 'previous week'
      ],
      future: [
        'next year', 'following year', 'upcoming year',
        'next quarter', 'following quarter', 'upcoming quarter',
        'next month', 'following month', 'upcoming month',
        'tomorrow', 'next week', 'following week'
      ]
    },
    
    // Period indicators
    periods: [
      'annual', 'yearly', 'monthly', 'quarterly', 'weekly', 'daily',
      'semester', 'half-year', 'biannual', 'decade'
    ]
  },
  
  fr: {
    // Regex patterns for absolute dates (same numbers work across languages)
    regex: [
      // Years (1990-2030)
      /\b(19[9]\d|20[0-3]\d)\b/,
      // Date formats (MM/YYYY, YYYY-MM, etc.)
      /\b\d{1,2}\/\d{4}\b/,
      /\b\d{4}-\d{1,2}\b/,
      /\b\d{1,2}-\d{4}\b/,
      // Quarter formats (T1 2023, 2023 T1, etc.)
      /\b(t[1-4]\s+\d{4}|\d{4}\s+t[1-4])\b/i
    ],
    
    // Month names (full and abbreviated)
    months: {
      full: [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
      ],
      abbreviated: [
        'jan', 'fév', 'mar', 'avr', 'mai', 'jun',
        'jul', 'aoû', 'sep', 'oct', 'nov', 'déc'
      ]
    },
    
    // Relative date terms
    relative: {
      current: [
        'année actuelle', 'cette année', 'année présente', 'maintenant', 'aujourd\'hui',
        'trimestre actuel', 'ce trimestre', 'trimestre présent'
      ],
      past: [
        'année dernière', 'année précédente', 'année passée', 'il y a un an',
        'trimestre dernier', 'trimestre précédent', 'trimestre passé', 'il y a un trimestre',
        'mois dernier', 'mois précédent', 'mois passé', 'il y a un mois',
        'hier', 'semaine dernière', 'semaine précédente'
      ],
      future: [
        'année prochaine', 'année suivante', 'année à venir',
        'trimestre prochain', 'trimestre suivant', 'trimestre à venir',
        'mois prochain', 'mois suivant', 'mois à venir',
        'demain', 'semaine prochaine', 'semaine suivante'
      ]
    },
    
    // Period indicators
    periods: [
      'annuel', 'annuelle', 'mensuel', 'mensuelle', 'trimestriel', 'trimestrielle',
      'hebdomadaire', 'quotidien', 'quotidienne', 'semestre', 'semestriel',
      'biennal', 'décennie'
    ]
  },
  
  de: {
    // Regex patterns for absolute dates (same numbers work across languages)
    regex: [
      // Years (1990-2030)
      /\b(19[9]\d|20[0-3]\d)\b/,
      // Date formats (MM/YYYY, YYYY-MM, etc.)
      /\b\d{1,2}\/\d{4}\b/,
      /\b\d{4}-\d{1,2}\b/,
      /\b\d{1,2}-\d{4}\b/,
      // Quarter formats (Q1 2023, 2023 Q1, etc.)
      /\b(q[1-4]\s+\d{4}|\d{4}\s+q[1-4])\b/i
    ],
    
    // Month names (full and abbreviated)
    months: {
      full: [
        'januar', 'februar', 'märz', 'april', 'mai', 'juni',
        'juli', 'august', 'september', 'oktober', 'november', 'dezember'
      ],
      abbreviated: [
        'jan', 'feb', 'mär', 'apr', 'mai', 'jun',
        'jul', 'aug', 'sep', 'okt', 'nov', 'dez'
      ]
    },
    
    // Relative date terms
    relative: {
      current: [
        'aktuelles jahr', 'dieses jahr', 'gegenwärtiges jahr', 'jetzt', 'heute',
        'aktuelles quartal', 'dieses quartal', 'gegenwärtiges quartal'
      ],
      past: [
        'letztes jahr', 'vorheriges jahr', 'vergangenes jahr', 'vor einem jahr',
        'letztes quartal', 'vorheriges quartal', 'vergangenes quartal', 'vor einem quartal',
        'letzter monat', 'vorheriger monat', 'vergangener monat', 'vor einem monat',
        'gestern', 'letzte woche', 'vorherige woche'
      ],
      future: [
        'nächstes jahr', 'folgendes jahr', 'kommendes jahr',
        'nächstes quartal', 'folgendes quartal', 'kommendes quartal',
        'nächster monat', 'folgender monat', 'kommender monat',
        'morgen', 'nächste woche', 'folgende woche'
      ]
    },
    
    // Period indicators
    periods: [
      'jährlich', 'monatlich', 'vierteljährlich', 'wöchentlich', 'täglich',
      'halbjährlich', 'semester', 'zweijährlich', 'jahrzehnt'
    ]
  }
};

// Function to get date patterns for current language
export const getDatePatterns = () => {
  const currentLanguage = i18n.language || 'en';
  return datePatternsData[currentLanguage] || datePatternsData.en;
};

// Legacy export for backward compatibility
export const DATE_PATTERNS = getDatePatterns();

/**
 * Get current year for relative date calculations
 */
const getCurrentYear = () => new Date().getFullYear();

/**
 * Convert relative date terms to actual years
 */
export const resolveRelativeDate = (term) => {
  const currentYear = getCurrentYear();
  const lowerTerm = term.toLowerCase();
  const datePatterns = getDatePatterns();
  
  // Current year references
  if (datePatterns.relative.current.some(current => lowerTerm.includes(current))) {
    return currentYear.toString();
  }
  
  // Past year references
  if (datePatterns.relative.past.some(past => lowerTerm.includes(past))) {
    if (lowerTerm.includes('year') || lowerTerm.includes('année') || lowerTerm.includes('jahr')) {
      return (currentYear - 1).toString();
    }
    // For other past terms, assume last year for simplicity
    return (currentYear - 1).toString();
  }
  
  // Future year references
  if (datePatterns.relative.future.some(future => lowerTerm.includes(future))) {
    if (lowerTerm.includes('year') || lowerTerm.includes('année') || lowerTerm.includes('jahr')) {
      return (currentYear + 1).toString();
    }
    // For other future terms, assume next year for simplicity
    return (currentYear + 1).toString();
  }
  
  return null;
};

/**
 * Check if text contains date references
 */
export const containsDate = (text) => {
  const lowerText = text.toLowerCase();
  const datePatterns = getDatePatterns();
  
  // Check regex patterns
  const hasRegexMatch = datePatterns.regex.some(pattern => pattern.test(lowerText));
  if (hasRegexMatch) return true;
  
  // Check month names
  const hasMonth = [
    ...datePatterns.months.full,
    ...datePatterns.months.abbreviated
  ].some(month => lowerText.includes(month));
  if (hasMonth) return true;
  
  // Check relative dates
  const hasRelativeDate = [
    ...datePatterns.relative.current,
    ...datePatterns.relative.past,
    ...datePatterns.relative.future
  ].some(relative => lowerText.includes(relative));
  if (hasRelativeDate) return true;
  
  // Check period indicators
  const hasPeriod = datePatterns.periods.some(period => lowerText.includes(period));
  if (hasPeriod) return true;
  
  return false;
};

/**
 * Extract date from text
 */
export const extractDate = (text, tokens) => {
  const lowerText = text.toLowerCase();
  const datePatterns = getDatePatterns();
  
  // First check for relative dates
  const relativeDate = resolveRelativeDate(lowerText);
  if (relativeDate) {
    return relativeDate;
  }
  
  // Check regex patterns
  for (const pattern of datePatterns.regex) {
    const match = lowerText.match(pattern);
    if (match) {
      return match[0];
    }
  }
  
  // Check for year tokens (4-digit numbers that could be years)
  const yearToken = tokens.find(token => {
    const num = parseInt(token);
    return !isNaN(num) && num >= 1990 && num <= 2030;
  });
  
  if (yearToken) {
    return yearToken;
  }
  
  // Check for month names with possible years
  for (const month of [...datePatterns.months.full, ...datePatterns.months.abbreviated]) {
    if (lowerText.includes(month)) {
      // Try to find a year near the month
      const yearMatch = lowerText.match(new RegExp(`${month}\\s+(\\d{4})|(\\d{4})\\s+${month}`));
      if (yearMatch) {
        return yearMatch[1] || yearMatch[2];
      }
      return month; // Return month name if no year found
    }
  }
  
  return null;
};
