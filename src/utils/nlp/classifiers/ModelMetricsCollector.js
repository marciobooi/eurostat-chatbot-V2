export class ModelMetricsCollector {
    constructor() {
        this.metrics = {
            predictions: 0,
            correctPredictions: 0,
            confidenceScores: [],
            responseTime: [],
            fallbackCount: 0
        };
    }

    recordPrediction(startTime, prediction, actual = null, usedFallback = false) {
        const endTime = performance.now();
        this.metrics.predictions++;
        this.metrics.responseTime.push(endTime - startTime);
        this.metrics.confidenceScores.push(prediction.confidence);
        
        if (usedFallback) {
            this.metrics.fallbackCount++;
        }

        if (actual !== null && prediction.intent === actual) {
            this.metrics.correctPredictions++;
        }
    }

    getAccuracy() {
        if (this.metrics.predictions === 0) return 0;
        return this.metrics.correctPredictions / this.metrics.predictions;
    }

    getAverageConfidence() {
        if (this.metrics.confidenceScores.length === 0) return 0;
        const sum = this.metrics.confidenceScores.reduce((a, b) => a + b, 0);
        return sum / this.metrics.confidenceScores.length;
    }

    getAverageResponseTime() {
        if (this.metrics.responseTime.length === 0) return 0;
        const sum = this.metrics.responseTime.reduce((a, b) => a + b, 0);
        return sum / this.metrics.responseTime.length;
    }

    getFallbackRate() {
        if (this.metrics.predictions === 0) return 0;
        return this.metrics.fallbackCount / this.metrics.predictions;
    }

    getMetricsSummary() {
        return {
            accuracy: this.getAccuracy(),
            averageConfidence: this.getAverageConfidence(),
            averageResponseTime: this.getAverageResponseTime(),
            fallbackRate: this.getFallbackRate(),
            totalPredictions: this.metrics.predictions
        };
    }

    reset() {
        this.metrics = {
            predictions: 0,
            correctPredictions: 0,
            confidenceScores: [],
            responseTime: [],
            fallbackCount: 0
        };
    }
}