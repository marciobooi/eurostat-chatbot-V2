import { BaseClassifier, ClassificationResult } from './BaseClassifier';

class TreeNode {
  constructor(feature, threshold, left, right, value = null) {
    this.feature = feature;
    this.threshold = threshold;
    this.left = left;
    this.right = right;
    this.value = value;
  }

  predict(features) {
    if (this.value !== null) return this.value;
    return features[this.feature] >= this.threshold 
      ? this.right.predict(features) 
      : this.left.predict(features);
  }
}

export class DecisionTreeClassifier extends BaseClassifier {
  constructor(config = {}) {
    super();
    this.tree = null;
    this.confidence = 0.8; // Base confidence for decision tree
    this.config = config;
  }

  buildTree() {
    // Build a decision tree based on domain knowledge
    return new TreeNode(
      'hasEnergyType', 0.5,
      new TreeNode(
        'hasDate', 0.5,
        new TreeNode(null, null, null, null, 'general_info'),
        new TreeNode('hasComparison', 0.5,
          new TreeNode(null, null, null, null, 'query_trend'),
          new TreeNode(null, null, null, null, 'query_trend')
        )
      ),
      new TreeNode(
        'hasTradeTerms', 0.5,
        new TreeNode(
          'hasProductionTerms', 0.5,
          new TreeNode(null, null, null, null, 'query_consumption'),
          new TreeNode(null, null, null, null, 'query_production')
        ),
        new TreeNode(null, null, null, null, 'query_trade')
      )
    );
  }

  async predict(features) {
    if (!this.tree) {
      this.tree = this.buildTree();
    }
    
    const intent = this.tree.predict(features);
    return new ClassificationResult(intent, this.confidence);
  }

  async train(data) {
    // Decision tree is pre-defined based on domain knowledge
    // but could be enhanced to learn from data
    this.tree = this.buildTree();
  }

  getConfidence() {
    return this.confidence;
  }
}