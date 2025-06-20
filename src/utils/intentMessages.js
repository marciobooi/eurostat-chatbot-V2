import { findBestMatch } from './ruler.js';
import { GREETING_WORDS, GREETING_RESPONSES } from '../data/greetings.js';
import { goodbyeWords, FAREWELL_RESPONSES } from '../data/farewell.js';
import { spellingCorrections } from '../data/SpellingCorrections.js';
import { getRandomUnknownResponse } from '../data/UnknownResponses.js';
import { energyKeywords, isEnergyRelated } from '../data/EnergyKeywords.js';
import { isAmbiguousPhrase, isAmbiguousWord, AMBIGUOUS_QUESTION_WORDS } from '../data/AmbiguousPhrases.js';
import { getRandomStarter, getConfidencePhrase, getSubfuelIntro } from '../data/DefinitionStarters.js';
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

// Initialize spell checker (will be loaded asynchronously)
let spellChecker = null;

/**
 * Initialize spell checker with fallback to corrections dictionary
 */
const initSpellChecker = async () => {
  try {
    if (typeof window !== 'undefined') {
      // Browser environment - try to load dictionary files
      try {
        const [affResponse, dicResponse] = await Promise.all([
          fetch('dictionaries/en.aff'),
          fetch('dictionaries/en.dic')
        ]);
        
        if (affResponse.ok && dicResponse.ok) {
          const aff = await affResponse.text();
          const dic = await dicResponse.text();
          spellChecker = nspell(aff, dic);
          console.log('Spell checker initialized with dictionary files');
        }
      } catch (error) {
        console.log('Dictionary files not available, using corrections only');
      }
    }
  } catch (error) {
    console.log('Spell checker initialization failed, using corrections only');
  }
};

// Initialize spell checker
initSpellChecker();

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
 */
const correctSpelling = (word) => {
  // First check our custom corrections dictionary
  if (spellingCorrections[word]) {
    return spellingCorrections[word];
  }
  
  // Then try nspell if available
  if (spellChecker && !spellChecker.correct(word)) {
    const suggestions = spellChecker.suggest(word);
    if (suggestions.length > 0) {
      return suggestions[0]; // Return best suggestion
    }
  }
  
  return word; // Return original if no correction found
};

/**
 * Apply spell correction to a text string
 */
const correctText = (text) => {
  const tokens = tokenize(text);
  const correctedTokens = tokens.map(token => correctSpelling(token));
  return correctedTokens.join(' ');
};

/**
 * Check if input contains greeting words
 */
const detectGreeting = (tokens) => {
  const greetingWords = GREETING_WORDS.en || [];
  return tokens.some(token => 
    greetingWords.includes(token) || 
    greetingWords.some(greeting => greeting.includes(token))
  );
};

/**
 * Check if input contains farewell words
 */
const detectFarewell = (tokens) => {
  const farewellWords = goodbyeWords.en || [];
  return tokens.some(token => 
    farewellWords.some(farewell => 
      farewell.toLowerCase().includes(token) || token.includes(farewell.toLowerCase())
    )
  );
};

/**
 * Common country names and codes for detection
 */
const COUNTRY_PATTERNS = [
  // EU countries (full names first for better matching)
  'austria', 'belgium', 'bulgaria', 'croatia', 'cyprus', 'czechia', 'czech republic',
  'denmark', 'estonia', 'finland', 'france', 'germany', 'greece', 'hungary',
  'ireland', 'italy', 'latvia', 'lithuania', 'luxembourg', 'malta', 'netherlands',
  'poland', 'portugal', 'romania', 'slovakia', 'slovenia', 'spain', 'sweden',
  'united kingdom', 'united states', 'great britain',
  // Other common countries (full names)
  'norway', 'switzerland', 'iceland', 'turkey', 'russia', 'china', 'japan', 
  'india', 'brazil', 'canada', 'australia', 'south africa', 'new zealand',
  // Country codes (2-letter codes should be checked more carefully)
  'at', 'be', 'bg', 'hr', 'cy', 'cz', 'dk', 'ee', 'fi', 'fr', 'de', 'gr', 'hu',
  'ie', 'it', 'lv', 'lt', 'lu', 'mt', 'nl', 'pl', 'pt', 'ro', 'sk', 'si', 'es', 'se',
  'uk', 'us', 'gb', 'no', 'ch', 'is', 'tr', 'ru', 'cn', 'jp', 'in', 'br', 'ca'
];

/**
 * Date patterns for detection
 */
const DATE_PATTERNS = [
  // Years (1990-2030)
  /\b(19[9]\d|20[0-3]\d)\b/,
  // Date formats (MM/YYYY, YYYY-MM, etc.)
  /\b\d{1,2}\/\d{4}\b/,
  /\b\d{4}-\d{1,2}\b/,
  /\b\d{1,2}-\d{4}\b/,
  // Month names
  /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/,
  /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/
];

/**
 * Check if input contains country references
 */
const detectCountry = (text, tokens) => {
  const lowerText = text.toLowerCase();
  
  // Check for country names in the full text
  const hasCountryInText = COUNTRY_PATTERNS.some(country => 
    lowerText.includes(country.toLowerCase())
  );
  
  // Check for country names in tokens
  const hasCountryInTokens = tokens.some(token => 
    COUNTRY_PATTERNS.some(country => 
      country.toLowerCase() === token || 
      country.toLowerCase().includes(token) ||
      token.includes(country.toLowerCase())
    )
  );
  
  return hasCountryInText || hasCountryInTokens;
};

/**
 * Check if input contains date references
 */
const detectDate = (text, tokens) => {
  const lowerText = text.toLowerCase();
  
  // Check regex patterns
  const hasDatePattern = DATE_PATTERNS.some(pattern => pattern.test(lowerText));
  
  // Check for year tokens (4-digit numbers that could be years)
  const hasYearToken = tokens.some(token => {
    const num = parseInt(token);
    return !isNaN(num) && num >= 1990 && num <= 2030;
  });
  
  return hasDatePattern || hasYearToken;
};

/**
 * Check if input contains fuel/energy references
 */
const detectFuel = (text, tokens) => {
  // Use existing energy keywords detection
  return isEnergyRelated(text) || tokens.some(token => isEnergyRelated(token));
};

/**
 * Check if input is a data query (contains country, date, and fuel)
 */
const detectDataQuery = (text, tokens) => {
  const hasCountry = detectCountry(text, tokens);
  const hasDate = detectDate(text, tokens);
  const hasFuel = detectFuel(text, tokens);
  
  return hasCountry && hasDate && hasFuel;
};

/**
 * Get random response from array
 */
const getRandomResponse = (responseArray) => {
  if (!Array.isArray(responseArray) || responseArray.length === 0) {
    return "I understand, but I don't have a specific response for that right now.";
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
  
  // Single word that's not a greeting, farewell, or energy-related term
  if (tokens.length === 1) {
    const token = tokens[0];
    const greetingWords = GREETING_WORDS.en || [];
    const farewellWords = goodbyeWords.en || [];
    
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
  
  // Short phrases with ambiguous question words
  if (tokens.length <= 2 && tokens.some(token => isAmbiguousWord(token))) {
    return true;
  }
  
  return false;
};

/**
 * Classify user intent based on input
 */
const classifyIntent = (text, tokens) => {
  // Check for greetings first
  if (detectGreeting(tokens)) {
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
  
  // Check for data queries (country + date + fuel) after clarification check
  if (detectDataQuery(text, tokens)) {
    return INTENT_TYPES.DATA_QUERY;
  }
  
  // If not greeting, farewell, ambiguous, or data query, assume it's a definition request
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
    response += `${match.text}`;
  }
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
    isError: false
  };
};

/**
 * Format data query response with extracted entities
 */
const formatDataQueryResponse = (text, tokens) => {
  // Extract entities from the query
  const entities = extractDataQueryEntities(text, tokens);
  
  return {
    type: RESPONSE_TYPES.DATA_QUERY,
    content: `I understand you're looking for data about **${entities.fuel}** in **${entities.country}** for **${entities.date}**. Let me fetch that information for you.`,
    entities: entities,
    hasVisualization: true,
    visualizationType: ['chart', 'table'],
    // Default dataset for energy data
    dataset: 'nrg_ind_id',
    indicator_type: 'INDIC_NRG',
    isError: false
  };
};

/**
 * Extract country, date, and fuel entities from text
 */
const extractDataQueryEntities = (text, tokens) => {
  const lowerText = text.toLowerCase();
  
  // Extract country - prioritize longer matches
  let country = null;
  const sortedCountries = COUNTRY_PATTERNS.sort((a, b) => b.length - a.length); // Sort by length desc
  for (const countryPattern of sortedCountries) {
    if (lowerText.includes(countryPattern.toLowerCase())) {
      country = countryPattern;
      break;
    }
  }
  
  // Extract date/year
  let date = null;
  for (const pattern of DATE_PATTERNS) {
    const match = lowerText.match(pattern);
    if (match) {
      date = match[0];
      break;
    }
  }
  
  // If no regex match, look for year tokens
  if (!date) {
    const yearToken = tokens.find(token => {
      const num = parseInt(token);
      return !isNaN(num) && num >= 1990 && num <= 2030;
    });
    if (yearToken) {
      date = yearToken;
    }
  }
  
  // Extract fuel/energy type - prioritize longer matches for compound terms
  let fuel = null;
  const sortedEnergyKeywords = energyKeywords.sort((a, b) => b.length - a.length);
  
  // First try to find compound fuel terms in the original text
  const compoundFuelTerms = [
    'solid fossil fuels', 'renewable energy', 'nuclear energy', 'natural gas',
    'crude oil', 'fossil fuels', 'solar energy', 'wind energy', 'hydro energy',
    'biomass energy', 'geothermal energy'
  ];
  
  for (const compound of compoundFuelTerms) {
    if (lowerText.includes(compound.toLowerCase())) {
      fuel = compound;
      break;
    }
  }
  
  // If no compound term found, try individual keywords
  if (!fuel) {
    for (const term of sortedEnergyKeywords) {
      if (lowerText.includes(term.toLowerCase())) {
        fuel = term;
        break;
      }
    }
  }
  
  return {
    country: country || 'unspecified country',
    date: date || 'unspecified date',
    fuel: fuel || 'energy'
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
        content: "Please enter a message.",
        isError: true
      };
    }

    // Step 2: Tokenize input
    const tokens = tokenize(cleanInput);
    
    // Step 3: Apply spell correction
    const correctedText = correctText(cleanInput);
    
    // Step 4: Classify intent
    const intent = classifyIntent(correctedText, tokens);      // Step 5: Generate response based on intent
    switch (intent) {
      case INTENT_TYPES.GREETING:
        return {
          type: RESPONSE_TYPES.GREETING,
          content: getRandomResponse(GREETING_RESPONSES.en),
          isError: false
        };
      
      case INTENT_TYPES.FAREWELL:
        return {
          type: RESPONSE_TYPES.FAREWELL,
          content: getRandomResponse(FAREWELL_RESPONSES.en),
          isError: false
        };
      
      case INTENT_TYPES.DATA_QUERY:
        return formatDataQueryResponse(correctedText, tokens);
      
      case INTENT_TYPES.UNKNOWN:
        return {
          type: RESPONSE_TYPES.FALLBACK,
          content: getRandomUnknownResponse('clarification'),
          isError: false
        };
      
      case INTENT_TYPES.DEFINITION:
        // Delegate to ruler for definition matching
        const result = findBestMatch(correctedText);
        return formatDefinitionResponse(result?.match, result);
      
      case INTENT_TYPES.DATA_QUERY:
        // Extract entities and format response
        return formatDataQueryResponse(correctedText, tokens);
        
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
      content: "Sorry, I encountered an error while processing your request. Please try again.",
      isError: true
    };
  }
};



