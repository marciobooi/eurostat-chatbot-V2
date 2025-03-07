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

export default datePatterns;