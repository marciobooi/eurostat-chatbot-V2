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
import { energyTermsEn, energyTermsFr, energyTermsDe } from './nlp/plugins/energyTerms';
import { commonQuestionPhrases } from '../dictionaries/questionPhrases';

// Initialize base NLP library with common plugins
nlp.extend(dates);
nlp.extend(numbers);
nlp.extend(sentences);

// Map of language plugins
const languagePlugins = {
  en: energyTermsEn,
  fr: energyTermsFr,
  de: energyTermsDe
};

// Store context for each session
const contextStore = new Map();

/**
 * Process text with language-specific plugin
 */
const processWithLanguage = (text, language) => {
  const plugin = languagePlugins[language] || languagePlugins[NLP_CONFIG.languages.default];
  const instance = nlp.extend(plugin);
  return instance(text);
};

/**
 * Extract term from text using question patterns
 */
function extractTermFromQuestion(text, language) {
  const questionPatterns = commonQuestionPhrases[language] || commonQuestionPhrases[NLP_CONFIG.languages.default];
  const cleanedText = text.toLowerCase().trim();

  for (const pattern of questionPatterns) {
    if (pattern instanceof RegExp) {
      const match = cleanedText.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  }
  return cleanedText;
}

/**
 * Process text through NLP pipeline
 */
export const processText = async (text, language = NLP_CONFIG.languages.default, lastMentionedCountry = null, lastMentionedEnergyType = null) => {
  try {
    // Resolve anaphora using the context from the previous turn
    const resolvedText = contextManager.resolveAnaphora(text, lastMentionedCountry, lastMentionedEnergyType);

    // Use resolvedText for all subsequent processing instead of the original 'text'
    const questionTerms = [];
    const extractedTerm = extractTermFromQuestion(resolvedText, language); // Use resolvedText
    if (extractedTerm && extractedTerm !== resolvedText.toLowerCase().trim()) {
      questionTerms.push(extractedTerm);
    }
    
    const doc = processWithLanguage(resolvedText, language); // Use resolvedText
    
    // Extract energy-specific entities
    const energyTypes = doc.energyTypes().out('array') || [];
    const energyTerms = doc.energyTerms().out('array') || [];
    const energyIndicators = doc.energyIndicators().out('array') || [];

    const energyEntities = {
      types: Array.isArray(energyTypes) ? energyTypes : [],
      terms: [...(Array.isArray(energyTerms) ? energyTerms : []), ...questionTerms],
      indicators: Array.isArray(energyIndicators) ? energyIndicators : []
    };

    // Extract entities first to get canonical forms
    const entities = await entityExtractor.extractEntities(resolvedText, language, energyEntities); // Use resolvedText
    
    // Get intent using extracted entities
    const intentResult = await intentClassifier.classifyIntent(resolvedText, entities, language); // Use resolvedText
    
    // Analyze sentiment
    const sentiment = await sentimentAnalyzer.analyzeSentiment(resolvedText, language); // Use resolvedText, though sentiment might be better on original
    
    // Update and get context using the conversation manager
    const context = contextManager.updateContext('default', text, { // Original text for history
      entities,
      intent: intentResult.primaryIntent,
      sentiment
    }, language, { lastMentionedCountry, lastMentionedEnergyType }); // Pass previous turn context

    return {
      entities,
      intent: intentResult.primaryIntent,
      allIntents: intentResult.allIntents,
      confidence: intentResult.confidence,
      sentiment,
      context, // This context is now based on processing resolvedText
      language,
      originalText: text, // Optionally return original text
      resolvedText: resolvedText // Optionally return resolved text for debugging/transparency
    };
  } catch (error) {
    console.error('Error in NLP processing:', error);
    return defaultNlpResponse(language);
  }
};

function defaultNlpResponse(language) {
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
    // Pass language and previous context to findBestMatch's processText call if it's intended to be context-aware for matching
    // For now, assuming findBestMatch's internal processText call is for simpler, non-contextual processing or it handles its own context.
    const nlpResult = await processText(text, language); // Removed undefined lastMentionedCountry, lastMentionedEnergyType
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