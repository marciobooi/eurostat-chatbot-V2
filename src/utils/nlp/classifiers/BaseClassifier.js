/**
 * Base interface for intent classifiers
 */
export class BaseClassifier {
  async predict(features) {
    throw new Error('predict() must be implemented');
  }

  async train(data) {
    throw new Error('train() must be implemented');
  }

  getConfidence() {
    throw new Error('getConfidence() must be implemented');
  }
}

/**
 * Result interface for classification predictions
 */
export class ClassificationResult {
  constructor(intent, confidence, priority = 1) {
    this.intent = intent;
    this.confidence = confidence;
    this.priority = priority;
  }
}