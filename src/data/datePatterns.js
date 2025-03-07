/**
 * Date patterns for different languages
 * Used for date extraction when compromise plugin fails
 */

export const datePatterns = {
  // English date patterns
  en: {
    // Regex for date expressions
    regex:
      /\b(?:today|tomorrow|yesterday|(?:next|last) (?:week|month|year)|(?:in |after |before )?\d+ (?:days?|weeks?|months?|years?))\b/gi,

    // Common date words
    dateWords: [
      "today",
      "tomorrow",
      "yesterday",
      "week",
      "month",
      "year",
      "decade",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
      "quarter",
      "semester",
      "annual",
      "yearly",
      "monthly",
      "weekly",
      "daily",
    ],

    // Time units
    timeUnits: ["day", "week", "month", "year", "decade", "century"],

    // Time references
    timeReferences: [
      "next",
      "last",
      "previous",
      "coming",
      "this",
      "current",
      "past",
      "future",
      "following",
    ],
  },

  // French date patterns
  fr: {
    // Regex for date expressions
    regex:
      /\b(?:aujourd'hui|demain|hier|(?:la |le )?(?:semaine|mois|année) (?:prochaine?|dernière?)|(?:dans |après |avant )?\d+ (?:jours?|semaines?|mois|ans?))\b/gi,

    // Common date words
    dateWords: [
      "aujourd'hui",
      "demain",
      "hier",
      "semaine",
      "mois",
      "année",
      "décennie",
      "lundi",
      "mardi",
      "mercredi",
      "jeudi",
      "vendredi",
      "samedi",
      "dimanche",
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
      "trimestre",
      "semestre",
      "annuel",
      "mensuel",
      "hebdomadaire",
      "quotidien",
    ],

    // Time units
    timeUnits: ["jour", "semaine", "mois", "an", "année", "décennie", "siècle"],

    // Time references
    timeReferences: [
      "prochain",
      "prochaine",
      "dernier",
      "dernière",
      "ce",
      "cette",
      "courant",
      "passé",
      "futur",
      "suivant",
    ],
  },

  // German date patterns
  de: {
    // Regex for date expressions
    regex:
      /\b(?:heute|morgen|gestern|(?:nächste[rn]?|letzte[rn]?) (?:Woche|Monat|Jahr)|(?:in |nach |vor )?\d+ (?:Tage?n?|Wochen?|Monate?n?|Jahre?n?))\b/gi,

    // Common date words
    dateWords: [
      "heute",
      "morgen",
      "gestern",
      "woche",
      "monat",
      "jahr",
      "jahrzehnt",
      "montag",
      "dienstag",
      "mittwoch",
      "donnerstag",
      "freitag",
      "samstag",
      "sonntag",
      "januar",
      "februar",
      "märz",
      "april",
      "mai",
      "juni",
      "juli",
      "august",
      "september",
      "oktober",
      "november",
      "dezember",
      "quartal",
      "semester",
      "jährlich",
      "monatlich",
      "wöchentlich",
      "täglich",
    ],

    // Time units
    timeUnits: ["tag", "woche", "monat", "jahr", "jahrzehnt", "jahrhundert"],

    // Time references
    timeReferences: [
      "nächste",
      "nächster",
      "nächstes",
      "letzte",
      "letzter",
      "letztes",
      "dieser",
      "diese",
      "dieses",
      "vergangene",
      "zukünftige",
      "folgende",
    ],
  },

  // Single month pattern (e.g., "January 2023")
  monthYear: {
    en: /(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}/i,
    fr: /(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{4}/i,
    de: /(?:januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember)\s+\d{4}/i
  },
  
  // Month range pattern (e.g., "between January 2023 and March 2023")
  monthRange: {
    en: /between\s+(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}\s+and\s+(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}/i,
    fr: /entre\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{4}\s+et\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{4}/i,
    de: /zwischen\s+(?:januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember)\s+\d{4}\s+und\s+(?:januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember)\s+\d{4}/i
  },
  
  // Single year pattern (e.g., "2023")
  year: {
    en: /\b(19|20)\d{2}\b/,
    fr: /\b(19|20)\d{2}\b/,
    de: /\b(19|20)\d{2}\b/
  },
  
  // Year range pattern (e.g., "between 2020 and 2023")
  yearRange: {
    en: /between\s+\d{4}\s+and\s+\d{4}/i,
    fr: /entre\s+\d{4}\s+et\s+\d{4}/i,
    de: /zwischen\s+\d{4}\s+und\s+\d{4}/i
  },
  
  // Relative time patterns
  relative: {
    en: {
      lastMonth: /last month/i,
      lastYear: /last year/i,
      monthsAgo: /(\d+)\s+months?\s+ago/i,
      yearsAgo: /(\d+)\s+years?\s+ago/i,
      recent: /recent|latest|current/i
    },
    fr: {
      lastMonth: /mois dernier/i,
      lastYear: /année dernière|an dernier/i,
      monthsAgo: /il y a (\d+)\s+mois/i,
      yearsAgo: /il y a (\d+)\s+ans?/i,
      recent: /récent|actuel|dernier/i
    },
    de: {
      lastMonth: /letzten Monat/i,
      lastYear: /letztes Jahr/i,
      monthsAgo: /vor (\d+)\s+Monaten?/i,
      yearsAgo: /vor (\d+)\s+Jahren?/i,
      recent: /aktuell|jüngst|derzeit/i
    }
  }
};

const monthMap = {
  en: {
    january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
    july: 7, august: 8, september: 9, october: 10, november: 11, december: 12
  },
  fr: {
    janvier: 1, février: 2, mars: 3, avril: 4, mai: 5, juin: 6,
    juillet: 7, août: 8, septembre: 9, octobre: 10, novembre: 11, décembre: 12
  },
  de: {
    januar: 1, februar: 2, märz: 3, april: 4, mai: 5, juni: 6,
    juli: 7, august: 8, september: 9, oktober: 10, november: 11, dezember: 12
  }
};

/**
 * Extract date references from text
 * @param {string} text - Text to analyze
 * @param {string} language - Language code
 * @returns {Array} Array of extracted date references
 */
export const extractDateReferences = (text, language = "en") => {
  if (!text) return [];

  // Get the appropriate patterns for the language
  const patterns = datePatterns[language] || datePatterns.en;

  // Try regex extraction first
  const matches = text.match(patterns.regex) || [];

  // Return unique matches
  return [...new Set(matches)];
};

/**
 * Extract time period information from query text
 * @param {string} query - Query text to analyze
 * @param {string} language - Language code (en, fr, de)
 * @returns {Object} Time period information
 */
export const extractTimePeriod = (query, language = 'en') => {
  if (!query) return null;
  
  const normalizedQuery = query.toLowerCase();
  const patterns = datePatterns[language] || datePatterns.en;
  const months = monthMap[language] || monthMap.en;
  
  // Check for month range
  const monthRangeMatch = normalizedQuery.match(patterns.monthRange);
  if (monthRangeMatch) {
    const parts = monthRangeMatch[0].split(/\s+(?:and|et|und)\s+/);
    const startParts = parts[0].replace(/(?:between|entre|zwischen)\s+/, '').split(' ');
    const endParts = parts[1].split(' ');
    
    return {
      type: 'monthRange',
      startMonth: months[startParts[0]] || 1,
      startYear: parseInt(startParts[1]),
      endMonth: months[endParts[0]] || 12,
      endYear: parseInt(endParts[1]),
      frequency: 'monthly'
    };
  }
  
  // Check for single month
  const monthMatch = normalizedQuery.match(patterns.monthYear);
  if (monthMatch) {
    const parts = monthMatch[0].split(' ');
    return {
      type: 'month',
      month: months[parts[0]] || 1,
      year: parseInt(parts[1]),
      frequency: 'monthly'
    };
  }
  
  // Check for year range
  const yearRangeMatch = normalizedQuery.match(patterns.yearRange);
  if (yearRangeMatch) {
    const years = yearRangeMatch[0].match(/\d{4}/g);
    return {
      type: 'yearRange',
      startYear: parseInt(years[0]),
      endYear: parseInt(years[1]),
      frequency: 'annual'
    };
  }
  
  // Check for single year
  const yearMatch = normalizedQuery.match(patterns.year);
  if (yearMatch) {
    return {
      type: 'year',
      year: parseInt(yearMatch[0]),
      frequency: 'annual'
    };
  }
  
  // Check for relative time expressions
  const relative = patterns.relative;
  if (normalizedQuery.match(relative.lastMonth)) {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return {
      type: 'month',
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      frequency: 'monthly'
    };
  }
  
  if (normalizedQuery.match(relative.lastYear)) {
    const date = new Date();
    return {
      type: 'year',
      year: date.getFullYear() - 1,
      frequency: 'annual'
    };
  }
  
  const monthsAgoMatch = normalizedQuery.match(relative.monthsAgo);
  if (monthsAgoMatch) {
    const date = new Date();
    date.setMonth(date.getMonth() - parseInt(monthsAgoMatch[1]));
    return {
      type: 'month',
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      frequency: 'monthly'
    };
  }
  
  const yearsAgoMatch = normalizedQuery.match(relative.yearsAgo);
  if (yearsAgoMatch) {
    const date = new Date();
    return {
      type: 'year',
      year: date.getFullYear() - parseInt(yearsAgoMatch[1]),
      frequency: 'annual'
    };
  }
  
  // Default to current year if no specific time period found
  return {
    type: 'year',
    year: new Date().getFullYear(),
    frequency: 'annual'
  };
};

export default {
  datePatterns,
  extractTimePeriod
};
