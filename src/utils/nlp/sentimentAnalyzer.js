import sentiment from 'sentiment';
import Fuse from 'fuse.js';
import { NLP_CONFIG } from '../../config/nlpConfig';
// Import multilang-sentiment directly instead of its JSON files
import multilangSentiment from 'multilang-sentiment';

class SentimentAnalyzer {
  constructor() {
    this.sentimentAnalyzer = new sentiment();
    this.cache = new Map();
    this.initialized = this.initialize();
  }

  async initialize() {
    try {
      // Access the JSON data directly from the package
      const afinn = multilangSentiment.afinn;
      const pattern = multilangSentiment.pattern;

      // Create Fuse instance for pattern matching
      this.fuse = new Fuse(pattern, {
        keys: ['pattern'],
        threshold: 0.4,
        location: 0,
        distance: 100,
        minMatchCharLength: 1
      });

      this.afinn = afinn;
      return true;
    } catch (error) {
      console.error('Failed to initialize sentiment analyzer:', error);
      return false;
    }
  }

  getCacheKey(text, language) {
    return `${language}:${text}`;
  }

  async analyzeSentiment(text, language = NLP_CONFIG.languages.default) {
    const cacheKey = this.getCacheKey(text, language);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Wait for initialization
    await this.initialized;

    try {
      // Get base sentiment using sentiment.js
      const baseResult = this.sentimentAnalyzer.analyze(text);
      let multiLangScore = 0;

      // Calculate multilang sentiment if initialization was successful
      if (this.fuse && this.afinn) {
        const words = text.toLowerCase().split(/\s+/);
        let score = 0;
        const matches = [];

        // Process each word
        words.forEach(word => {
          // Check AFINN dictionary first
          if (this.afinn[language]?.[word]) {
            score += this.afinn[language][word];
            matches.push(word);
            return;
          }

          // Use Fuse for fuzzy pattern matching
          const fuseResults = this.fuse.search(word);
          if (fuseResults.length > 0) {
            const bestMatch = fuseResults[0].item;
            if (bestMatch.language === language || bestMatch.language === 'any') {
              score += bestMatch.weight || 0;
              matches.push(word);
            }
          }
        });

        multiLangScore = score;
      }

      // Combine results using configured weights
      const combinedScore = (
        baseResult.score * NLP_CONFIG.sentiment.weights.winkNLP +
        multiLangScore * NLP_CONFIG.sentiment.weights.multiLang
      );

      const result = {
        score: combinedScore,
        comparative: combinedScore / (text.split(' ').length || 1),
        language,
        classification: this.classifySentiment(combinedScore)
      };

      // Cache the result
      this.cache.set(cacheKey, result);

      // Maintain cache size
      if (this.cache.size > NLP_CONFIG.cache.maxSize) {
        const oldestKey = this.cache.keys().next().value;
        this.cache.delete(oldestKey);
      }

      return result;
    } catch (error) {
      console.error('Error in sentiment analysis:', error);
      // Return neutral sentiment on error
      return {
        score: 0,
        comparative: 0,
        language,
        classification: 'neutral'
      };
    }
  }

  classifySentiment(score) {
    if (score >= NLP_CONFIG.sentiment.thresholds.positive) {
      return 'positive';
    } else if (score <= NLP_CONFIG.sentiment.thresholds.negative) {
      return 'negative';
    }
    return 'neutral';
  }
}

export const sentimentAnalyzer = new SentimentAnalyzer();