/**
 * Ambiguous phrases and question words that need clarification
 * These are typically very short or vague inputs that don't provide 
 * enough context for meaningful energy-related responses
 */

import i18n from '../i18n/index.js';

const ambiguousQuestionWordsData = {
  en: [
    // Basic question words
    'what',
    'how',
    'why',
    'when',
    'where',
    'who',
    'which',
    
    // Vague help requests
    'help',
    'info',
    'information',
    'tell',
    'explain',
    'show',
    'give',
    'find',
    'search',
    'look',
    
    // Too general requests
    'anything',
    'something',
    'everything',
    'nothing',
    'stuff',
    'things',
    'data',
    'details',
    'facts',
    
    // Single characters or symbols
    '?',
    '!',
    '.',
    '-',
    '+',
    '*',
    '/',
    '=',
    
    // Very short responses
    'ok',
    'yes',
    'no',
    'maybe',
    'sure',
    'fine',
    'good',
    'bad',
    'hmm',
    'uhm',
    'uh',
    'ah',
    'oh',
    
    // Incomplete phrases
    'i want',
    'i need',
    'can you',
    'could you',
    'would you',
    'will you',
    'do you',
    'are you',
    'is there',
    'are there',
    'tell me about',
    'what about',
    'how about'
  ],
  
  fr: [
    // Mots de question de base
    'quoi',
    'que',
    'qu\'est-ce que',
    'comment',
    'pourquoi',
    'quand',
    'où',
    'qui',
    'quel',
    'quelle',
    'lequel',
    'laquelle',
    
    // Demandes d'aide vagues
    'aide',
    'info',
    'information',
    'dis',
    'dites',
    'expliquer',
    'expliquez',
    'montrer',
    'montrez',
    'donner',
    'donnez',
    'trouver',
    'trouvez',
    'chercher',
    'cherchez',
    'regarder',
    'regardez',
    
    // Demandes trop générales
    'n\'importe quoi',
    'quelque chose',
    'tout',
    'rien',
    'trucs',
    'choses',
    'données',
    'détails',
    'faits',
    
    // Réponses très courtes
    'd\'accord',
    'oui',
    'non',
    'peut-être',
    'sûr',
    'bien',
    'bon',
    'mauvais',
    'hmm',
    'euh',
    'ah',
    'oh',
    
    // Phrases incomplètes
    'je veux',
    'j\'ai besoin',
    'pouvez-vous',
    'pourriez-vous',
    'voudriez-vous',
    'faites-vous',
    'êtes-vous',
    'y a-t-il',
    'dites-moi',
    'qu\'en est-il'
  ],
  
  de: [
    // Grundlegende Fragewörter
    'was',
    'wie',
    'warum',
    'wann',
    'wo',
    'wer',
    'welcher',
    'welche',
    'welches',
    
    // Vage Hilfeanfragen
    'hilfe',
    'info',
    'information',
    'sagen',
    'erklären',
    'zeigen',
    'geben',
    'finden',
    'suchen',
    'schauen',
    
    // Zu allgemeine Anfragen
    'alles',
    'etwas',
    'nichts',
    'sachen',
    'dinge',
    'daten',
    'details',
    'fakten',
    
    // Sehr kurze Antworten
    'ok',
    'okay',
    'ja',
    'nein',
    'vielleicht',
    'sicher',
    'gut',
    'schlecht',
    'hmm',
    'äh',
    'ah',
    'oh',
    
    // Unvollständige Phrasen
    'ich will',
    'ich brauche',
    'können sie',
    'könnten sie',
    'würden sie',
    'machen sie',
    'sind sie',
    'gibt es',
    'sagen sie mir',
    'was ist mit'
  ]
};

const ambiguousPhrasesData = {
  en: [
    // Too vague energy requests
    'energy',
    'power',
    'fuel',
    'data',
    'statistics',
    'information',
    'help',
    'explain',
    'tell me',
    'show me',
    'i want to know',
    'what is',
    'how do',
    'can you help',
    'i need help',
    'i need information',
    'give me data',
    'tell me about energy',
    'explain energy',
    'energy help',
    'energy info',
    'energy data',
    'fuel help',
    'power help'
  ],
  
  fr: [
    // Demandes d'énergie trop vagues
    'énergie',
    'puissance',
    'carburant',
    'données',
    'statistiques',
    'information',
    'aide',
    'expliquer',
    'dis-moi',
    'montrez-moi',
    'je veux savoir',
    'qu\'est-ce que',
    'comment faire',
    'pouvez-vous aider',
    'j\'ai besoin d\'aide',
    'j\'ai besoin d\'information',
    'donnez-moi des données',
    'parlez-moi d\'énergie',
    'expliquez l\'énergie',
    'aide énergie',
    'info énergie',
    'données énergie',
    'aide carburant',
    'aide puissance'
  ],
  
  de: [
    // Zu vage Energieanfragen
    'energie',
    'strom',
    'kraftstoff',
    'daten',
    'statistiken',
    'information',
    'hilfe',
    'erklären',
    'sag mir',
    'zeig mir',
    'ich möchte wissen',
    'was ist',
    'wie mache',
    'können sie helfen',
    'ich brauche hilfe',
    'ich brauche information',
    'geben sie mir daten',
    'erzählen sie mir über energie',
    'erklären sie energie',
    'energie hilfe',
    'energie info',
    'energie daten',
    'kraftstoff hilfe',
    'strom hilfe'
  ]
};

// Function to get ambiguous question words for current language
export const getAmbiguousQuestionWords = () => {
  const currentLanguage = i18n.language || 'en';
  return ambiguousQuestionWordsData[currentLanguage] || ambiguousQuestionWordsData.en;
};

// Function to get ambiguous phrases for current language
export const getAmbiguousPhrases = () => {
  const currentLanguage = i18n.language || 'en';
  return ambiguousPhrasesData[currentLanguage] || ambiguousPhrasesData.en;
};

// Legacy exports for backward compatibility
export const AMBIGUOUS_QUESTION_WORDS = getAmbiguousQuestionWords();
export const AMBIGUOUS_PHRASES = getAmbiguousPhrases();

/**
 * Check if a phrase is too ambiguous and needs clarification
 * @param {string} phrase - The phrase to check
 * @returns {boolean} - True if the phrase needs clarification
 */
export const isAmbiguousPhrase = (phrase) => {
  const lowerPhrase = phrase.toLowerCase().trim();
  const currentPhrases = getAmbiguousPhrases();
  
  // Check exact matches first
  if (currentPhrases.includes(lowerPhrase)) {
    return true;
  }
  
  // Get language-specific ambiguous starters
  const currentLanguage = i18n.language || 'en';
  let ambiguousStarters = [];
  
  if (currentLanguage === 'fr') {
    ambiguousStarters = [
      'qu\'est-ce que',
      'comment faire',
      'pouvez-vous',
      'pourriez-vous',
      'voudriez-vous',
      'dites-moi',
      'montrez-moi',
      'expliquer',
      'aidez-moi',
      'je veux',
      'j\'ai besoin'
    ];
  } else if (currentLanguage === 'de') {
    ambiguousStarters = [
      'was ist',
      'wie mache',
      'können sie',
      'könnten sie',
      'würden sie',
      'sagen sie mir',
      'zeigen sie mir',
      'erklären',
      'helfen sie mir',
      'ich will',
      'ich brauche'
    ];
  } else {
    ambiguousStarters = [
      'what is',
      'how do',
      'can you',
      'could you',
      'would you',
      'will you',
      'tell me',
      'show me',
      'explain',
      'help me',
      'i want',
      'i need'
    ];
  }
  
  return ambiguousStarters.some(starter => 
    lowerPhrase.startsWith(starter) && lowerPhrase.length < starter.length + 10
  );
};

/**
 * Check if a single word is ambiguous
 * @param {string} word - The word to check
 * @returns {boolean} - True if the word is ambiguous
 */
export const isAmbiguousWord = (word) => {
  const currentQuestionWords = getAmbiguousQuestionWords();
  return currentQuestionWords.includes(word.toLowerCase().trim());
};
