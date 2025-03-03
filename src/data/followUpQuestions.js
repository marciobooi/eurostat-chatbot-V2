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
    // General follow-up questions for any topic
    general: [
      "Would you like to know more about this topic?",
      "Do you have any specific questions about this?",
      "Is there anything else you'd like to know?",
      "Would you like me to elaborate on any particular aspect?",
      "Is there something specific about this that interests you?",
    ],

    // Topic-specific follow up questions
    oil: [
      "Would you like to know about oil consumption trends in Europe?",
      "Are you interested in how oil prices have evolved over time?",
      "Would you like to know about the EU's oil import dependencies?",
      "Are you interested in the environmental impacts of oil use?",
      "Would you like to learn about alternatives to oil?",
    ],

    "renewable energy": [
      "Would you like to know which EU country has the highest share of renewables?",
      "Are you interested in learning about specific renewable technologies?",
      "Would you like to see data on renewable energy growth in Europe?",
      "Are you curious about EU policies promoting renewable energy?",
      "Did you know solar and wind are the fastest growing energy sources?",
    ],

    "energy efficiency": [
      "Did you know buildings account for 40% of energy use in the EU?",
      "Would you like to learn about energy efficiency measures in households?",
      "Are you interested in the EU's energy efficiency targets?",
      "Would you like to know how much energy is saved through efficiency measures?",
      "Are you curious about energy efficiency labels on appliances?",
    ],

    "energy consumption": [
      "Would you like to see which sectors consume the most energy in Europe?",
      "Are you interested in how energy consumption has changed over time?",
      "Would you like to learn about seasonal variations in energy use?",
      "Are you curious about how COVID-19 affected energy consumption patterns?",
      "Would you like to know about per capita energy consumption differences?",
    ],

    "energy mix": [
      "Would you like to know how the EU's energy mix has evolved over time?",
      "Are you interested in how different EU countries have different energy mixes?",
      "Would you like to learn about plans for changing the energy mix in the future?",
      "Did you know the share of renewables in the EU's mix has doubled since 2004?",
      "Would you like to see a comparison with other regions' energy mixes?",
    ],
  },

  fr: {
    general: [
      "Voulez-vous en savoir plus sur ce sujet ?",
      "Avez-vous des questions spécifiques à ce sujet ?",
      "Y a-t-il autre chose que vous aimeriez savoir ?",
      "Souhaitez-vous que j'élabore sur un aspect particulier ?",
      "Y a-t-il quelque chose de spécifique qui vous intéresse ?",
    ],

    pétrole: [
      "Voulez-vous connaître les tendances de consommation de pétrole en Europe ?",
      "Êtes-vous intéressé par l'évolution des prix du pétrole ?",
      "Souhaitez-vous en savoir plus sur les dépendances de l'UE en matière d'importation de pétrole ?",
      "Êtes-vous intéressé par les impacts environnementaux de l'utilisation du pétrole ?",
      "Voulez-vous en savoir plus sur les alternatives au pétrole ?",
    ],
    // Add more French topics as needed
  },

  de: {
    general: [
      "Möchten Sie mehr über dieses Thema erfahren?",
      "Haben Sie konkrete Fragen dazu?",
      "Gibt es etwas anderes, das Sie wissen möchten?",
      "Möchten Sie, dass ich auf einen bestimmten Aspekt näher eingehe?",
      "Gibt es etwas Bestimmtes, das Sie interessiert?",
    ],

    öl: [
      "Möchten Sie mehr über die Trends beim Ölverbrauch in Europa erfahren?",
      "Interessieren Sie sich für die Entwicklung der Ölpreise?",
      "Möchten Sie mehr über die Abhängigkeit der EU von Ölimporten erfahren?",
      "Interessieren Sie sich für die Umweltauswirkungen der Ölnutzung?",
      "Möchten Sie etwas über Alternativen zu Öl erfahren?",
    ],
    // Add more German topics as needed
  },
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
