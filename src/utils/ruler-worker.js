/**
 * Web Worker for Heavy Ruler Processing
 * Offloads intensive search operations to prevent UI blocking
 */

import { findBestMatch, batchFindBestMatch } from '../utils/ruler.js';

self.onmessage = function(e) {
  const { type, data, id } = e.data;
  
  try {
    switch (type) {
      case 'SINGLE_QUERY':
        const result = findBestMatch(data.query);
        self.postMessage({
          type: 'SINGLE_RESULT',
          data: result,
          id
        });
        break;
        
      case 'BATCH_QUERY':
        batchFindBestMatch(data.queries, (progress) => {
          self.postMessage({
            type: 'BATCH_PROGRESS',
            data: progress,
            id
          });
        }).then(results => {
          self.postMessage({
            type: 'BATCH_RESULT',
            data: results,
            id
          });
        });
        break;
        
      case 'WARM_CACHE':
        // Pre-populate cache with common queries
        data.commonQueries.forEach(query => {
          findBestMatch(query);
        });
        self.postMessage({
          type: 'CACHE_WARMED',
          data: { count: data.commonQueries.length },
          id
        });
        break;
        
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      data: { error: error.message },
      id
    });
  }
};
