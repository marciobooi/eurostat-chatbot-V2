/**
 * Intent detection patterns for identifying user intent
 * Using comprehensive dictionaries from intentDictionaries.js
 */
import {
  greetingDictionary,
  farewellDictionary,
  gratitudeDictionary,
  helpDictionary,
  confirmationDictionary,
  negationDictionary,
  questionDictionary,
  infoDictionary,
  comparisonDictionary,
  dataDictionary,
} from "./intentDictionaries";

// Define intent patterns using the comprehensive dictionaries
export const intentPatterns = {
  greeting: greetingDictionary,
  farewell: farewellDictionary,
  gratitude: gratitudeDictionary,
  help: helpDictionary,
  confirmation: confirmationDictionary,
  negation: negationDictionary,
  question: questionDictionary,
  info: infoDictionary,
  comparison: comparisonDictionary,
  data: dataDictionary,
  solidFossilFuels: {
    production: [
      "(coal|lignite) (production|mining|output|extraction)",
      "(underground|surface) mining (data|statistics|numbers)",
      "how much (coal|lignite) (is produced|was mined)",
      "(solid fuel|coal|lignite) (production|extraction) (data|statistics)"
    ],
    imports: [
      "(coal|lignite|coke) imports",
      "importing (coal|lignite|coke)",
      "(coal|lignite) trade (data|statistics)",
      "how much (coal|lignite) (is imported|was imported)"
    ],
    exports: [
      "(coal|lignite|coke) exports",
      "exporting (coal|lignite|coke)",
      "(coal|lignite) trade (data|statistics)",
      "how much (coal|lignite) (is exported|was exported)"
    ],
    consumption: [
      "(coal|lignite) (consumption|use|usage)",
      "(coal|lignite) (demand|requirements)",
      "how much (coal|lignite) (is used|was consumed)",
      "(solid fuel|coal|lignite) consumption by sector"
    ]
  },
  nonFossilHeat: {
    production: [
      "(non-fossil|renewable|clean) heat production",
      "(geothermal|solar thermal|heat pump) (production|generation)",
      "how much heat (is|was) produced from (non-fossil|renewable) sources",
      "(non-fossil|renewable) heat (data|statistics)"
    ],
    district: [
      "district heating (supply|network|system)",
      "district heat (data|statistics)",
      "(urban|city) heating network",
      "how much heat is distributed through (district|urban) networks"
    ],
    efficiency: [
      "(non-fossil|renewable) heat (efficiency|performance)",
      "heat production (efficiency|losses)",
      "how efficient is (non-fossil|renewable) heat production",
      "district heating (efficiency|losses|performance)"
    ]
  },
  renewableEnergy: {
    share: [
      "renewable (energy|electricity) share",
      "percentage of renewables",
      "how much energy comes from renewables",
      "proportion of renewable energy"
    ],
    transport: [
      "renewables in transport",
      "renewable (energy|fuel) for transport",
      "how much renewable (energy|fuel) is used in transport",
      "(biofuel|renewable fuel) share in transport"
    ],
    electricity: [
      "renewable electricity (share|percentage)",
      "electricity from renewables",
      "how much electricity comes from renewable sources",
      "(wind|solar|hydro) power share"
    ],
    heating: [
      "renewable (heating|cooling)",
      "renewables in (heating|cooling)",
      "how much heating comes from renewables",
      "(biomass|solar thermal|heat pump) share in heating"
    ]
  },
  energyEfficiency: {
    primary: [
      "primary energy (consumption|use)",
      "total energy (consumption|demand)",
      "how much primary energy (is used|was consumed)",
      "primary energy efficiency (target|progress)"
    ],
    final: [
      "final energy (consumption|use)",
      "end-use energy (consumption|demand)",
      "how much final energy (is used|was consumed)",
      "final energy efficiency (target|progress)"
    ],
    progress: [
      "energy efficiency (progress|improvement)",
      "progress towards (efficiency|2030) targets",
      "how (close|far) are we from efficiency targets",
      "efficiency target (achievement|status)"
    ]
  }
};

/**
 * Find the intent of a user input
 * @param {string} input - User input
 * @param {string} language - Language code
 * @returns {Object} Intent information
 */
export const getIntent = (input, language = "en") => {
  if (!input) return { intent: "unknown", confidence: 0 };

  const normalizedInput = input.toLowerCase().trim();
  const validLanguage = ["en", "fr", "de"].includes(language) ? language : "en";

  let highestScore = 0;
  let detectedIntent = "unknown";

  // Check each intent type
  Object.entries(intentPatterns).forEach(([intent, langPatterns]) => {
    const patterns = langPatterns[validLanguage] || langPatterns.en;

    if (!patterns || !patterns.length) return;

    for (const pattern of patterns) {
      if (normalizedInput.includes(pattern)) {
        // Calculate confidence based on pattern length and position
        let score = pattern.length / Math.max(normalizedInput.length, 1);

        // Boost score if pattern is at the beginning of input (more significant)
        if (normalizedInput.indexOf(pattern) === 0) {
          score *= 1.5;
        }

        // Discount score slightly if pattern is very short (potential false positive)
        if (pattern.length < 3) {
          score *= 0.8;
        }

        // Cap score at 1.0
        score = Math.min(score, 1.0);

        if (score > highestScore) {
          highestScore = score;
          detectedIntent = intent;
        }
      }
    }
  });

  return {
    intent: detectedIntent,
    confidence: parseFloat(highestScore.toFixed(2)),
  };
};

export default intentPatterns;
