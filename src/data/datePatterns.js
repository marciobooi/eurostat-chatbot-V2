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

export default datePatterns;
