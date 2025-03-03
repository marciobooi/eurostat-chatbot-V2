import { LanguageValidator } from './languageUtils';

export class AnalyticsManager {
  constructor() {
    this.analytics = {
      questionCount: 0,
      knownTopics: {},
      unknownQueries: [],
      languageStats: {},
      averageResponseTime: 0,
      totalResponseTime: 0,
      interactions: []
    };
  }

  trackQuestion(query, wasKnown, language, responseTime) {
    const validLang = LanguageValidator.validate(language);

    // Update question count
    this.analytics.questionCount++;

    // Update language statistics
    this.analytics.languageStats[validLang] = (this.analytics.languageStats[validLang] || 0) + 1;

    // Track response time
    this.analytics.totalResponseTime += responseTime;
    this.analytics.averageResponseTime = this.analytics.totalResponseTime / this.analytics.questionCount;

    // Store interaction details
    this.analytics.interactions.push({
      timestamp: Date.now(),
      query,
      wasKnown,
      language: validLang,
      responseTime
    });

    // Track unknown queries for improvement
    if (!wasKnown) {
      this.analytics.unknownQueries.push({
        query,
        language: validLang,
        timestamp: Date.now()
      });
    }
  }

  trackTopic(topic) {
    if (!topic) return;
    this.analytics.knownTopics[topic] = (this.analytics.knownTopics[topic] || 0) + 1;
  }

  getAnalytics() {
    return {
      ...this.analytics,
      languageDistribution: this.getLanguageDistribution(),
      topTopics: this.getTopTopics(5),
      recentUnknownQueries: this.getRecentUnknownQueries(10)
    };
  }

  getLanguageDistribution() {
    const total = Object.values(this.analytics.languageStats).reduce((a, b) => a + b, 0);
    return Object.entries(this.analytics.languageStats).reduce((acc, [lang, count]) => {
      acc[lang] = (count / total) * 100;
      return acc;
    }, {});
  }

  getTopTopics(limit = 5) {
    return Object.entries(this.analytics.knownTopics)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([topic, count]) => ({ topic, count }));
  }

  getRecentUnknownQueries(limit = 10) {
    return this.analytics.unknownQueries
      .slice(-limit)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  getPerformanceMetrics() {
    return {
      averageResponseTime: this.analytics.averageResponseTime,
      totalQuestions: this.analytics.questionCount,
      knownTopicsCount: Object.keys(this.analytics.knownTopics).length,
      unknownQueriesCount: this.analytics.unknownQueries.length
    };
  }

  reset() {
    this.analytics = {
      questionCount: 0,
      knownTopics: {},
      unknownQueries: [],
      languageStats: {},
      averageResponseTime: 0,
      totalResponseTime: 0,
      interactions: []
    };
  }
}
