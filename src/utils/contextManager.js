const MAX_CONTEXT_LENGTH = 5; // Remember last 5 interactions

export class ContextManager {
  constructor() {
    this.context = [];
    this.topics = new Set();
  }

  addToContext(message, topic) {
    this.context.push({ message, topic, timestamp: Date.now() });
    if (topic) this.topics.add(topic);
    
    // Keep only last N messages
    if (this.context.length > MAX_CONTEXT_LENGTH) {
      this.context.shift();
    }
  }

  getRelevantContext(currentTopic) {
    return this.context.filter(ctx => 
      ctx.topic === currentTopic || 
      Date.now() - ctx.timestamp < 5 * 60 * 1000 // Last 5 minutes
    );
  }

  getSuggestedTopics() {
    return Array.from(this.topics)
      .filter(topic => topic !== 'unknown')
      .slice(0, 3); // Return top 3 discussed topics
  }

  clearContext() {
    this.context = [];
    this.topics = new Set();
  }
}
