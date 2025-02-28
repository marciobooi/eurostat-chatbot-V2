export class AnalyticsManager {
  constructor() {
    this.statistics = {
      totalQuestions: 0,
      successfulMatches: 0,
      topTopics: {},
      languageUsage: {},
      averageResponseTime: 0,
      totalResponseTime: 0
    };
  }

  trackQuestion(query, matchFound, language, responseTime) {
    this.statistics.totalQuestions++;
    if (matchFound) this.statistics.successfulMatches++;
    
    this.statistics.languageUsage[language] = (this.statistics.languageUsage[language] || 0) + 1;
    
    // Update average response time
    this.statistics.totalResponseTime += responseTime;
    this.statistics.averageResponseTime = this.statistics.totalResponseTime / this.statistics.totalQuestions;
  }

  trackTopic(topic) {
    this.statistics.topTopics[topic] = (this.statistics.topTopics[topic] || 0) + 1;
  }

  getStatistics() {
    return {
      ...this.statistics,
      matchRate: (this.statistics.successfulMatches / this.statistics.totalQuestions) * 100,
      mostPopularTopics: Object.entries(this.statistics.topTopics)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
    };
  }
}
