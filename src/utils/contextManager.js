import { findIntent } from "./nlpHelper";
import { LanguageValidator } from "./languageUtils";

/**
 * A simple context manager to track conversation context and provide contextual responses
 */
export class ContextManager {
  constructor() {
    this.recentTopics = [];
    this.recentQueries = [];
    this.topicCounts = {};
    this.conversationLength = 0;
    this.contextualMood = {
      urgency: 1,
      engagement: 1,
    };
  }

  /**
   * Add a user query and topic to the context
   */
  addToContext(query, topic, language = "en") {
    this.recentQueries.push({ query, timestamp: Date.now(), language });
    if (this.recentQueries.length > 10) this.recentQueries.shift();

    this.conversationLength++;

    if (topic !== "unknown") {
      if (!this.topicCounts[topic]) {
        this.topicCounts[topic] = 0;
      }
      this.topicCounts[topic]++;

      // Add to recent topics if not already there
      if (!this.recentTopics.includes(topic)) {
        this.recentTopics.push(topic);
        if (this.recentTopics.length > 5) {
          this.recentTopics.shift();
        }
      }
    }

    // Update mood based on conversation patterns
    this.updateMood(query, topic);
  }

  /**
   * Get current mood of the conversation
   */
  getCurrentMood() {
    return this.contextualMood;
  }

  /**
   * Get typing speed factor based on context
   */
  getTypingSpeed() {
    return 1 / this.contextualMood.urgency;
  }

  /**
   * Get contextual suggestions based on conversation
   */
  getContextualSuggestions() {
    const shouldFollowUp =
      this.conversationLength >= 2 && this.recentTopics.length >= 1;

    return {
      recentTopics: this.recentTopics,
      mostDiscussedTopic: this.getMostDiscussedTopic(),
      conversationLength: this.conversationLength,
      shouldFollowUp,
      emotionalState: this.getEmotionalState(),
    };
  }

  /**
   * Get the most discussed topic
   */
  getMostDiscussedTopic() {
    let maxCount = 0;
    let mostDiscussed = null;

    Object.entries(this.topicCounts).forEach(([topic, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostDiscussed = topic;
      }
    });

    return mostDiscussed;
  }

  /**
   * Get a suggested list of topics based on context
   */
  getSuggestedTopics() {
    return this.recentTopics;
  }

  /**
   * Detect emotional state from conversation
   */
  getEmotionalState() {
    // Simple implementation - could be enhanced with sentiment analysis
    return {
      isPositive: this.contextualMood.engagement > 1.2,
      isNegative: this.contextualMood.engagement < 0.8,
    };
  }

  /**
   * Update mood based on user interaction
   */
  updateMood(query, topic) {
    // Simple mood detection - could be enhanced with ML
    const queryLength = query.length;
    const isQuestion = query.includes("?");
    const isExclamation = query.includes("!");

    // Adjust urgency based on punctuation and query patterns
    if (isQuestion) {
      this.contextualMood.urgency += 0.1;
    } else if (isExclamation) {
      this.contextualMood.urgency += 0.2;
    } else {
      this.contextualMood.urgency = Math.max(
        0.8,
        this.contextualMood.urgency - 0.05
      );
    }

    // Adjust engagement based on query length and topic continuity
    if (queryLength > 50) {
      this.contextualMood.engagement += 0.1;
    } else if (queryLength < 15) {
      this.contextualMood.engagement -= 0.1;
    }

    // Cap mood values
    this.contextualMood.urgency = Math.min(
      2.0,
      Math.max(0.5, this.contextualMood.urgency)
    );
    this.contextualMood.engagement = Math.min(
      2.0,
      Math.max(0.5, this.contextualMood.engagement)
    );
  }

  /**
   * Clear the context
   */
  clearContext() {
    this.recentTopics = [];
    this.recentQueries = [];
    this.topicCounts = {};
    this.conversationLength = 0;
    this.contextualMood = {
      urgency: 1,
      engagement: 1,
    };
  }
}
