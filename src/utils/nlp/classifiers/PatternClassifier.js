import { BaseClassifier, ClassificationResult } from './BaseClassifier';
import { intentPatterns } from '../../../dictionaries/intentPatterns';
import { energyBalanceIndicators } from '../../../dictionaries/energyBalanceIndicators';
import { NLP_CONFIG } from '../../../config/nlpConfig';

export class PatternClassifier extends BaseClassifier {
  constructor(config = {}) {
    super();
    this.config = {
      confidenceThreshold: NLP_CONFIG.intents.confidenceThreshold,
      ...config
    };
  }

  async predict(text, language = NLP_CONFIG.languages.default) {
    const patterns = intentPatterns[language] || intentPatterns[NLP_CONFIG.languages.default];
    const results = [];

    // Match against intent patterns
    for (const [intent, intentPatterns] of Object.entries(patterns)) {
      const matches = intentPatterns.filter(pattern => pattern.test(text));
      if (matches.length > 0) {
        const confidence = matches.length / intentPatterns.length;
        if (confidence >= this.config.confidenceThreshold) {
          results.push(new ClassificationResult(intent, confidence));
        }
      }
    }

    // Match against energy balance indicators
    for (const [indicator, data] of Object.entries(energyBalanceIndicators)) {
      const matches = data.patterns.filter(pattern => {
        if (pattern instanceof RegExp) {
          return pattern.test(text);
        }
        const regex = new RegExp(`\\b${pattern}\\b`, 'i');
        return regex.test(text);
      });

      if (matches.length > 0) {
        const confidence = matches.length / data.patterns.length;
        if (confidence >= this.config.confidenceThreshold) {
          results.push(new ClassificationResult(data.intent, confidence));
        }
      }
    }

    // Return the result with highest confidence, or default to general_info
    results.sort((a, b) => b.confidence - a.confidence);
    return results[0] || new ClassificationResult('general_info', 0.5);
  }

  async train() {
    // Pattern-based classifier doesn't require training
    return Promise.resolve();
  }

  getConfidence() {
    // Return average confidence across all patterns
    const allPatterns = Object.values(intentPatterns).flat();
    return allPatterns.length > 0 ? 0.7 : 0;
  }
}