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
