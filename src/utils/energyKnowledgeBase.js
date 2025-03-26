import pako from 'pako';

class EnergyKnowledgeBase {
  constructor() {
    this.compressedData = null;
    this.cache = new Map();
  }

  async initialize(rawData) {
    // Compress the data using pako
    const jsonString = JSON.stringify(rawData);
    this.compressedData = pako.deflate(jsonString);
    
    // Store in IndexedDB for persistence
    await this.storeCompressedData();
  }

  async storeCompressedData() {
    try {
      const db = await initializeDB();
      const transaction = db.transaction(STATS_STORE, 'readwrite');
      const store = transaction.objectStore(STATS_STORE);
      
      await new Promise((resolve, reject) => {
        const request = store.put({
          key: 'energyStats',
          data: this.compressedData,
          timestamp: Date.now()
        });
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error storing compressed data:', error);
    }
  }

  async loadFromIndexedDB() {
    try {
      const db = await initializeDB();
      const transaction = db.transaction(STATS_STORE, 'readonly');
      const store = transaction.objectStore(STATS_STORE);

      return new Promise((resolve, reject) => {
        const request = store.get('energyStats');
        
        request.onsuccess = () => {
          if (request.result) {
            this.compressedData = request.result.data;
            resolve(true);
          } else {
            resolve(false);
          }
        };
        
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error loading compressed data:', error);
      return false;
    }
  }

  getData(key) {
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    if (!this.compressedData) {
      return null;
    }

    try {
      // Decompress only the needed portion
      const decompressed = pako.inflate(this.compressedData, { to: 'string' });
      const data = JSON.parse(decompressed);
      
      // Cache the result
      this.cache.set(key, data[key]);
      
      // Maintain cache size
      if (this.cache.size > 100) { // Cache limit
        const oldestKey = this.cache.keys().next().value;
        this.cache.delete(oldestKey);
      }
      
      return data[key];
    } catch (error) {
      console.error('Error accessing knowledge base:', error);
      return null;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export const energyKnowledgeBase = new EnergyKnowledgeBase();