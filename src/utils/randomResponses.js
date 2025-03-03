import { welcomeMessages } from '../data/welcomeMessages';
import { unknownResponses } from '../data/unknownResponses';
import { getRandomFromArray } from './random';
import { LanguageValidator } from './languageUtils';
import { getRelatedTopics } from '../data/energyDictionary';

const SUPPORTED_LANGUAGES = ['en', 'fr', 'de'];
const DEFAULT_LANGUAGE = 'en';

const validateLanguage = (language) => {
  if (!language || !SUPPORTED_LANGUAGES.includes(language)) {
    console.warn(`Invalid or unsupported language: ${language}. Falling back to ${DEFAULT_LANGUAGE}`);
    return DEFAULT_LANGUAGE;
  }
  return language;
};

const getRandomUnknownResponse = (language, matchInfo = null) => {
  const validLang = LanguageValidator.validate(language);
  const responses = unknownResponses[validLang] || unknownResponses[LanguageValidator.getDefault()];

  // If we have match info and it's a near match, use more specific responses
  if (matchInfo && matchInfo.score > 0.3 && matchInfo.topic) {
    const suggestions = getRelatedTopics(matchInfo.topic, validLang);
    if (suggestions.length > 0) {
      // Get a near match response and fill in the placeholders
      const template = getRandomFromArray(responses.nearMatch);
      return template
        .replace('{topic}', matchInfo.topic)
        .replace('{suggestions}', suggestions.slice(0, 2).join(' or '));
    }
  }

  // Fall back to general responses
  return getRandomFromArray(responses.general);
};

const getRandomWelcomeMessage = (language) => {
  const validLang = LanguageValidator.validate(language);
  const messages = welcomeMessages[validLang] || welcomeMessages[LanguageValidator.getDefault()];
  return getRandomFromArray(messages);
};

const getContextAwareResponse = (input, contextManager, baseResponse) => {
  const context = contextManager.getCurrentContext();
  const currentLang = context.language || LanguageValidator.getDefault();
  const responses = unknownResponses[currentLang] || unknownResponses[LanguageValidator.getDefault()];
  
  // If confidence is high and mood is positive, add a gratitude suffix
  if (context.confidence > 0.8 && context.overallMood > 0.3) {
    return `${baseResponse} ${responses.gratitudeSuffix}`;
  }

  // If user seems confused or frustrated, add reassurance
  if (context.overallMood < -0.3) {
    return `${responses.reassurancePrefix} ${baseResponse}`;
  }

  return baseResponse;
};

export { getRandomWelcomeMessage, getRandomUnknownResponse, getContextAwareResponse };
