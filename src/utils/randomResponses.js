import { getRandomFromArray } from './random';
import { welcomeMessages } from '../data/welcomeMessages';
import { unknownResponses } from '../data/unknownResponses';

export const getRandomWelcomeMessage = (language = 'en') => {
  const messages = welcomeMessages[language] || welcomeMessages.en;
  return getRandomFromArray(messages);
};

export const getRandomUnknownResponse = (language = 'en') => {
  const responses = unknownResponses[language] || unknownResponses.en;
  return getRandomFromArray(responses);
};
