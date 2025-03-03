import { LanguageValidator } from "./languageUtils";

/**
 * Analytics manager to track user interactions with the chatbot
 */
export class AnalyticsManager {
  constructor() {
    this.interactions = {
      userMessages: 0,
      botMessages: 0,
      successfulResponses: 0,
      failedResponses: 0,
      topicsDiscussed: new Set(),
      sessionsCount: 0,
      speechRecognitionUsed: 0,
      suggestionsClicked: 0,
    };

    this.currentSession = {
      startTime: new Date(),
      language: "en",
      messageCount: 0,
      topics: new Set(),
    };
  }

  /**
   * Track a user message
   * @param {string} message - The message text
   */
  trackUserMessage(message) {
    this.interactions.userMessages++;
    this.currentSession.messageCount++;
    // Could add sentiment analysis or other processing here
    this.sendAnalyticsEvent("user_message", { length: message.length });
  }

  /**
   * Track a bot response
   * @param {Object} response - The bot response object
   * @param {boolean} wasSuccessful - Whether the response was successful
   */
  trackBotResponse(response, wasSuccessful = true) {
    this.interactions.botMessages++;

    if (wasSuccessful) {
      this.interactions.successfulResponses++;
    } else {
      this.interactions.failedResponses++;
    }

    if (response.topic) {
      this.interactions.topicsDiscussed.add(response.topic);
      this.currentSession.topics.add(response.topic);
    }

    this.sendAnalyticsEvent("bot_response", {
      successful: wasSuccessful,
      topic: response.topic || "unknown",
      length: response.text.length,
    });
  }

  /**
   * Track speech recognition usage
   * @param {boolean} successful - Whether recognition was successful
   */
  trackSpeechRecognition(successful = true) {
    this.interactions.speechRecognitionUsed++;
    this.sendAnalyticsEvent("speech_recognition", { successful });
  }

  /**
   * Track when a user clicks a suggestion
   * @param {string} suggestion - The suggestion that was clicked
   */
  trackSuggestionClick(suggestion) {
    this.interactions.suggestionsClicked++;
    this.sendAnalyticsEvent("suggestion_click", { suggestion });
  }

  /**
   * Track the start of a new session
   * @param {string} language - The session language
   */
  trackSessionStart(language = "en") {
    this.interactions.sessionsCount++;
    this.currentSession = {
      startTime: new Date(),
      language,
      messageCount: 0,
      topics: new Set(),
    };
    this.sendAnalyticsEvent("session_start", { language });
  }

  /**
   * Track the end of a session
   */
  trackSessionEnd() {
    const duration = (new Date() - this.currentSession.startTime) / 1000; // in seconds
    this.sendAnalyticsEvent("session_end", {
      duration,
      messageCount: this.currentSession.messageCount,
      topicsCount: this.currentSession.topics.size,
      language: this.currentSession.language,
    });
  }

  /**
   * Get analytics summary
   * @returns {Object} Analytics summary
   */
  getAnalyticsSummary() {
    return {
      ...this.interactions,
      topicsDiscussed: Array.from(this.interactions.topicsDiscussed),
      currentSession: {
        ...this.currentSession,
        topics: Array.from(this.currentSession.topics),
        duration: (new Date() - this.currentSession.startTime) / 1000,
      },
    };
  }

  /**
   * Send analytics event to tracking service (placeholder)
   * @param {string} eventName - Name of the event
   * @param {Object} eventData - Event data
   * @private
   */
  sendAnalyticsEvent(eventName, eventData = {}) {
    // In a real implementation, this would send data to Google Analytics,
    // Matomo, or another analytics service

    if (process.env.NODE_ENV === "development") {
      console.log(`Analytics event: ${eventName}`, eventData);
    }

    // Example integration with Google Analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", eventName, eventData);
    }

    // Example integration with Matomo/Piwik
    if (typeof window !== "undefined" && window._paq) {
      window._paq.push([
        "trackEvent",
        "Chatbot",
        eventName,
        JSON.stringify(eventData),
      ]);
    }
  }
}

export default AnalyticsManager;
