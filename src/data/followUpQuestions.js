import { energyDictionary } from './energyDictionary';
import { getRandomFromArray } from '../utils/random';

const SUPPORTED_LANGUAGES = ['en', 'fr', 'de'];
const DEFAULT_LANGUAGE = 'en';

const validateLanguage = (language) => {
  if (!language || !SUPPORTED_LANGUAGES.includes(language)) {
    console.warn(`Invalid or unsupported language: ${language}. Falling back to ${DEFAULT_LANGUAGE}`);
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
    "Would you like to dive deeper into {topic}?"
  ],
  fr: [
    "Voulez-vous en savoir plus sur {topic} ?",
    "Souhaitez-vous explorer davantage {topic} ?",
    "Je peux vous en dire plus sur {topic}. Intéressé(e) ?",
    "Il y a plus à apprendre sur {topic}. On continue ?",
    "Voulez-vous approfondir le sujet de {topic} ?"
  ],
  de: [
    "Möchten Sie mehr über {topic} erfahren?",
    "Sollen wir {topic} weiter erkunden?",
    "Ich kann Ihnen mehr über {topic} erzählen. Interessiert?",
    "Es gibt noch mehr über {topic} zu lernen. Weitermachen?",
    "Möchten Sie tiefer in das Thema {topic} einsteigen?"
  ]
};

export const getFollowUpQuestion = (topic, language) => {
  const validLang = validateLanguage(language);
  const dictionary = energyDictionary[validLang];
  
  if (!dictionary || !dictionary[topic]) {
    return null;
  }

  const relatedTopics = dictionary[topic].relatedTopics || [];
  if (relatedTopics.length === 0) {
    return null;
  }

  const phrases = followUpPhrases[validLang] || followUpPhrases[DEFAULT_LANGUAGE];
  const question = getRandomFromArray(phrases).replace('{topic}', topic);

  return {
    topic,
    question,
    topics: relatedTopics,
    language: validLang
  };
};

export const getFollowUpSuggestion = (topic, language) => {
  const validLang = validateLanguage(language);
  const dictionary = energyDictionary[validLang];
  
  if (!dictionary || !dictionary[topic]) {
    return null;
  }

  const relatedTopics = dictionary[topic].relatedTopics || [];
  if (relatedTopics.length === 0) {
    return null;
  }

  return {
    topic,
    topics: relatedTopics,
    language: validLang
  };
};
