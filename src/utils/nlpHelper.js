import { commonQuestionPhrases } from '../data/questionPhrases';
import nlp from 'compromise';
import sentences from 'compromise-sentences';
import numbers from 'compromise-numbers';
import dates from 'compromise-dates';
import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';

// Initialize NLP processors and extend Compromise with plugins
const nlpProcessor = winkNLP(model);
nlp.extend(sentences);
nlp.extend(numbers);
nlp.extend(dates);

// Helper function to safely get tokens from winkNLP
const safeTokenize = (text) => {
  if (!text || typeof text !== 'string') return [];
  try {
    const doc = nlpProcessor.readDoc(text);
    return doc.tokens().out();
  } catch (error) {
    console.warn('Error in safeTokenize:', error);
    return text.toLowerCase().split(/\s+/); // Fallback to simple tokenization
  }
};

export const cleanQuery = (query = '') => {
  if (!query) return '';
  
  try {
    const tokens = safeTokenize(query);
    return tokens
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .trim();
  } catch (error) {
    console.warn('Error in cleanQuery:', error);
    return query.toLowerCase().trim();
  }
};

export const extractTopicFromQuery = (query, language) => {
  try {
    const cleanedQuery = cleanQuery(query);
    if (!cleanedQuery || !language) return '';

    // For single-word queries, return as is if they're not in filtered words
    if (!cleanedQuery.includes(' ')) {
      return cleanedQuery;
    }

    const phrases = commonQuestionPhrases[language];
    if (!phrases) {
      console.warn(`No question phrases found for language: ${language}`);
      return cleanedQuery;
    }
    
    // Use compromise for initial processing
    let doc = nlp(cleanedQuery);
    
    // Remove question phrases
    phrases.forEach(phrase => {
      doc = doc.replace(phrase, '');
    });

    // Extract topics and nouns
    const topics = doc.topics().text();
    const nouns = doc.nouns().text();
    
    // Use the most specific information available
    return topics || nouns || cleanedQuery;
  } catch (error) {
    console.warn('Error in extractTopicFromQuery:', error);
    return query.trim();
  }
};

export const extractEntities = (text) => {
  if (!text) return { organizations: [], places: [], numbers: [], dates: [] };
  
  try {
    const doc = nlp(text);
    
    // Initialize with empty arrays
    const entities = {
      organizations: [],
      places: [],
      numbers: [],
      dates: []
    };

    // Extract organizations (fallback to nouns starting with capital letters)
    const orgs = doc.match('#Organization+').out('array');
    entities.organizations = orgs.length ? orgs : doc.match('[A-Z][a-z]+').out('array');

    // Extract places
    entities.places = doc.places().out('array');

    // Extract numbers using the numbers plugin
    entities.numbers = doc.numbers().out('array');

    // Extract dates using the dates plugin, with fallback
    try {
      entities.dates = doc.dates().out('array');
    } catch (error) {
      console.warn('Date extraction failed, using fallback:', error);
      entities.dates = doc.match('(january|february|march|april|may|june|july|august|september|october|november|december|year|month|week|day|today|tomorrow|yesterday)').out('array');
    }

    return entities;
  } catch (error) {
    console.warn('Error in extractEntities:', error);
    return { organizations: [], places: [], numbers: [], dates: [] };
  }
};

export const getSentenceSentiment = (text) => {
  if (!text) return 0;
  
  try {
    const doc = nlp(text);
    // Use simple word matching for sentiment
    const positive = doc.match('(good|great|excellent|awesome|nice|wonderful|fantastic|amazing|love|happy|positive|helpful)').length;
    const negative = doc.match('(bad|poor|terrible|awful|horrible|hate|negative|unhelpful|wrong|worse|worst)').length;
    
    return (positive - negative) / (positive + negative + 1);
  } catch (error) {
    console.warn('Error in getSentenceSentiment:', error);
    return 0;
  }
};

export const extractKeyPhrases = (text) => {
  if (!text) return [];
  
  try {
    const doc = nlp(text);
    return doc
      .phrases()
      .json()
      .map(phrase => phrase.text)
      .filter(phrase => phrase.split(' ').length > 1);
  } catch (error) {
    console.warn('Error in extractKeyPhrases:', error);
    return [];
  }
};

export const detectLanguage = (text) => {
  if (!text) return null;
  
  try {
    const words = safeTokenize(text);
    
    const langScores = {
      en: 0,
      fr: 0,
      de: 0
    };

    words.forEach(word => {
      if (commonQuestionPhrases.en.some(phrase => word.includes(phrase))) langScores.en++;
      if (commonQuestionPhrases.fr.some(phrase => word.includes(phrase))) langScores.fr++;
      if (commonQuestionPhrases.de.some(phrase => word.includes(phrase))) langScores.de++;
    });

    // Find language with highest score
    const [detectedLang, score] = Object.entries(langScores)
      .reduce((a, b) => a[1] > b[1] ? a : b);
    
    // Only return detected language if we have some confidence
    return score > 0 ? detectedLang : null;
  } catch (error) {
    console.warn('Error in detectLanguage:', error);
    return null;
  }
};

export const findIntent = (text) => {
  if (!text) {
    return {
      primary: 'unknown',
      secondary: null,
      patterns: [],
      sentenceType: 'statement',
      entities: {},
      confidence: 0
    };
  }

  try {
    const doc = nlp(text);
    
    // Get basic sentence type
    const sentenceType = doc.sentences().json()[0]?.type || 'statement';
    
    // Get intent analysis
    const isQuestion = sentenceType === 'question' || text.includes('?');
    const isCommand = doc.verbs().isImperative().length > 0;
    const sentimentValue = getSentenceSentiment(text);
    const isSentiment = Math.abs(sentimentValue) > 0.3;
    
    // Check for specific patterns
    const patterns = {
      greeting: doc.has('(hello|hi|hey|good morning|good afternoon|good evening)'),
      farewell: doc.has('(goodbye|bye|see you|farewell)'),
      thanks: doc.has('(thank|thanks|appreciate)'),
      help: doc.has('(help|assist|support)'),
      compare: doc.has('(compare|versus|vs|difference between)'),
      definition: doc.has('(what is|what are|define|meaning of|definition)'),
      howTo: doc.has('(how to|how do|how can|how would)'),
      location: doc.has('(where|location|country|region)'),
      time: doc.has('(when|time|date|year|period)'),
      quantity: doc.has('(how many|how much|quantity|amount)')
    };

    // Get entities
    const entities = extractEntities(text);

    // Get detected patterns
    const detectedPatterns = Object.entries(patterns)
      .filter(([_, hasPattern]) => hasPattern)
      .map(([intent]) => intent);

    let primaryIntent = 'unknown';
    let secondaryIntent = null;
    let confidence = 0.2; // Base confidence

    if (isQuestion) {
      primaryIntent = 'question';
      secondaryIntent = detectedPatterns[0] || 'general';
      confidence += 0.3;
    } else if (isCommand) {
      primaryIntent = 'command';
      secondaryIntent = detectedPatterns[0] || 'action';
      confidence += 0.3;
    } else if (isSentiment) {
      primaryIntent = 'sentiment';
      secondaryIntent = sentimentValue > 0 ? 'positive' : 'negative';
      confidence += 0.2;
    } else if (detectedPatterns.length > 0) {
      primaryIntent = detectedPatterns[0];
      secondaryIntent = detectedPatterns[1] || null;
      confidence += 0.2;
    }

    // Add confidence from pattern matching
    confidence += Math.min(detectedPatterns.length * 0.1, 0.3);
    
    // Add confidence from entity detection
    const entityCount = Object.values(entities)
      .reduce((sum, arr) => sum + arr.length, 0);
    confidence += Math.min(entityCount * 0.1, 0.2);

    return {
      primary: primaryIntent,
      secondary: secondaryIntent,
      patterns: detectedPatterns,
      sentenceType,
      entities,
      confidence: Math.min(confidence, 1) // Normalize to 0-1 range
    };
  } catch (error) {
    console.warn('Error in findIntent:', error);
    return {
      primary: 'unknown',
      secondary: null,
      patterns: [],
      sentenceType: 'statement',
      entities: {},
      confidence: 0
    };
  }
};