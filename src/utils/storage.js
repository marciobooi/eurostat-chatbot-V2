/**
 * Storage Manager for Eurostat Chatbot
 * 
 * Provides a unified interface for storing and retrieving application data
 * including chat history, user preferences, and application state.
 * 
 * Features:
 * - Local Storage for persistent data
 * - Session Storage for temporary data
 * - Memory storage fallback for environments without storage support
 * - Automatic data validation and serialization
 * - Storage size management and cleanup
 * - Export/Import functionality for data portability
 */

// Storage keys
export const STORAGE_KEYS = {
  CHAT_HISTORY: 'eurostat_chat_history',
  USER_PREFERENCES: 'eurostat_user_preferences',
  CHART_SETTINGS: 'eurostat_chart_settings',
  SEARCH_HISTORY: 'eurostat_search_history',
  FAVORITE_QUERIES: 'eurostat_favorite_queries',
  SESSION_STATE: 'eurostat_session_state',
  APP_VERSION: 'eurostat_app_version'
};

// Default configurations
const DEFAULT_PREFERENCES = {
  theme: 'light',
  language: 'en',
  chartType: 'pie',
  autoSave: true,
  showWelcomeMessage: true,
  maxChatHistory: 100,
  enableNotifications: true,
  defaultCountry: 'EU27_2020',
  displayDensity: 'comfortable'
};

const DEFAULT_CHART_SETTINGS = {
  defaultType: 'pie',
  colorScheme: 'default',
  showLegend: true,
  showTooltip: true,
  animationEnabled: true,
  exportFormat: 'png'
};

// Storage types
const STORAGE_TYPES = {
  LOCAL: 'localStorage',
  SESSION: 'sessionStorage',
  MEMORY: 'memory'
};

// In-memory fallback storage
const memoryStorage = new Map();

class StorageManager {
  constructor() {
    this.isLocalStorageAvailable = this.checkStorageAvailability(STORAGE_TYPES.LOCAL);
    this.isSessionStorageAvailable = this.checkStorageAvailability(STORAGE_TYPES.SESSION);
    this.appVersion = '2.0.0';
    
    // Initialize storage
    this.initializeStorage();
  }

  /**
   * Check if storage type is available
   */
  checkStorageAvailability(storageType) {
    try {
      if (typeof window === 'undefined') return false;
      
      const storage = window[storageType];
      const testKey = '__storage_test__';
      storage.setItem(testKey, 'test');
      storage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn(`${storageType} is not available:`, error.message);
      return false;
    }
  }

  /**
   * Initialize storage with default values
   */
  initializeStorage() {
    // Check if this is a new installation or version update
    const storedVersion = this.getItem(STORAGE_KEYS.APP_VERSION);
    if (!storedVersion || storedVersion !== this.appVersion) {
      this.handleVersionUpdate(storedVersion);
    }

    // Initialize default preferences if not exist
    if (!this.getItem(STORAGE_KEYS.USER_PREFERENCES)) {
      this.setItem(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_PREFERENCES);
    }

    // Initialize default chart settings if not exist
    if (!this.getItem(STORAGE_KEYS.CHART_SETTINGS)) {
      this.setItem(STORAGE_KEYS.CHART_SETTINGS, DEFAULT_CHART_SETTINGS);
    }

    // Initialize empty arrays for history-based storage
    if (!this.getItem(STORAGE_KEYS.CHAT_HISTORY)) {
      this.setItem(STORAGE_KEYS.CHAT_HISTORY, []);
    }

    if (!this.getItem(STORAGE_KEYS.SEARCH_HISTORY)) {
      this.setItem(STORAGE_KEYS.SEARCH_HISTORY, []);
    }

    if (!this.getItem(STORAGE_KEYS.FAVORITE_QUERIES)) {
      this.setItem(STORAGE_KEYS.FAVORITE_QUERIES, []);
    }

    // Set current version
    this.setItem(STORAGE_KEYS.APP_VERSION, this.appVersion);
  }

  /**
   * Handle version updates and data migration
   */
  handleVersionUpdate(oldVersion) {
    console.log(`Updating storage from version ${oldVersion || 'unknown'} to ${this.appVersion}`);
    
    // Migration logic can be added here for future versions
    // For now, we'll just clear incompatible data if needed
    
    if (!oldVersion) {
      // Fresh installation - no migration needed
      console.log('Fresh installation detected');
    } else {
      // Version update - implement migration logic here
      console.log('Version update detected - checking for data migration needs');
    }
  }

  /**
   * Get storage instance based on availability and type preference
   */
  getStorage(preferredType = STORAGE_TYPES.LOCAL) {
    if (preferredType === STORAGE_TYPES.LOCAL && this.isLocalStorageAvailable) {
      return window.localStorage;
    } else if (preferredType === STORAGE_TYPES.SESSION && this.isSessionStorageAvailable) {
      return window.sessionStorage;
    } else {
      return null; // Use memory storage
    }
  }

  /**
   * Set item in storage with automatic serialization
   */
  setItem(key, value, storageType = STORAGE_TYPES.LOCAL) {
    try {
      const serializedValue = JSON.stringify({
        data: value,
        timestamp: Date.now(),
        version: this.appVersion
      });

      const storage = this.getStorage(storageType);
      if (storage) {
        storage.setItem(key, serializedValue);
      } else {
        // Fallback to memory storage
        memoryStorage.set(key, serializedValue);
      }

      return true;
    } catch (error) {
      console.error('Error setting storage item:', error);
      return false;
    }
  }

  /**
   * Get item from storage with automatic deserialization
   */
  getItem(key, storageType = STORAGE_TYPES.LOCAL) {
    try {
      const storage = this.getStorage(storageType);
      let serializedValue;

      if (storage) {
        serializedValue = storage.getItem(key);
      } else {
        // Fallback to memory storage
        serializedValue = memoryStorage.get(key);
      }

      if (!serializedValue) return null;

      const parsed = JSON.parse(serializedValue);
      return parsed.data;
    } catch (error) {
      console.error('Error getting storage item:', error);
      return null;
    }
  }

  /**
   * Remove item from storage
   */
  removeItem(key, storageType = STORAGE_TYPES.LOCAL) {
    try {
      const storage = this.getStorage(storageType);
      if (storage) {
        storage.removeItem(key);
      } else {
        memoryStorage.delete(key);
      }
      return true;
    } catch (error) {
      console.error('Error removing storage item:', error);
      return false;
    }
  }

  /**
   * Clear all application storage
   */
  clearAllStorage() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        this.removeItem(key, STORAGE_TYPES.LOCAL);
        this.removeItem(key, STORAGE_TYPES.SESSION);
      });
      memoryStorage.clear();
      console.log('All storage cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  /**
   * Get storage usage information
   */
  getStorageInfo() {
    const info = {
      localStorage: {
        available: this.isLocalStorageAvailable,
        usage: 0,
        quota: 0
      },
      sessionStorage: {
        available: this.isSessionStorageAvailable,
        usage: 0,
        quota: 0
      },
      memoryStorage: {
        usage: memoryStorage.size
      }
    };

    // Calculate storage usage
    if (this.isLocalStorageAvailable) {
      try {
        let localStorageSize = 0;
        for (let key in localStorage) {
          if (localStorage.hasOwnProperty(key)) {
            localStorageSize += localStorage[key].length;
          }
        }
        info.localStorage.usage = localStorageSize;
        
        // Estimate quota (usually 5-10MB for localStorage)
        if (navigator.storage && navigator.storage.estimate) {
          navigator.storage.estimate().then(estimate => {
            info.localStorage.quota = estimate.quota;
          });
        }
      } catch (error) {
        console.warn('Could not calculate localStorage usage:', error);
      }
    }

    return info;
  }

  /**
   * Export all storage data
   */
  exportData() {
    const exportData = {
      version: this.appVersion,
      timestamp: new Date().toISOString(),
      data: {}
    };

    Object.values(STORAGE_KEYS).forEach(key => {
      const value = this.getItem(key);
      if (value !== null) {
        exportData.data[key] = value;
      }
    });

    return exportData;
  }

  /**
   * Import storage data
   */
  importData(importData) {
    try {
      if (!importData || !importData.data) {
        throw new Error('Invalid import data format');
      }

      // Validate version compatibility
      if (importData.version && importData.version !== this.appVersion) {
        console.warn(`Importing data from version ${importData.version} to ${this.appVersion}`);
      }

      // Import each data item
      Object.entries(importData.data).forEach(([key, value]) => {
        if (Object.values(STORAGE_KEYS).includes(key)) {
          this.setItem(key, value);
        }
      });

      console.log('Data imported successfully');
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  /**
   * Clean up old or excessive data
   */
  cleanup() {
    try {
      // Clean up chat history if it exceeds max limit
      const preferences = this.getUserPreferences();
      const maxHistory = preferences.maxChatHistory || 100;
      
      const chatHistory = this.getChatHistory();
      if (chatHistory.length > maxHistory) {
        const trimmedHistory = chatHistory.slice(-maxHistory);
        this.setItem(STORAGE_KEYS.CHAT_HISTORY, trimmedHistory);
      }

      // Clean up search history (keep last 50)
      const searchHistory = this.getSearchHistory();
      if (searchHistory.length > 50) {
        const trimmedSearch = searchHistory.slice(-50);
        this.setItem(STORAGE_KEYS.SEARCH_HISTORY, trimmedSearch);
      }

      console.log('Storage cleanup completed');
      return true;
    } catch (error) {
      console.error('Error during storage cleanup:', error);
      return false;
    }
  }

  // ===== SPECIFIC DATA METHODS =====

  /**
   * Chat History Management
   */
  getChatHistory() {
    return this.getItem(STORAGE_KEYS.CHAT_HISTORY) || [];
  }

  addChatMessage(message) {
    const history = this.getChatHistory();
    const messageWithId = {
      ...message,
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString()
    };
    
    history.push(messageWithId);
    this.setItem(STORAGE_KEYS.CHAT_HISTORY, history);
    
    // Auto-cleanup if needed
    const preferences = this.getUserPreferences();
    if (preferences.autoSave) {
      this.cleanup();
    }
    
    return messageWithId;
  }

  clearChatHistory() {
    return this.setItem(STORAGE_KEYS.CHAT_HISTORY, []);
  }
  /**
   * User Preferences Management
   */
  getUserPreferences() {
    try {
      const stored = this.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return { ...DEFAULT_PREFERENCES, ...stored };
    } catch (error) {
      console.warn('Error loading user preferences, using defaults:', error);
      return { ...DEFAULT_PREFERENCES };
    }
  }

  updateUserPreferences(updates) {
    try {
      const current = this.getUserPreferences();
      const updated = { ...current, ...updates };
      return this.setItem(STORAGE_KEYS.USER_PREFERENCES, updated);
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return false;
    }
  }

  resetUserPreferences() {
    return this.setItem(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_PREFERENCES);
  }
  /**
   * Chart Settings Management
   */
  getChartSettings() {
    try {
      const stored = this.getItem(STORAGE_KEYS.CHART_SETTINGS);
      return { ...DEFAULT_CHART_SETTINGS, ...stored };
    } catch (error) {
      console.warn('Error loading chart settings, using defaults:', error);
      return { ...DEFAULT_CHART_SETTINGS };
    }
  }

  updateChartSettings(updates) {
    try {
      const current = this.getChartSettings();
      const updated = { ...current, ...updates };
      return this.setItem(STORAGE_KEYS.CHART_SETTINGS, updated);
    } catch (error) {
      console.error('Error updating chart settings:', error);
      return false;
    }
  }

  /**
   * Search History Management
   */
  getSearchHistory() {
    return this.getItem(STORAGE_KEYS.SEARCH_HISTORY) || [];
  }

  addSearchQuery(query) {
    const history = this.getSearchHistory();
    const searchItem = {
      query,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };
    
    // Remove duplicate if exists
    const filtered = history.filter(item => item.query !== query);
    filtered.push(searchItem);
    
    this.setItem(STORAGE_KEYS.SEARCH_HISTORY, filtered);
    return searchItem;
  }

  clearSearchHistory() {
    return this.setItem(STORAGE_KEYS.SEARCH_HISTORY, []);
  }

  /**
   * Favorite Queries Management
   */
  getFavoriteQueries() {
    return this.getItem(STORAGE_KEYS.FAVORITE_QUERIES) || [];
  }

  addFavoriteQuery(query, title = null) {
    const favorites = this.getFavoriteQueries();
    const favoriteItem = {
      query,
      title: title || query,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };
    
    // Check if already exists
    const exists = favorites.some(fav => fav.query === query);
    if (!exists) {
      favorites.push(favoriteItem);
      this.setItem(STORAGE_KEYS.FAVORITE_QUERIES, favorites);
    }
    
    return favoriteItem;
  }

  removeFavoriteQuery(queryId) {
    const favorites = this.getFavoriteQueries();
    const filtered = favorites.filter(fav => fav.id !== queryId);
    return this.setItem(STORAGE_KEYS.FAVORITE_QUERIES, filtered);
  }

  /**
   * Session State Management
   */
  getSessionState() {
    return this.getItem(STORAGE_KEYS.SESSION_STATE, STORAGE_TYPES.SESSION) || {};
  }

  updateSessionState(updates) {
    const current = this.getSessionState();
    const updated = { ...current, ...updates };
    return this.setItem(STORAGE_KEYS.SESSION_STATE, updated, STORAGE_TYPES.SESSION);
  }

  clearSessionState() {
    return this.removeItem(STORAGE_KEYS.SESSION_STATE, STORAGE_TYPES.SESSION);
  }
}

// Create and export singleton instance
export const storageManager = new StorageManager();

// Export utility functions for easy access
export const getChatHistory = () => storageManager.getChatHistory();
export const addChatMessage = (message) => storageManager.addChatMessage(message);
export const clearChatHistory = () => storageManager.clearChatHistory();
export const getUserPreferences = () => storageManager.getUserPreferences();
export const updateUserPreferences = (updates) => storageManager.updateUserPreferences(updates);
export const resetUserPreferences = () => storageManager.resetUserPreferences();
export const getChartSettings = () => storageManager.getChartSettings();
export const updateChartSettings = (updates) => storageManager.updateChartSettings(updates);
export const getSearchHistory = () => storageManager.getSearchHistory();
export const addSearchQuery = (query) => storageManager.addSearchQuery(query);
export const clearSearchHistory = () => storageManager.clearSearchHistory();
export const getFavoriteQueries = () => storageManager.getFavoriteQueries();
export const addFavoriteQuery = (query, title) => storageManager.addFavoriteQuery(query, title);
export const removeFavoriteQuery = (queryId) => storageManager.removeFavoriteQuery(queryId);
export const getSessionState = () => storageManager.getSessionState();
export const updateSessionState = (updates) => storageManager.updateSessionState(updates);
export const clearSessionState = () => storageManager.clearSessionState();
export const exportData = () => storageManager.exportData();
export const importData = (data) => storageManager.importData(data);
export const cleanup = () => storageManager.cleanup();
export const clearAllStorage = () => storageManager.clearAllStorage();
export const getStorageInfo = () => storageManager.getStorageInfo();

export default storageManager;
