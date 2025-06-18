/**
 * React Hooks and Components for Ruler Integration
 * Provides easy integration with React components
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  findBestMatch, 
  findBestMatchAdvanced,
  getPerformanceMetrics,
  queryCompletion
} from '../utils/ruler.js';

/**
 * Hook for search functionality with debouncing and caching
 */
export const useRulerSearch = (options = {}) => {
  const {
    debounceMs = 300,
    enableAdvanced = true,
    sessionId = null,
    enableCompletions = true
  } = options;
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completions, setCompletions] = useState([]);
  const [error, setError] = useState(null);
  
  const debounceRef = useRef(null);
  
  const search = useCallback(async (searchQuery, searchOptions = {}) => {
    if (!searchQuery.trim()) {
      setResults(null);
      setCompletions([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      if (enableAdvanced) {
        result = findBestMatchAdvanced(searchQuery, {
          sessionId,
          ...searchOptions
        });
      } else {
        result = findBestMatch(searchQuery);
      }
      
      setResults(result);
      
      // Get completions if enabled
      if (enableCompletions) {
        const comps = queryCompletion.getCompletions(searchQuery);
        setCompletions(comps);
      }
      
    } catch (err) {
      setError(err.message);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }, [enableAdvanced, sessionId, enableCompletions]);
  
  const debouncedSearch = useCallback((searchQuery, searchOptions = {}) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      search(searchQuery, searchOptions);
    }, debounceMs);
  }, [search, debounceMs]);
  
  const updateQuery = useCallback((newQuery) => {
    setQuery(newQuery);
    debouncedSearch(newQuery);
  }, [debouncedSearch]);
  
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);
  
  return {
    query,
    setQuery: updateQuery,
    results,
    isLoading,
    completions,
    error,
    search: (q, opts) => search(q, opts)
  };
};

/**
 * Hook for performance monitoring
 */
export const useRulerMetrics = (updateInterval = 5000) => {
  const [metrics, setMetrics] = useState(null);
  const intervalRef = useRef(null);
  
  useEffect(() => {
    const updateMetrics = () => {
      try {
        const currentMetrics = getPerformanceMetrics();
        setMetrics(currentMetrics);
      } catch (error) {
        console.error('Failed to update metrics:', error);
      }
    };
    
    // Initial load
    updateMetrics();
    
    // Set up interval
    intervalRef.current = setInterval(updateMetrics, updateInterval);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateInterval]);
  
  return metrics;
};

/**
 * Search Input Component with completions
 */
export const RulerSearchInput = ({ 
  onResultSelect, 
  placeholder = "Search energy definitions...",
  className = "",
  showCompletions = true,
  sessionId = null
}) => {
  const { 
    query, 
    setQuery, 
    results, 
    isLoading, 
    completions, 
    error 
  } = useRulerSearch({ sessionId });
  
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (results && onResultSelect) {
      onResultSelect(results);
    }
  }, [results, onResultSelect]);
  
  const handleCompletionSelect = (completion) => {
    setQuery(completion.completion);
    setShowDropdown(false);
    inputRef.current?.focus();
  };
  
  const handleInputFocus = () => {
    if (showCompletions && completions.length > 0) {
      setShowDropdown(true);
    }
  };
  
  const handleInputBlur = () => {
    // Delay hiding to allow completion clicks
    setTimeout(() => setShowDropdown(false), 200);
  };
  
  return (
    <div className={`ruler-search-container ${className}`}>
      <div className="search-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="ruler-search-input"
        />
        
        {isLoading && (
          <div className="search-loading">
            <span className="spinner">🔄</span>
          </div>
        )}
        
        {error && (
          <div className="search-error">
            ⚠️ {error}
          </div>
        )}
      </div>
      
      {showDropdown && showCompletions && completions.length > 0 && (
        <div className="completions-dropdown">
          {completions.map((completion, index) => (
            <div
              key={index}
              className={`completion-item ${completion.type}`}
              onClick={() => handleCompletionSelect(completion)}
            >
              <span className="completion-text">{completion.completion}</span>
              <span className="completion-type">{completion.type}</span>
              {completion.popularity && (
                <span className="completion-popularity">
                  {completion.popularity} uses
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      
      <style jsx>{`
        .ruler-search-container {
          position: relative;
          width: 100%;
          max-width: 500px;
        }
        
        .search-input-wrapper {
          position: relative;
        }
        
        .ruler-search-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          outline: none;
          transition: border-color 0.2s;
        }
        
        .ruler-search-input:focus {
          border-color: #007bff;
        }
        
        .search-loading {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .spinner {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .search-error {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #f8d7da;
          color: #721c24;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 14px;
          margin-top: 4px;
        }
        
        .completions-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          max-height: 200px;
          overflow-y: auto;
          z-index: 1000;
          margin-top: 4px;
        }
        
        .completion-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid #f0f0f0;
          transition: background-color 0.2s;
        }
        
        .completion-item:hover {
          background-color: #f8f9fa;
        }
        
        .completion-item:last-child {
          border-bottom: none;
        }
        
        .completion-text {
          font-weight: 500;
          flex: 1;
        }
        
        .completion-type {
          font-size: 12px;
          color: #666;
          background: #e9ecef;
          padding: 2px 6px;
          border-radius: 12px;
          margin-left: 8px;
        }
        
        .completion-type.popular {
          background: #d4edda;
          color: #155724;
        }
        
        .completion-type.common {
          background: #d1ecf1;
          color: #0c5460;
        }
        
        .completion-popularity {
          font-size: 11px;
          color: #999;
          margin-left: 8px;
        }
      `}</style>
    </div>
  );
};

/**
 * Results Display Component
 */
export const RulerResults = ({ results, onResultClick }) => {
  if (!results) return null;
  
  const handleResultClick = (result) => {
    if (onResultClick) {
      onResultClick(result);
    }
  };
  
  if (!results.match) {
    return (
      <div className="ruler-no-results">
        <h3>No direct match found</h3>
        
        {results.suggestions?.autoCorrection && (
          <div className="suggestion-section">
            <h4>Did you mean?</h4>
            <button 
              className="suggestion-button"
              onClick={() => handleResultClick(results.suggestions.autoCorrection)}
            >
              "{results.suggestions.autoCorrection.suggestion}"
            </button>
          </div>
        )}
        
        {results.suggestions?.intelligent?.length > 0 && (
          <div className="suggestion-section">
            <h4>Related queries:</h4>
            {results.suggestions.intelligent.map((suggestion, index) => (
              <button 
                key={index}
                className="suggestion-button"
                onClick={() => handleResultClick(suggestion)}
              >
                {suggestion.query}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="ruler-results">
      <div className="result-card" onClick={() => handleResultClick(results)}>
        <h3>{results.match.title}</h3>
        {results.match.fuelCode && (
          <div className="fuel-code">Code: {results.match.fuelCode}</div>
        )}
        <p className="result-description">
          {results.match.text || results.match.description}
        </p>
        <div className="result-meta">
          <span className="confidence">
            Confidence: {(results.confidence * 100).toFixed(1)}%
          </span>
          <span className="method">Method: {results.method}</span>
        </div>
        {results.match.keywords && (
          <div className="keywords">
            {results.match.keywords.slice(0, 5).map((keyword, index) => (
              <span key={index} className="keyword-tag">{keyword}</span>
            ))}
          </div>
        )}
      </div>
      
      <style jsx>{`
        .ruler-results {
          margin-top: 20px;
        }
        
        .ruler-no-results {
          text-align: center;
          padding: 40px 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .suggestion-section {
          margin: 20px 0;
        }
        
        .suggestion-section h4 {
          margin-bottom: 10px;
          color: #666;
        }
        
        .suggestion-button {
          display: inline-block;
          margin: 5px;
          padding: 8px 16px;
          background: #e9ecef;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .suggestion-button:hover {
          background: #dee2e6;
        }
        
        .result-card {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          cursor: pointer;
          transition: box-shadow 0.2s;
        }
        
        .result-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .result-card h3 {
          margin: 0 0 10px 0;
          color: #333;
        }
        
        .fuel-code {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }
        
        .result-description {
          color: #555;
          line-height: 1.5;
          margin-bottom: 15px;
        }
        
        .result-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #888;
          margin-bottom: 10px;
        }
        
        .keywords {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        
        .keyword-tag {
          background: #e3f2fd;
          color: #1976d2;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
        }
      `}</style>
    </div>
  );
};

/**
 * Performance Metrics Component
 */
export const RulerMetricsDisplay = ({ updateInterval = 5000 }) => {
  const metrics = useRulerMetrics(updateInterval);
  
  if (!metrics) {
    return <div>Loading metrics...</div>;
  }
  
  return (
    <div className="ruler-metrics">
      <h3>Search Performance</h3>
      <div className="metrics-grid">
        <div className="metric">
          <span className="metric-label">Total Queries</span>
          <span className="metric-value">{metrics.totalQueries}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Cache Hit Rate</span>
          <span className="metric-value">{metrics.cacheHitRate}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Avg Response</span>
          <span className="metric-value">{metrics.averageResponseTime.toFixed(1)}ms</span>
        </div>
        <div className="metric">
          <span className="metric-label">Cache Size</span>
          <span className="metric-value">{metrics.cacheSize}</span>
        </div>
      </div>
      
      <style jsx>{`
        .ruler-metrics {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 16px;
          margin: 20px 0;
        }
        
        .ruler-metrics h3 {
          margin: 0 0 15px 0;
          color: #333;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 15px;
        }
        
        .metric {
          text-align: center;
        }
        
        .metric-label {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 5px;
        }
        
        .metric-value {
          display: block;
          font-size: 18px;
          font-weight: bold;
          color: #333;
        }
      `}</style>
    </div>
  );
};
