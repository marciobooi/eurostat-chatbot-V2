import { BaseClassifier, ClassificationResult } from './BaseClassifier';
import * as tf from '@tensorflow/tfjs';

export class NeuralClassifier extends BaseClassifier {
  constructor(config = {}) {
    super();
    this.model = null;
    this.intentLabels = config.intentLabels || [
      'general_info', 
      'query_trend', 
      'query_trade', 
      'query_production', 
      'query_consumption', 
      'query_comparison'
    ];
    this.inputDimension = config.inputDimension || 20;
    this.hiddenUnits = config.hiddenUnits || 32;
    this.dropoutRate = config.dropoutRate || 0.2;
  }

  async initialize() {
    if (this.model) return;

    this.model = tf.sequential();
    this.model.add(tf.layers.dense({
      units: this.hiddenUnits,
      activation: 'relu',
      inputShape: [this.inputDimension]
    }));
    this.model.add(tf.layers.dropout({ rate: this.dropoutRate }));
    this.model.add(tf.layers.dense({
      units: this.intentLabels.length,
      activation: 'softmax'
    }));

    this.model.compile({
      optimizer: tf.train.adam(),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
  }

  async predict(features) {
    await this.initialize();
    const inputTensor = this.featuresToTensor(features);
    const prediction = await this.model.predict(inputTensor).array();
    const maxIndex = prediction[0].indexOf(Math.max(...prediction[0]));
    
    return new ClassificationResult(
      this.intentLabels[maxIndex],
      prediction[0][maxIndex]
    );
  }

  featuresToTensor(features) {
    const featureArray = Object.values(features);
    while (featureArray.length < this.inputDimension) {
      featureArray.push(0);
    }
    return tf.tensor2d([featureArray]);
  }

  async train(data) {
    await this.initialize();
    const { features, labels } = this.prepareTrainingData(data);
    await this.model.fit(features, labels, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2
    });
  }

  prepareTrainingData(data) {
    // Convert training data to tensors
    const features = tf.tensor2d(data.map(d => Object.values(d.features)));
    const labels = tf.tensor2d(data.map(d => {
      const label = new Array(this.intentLabels.length).fill(0);
      label[this.intentLabels.indexOf(d.intent)] = 1;
      return label;
    }));
    return { features, labels };
  }

  getConfidence() {
    return this.model ? this.model.evaluate(testData).accuracy : 0;
  }
}