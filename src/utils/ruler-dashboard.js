/**
 * Real-time Analytics Dashboard for Ruler System
 * Provides live monitoring and insights
 */

import { getPerformanceMetrics, analyzeSearchDataQuality } from './ruler.js';

export class RulerAnalyticsDashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.updateInterval = null;
    this.charts = {};
    this.isRunning = false;
    
    this.initDashboard();
  }
  
  initDashboard() {
    this.container.innerHTML = `
      <div class="analytics-dashboard">
        <div class="dashboard-header">
          <h2>🔍 Ruler System Analytics</h2>
          <div class="controls">
            <button id="start-monitoring" class="btn btn-primary">Start Monitoring</button>
            <button id="stop-monitoring" class="btn btn-secondary">Stop</button>
            <button id="reset-analytics" class="btn btn-warning">Reset</button>
          </div>
        </div>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <h3>Performance</h3>
            <div id="performance-metrics">
              <div class="metric">
                <span class="label">Total Queries:</span>
                <span id="total-queries" class="value">0</span>
              </div>
              <div class="metric">
                <span class="label">Cache Hit Rate:</span>
                <span id="cache-hit-rate" class="value">0%</span>
              </div>
              <div class="metric">
                <span class="label">Avg Response Time:</span>
                <span id="avg-response-time" class="value">0ms</span>
              </div>
            </div>
          </div>
          
          <div class="metric-card">
            <h3>Query Patterns</h3>
            <div id="query-patterns">
              <canvas id="query-chart" width="300" height="200"></canvas>
            </div>
          </div>
          
          <div class="metric-card">
            <h3>Success Rates</h3>
            <div id="success-rates">
              <div class="progress-bar">
                <div class="progress-fill" id="success-rate-bar"></div>
                <span class="progress-text" id="success-rate-text">0%</span>
              </div>
            </div>
          </div>
          
          <div class="metric-card">
            <h3>Popular Queries</h3>
            <div id="popular-queries-list"></div>
          </div>
        </div>
        
        <div class="logs-section">
          <h3>Real-time Query Log</h3>
          <div id="query-log" class="log-container"></div>
        </div>
      </div>
    `;
    
    this.attachEventListeners();
    this.applyStyles();
  }
  
  attachEventListeners() {
    document.getElementById('start-monitoring').addEventListener('click', () => {
      this.startMonitoring();
    });
    
    document.getElementById('stop-monitoring').addEventListener('click', () => {
      this.stopMonitoring();
    });
    
    document.getElementById('reset-analytics').addEventListener('click', () => {
      this.resetAnalytics();
    });
  }
  
  startMonitoring() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.updateInterval = setInterval(() => {
      this.updateMetrics();
    }, 1000);
    
    console.log('📊 Analytics monitoring started');
  }
  
  stopMonitoring() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    console.log('📊 Analytics monitoring stopped');
  }
  
  updateMetrics() {
    try {
      const metrics = getPerformanceMetrics();
      
      // Update performance metrics
      document.getElementById('total-queries').textContent = metrics.totalQueries;
      document.getElementById('cache-hit-rate').textContent = metrics.cacheHitRate;
      document.getElementById('avg-response-time').textContent = 
        `${metrics.averageResponseTime.toFixed(2)}ms`;
      
      // Update success rate bar
      const successRate = this.calculateSuccessRate(metrics);
      const successBar = document.getElementById('success-rate-bar');
      const successText = document.getElementById('success-rate-text');
      
      successBar.style.width = `${successRate}%`;
      successText.textContent = `${successRate.toFixed(1)}%`;
      
      // Color code the success rate
      if (successRate >= 90) {
        successBar.className = 'progress-fill success';
      } else if (successRate >= 70) {
        successBar.className = 'progress-fill warning';
      } else {
        successBar.className = 'progress-fill danger';
      }
      
    } catch (error) {
      console.error('Error updating metrics:', error);
    }
  }
  
  calculateSuccessRate(metrics) {
    // This would need to be implemented based on your specific success tracking
    // For now, return a mock calculation
    return Math.max(0, 100 - (metrics.totalQueries - metrics.cacheHits) * 0.1);
  }
  
  logQuery(query, result, responseTime) {
    const logContainer = document.getElementById('query-log');
    const timestamp = new Date().toLocaleTimeString();
    
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${result ? 'success' : 'failure'}`;
    logEntry.innerHTML = `
      <span class="timestamp">${timestamp}</span>
      <span class="query">"${query}"</span>
      <span class="result">${result ? result.match.title : 'No match'}</span>
      <span class="time">${responseTime}ms</span>
    `;
    
    logContainer.insertBefore(logEntry, logContainer.firstChild);
    
    // Keep only last 50 entries
    while (logContainer.children.length > 50) {
      logContainer.removeChild(logContainer.lastChild);
    }
  }
  
  resetAnalytics() {
    // Reset all displayed metrics
    document.getElementById('total-queries').textContent = '0';
    document.getElementById('cache-hit-rate').textContent = '0%';
    document.getElementById('avg-response-time').textContent = '0ms';
    document.getElementById('success-rate-bar').style.width = '0%';
    document.getElementById('success-rate-text').textContent = '0%';
    document.getElementById('query-log').innerHTML = '';
    
    console.log('📊 Analytics dashboard reset');
  }
  
  applyStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .analytics-dashboard {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      
      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        border-bottom: 2px solid #eee;
        padding-bottom: 15px;
      }
      
      .dashboard-header h2 {
        margin: 0;
        color: #333;
      }
      
      .controls {
        display: flex;
        gap: 10px;
      }
      
      .btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
      }
      
      .btn-primary { background: #007bff; color: white; }
      .btn-secondary { background: #6c757d; color: white; }
      .btn-warning { background: #ffc107; color: black; }
      
      .btn:hover { opacity: 0.9; }
      
      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }
      
      .metric-card {
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .metric-card h3 {
        margin: 0 0 15px 0;
        color: #333;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
      }
      
      .metric {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      
      .metric .label {
        color: #666;
      }
      
      .metric .value {
        font-weight: bold;
        color: #333;
      }
      
      .progress-bar {
        position: relative;
        background: #f0f0f0;
        border-radius: 10px;
        height: 20px;
        overflow: hidden;
      }
      
      .progress-fill {
        height: 100%;
        transition: width 0.3s ease;
        border-radius: 10px;
      }
      
      .progress-fill.success { background: #28a745; }
      .progress-fill.warning { background: #ffc107; }
      .progress-fill.danger { background: #dc3545; }
      
      .progress-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
        font-weight: bold;
        color: #333;
      }
      
      .logs-section {
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
      }
      
      .log-container {
        max-height: 300px;
        overflow-y: auto;
        border: 1px solid #eee;
        border-radius: 4px;
        padding: 10px;
        background: #f9f9f9;
      }
      
      .log-entry {
        display: grid;
        grid-template-columns: 80px 1fr 200px 60px;
        gap: 10px;
        padding: 5px 0;
        border-bottom: 1px solid #eee;
        font-size: 12px;
      }
      
      .log-entry.success { color: #28a745; }
      .log-entry.failure { color: #dc3545; }
      
      .log-entry .timestamp { color: #666; }
      .log-entry .query { font-weight: bold; }
    `;
    
    document.head.appendChild(style);
  }
}

// Export utility function to integrate with ruler
export const createDashboard = (containerId) => {
  return new RulerAnalyticsDashboard(containerId);
};
