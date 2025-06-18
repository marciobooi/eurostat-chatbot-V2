/**
 * Ambiguous phrases and question words that need clarification
 * These are typically very short or vague inputs that don't provide 
 * enough context for meaningful energy-related responses
 */

export const AMBIGUOUS_QUESTION_WORDS = [
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
];

export const AMBIGUOUS_PHRASES = [
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
];

/**
 * Check if a phrase is too ambiguous and needs clarification
 * @param {string} phrase - The phrase to check
 * @returns {boolean} - True if the phrase needs clarification
 */
export const isAmbiguousPhrase = (phrase) => {
  const lowerPhrase = phrase.toLowerCase().trim();
  
  // Check exact matches first
  if (AMBIGUOUS_PHRASES.includes(lowerPhrase)) {
    return true;
  }
  
  // Check if it starts with ambiguous patterns
  const ambiguousStarters = [
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
  return AMBIGUOUS_QUESTION_WORDS.includes(word.toLowerCase().trim());
};
