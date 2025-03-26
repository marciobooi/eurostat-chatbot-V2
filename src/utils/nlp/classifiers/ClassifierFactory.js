import { NeuralClassifier } from './NeuralClassifier';
import { DecisionTreeClassifier } from './DecisionTreeClassifier';
import { PatternClassifier } from './PatternClassifier';
import { ModelMetricsCollector } from './ModelMetricsCollector';

/**
 * Factory function for creating classifiers
 */
export function createClassifier(type, config = {}) {
    switch (type) {
        case 'neural':
            return new NeuralClassifier(config);
        case 'decisionTree':
            return new DecisionTreeClassifier(config);
        case 'pattern':
            return new PatternClassifier(config);
        default:
            throw new Error(`Unknown classifier type: ${type}`);
    }
}

export class ClassifierOrchestrator {
    constructor() {
        this.classifiers = {
            neural: new NeuralClassifier(),
            pattern: new PatternClassifier(),
            decisionTree: new DecisionTreeClassifier()
        };
        this.confidenceThreshold = 0.7;
        this.isModelReady = false;
        this.metricsCollector = new ModelMetricsCollector();
    }

    async initialize() {
        // Start with pattern matching (always available)
        this.currentClassifier = this.classifiers.pattern;
        
        // Initialize neural network in background
        this.initializeNeuralNetwork();
    }

    async initializeNeuralNetwork() {
        try {
            await this.classifiers.neural.initialize();
            this.isModelReady = true;
            console.log('Neural network model ready');
        } catch (error) {
            console.error('Error initializing neural network:', error);
        }
    }

    async classify(text, features) {
        const startTime = performance.now();
        
        // Always get pattern matching result first
        const patternResult = await this.classifiers.pattern.predict(text);
        
        if (!this.isModelReady) {
            this.metricsCollector.recordPrediction(startTime, patternResult, null, true);
            return patternResult;
        }

        // If neural network is ready, use it
        const neuralResult = await this.classifiers.neural.predict(features);
        
        // Use neural network result if confidence is high enough
        if (neuralResult.confidence >= this.confidenceThreshold) {
            this.metricsCollector.recordPrediction(startTime, neuralResult);
            return neuralResult;
        }
        
        // Fallback to pattern matching if neural confidence is low
        this.metricsCollector.recordPrediction(startTime, patternResult, null, true);
        return patternResult;
    }

    async train(data) {
        // Train neural network if available
        if (this.classifiers.neural) {
            await this.classifiers.neural.train(data);
            
            // Validate on test set if provided
            if (data.testSet) {
                for (const example of data.testSet) {
                    const startTime = performance.now();
                    const prediction = await this.classifiers.neural.predict(example.features);
                    this.metricsCollector.recordPrediction(startTime, prediction, example.intent);
                }
            }
        }
    }

    getPerformanceMetrics() {
        return this.metricsCollector.getMetricsSummary();
    }

    resetMetrics() {
        this.metricsCollector.reset();
    }
}

export const classifierOrchestrator = new ClassifierOrchestrator();