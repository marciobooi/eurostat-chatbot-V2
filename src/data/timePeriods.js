/**
 * Comprehensive dictionary of time periods and temporal references in multiple languages
 * Used for entity extraction and NLP processing in Eurostat data reporting
 */

export const timePeriodsDictionary = {
  en: [
    // Quarters and periods
    'q1', 'q2', 'q3', 'q4', 'h1', 'h2',
    'first quarter', 'second quarter', 'third quarter', 'fourth quarter',
    'first half', 'second half',
    'quarterly', 'annual', 'monthly', 'yearly', 'fiscal year',
    'calendar year', 'year-to-date', 'ytd', 'year-over-year', 'yoy',
    'month-over-month', 'mom',
    
    // Additional time references
    'weekly', 'daily', 'biannual', 'biennial', 'decade', 'century',
    'short-term', 'medium-term', 'long-term',
    'previous period', 'current period', 'base period',
    'reference period', 'reporting period', 'previous year',
    'previous quarter', 'previous month', 'forecast period'
  ],
  fr: [
    // Quarters and periods
    'q1', 't1', 'q2', 't2', 'q3', 't3', 'q4', 't4', 's1', 's2',
    'premier trimestre', 'deuxième trimestre', 'troisième trimestre', 'quatrième trimestre',
    'premier semestre', 'deuxième semestre',
    'trimestriel', 'annuel', 'mensuel', 'année fiscale',
    'année civile', 'depuis le début de l\'année', 'sur un an',
    'd\'un mois à l\'autre',
    
    // Additional time references
    'hebdomadaire', 'quotidien', 'semestriel', 'biennal', 'décennie', 'siècle',
    'court terme', 'moyen terme', 'long terme',
    'période précédente', 'période courante', 'période de référence',
    'période de déclaration', 'année précédente',
    'trimestre précédent', 'mois précédent', 'période de prévision'
  ],
  de: [
    // Quarters and periods
    'q1', 'q2', 'q3', 'q4', 'h1', 'h2',
    'erstes quartal', 'zweites quartal', 'drittes quartal', 'viertes quartal',
    'erste hälfte', 'zweite hälfte',
    'vierteljährlich', 'jährlich', 'monatlich', 'geschäftsjahr',
    'kalenderjahr', 'jahresverlauf', 'im jahresvergleich',
    'im monatsvergleich',
    
    // Additional time references
    'wöchentlich', 'täglich', 'halbjährlich', 'zweijährlich', 'jahrzehnt', 'jahrhundert',
    'kurzfristig', 'mittelfristig', 'langfristig',
    'vorperiode', 'aktuelle periode', 'basisperiode',
    'bezugszeitraum', 'berichtszeitraum', 'vorjahr',
    'vorquartal', 'vormonat', 'prognosezeitraum'
  ]
};

/**
 * Gets time periods and temporal references in the specified language
 * @param {string} language - Language code (en, fr, de)
 * @returns {string[]} Array of time periods and references
 */
export const getTimePeriods = (language = "en") => {
  return timePeriodsDictionary[language] || timePeriodsDictionary.en;
};

export default {
  timePeriodsDictionary,
  getTimePeriods
};