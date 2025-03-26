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
    this.embeddingDim = config.embeddingDim || 50;
    this.vocabSize = config.vocabSize || 10000;
  }

  async saveModel() {
    if (!this.model) return;
    try {
      await this.model.save('indexeddb://eurostat-chatbot-model');
      console.log('Model saved successfully');
    } catch (error) {
      console.error('Error saving model:', error);
    }
  }

  async loadModel() {
    try {
      this.model = await tf.loadLayersModel('indexeddb://eurostat-chatbot-model');
      console.log('Model loaded successfully');
      return true;
    } catch (error) {
      console.log('No saved model found, initializing new model');
      return false;
    }
  }

  async initialize() {
    if (this.model) return;

    // Try to load existing model first
    const modelLoaded = await this.loadModel();
    if (modelLoaded) return;

    const input = tf.input({shape: [this.inputDimension]});
    
    // Embedding layer
    const embedded = tf.layers.embedding({
      inputDim: this.vocabSize,
      outputDim: this.embeddingDim,
      inputLength: this.inputDimension
    }).apply(input);

    // Reshape for sequence processing
    const reshape1 = tf.layers.reshape({
      targetShape: [this.inputDimension, this.embeddingDim]
    }).apply(embedded);

    // Dense layer for feature extraction
    const dense1 = tf.layers.dense({
      units: this.embeddingDim,
      activation: 'relu'
    }).apply(reshape1);
    
    // Flatten the output instead of using global pooling
    const flattened = tf.layers.flatten().apply(dense1);
    
    // Dense layers with dropout
    const dense2 = tf.layers.dense({
      units: this.hiddenUnits,
      activation: 'relu'
    }).apply(flattened);
    
    const dropout = tf.layers.dropout({
      rate: this.dropoutRate
    }).apply(dense2);

    const output = tf.layers.dense({
      units: this.intentLabels.length,
      activation: 'softmax'
    }).apply(dropout);

    this.model = tf.model({inputs: input, outputs: output});
    
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
    
    // Train the model
    await this.model.fit(features, labels, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
        }
      }
    });

    // Save model after training
    await this.saveModel();
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