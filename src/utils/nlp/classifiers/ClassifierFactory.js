import { NeuralClassifier } from './NeuralClassifier';
import { PatternClassifier } from './PatternClassifier';
import { ModelMetricsCollector } from './ModelMetricsCollector';

/**
 * Factory function for creating classifiers
 */
export function createClassifier(type, config = {}) {
    switch (type) {
        case 'neural':
            return new NeuralClassifier(config);
        case 'pattern':
            return new PatternClassifier(config);
        default:
            throw new Error(`Unknown classifier type: ${type}`);
    }
}

/**
 * Orchestrates various classification strategies.
 * Prioritizes pattern matching for speed and availability,
 * then attempts to use a neural network for more nuanced classification if available and confident.
 * Falls back to pattern matching if the neural network is not ready or its confidence is low.
 */
export class ClassifierOrchestrator {
    constructor() {
        this.classifiers = {
            neural: new NeuralClassifier(),
            pattern: new PatternClassifier(),
            // DecisionTreeClassifier was removed as it was unused.
        };
        this.confidenceThreshold = 0.7; // Threshold for using neural network results.
        this.isModelReady = false; // Tracks if the neural model has been initialized.
        this.metricsCollector = new ModelMetricsCollector();
    }

    async initialize() {
        // Start with pattern matching as it's lightweight and always available.
        this.currentClassifier = this.classifiers.pattern;
        
        // Asynchronously initialize the neural network in the background.
        // This allows the application to start classifying intents immediately using patterns.
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
        
        // Always get pattern matching result first for baseline and fallback.
        const patternResult = await this.classifiers.pattern.predict(text);
        
        // If the neural network model isn't ready, use the pattern result.
        if (!this.isModelReady) {
            this.metricsCollector.recordPrediction(startTime, patternResult, null, true);
            return patternResult;
        }

        // If neural network is ready, get its prediction.
        const neuralResult = await this.classifiers.neural.predict(features);
        
        // Use neural network result if its confidence meets the threshold.
        if (neuralResult.confidence >= this.confidenceThreshold) {
            this.metricsCollector.recordPrediction(startTime, neuralResult);
            return neuralResult;
        }
        
        // Fallback to pattern matching if neural network confidence is too low.
        this.metricsCollector.recordPrediction(startTime, patternResult, null, true); // True indicates fallback was used
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