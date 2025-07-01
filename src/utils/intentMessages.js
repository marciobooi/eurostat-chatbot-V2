import { findBestMatch } from './ruler.js';
import { getGreetingWords, getGreetingResponses } from '../data/greetings.js';
import { getGoodbyeWords, getFarewellResponses } from '../data/farewell.js';
import { spellingCorrections, containsIntentException, isWordInIntentException } from '../data/SpellingCorrections.js';
import { applyPhraseCorrections } from '../data/PhraseCorrections.js';
import { getRandomUnknownResponse } from '../data/UnknownResponses.js';
import { getEnergyKeywords, isEnergyRelated } from '../data/EnergyKeywords.js';
import { isAmbiguousPhrase, isAmbiguousWord } from '../data/AmbiguousPhrases.js';
import { getRandomStarter, getConfidencePhrase, getSubfuelIntro } from '../data/DefinitionStarters.js';
import { isDataQuery, formatDataQueryResponse } from './dataQuery.js';
import { containsCountry, getAllCountryPatterns } from '../data/Countries.js';
import { isDefinitionQuestion, cleanQuestionForDefinition } from '../data/QuestionPatterns.js';
import i18n from '../i18n/index.js';
import nspell from 'nspell';

/**
 * Message flow for the chat
 * 
 * This implements a comprehensive intent flow processing for the messages 
 * using dictionaries from the data folder for consistent and maintainable classification
 * 
 * Dictionary Integration:
 * - EnergyKeywords.js: Contains comprehensive energy-related terms for recognition
 * - AmbiguousPhrases.js: Defines vague inputs that need clarification
 * - greetings.js: Greeting patterns and response variations
 * - farewell.js: Farewell patterns and response variations
 * - UnknownResponses.js: Randomized responses for different unknown scenarios
 * * Message Flow:
 * 1. User Input → Trim + Lowercase + Tokenization
 * 2. Check spelling with nspell and corrections
 * 3. Detect greetings → provide random greeting response
 * 4. Detect farewells → provide random farewell response
 * 5. Check for ambiguous inputs → provide clarification request
 * 6. Detect data queries (country + date + fuel) → structured data query response
 * 7. Find definition (delegate to ruler) → structured energy definition response
 * 8. Default → helpful fallback response
 * 
 * All responses use dictionary-based randomization for natural conversation
 */

// Intent types
export const INTENT_TYPES = {
  GREETING: 'greeting',
  FAREWELL: 'farewell',
  DEFINITION: 'definition',
  DATA_QUERY: 'data_query',
  UNKNOWN: 'unknown'
};

// Response types for different intents
export const RESPONSE_TYPES = {
  GREETING: 'greeting_response',
  FAREWELL: 'farewell_response',
  DEFINITION: 'definition_response',
  DATA_QUERY: 'data_query_response',
  ERROR: 'error_response',
  FALLBACK: 'fallback_response'
};

// Initialize spell checker (will be loaded asynchronously based on language)
let spellChecker = null;
let currentSpellCheckerLanguage = null;

/**
 * Initialize spell checker for a specific language
 */
const initSpellChecker = async (language = 'en') => {
  try {
    if (typeof window !== 'undefined') {
      // Only reload if language has changed or spellChecker is null
      if (currentSpellCheckerLanguage === language && spellChecker !== null) {
        return; // Already loaded for this language
      }
      
      // Browser environment - try to load dictionary files for the specified language
      try {
        const [affResponse, dicResponse] = await Promise.all([
          fetch(`dictionaries/${language}.aff`),
          fetch(`dictionaries/${language}.dic`)
        ]);
        
        if (affResponse.ok && dicResponse.ok) {
          const aff = await affResponse.text();
          const dic = await dicResponse.text();
          spellChecker = nspell(aff, dic);
          currentSpellCheckerLanguage = language;
          console.log(`Spell checker initialized with ${language.toUpperCase()} dictionary files`);
        } else {
          console.log(`Dictionary files for ${language} not available, using corrections only`);
          spellChecker = null;
          currentSpellCheckerLanguage = null;
        }
      } catch (error) {
        console.log(`Dictionary files for ${language} not available, using corrections only`);
        spellChecker = null;
        currentSpellCheckerLanguage = null;
      }
    }
  } catch (error) {
    console.log(`Spell checker initialization failed for ${language}, using corrections only`);
    spellChecker = null;
    currentSpellCheckerLanguage = null;
  }
};

/**
 * Ensure spell checker is loaded for the current language
 */
const ensureSpellCheckerForCurrentLanguage = async () => {
  const currentLanguage = i18n.language || 'en';
  
  // Only initialize if we don't have a spell checker for the current language
  if (currentSpellCheckerLanguage !== currentLanguage) {
    await initSpellChecker(currentLanguage);
  }
};

// Spell checker will be initialized on-demand based on current language

// Listen for language changes and reinitialize spell checker
if (typeof window !== 'undefined') {
  i18n.on('languageChanged', (lng) => {
    console.log(`Language changed to ${lng}, will reload spell checker on next use`);
    // Reset current language tracker so spell checker reloads on next use
    currentSpellCheckerLanguage = null;
    spellChecker = null;
  });
}

/**
 * Simple tokenization - split on whitespace and punctuation
 */
const tokenize = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s'-]/g, ' ') // Keep apostrophes and hyphens
    .split(/\s+/)
    .filter(token => token.length > 0);
};

/**
 * Spell correction using nspell or fallback corrections
 * Enhanced for data query context and intent preservation
 */
const correctSpelling = async (word, fullText = '') => {
  const lowerWord = word.toLowerCase();
  
  // Don't correct valid years (1990-2030)
  const yearMatch = /^(19[9]\d|20[0-3]\d)$/.test(word);
  if (yearMatch) {
    return word; // Return the year unchanged
  }
  
  // Don't correct words that are part of intent exceptions (greetings, farewells)
  if (fullText && isWordInIntentException(word, fullText)) {
    console.log(`[correctSpelling] Preserving intent exception word: "${word}" in context: "${fullText}"`);
    return word; // Return the word unchanged to preserve intent
  }
  
  // Don't correct country names - check if the word is a known country
  const countryPatterns = getAllCountryPatterns();
  const isCountryName = countryPatterns.some(country => 
    country.toLowerCase() === lowerWord
  );
  if (isCountryName) {
    return word; // Return the country name unchanged
  }
  
  // First check our custom corrections dictionary
  if (spellingCorrections[lowerWord]) {
    return spellingCorrections[lowerWord];
  }
  
  // Ensure spell checker is loaded for current language
  await ensureSpellCheckerForCurrentLanguage();
  
  // Then try nspell if available
  if (spellChecker) {
    // Check if word is already correct
    if (spellChecker.correct(lowerWord)) {
      return word; // Word is correct, return original case
    }
    
    // Get suggestions for misspelled word
    const suggestions = spellChecker.suggest(lowerWord);
    if (suggestions.length > 0) {
      // For data queries, prefer energy-related suggestions
      const currentEnergyKeywords = getEnergyKeywords();
      const energySuggestion = suggestions.find(suggestion => 
        isEnergyRelated(suggestion) || 
        currentEnergyKeywords.some(keyword => keyword.includes(suggestion.toLowerCase()))
      );
      if (energySuggestion) {
        return energySuggestion;
      }
      
      // Check if any suggestion is a country name - avoid correcting to wrong countries
      const countrySuggestion = suggestions.find(suggestion =>
        countryPatterns.some(country => country.toLowerCase() === suggestion.toLowerCase())
      );
      
      if (countrySuggestion) {
        return countrySuggestion;
      }
      
      // Return the first (most likely) suggestion
      return suggestions[0];
    }
  }
  
  return word; // Return original if no correction found
};

/**
 * Apply spell correction to a text string with enhanced data query support
 * and intent preservation
 */
const correctText = async (text) => {
  let correctedText = text;
  
  // Check if the text contains intent exceptions that should be preserved
  if (containsIntentException(text)) {
    console.log(`[correctText] Text contains intent exceptions, applying limited correction: "${text}"`);
    
    // For intent exception texts, only apply phrase corrections but be very conservative with spell correction
    correctedText = applyPhraseCorrections(correctedText);
    
    // Skip individual word spell correction for intent exception phrases to preserve them
    return correctedText;
  }
  
  // First apply context-aware phrase corrections from the PhraseCorrections dictionary
  correctedText = applyPhraseCorrections(correctedText);
  
  // Then apply individual word spell correction to remaining words
  const tokens = tokenize(correctedText);
  
  const correctedTokens = await Promise.all(tokens.map(async (token) => {
    const corrected = await correctSpelling(token, text); // Pass full text for context
    return corrected;
  }));
  
  const finalText = correctedTokens.join(' ');
  
  return finalText;
};

/**
 * Check if input contains greeting words
 */
const detectGreeting = (tokens) => {
  const currentLanguage = i18n.language || 'en';
  const greetingWords = getGreetingWords();
  
  console.log(`[detectGreeting] Current language: ${currentLanguage}, Greeting words:`, greetingWords.slice(0, 5), '...');
  
  // Join tokens to check for multi-word greetings first
  const fullText = tokens.join(' ');
  
  // Check for exact multi-word greeting matches first
  const multiWordMatch = greetingWords.some(greeting => {
    const normalizedGreeting = greeting.toLowerCase().trim();
    return fullText === normalizedGreeting || fullText.startsWith(normalizedGreeting + ' ') || fullText.endsWith(' ' + normalizedGreeting);
  });
  
  if (multiWordMatch) {
    console.log(`[detectGreeting] Multi-word greeting detected: "${fullText}"`);
    return true;
  }
  
  // For single token matches, be more strict - only exact matches or meaningful partials
  const isGreeting = tokens.some(token => {
    // Direct exact match
    const directMatch = greetingWords.includes(token);
    
    // Only allow partial matches for tokens that are reasonable substrings of greetings
    // Avoid matching common question words like "what", "how", etc. unless they're standalone greetings
    const meaningfulPartialMatch = token.length >= 3 && greetingWords.some(greeting => {
      const greetingTokens = greeting.toLowerCase().split(/\s+/);
      return greetingTokens.includes(token) && !['what', 'how', 'when', 'where', 'why', 'who', 'are'].includes(token);
    });
    
    if (directMatch || meaningfulPartialMatch) {
      console.log(`[detectGreeting] Single token greeting detected: "${token}"`);
    }
    
    return directMatch || meaningfulPartialMatch;
  });
  
  return isGreeting;
};

/**
 * Check if input contains farewell words
 */
const detectFarewell = (tokens) => {
  const currentLanguage = i18n.language || 'en';
  const farewellWords = getGoodbyeWords();
  
  console.log(`[detectFarewell] Current language: ${currentLanguage}, Farewell words:`, farewellWords.slice(0, 5), '...');
  
  // Join tokens to check for multi-word farewells first
  const fullText = tokens.join(' ');
  
  // Check for exact multi-word farewell matches first
  const multiWordMatch = farewellWords.some(farewell => {
    const normalizedFarewell = farewell.toLowerCase().trim();
    const match = fullText === normalizedFarewell || fullText.startsWith(normalizedFarewell + ' ') || fullText.endsWith(' ' + normalizedFarewell);
    if (match) {
      console.log(`[detectFarewell] Multi-word farewell detected: "${fullText}" matches "${normalizedFarewell}"`);
    }
    return match;
  });
  
  if (multiWordMatch) {
    return true;
  }
  
  // For single token matches, be more strict - only exact matches
  const singleTokenMatch = tokens.some(token => {
    const match = farewellWords.some(farewell => farewell.toLowerCase() === token);
    if (match) {
      console.log(`[detectFarewell] Single token farewell detected: "${token}"`);
    }
    return match;
  });
  
  return singleTokenMatch;
};

/**
 * Get random response from array
 */
const getRandomResponse = (responseArray) => {
  if (!Array.isArray(responseArray) || responseArray.length === 0) {
    return i18n.t('errors.noSpecificResponse');
  }
  const randomIndex = Math.floor(Math.random() * responseArray.length);
  return responseArray[randomIndex];
};

/**
 * Check if input is too short or ambiguous and needs clarification
 */
const needsClarification = (text, tokens) => {
  // Very short inputs (1-2 characters)
  if (text.length <= 2) {
    return true;
  }
    // Check if the entire phrase is ambiguous
  if (isAmbiguousPhrase(text)) {
    return true;
  }
    // If it's a definition question, don't require clarification
  if (isDefinitionQuestion(text)) {
    return false;
  }
  
  // Single word that's not a greeting, farewell, or energy-related term
  if (tokens.length === 1) {
    const token = tokens[0];
    const greetingWords = getGreetingWords();
    const farewellWords = getGoodbyeWords();
    
    // Check if it's an ambiguous word
    if (isAmbiguousWord(token)) {
      return true;
    }
    
    // Check if it's a known greeting or farewell
    const isGreetingOrFarewell = greetingWords.includes(token) ||
                                farewellWords.some(farewell => farewell.toLowerCase().includes(token));
    
    // Check if it's energy-related
    const isEnergyWord = isEnergyRelated(token);
    
    // If it's not a greeting, farewell, or energy-related, it needs clarification
    if (!isGreetingOrFarewell && !isEnergyWord) {
      return true;
    }
  }
    // Short phrases with ambiguous question words - but not if they're definition questions
  if (tokens.length <= 2 && tokens.some(token => isAmbiguousWord(token)) && !isDefinitionQuestion(text)) {
    return true;
  }
  
  return false;
};

/**
 * Classify user intent based on input
 */
const classifyIntent = (text, tokens) => {
  // Check for data queries FIRST (priority for country + date + fuel combinations)
  const isDataQueryResult = isDataQuery(text, tokens);
  
  if (isDataQueryResult) {
    return INTENT_TYPES.DATA_QUERY;
  }
  
  // Check for greetings (after data query check)
  const isGreeting = detectGreeting(tokens);
  
  if (isGreeting) {
    return INTENT_TYPES.GREETING;
  }
  
  // Check for farewells
  if (detectFarewell(tokens)) {
    return INTENT_TYPES.FAREWELL;
  }
  
  // Check if input needs clarification
  if (needsClarification(text, tokens)) {
    return INTENT_TYPES.UNKNOWN;
  }
  
  // Check if it's a definition question (after data query and greeting checks)
  const isDefQuestion = isDefinitionQuestion(text);
  
  if (isDefQuestion) {
    return INTENT_TYPES.DEFINITION;
  }
  
  // If not greeting, farewell, ambiguous, data query, or definition question, assume it's a definition request
  // The ruler will determine if it's actually answerable
  return INTENT_TYPES.DEFINITION;
};

/**
 * Format definition response from ruler match
 */
const formatDefinitionResponse = (match, result) => {
  if (!match) {
    return {
      type: RESPONSE_TYPES.FALLBACK,
      content: getRandomUnknownResponse('no_match'),
      isError: false
    };
  }

  // Get starter phrase and confidence phrase
  const starter = getRandomStarter();
  const confidencePhrase = getConfidencePhrase(result.confidence * 100);
  
  // Start with confidence phrase and starter
  let response = `${confidencePhrase} ${starter} **${match.title}**:\n\n`;
  
  // Add fuel code if available
  if (match.fuelCode) {
    response += `**Fuel Code:** ${match.fuelCode}\n\n`;
  }
  
  // Add definition text
  if (match.text) {
    response += `${match.text}`;  }  // Extract nrg_bal codes for stacked charts if available
  const nrgBalCodes = (match.visualizationType && 
                       match.visualizationType.includes('stacked') && 
                       match.nrg_bal && 
                       Array.isArray(match.nrg_bal)) ? match.nrg_bal : null;
  
    return {
    type: RESPONSE_TYPES.DEFINITION,
    content: response,
    matchData: result,
    subfuels: match.subFuels || [],
    hasVisualization: match.hasVisualization || false,
    visualizationType: match.visualizationType || [],
    link: match.link || '',
    // API parameters for chart data
    dataset: match.dataset || 'nrg_ind_id',
    indicator_type: match.indicator_type || 'INDIC_NRG',
    fuelCode: match.fuelCode || '',
    nrgBalCodes: nrgBalCodes,
    isError: false
  };
};

/**
 * Main message processing function
 * Processes user input and returns appropriate response
 */
export const processMessage = async (userInput) => {
  try {
    // Step 1: Clean and normalize input
    const cleanInput = userInput.trim();
    if (!cleanInput) {
      return {
        type: RESPONSE_TYPES.ERROR,
        content: i18n.t('errors.emptyMessage'),
        isError: true
      };
    }
    
    // Step 2: Tokenize input
    const tokens = tokenize(cleanInput);
    
    // Step 3: Apply enhanced spell correction for data queries
    const correctedText = await correctText(cleanInput);
    
    // Step 4: Classify intent - use original text for intent exceptions, corrected text otherwise
    const textForIntent = containsIntentException(cleanInput) ? cleanInput : correctedText;
    const tokensForIntent = tokenize(textForIntent);
    const intent = classifyIntent(textForIntent, tokensForIntent);
    
    console.log(`[processMessage] Original: "${cleanInput}", Corrected: "${correctedText}", Intent text: "${textForIntent}", Intent: ${intent}`);
    
    // Step 5: Generate response based on intent
    switch (intent) {
      case INTENT_TYPES.GREETING:
        return {
          type: RESPONSE_TYPES.GREETING,
          content: getRandomResponse(getGreetingResponses()),
          isError: false
        };
      
      case INTENT_TYPES.FAREWELL:
        return {
          type: RESPONSE_TYPES.FAREWELL,
          content: getRandomResponse(getFarewellResponses()),
          isError: false
        };
        
      case INTENT_TYPES.DATA_QUERY:
        return await formatDataQueryResponse(correctedText, tokens);
      
      case INTENT_TYPES.UNKNOWN:
        return {
          type: RESPONSE_TYPES.FALLBACK,
          content: getRandomUnknownResponse('clarification'),
          isError: false
        };
        
      case INTENT_TYPES.DEFINITION:
        // Clean question text for better definition matching
        const cleanedText = isDefinitionQuestion(correctedText) ? 
          cleanQuestionForDefinition(correctedText) : correctedText;
        
        // Delegate to ruler for definition matching
        const result = await findBestMatch(cleanedText);
        return formatDefinitionResponse(result?.match, result);
        
      default:
        return {
          type: RESPONSE_TYPES.FALLBACK,
          content: getRandomUnknownResponse('unknown'),
          isError: false
        };
    }
    
  } catch (error) {
    console.error('Error processing message:', error);
    return {
      type: RESPONSE_TYPES.ERROR,
      content: i18n.t('errors.processingError'),
      isError: true
    };
  }
};



