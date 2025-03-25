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
import energyTermsPlugin from './nlp/plugins/energyTerms';

// Initialize NLP libraries
nlp.extend(dates);
nlp.extend(numbers);
nlp.extend(sentences);
nlp.extend(energyTermsPlugin);

// Store context for each session
const contextStore = new Map();

/**
 * Process text through NLP pipeline
 */
export const processText = async (text, language = NLP_CONFIG.languages.default) => {
  try {
    // Use compromise to pre-process and extract energy-specific entities
    const doc = nlp(text);
    const energyEntities = {
      types: doc.energyTypes().out('array'),
      terms: doc.energyTerms().out('array'),
      indicators: doc.energyIndicators().out('array')
    };

    // Extract entities first to get canonical forms
    const entities = await entityExtractor.extractEntities(text, language, energyEntities);
    
    // Get intent using extracted entities
    const intentResult = await intentClassifier.classifyIntent(text, entities, language);
    
    // Analyze sentiment
    const sentiment = await sentimentAnalyzer.analyzeSentiment(text, language);
    
    // Update and get context using the conversation manager
    const context = contextManager.updateContext('default', text, {
      entities,
      intent: intentResult.primaryIntent,
      sentiment
    }, language);

    return {
      entities,
      intent: intentResult.primaryIntent,
      allIntents: intentResult.allIntents,
      confidence: intentResult.confidence,
      sentiment,
      context,
      language
    };
  } catch (error) {
    console.error('Error in NLP processing:', error);
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
    const matches = [];

    // First try canonical forms from extracted entities
    if (nlpResult.entities?.energyDomain?.energyTypes) {
      for (const entity of nlpResult.entities.energyDomain.energyTypes) {
        if (entity.canonical && candidates.includes(entity.canonical)) {
          matches.push({
            candidate: entity.canonical,
            score: 1.0,
            confidence: entity.confidence || 1.0
          });
        }
      }
    }

    // If no matches through canonical forms, try fuzzy matching
    if (matches.length === 0) {
      for (const candidate of candidates) {
        const score = calculateSimilarity(text.toLowerCase(), candidate.toLowerCase());
        if (score >= NLP_CONFIG.questionProcessing.minSimilarity) {
          matches.push({
            candidate,
            score,
            confidence: score
          });
        }
      }
    }

    // Sort matches by score
    matches.sort((a, b) => b.score - a.score);

    return {
      matches,
      intent: nlpResult.intent,
      entities: nlpResult.entities,
      confidence: matches[0]?.score || 0
    };
  } catch (error) {
    console.error('Error finding best match:', error);
    return {
      matches: [],
      intent: null,
      entities: null,
      confidence: 0
    };
  }
};

/**
 * Calculate similarity between two strings
 */
function calculateSimilarity(str1, str2) {
  // Simple Levenshtein distance-based similarity
  const distance = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  return 1 - (distance / maxLength);
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[m][n];
}

/**
 * Clear context for a session
 */
export const clearContext = (sessionId = 'default', language = NLP_CONFIG.languages.default) => {
  contextManager.clearContext(sessionId);
};