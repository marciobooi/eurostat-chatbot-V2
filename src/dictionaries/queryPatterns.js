exports.queryPatterns = {
  en: {
    patterns: {
      production: [
        /production/i,
        /generate/i,
        /produce/i,
        /output/i,
        /yield/i,
        /manufacture/i
      ],
      consumption: [
        /consumption/i,
        /use/i,
        /usage/i,
        /demand/i,
        /utilized/i,
        /consumed/i
      ],
      trade: [
        /trade/i,
        /import/i,
        /export/i,
        /trading/i,
        /exchange/i,
        /balance/i
      ],
      emissions: [
        /emission/i,
        /carbon/i,
        /co2/i,
        /greenhouse gas/i,
        /ghg/i,
        /pollutant/i
      ],
      efficiency: [
        /efficiency/i,
        /performance/i,
        /ratio/i,
        /intensity/i,
        /effectiveness/i
      ],
      statistics: [
        /statistics/i,
        /data/i,
        /numbers/i,
        /figures/i,
        /information/i,
        /metrics/i
      ],
      trends: [
        /trend/i,
        /evolution/i,
        /development/i,
        /progress/i,
        /change/i,
        /pattern/i
      ],
      comparison: [
        /compar/i,
        /difference/i,
        /versus/i,
        /against/i,
        /between/i,
        /relation/i
      ]
    },
    timeframes: {
      latest: [
        /latest/i,
        /current/i,
        /most recent/i,
        /up to date/i,
        /now/i
      ],
      specific: [
        /in \d{4}/i,
        /for \d{4}/i,
        /during \d{4}/i,
        /year \d{4}/i
      ],
      range: [
        /from \d{4} to \d{4}/i,
        "Could you specify which {missing} you're interested in?",
        "I need to know the {missing} to provide accurate statistics.",
        "Please indicate which {missing} you'd like to see data for.",
        "To show you the right data, I need to know the {missing}."
      ]
    }
  },
  fr: {
    // French patterns to be added
  },
  de: {
    // German patterns to be added
  }
};