import { energyDictionary } from "./energyDictionary";
import { getRandomFromArray } from "../utils/random";

const SUPPORTED_LANGUAGES = ["en", "fr", "de"];
const DEFAULT_LANGUAGE = "en";

const validateLanguage = (language) => {
  if (!language || !SUPPORTED_LANGUAGES.includes(language)) {
    console.warn(
      `Invalid or unsupported language: ${language}. Falling back to ${DEFAULT_LANGUAGE}`
    );
    return DEFAULT_LANGUAGE;
  }
  return language;
};

export const followUpPhrases = {
  en: [
    "Would you like to know more about {topic}?",
    "Shall we explore {topic} further?",
    "I can tell you more about {topic}. Interested?",
    "There's more to learn about {topic}. Want to continue?",
    "Would you like to dive deeper into {topic}?",
  ],
  fr: [
    "Voulez-vous en savoir plus sur {topic} ?",
    "Souhaitez-vous explorer davantage {topic} ?",
    "Je peux vous en dire plus sur {topic}. Intéressé(e) ?",
    "Il y a plus à apprendre sur {topic}. On continue ?",
    "Voulez-vous approfondir le sujet de {topic} ?",
  ],
  de: [
    "Möchten Sie mehr über {topic} erfahren?",
    "Sollen wir {topic} weiter erkunden?",
    "Ich kann Ihnen mehr über {topic} erzählen. Interessiert?",
    "Es gibt noch mehr über {topic} zu lernen. Weitermachen?",
    "Möchten Sie tiefer in das Thema {topic} einsteigen?",
  ],
};

/**
 * Follow-up questions to enhance conversation flow
 */

export const followUpQuestions = {
  en: {
    // Natural Gas follow-ups
    "natural gas": [
      "Would you like to see monthly natural gas balance data?",
      "How about recent gas import trends?",
      "Would you like to compare gas consumption across different countries?",
      "Should we look at monthly gas storage levels?"
    ],
    // Oil follow-ups
    "oil": [
      "Would you like to see monthly oil balance trends?",
      "How about crude oil import patterns?",
      "Should we look at petroleum products consumption?",
      "Would you like to see monthly refinery data?"
    ],
    // Electricity follow-ups
    "electricity": [
      "Would you like to see electricity production by source?",
      "How about consumption patterns by sector?",
      "Should we look at renewable vs non-renewable generation?",
      "Would you like to compare production across countries?"
    ],
    // General follow-ups
    "general": [
      "Would you like to see the data visualized?",
      "Should we compare with other countries?",
      "Would you like to see historical trends?",
      "How about looking at monthly patterns?"
    ]
  },
  fr: {
    "natural gas": [
      "Voulez-vous voir les données mensuelles du bilan gazier ?",
      "Que diriez-vous des tendances récentes des importations de gaz ?",
      "Voulez-vous comparer la consommation de gaz entre différents pays ?",
      "Devrions-nous examiner les niveaux mensuels de stockage de gaz ?"
    ],
    "oil": [
      "Voulez-vous voir les tendances mensuelles du bilan pétrolier ?",
      "Que diriez-vous des schémas d'importation de pétrole brut ?",
      "Devrions-nous examiner la consommation de produits pétroliers ?",
      "Voulez-vous voir les données mensuelles des raffineries ?"
    ],
    "electricity": [
      "Voulez-vous voir la production d'électricité par source ?",
      "Que diriez-vous des modes de consommation par secteur ?",
      "Devrions-nous examiner la production renouvelable vs non renouvelable ?",
      "Voulez-vous comparer la production entre les pays ?"
    ],
    "general": [
      "Voulez-vous voir les données visualisées ?",
      "Devrions-nous comparer avec d'autres pays ?",
      "Voulez-vous voir les tendances historiques ?",
      "Que diriez-vous d'examiner les tendances mensuelles ?"
    ]
  },
  de: {
    "natural gas": [
      "Möchten Sie monatliche Erdgasbilanzdaten sehen?",
      "Wie wäre es mit aktuellen Gasimporttrends?",
      "Möchten Sie den Gasverbrauch verschiedener Länder vergleichen?",
      "Sollen wir uns die monatlichen Gasspeicherstände ansehen?"
    ],
    "oil": [
      "Möchten Sie monatliche Ölbilanztrends sehen?",
      "Wie wäre es mit Rohölimportmustern?",
      "Sollen wir uns den Verbrauch von Erdölprodukten ansehen?",
      "Möchten Sie monatliche Raffinerie-Daten sehen?"
    ],
    "electricity": [
      "Möchten Sie die Stromerzeugung nach Quellen sehen?",
      "Wie wäre es mit Verbrauchsmustern nach Sektoren?",
      "Sollen wir die erneuerbare vs. nicht-erneuerbare Erzeugung betrachten?",
      "Möchten Sie die Produktion zwischen Ländern vergleichen?"
    ],
    "general": [
      "Möchten Sie die Daten visualisiert sehen?",
      "Sollen wir mit anderen Ländern vergleichen?",
      "Möchten Sie historische Trends sehen?",
      "Wie wäre es mit monatlichen Mustern?"
    ]
  },
  solidFossilFuels: {
    en: [
      "Would you like to see the breakdown between hard coal and lignite production?",
      "Would you like to see consumption by different sectors?",
      "Would you like to know about trade patterns in solid fossil fuels?",
      "Would you like to compare surface mining versus underground mining?",
      "Would you like to see how solid fuel use has changed over time?"
    ],
    fr: [
      "Voulez-vous voir la répartition entre la production de houille et de lignite ?",
      "Voulez-vous voir la consommation par différents secteurs ?",
      "Voulez-vous en savoir plus sur les modèles de commerce des combustibles fossiles solides ?",
      "Voulez-vous comparer l'extraction à ciel ouvert et souterraine ?",
      "Voulez-vous voir comment l'utilisation des combustibles solides a évolué dans le temps ?"
    ],
    de: [
      "Möchten Sie die Aufteilung zwischen Steinkohle- und Braunkohleförderung sehen?",
      "Möchten Sie den Verbrauch nach verschiedenen Sektoren sehen?",
      "Möchten Sie mehr über die Handelsmuster bei festen fossilen Brennstoffen erfahren?",
      "Möchten Sie Tagebau und Untertagebau vergleichen?",
      "Möchten Sie sehen, wie sich die Nutzung fester Brennstoffe im Laufe der Zeit verändert hat?"
    ]
  },

  nonFossilHeat: {
    en: [
      "Would you like to see the breakdown by heat source (geothermal, solar, etc.)?",
      "Would you like to know more about district heating networks?",
      "Would you like to see the efficiency of different heat production methods?",
      "Would you like to compare heat production between different countries?",
      "Would you like to see seasonal variations in heat production?"
    ],
    fr: [
      "Voulez-vous voir la répartition par source de chaleur (géothermie, solaire, etc.) ?",
      "Voulez-vous en savoir plus sur les réseaux de chauffage urbain ?",
      "Voulez-vous voir l'efficacité des différentes méthodes de production de chaleur ?",
      "Voulez-vous comparer la production de chaleur entre différents pays ?",
      "Voulez-vous voir les variations saisonnières de la production de chaleur ?"
    ],
    de: [
      "Möchten Sie die Aufteilung nach Wärmequellen (Geothermie, Solar, etc.) sehen?",
      "Möchten Sie mehr über Fernwärmenetze erfahren?",
      "Möchten Sie die Effizienz verschiedener Wärmeerzeugungsmethoden sehen?",
      "Möchten Sie die Wärmeerzeugung zwischen verschiedenen Ländern vergleichen?",
      "Möchten Sie die saisonalen Schwankungen in der Wärmeerzeugung sehen?"
    ]
  },

  renewableEnergy: {
    en: [
      "Would you like to see the breakdown of different renewable sources?",
      "Would you like to know about renewable energy in transport?",
      "Would you like to see renewable energy targets and progress?",
      "Would you like to compare renewable shares between countries?",
      "Would you like to see trends in renewable heating and cooling?"
    ],
    fr: [
      "Voulez-vous voir la répartition des différentes sources renouvelables ?",
      "Voulez-vous en savoir plus sur les énergies renouvelables dans les transports ?",
      "Voulez-vous voir les objectifs et les progrès en matière d'énergies renouvelables ?",
      "Voulez-vous comparer les parts de renouvelables entre pays ?",
      "Voulez-vous voir les tendances en matière de chauffage et refroidissement renouvelables ?"
    ],
    de: [
      "Möchten Sie die Aufteilung der verschiedenen erneuerbaren Quellen sehen?",
      "Möchten Sie mehr über erneuerbare Energien im Verkehr erfahren?",
      "Möchten Sie die Ziele und Fortschritte bei erneuerbaren Energien sehen?",
      "Möchten Sie die Anteile erneuerbarer Energien zwischen Ländern vergleichen?",
      "Möchten Sie die Trends bei erneuerbarem Heizen und Kühlen sehen?"
    ]
  },

  energyEfficiency: {
    en: [
      "Would you like to see progress towards 2030 efficiency targets?",
      "Would you like to compare efficiency between sectors?",
      "Would you like to see energy intensity trends?",
      "Would you like to know about energy savings in buildings?",
      "Would you like to see efficiency improvements over time?"
    ],
    fr: [
      "Voulez-vous voir les progrès vers les objectifs d'efficacité 2030 ?",
      "Voulez-vous comparer l'efficacité entre les secteurs ?",
      "Voulez-vous voir les tendances de l'intensité énergétique ?",
      "Voulez-vous en savoir plus sur les économies d'énergie dans les bâtiments ?",
      "Voulez-vous voir les améliorations d'efficacité au fil du temps ?"
    ],
    de: [
      "Möchten Sie die Fortschritte bei den Effizienzzielen 2030 sehen?",
      "Möchten Sie die Effizienz zwischen Sektoren vergleichen?",
      "Möchten Sie die Trends der Energieintensität sehen?",
      "Möchten Sie mehr über Energieeinsparungen in Gebäuden erfahren?",
      "Möchten Sie die Effizienzverbesserungen im Laufe der Zeit sehen?"
    ]
  }
};

/**
 * Get a follow-up question for a topic
 * @param {string} topic - The topic to follow up on
 * @param {string} language - Language code
 * @returns {Object|null} Follow-up question data or null if not available
 */
export const getFollowUpQuestion = (topic, language) => {
  try {
    const validLang = validateLanguage(language);
    const dictionary = energyDictionary[validLang] || energyDictionary.en;

    if (!dictionary || !dictionary[topic]) {
      return null;
    }

    const relatedTopics = dictionary[topic]?.relatedTopics || [];
    if (relatedTopics.length === 0) {
      return null;
    }

    const phrases =
      followUpPhrases[validLang] || followUpPhrases[DEFAULT_LANGUAGE];
    const question = getRandomFromArray(phrases).replace("{topic}", topic);

    return {
      topic,
      question,
      topics: relatedTopics,
      language: validLang,
    };
  } catch (error) {
    console.error("Error in getFollowUpQuestion:", error);
    return null;
  }
};

/**
 * Get follow-up suggestions for a topic
 * @param {string} topic - The topic to suggest related topics for
 * @param {string} language - Language code
 * @returns {Object|null} Suggestion data or null if not available
 */
export const getFollowUpSuggestion = (topic, language) => {
  try {
    const validLang = validateLanguage(language);
    const dictionary = energyDictionary[validLang] || energyDictionary.en;

    if (!dictionary || !dictionary[topic]) {
      return null;
    }

    const relatedTopics = dictionary[topic]?.relatedTopics || [];
    if (relatedTopics.length === 0) {
      return null;
    }

    return {
      topic,
      topics: relatedTopics,
      language: validLang,
    };
  } catch (error) {
    console.error("Error in getFollowUpSuggestion:", error);
    return null;
  }
};

export default followUpQuestions;
