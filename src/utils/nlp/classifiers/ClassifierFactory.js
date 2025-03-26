/**
 * Factory function for creating classifiers
 */
export function createClassifier(type, config = {}) {
  switch (type) {
    case 'neural':
      return import('./NeuralClassifier').then(m => new m.NeuralClassifier(config));
    case 'decision_tree':
      return import('./DecisionTreeClassifier').then(m => new m.DecisionTreeClassifier(config));
    case 'pattern':
      return import('./PatternClassifier').then(m => new m.PatternClassifier(config));
    default:
      throw new Error(`Unknown classifier type: ${type}`);
  }
}