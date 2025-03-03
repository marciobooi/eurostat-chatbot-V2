import { findIntent, getSentenceSentiment } from './nlpHelper';

const MAX_CONTEXT_LENGTH = 5;
const SENTIMENT_THRESHOLD = 0.3;

export class ContextManager {
  constructor() {
    this.context = {
      currentTopic: null,
      intent: null,
      confidence: 0,
      turnCount: 0,
      previousTopics: [],
      entities: {},
      messageHistory: [],
      overallMood: 0,
      language: null
    };
  }

  addToContext(message, language) {
    try {
      if (!language) {
        console.warn('No language provided to addToContext');
        return this.context;
      }

      // Update current language
      this.context.language = language;

      // Get intent analysis with error handling
      const intentAnalysis = findIntent(message);
      const sentimentScore = getSentenceSentiment(message);

      // Update overall mood (weighted average)
      this.context.overallMood = this.context.messageHistory.length === 0
        ? sentimentScore
        : (this.context.overallMood * 0.7) + (sentimentScore * 0.3);

      // Add message to history with language
      this.context.messageHistory.push({
        message,
        timestamp: Date.now(),
        sentiment: sentimentScore,
        intent: intentAnalysis?.primary || 'unknown',
        language
      });

      // Keep only last N messages
      if (this.context.messageHistory.length > MAX_CONTEXT_LENGTH) {
        this.context.messageHistory.shift();
      }
      
      // Update context with new information
      this.context = {
        ...this.context,
        turnCount: this.context.turnCount + 1,
        intent: {
          primary: intentAnalysis?.primary || 'unknown',
          secondary: intentAnalysis?.secondary,
          confidence: intentAnalysis?.confidence || 0,
          patterns: intentAnalysis?.patterns || []
        },
        entities: {
          ...this.context.entities,
          ...intentAnalysis?.entities
        }
      };

      // If we have a current topic, add it to previous topics before updating
      if (this.context.currentTopic && 
          this.context.currentTopic !== 'unknown' && 
          !this.context.previousTopics.includes(this.context.currentTopic)) {
        this.context.previousTopics.push(this.context.currentTopic);
        
        // Keep only last MAX_CONTEXT_LENGTH topics
        if (this.context.previousTopics.length > MAX_CONTEXT_LENGTH) {
          this.context.previousTopics.shift();
        }
      }

      return this.context;
    } catch (error) {
      console.warn('Error in addToContext:', error);
      // Maintain basic context even if intent analysis fails
      this.context.turnCount += 1;
      return this.context;
    }
  }

  updateCurrentTopic(topic, confidence = 0) {
    if (topic && topic !== 'unknown') {
      this.context.currentTopic = topic;
      this.context.confidence = confidence;
    }
  }

  getCurrentContext() {
    return this.context;
  }

  getCurrentLanguage() {
    return this.context.language;
  }

  getCurrentMood() {
    return {
      mood: this.context.overallMood,
      isPositive: this.context.overallMood > SENTIMENT_THRESHOLD,
      isNegative: this.context.overallMood < -SENTIMENT_THRESHOLD,
      isNeutral: Math.abs(this.context.overallMood) <= SENTIMENT_THRESHOLD
    };
  }

  getContextualSuggestions() {
    const recentMessages = this.context.messageHistory.slice(-3);
    const emotionalState = this.getCurrentMood();
    const currentIntent = this.context.intent?.primary;

    return {
      recentTopics: this.context.previousTopics.slice(-3),
      emotionalState,
      currentIntent,
      needsReassurance: emotionalState.isNegative,
      shouldFollowUp: currentIntent === 'question' || emotionalState.isPositive,
      language: this.context.language
    };
  }

  reset() {
    const currentLang = this.context.language; // Preserve language setting
    this.context = {
      currentTopic: null,
      intent: null,
      confidence: 0,
      turnCount: 0,
      previousTopics: [],
      entities: {},
      messageHistory: [],
      overallMood: 0,
      language: currentLang // Restore language setting
    };
  }
}
