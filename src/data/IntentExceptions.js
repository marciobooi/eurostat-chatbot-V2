/**
 * Intent Exceptions
 * 
 * This file contains phrases and words that should NOT be spell-corrected
 * because they are intentional greetings, farewells, or other recognized intents
 * in different languages. This prevents spell correction from interfering
 * with intent detection.
 */

import i18n from '../i18n/index.js';

// Multi-language intent phrases that should never be spell-corrected
const intentExceptions = {
  en: {
    greetings: [
      'hello', 'hi', 'hey', 'hiya', 'howdy',
      'good morning', 'good afternoon', 'good evening',
      'greetings', 'salutations', 'welcome'
    ],
    farewells: [
      'goodbye', 'bye', 'farewell', 'see you', 'take care',
      'good night', 'goodnight', 'later', 'cheerio',
      'so long', 'until next time', 'catch you later'
    ]
  },
  fr: {
    greetings: [
      'bonjour', 'salut', 'bonsoir', 'bonne matinée',
      'bonne journée', 'bonne soirée', 'coucou', 'allô',
      'enchanté', 'ravi de vous rencontrer'
    ],
    farewells: [
      'au revoir', 'aurevoir', 'à bientôt', 'à plus tard',
      'à plus', 'bonne nuit', 'bonne soirée', 'à demain',
      'bye', 'ciao', 'salut', 'adieu', 'à la prochaine',
      'bonne journée', 'bon week-end', 'bonnes vacances'
    ]
  },
  de: {
    greetings: [
      'hallo', 'guten tag', 'guten morgen', 'guten abend',
      'hi', 'hey', 'servus', 'moin', 'grüß gott',
      'freut mich', 'schön sie zu treffen'
    ],
    farewells: [
      'auf wiedersehen', 'tschüss', 'bis bald', 'bis später',
      'gute nacht', 'bis morgen', 'schönen tag noch',
      'bis dann', 'ciao', 'bye', 'ade', 'pfiat di',
      'servus', 'machs gut', 'schönes wochenende'
    ]
  }
};

/**
 * Get all intent exception phrases for the current language
 */
export const getIntentExceptions = () => {
  const currentLanguage = i18n.language || 'en';
  const langExceptions = intentExceptions[currentLanguage] || intentExceptions.en;
  
  // Combine all intent phrases into a single array
  const allExceptions = [
    ...langExceptions.greetings,
    ...langExceptions.farewells
  ];
  
  return allExceptions;
};

/**
 * Get greeting exception phrases for the current language
 */
export const getGreetingExceptions = () => {
  const currentLanguage = i18n.language || 'en';
  const langExceptions = intentExceptions[currentLanguage] || intentExceptions.en;
  return langExceptions.greetings;
};

/**
 * Get farewell exception phrases for the current language
 */
export const getFarewellExceptions = () => {
  const currentLanguage = i18n.language || 'en';
  const langExceptions = intentExceptions[currentLanguage] || intentExceptions.en;
  return langExceptions.farewells;
};

/**
 * Check if a text contains any intent exception phrases that should not be spell-corrected
 */
export const containsIntentException = (text) => {
  const normalizedText = text.toLowerCase().trim();
  const exceptions = getIntentExceptions();
  
  // Check for exact phrase matches
  return exceptions.some(exception => {
    const normalizedException = exception.toLowerCase();
    return normalizedText === normalizedException ||
           normalizedText.includes(normalizedException);
  });
};

/**
 * Extract intent exception phrases from text to preserve them during spell correction
 */
export const extractIntentExceptions = (text) => {
  const normalizedText = text.toLowerCase().trim();
  const exceptions = getIntentExceptions();
  const foundExceptions = [];
  
  exceptions.forEach(exception => {
    const normalizedException = exception.toLowerCase();
    if (normalizedText.includes(normalizedException)) {
      foundExceptions.push({
        original: exception,
        normalized: normalizedException,
        startIndex: normalizedText.indexOf(normalizedException),
        endIndex: normalizedText.indexOf(normalizedException) + normalizedException.length
      });
    }
  });
  
  // Sort by start index to handle overlapping exceptions properly
  return foundExceptions.sort((a, b) => a.startIndex - b.startIndex);
};

/**
 * Check if a specific word is part of an intent exception phrase
 */
export const isWordInIntentException = (word, text) => {
  const normalizedWord = word.toLowerCase();
  const normalizedText = text.toLowerCase().trim();
  const exceptions = getIntentExceptions();
  
  return exceptions.some(exception => {
    const normalizedException = exception.toLowerCase();
    const exceptionWords = normalizedException.split(/\s+/);
    
    // Check if the word is part of this exception phrase AND the phrase exists in the text
    return exceptionWords.includes(normalizedWord) && 
           normalizedText.includes(normalizedException);
  });
};

export default {
  getIntentExceptions,
  getGreetingExceptions,
  getFarewellExceptions,
  containsIntentException,
  extractIntentExceptions,
  isWordInIntentException
};
