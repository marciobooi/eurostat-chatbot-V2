import nlp from 'compromise';
import dates from 'compromise-dates';
import numbers from 'compromise-numbers';
import sentences from 'compromise-sentences';
import stringSimilarity from 'string-similarity';
import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';
import multilangSentiment from 'multilang-sentiment';
import Sentiment from 'sentiment';
import { energyDictionary } from './energyDictionary';
import { CONFIG } from '../i18n';
import { NLP_CONFIG } from '../config/nlpConfig';
import { sentimentAnalyzer } from './nlp/sentimentAnalyzer';
import { entityExtractor } from './nlp/entityExtractor';
import { intentClassifier } from './nlp/intentClassifier';
import { contextManager } from './nlp/contextManager';

// Initialize NLP libraries
nlp.extend(dates);
nlp.extend(numbers);
nlp.extend(sentences);
const winkNlp = winkNLP(model);
const sentiment = new Sentiment();

// Store context for each session
const contextStore = new Map();

/**
 * Process text through NLP pipeline
 */
export const processText = async (text, language = NLP_CONFIG.languages.default) => {
  try {
    // Extract entities first
    const entities = await entityExtractor.extractEntities(text, language);
    
    // Get intent and sentiment
    const [intentResult, sentimentResult] = await Promise.all([
      intentClassifier.classifyIntent(text, entities, language),
      sentimentAnalyzer.analyzeSentiment(text, language)
    ]);

    // Create consolidated NLP result with proper structure
    const nlpResult = {
      entities: {
        standardEntities: entities.standardEntities || {},
        energyDomain: entities.energyDomain || {
          energyTypes: [],
          metrics: [],
          timeframes: []
        }
      },
      intent: intentResult.primaryIntent,
      intentDetails: intentResult,
      sentiment: sentimentResult,
      language
    };

    // Update context with properly structured data
    const context = contextManager.updateContext(
      'default',
      text,
      nlpResult,
      language
    );

    return {
      ...nlpResult,
      context
    };
  } catch (error) {
    console.error('Error in NLP processing:', error);
    // Return safe defaults on error
    return {
      entities: {
        standardEntities: {},
        energyDomain: {
          energyTypes: [],
          metrics: [],
          timeframes: []
        }
      },
      intent: 'general_info',
      sentiment: { score: 0, comparative: 0 },
      context: null,
      language
    };
  }
};

/**
 * Extract sentiment from text
 */
export const analyzeSentiment = async (text, language = NLP_CONFIG.languages.default) => {
  return sentimentAnalyzer.analyzeSentiment(text, language);
};

/**
 * Extract entities from text
 */
export const extractEntities = async (text, language = NLP_CONFIG.languages.default) => {
  return entityExtractor.extractEntities(text, language);
};

/**
 * Find best matching topic or intent
 */
export const findBestMatch = async (text, candidates, language = NLP_CONFIG.languages.default) => {
  try {
    const nlpResult = await processText(text, language);
    const intent = await intentClassifier.classifyIntent(text, nlpResult.entities, language);

    return {
      text,
      matches: candidates.map(candidate => ({
        candidate,
        score: calculateMatchScore(text, candidate, nlpResult, intent)
      })).sort((a, b) => b.score - a.score),
      intent: intent.primaryIntent,
      confidence: intent.confidence
    };
  } catch (error) {
    console.error('Error finding best match:', error);
    return {
      text,
      matches: [],
      error: true
    };
  }
};

/**
 * Calculate match score between text and candidate
 */
const calculateMatchScore = (text, candidate, nlpResult, intent) => {
  let score = 0;

  // Add intent confidence
  if (intent?.confidence) {
    score += intent.confidence * 0.3;
  }

  // Add entity matches
  const energyDomain = nlpResult?.entities?.energyDomain || {};
  if (energyDomain) {
    // Check energy types
    const energyTypes = energyDomain.energyTypes || [];
    if (energyTypes.some(entity => candidate.toLowerCase().includes(entity.text.toLowerCase()))) {
      score += 0.4;
    }

    // Check metrics
    const metrics = energyDomain.metrics || [];
    if (metrics.some(entity => candidate.toLowerCase().includes(entity.text.toLowerCase()))) {
      score += 0.3;
    }
  }

  // Add text similarity (basic for now)
  const textSimilarity = calculateTextSimilarity(text.toLowerCase(), candidate.toLowerCase());
  score += textSimilarity * 0.2;

  return score;
};

/**
 * Calculate basic text similarity
 */
const calculateTextSimilarity = (text1, text2) => {
  const words1 = new Set(text1.split(/\s+/));
  const words2 = new Set(text2.split(/\s+/));
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  return intersection.size / union.size;
};

/**
 * Clear context for a session
 */
export const clearContext = (sessionId = 'default', language = NLP_CONFIG.languages.default) => {
  contextManager.clearContext(sessionId);
};