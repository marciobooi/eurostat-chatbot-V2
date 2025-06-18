/**
 * Advanced Configuration Management for Ruler System
 * Provides environment-specific configs and A/B testing capabilities
 */

// Default configuration profiles
const configProfiles = {
  development: {
    cache: {
      size: 500,
      ttl: 30000, // 30 seconds for development
      enableDebugLogs: true
    },
    search: {
      fuzzyThreshold: 0.5,
      enableAllSteps: true,
      enableAdvancedFeatures: true
    },
    performance: {
      enableMetrics: true,
      enableProfiling: true
    }
  },
  
  production: {
    cache: {
      size: 2000,
      ttl: 300000, // 5 minutes
      enableDebugLogs: false
    },
    search: {
      fuzzyThreshold: 0.4,
      enableAllSteps: true,
      enableAdvancedFeatures: true
    },
    performance: {
      enableMetrics: true,
      enableProfiling: false
    }
  },
  
  testing: {
    cache: {
      size: 100,
      ttl: 5000, // 5 seconds
      enableDebugLogs: true
    },
    search: {
      fuzzyThreshold: 0.3,
      enableAllSteps: true,
      enableAdvancedFeatures: false
    },
    performance: {
      enableMetrics: true,
      enableProfiling: true
    }
  }
};

// A/B Testing configurations
const abTestConfigs = {
  strictSearch: {
    name: "Strict Search",
    description: "More precise matching with higher thresholds",
    config: {
      search: {
        fuzzyThreshold: 0.2,
        levenshteinThreshold: 0.8,
        stemmingThreshold: 0.4
      }
    }
  },
  
  relaxedSearch: {
    name: "Relaxed Search", 
    description: "More permissive matching for better recall",
    config: {
      search: {
        fuzzyThreshold: 0.6,
        levenshteinThreshold: 0.5,
        stemmingThreshold: 0.2
      }
    }
  },
  
  fastCache: {
    name: "Fast Cache",
    description: "Optimized for speed with larger cache",
    config: {
      cache: {
        size: 5000,
        ttl: 600000 // 10 minutes
      }
    }
  }
};

class RulerConfigManager {
  constructor() {
    this.currentProfile = 'development';
    this.activeABTests = new Set();
    this.customOverrides = {};
    this.configHistory = [];
    
    this.loadFromStorage();
  }
  
  /**
   * Load configuration profile
   */
  loadProfile(profileName) {
    if (!configProfiles[profileName]) {
      throw new Error(`Profile '${profileName}' not found`);
    }
    
    this.currentProfile = profileName;
    this.saveToStorage();
    
    console.log(`🔧 Loaded configuration profile: ${profileName}`);
    return this.getActiveConfig();
  }
  
  /**
   * Enable A/B test
   */
  enableABTest(testName) {
    if (!abTestConfigs[testName]) {
      throw new Error(`A/B test '${testName}' not found`);
    }
    
    this.activeABTests.add(testName);
    this.saveToStorage();
    
    console.log(`🧪 Enabled A/B test: ${testName}`);
    return this.getActiveConfig();
  }
  
  /**
   * Disable A/B test
   */
  disableABTest(testName) {
    this.activeABTests.delete(testName);
    this.saveToStorage();
    
    console.log(`🧪 Disabled A/B test: ${testName}`);
    return this.getActiveConfig();
  }
  
  /**
   * Set custom override
   */
  setOverride(path, value) {
    this.setNestedValue(this.customOverrides, path, value);
    this.saveToStorage();
    
    console.log(`⚙️ Set override: ${path} = ${JSON.stringify(value)}`);
    return this.getActiveConfig();
  }
  
  /**
   * Remove custom override
   */
  removeOverride(path) {
    this.removeNestedValue(this.customOverrides, path);
    this.saveToStorage();
    
    console.log(`⚙️ Removed override: ${path}`);
    return this.getActiveConfig();
  }
  
  /**
   * Get the active configuration (profile + A/B tests + overrides)
   */
  getActiveConfig() {
    let config = this.deepClone(configProfiles[this.currentProfile]);
    
    // Apply A/B test configurations
    for (const testName of this.activeABTests) {
      if (abTestConfigs[testName]) {
        config = this.deepMerge(config, abTestConfigs[testName].config);
      }
    }
    
    // Apply custom overrides
    config = this.deepMerge(config, this.customOverrides);
    
    return config;
  }
  
  /**
   * Get configuration summary
   */
  getConfigSummary() {
    return {
      profile: this.currentProfile,
      activeABTests: Array.from(this.activeABTests),
      customOverrides: Object.keys(this.flattenObject(this.customOverrides)),
      availableProfiles: Object.keys(configProfiles),
      availableABTests: Object.keys(abTestConfigs)
    };
  }
  
  /**
   * Validate configuration
   */
  validateConfig(config) {
    const errors = [];
    
    // Cache validation
    if (config.cache) {
      if (config.cache.size < 10 || config.cache.size > 10000) {
        errors.push('Cache size must be between 10 and 10000');
      }
      if (config.cache.ttl < 1000 || config.cache.ttl > 3600000) {
        errors.push('Cache TTL must be between 1 second and 1 hour');
      }
    }
    
    // Search validation
    if (config.search) {
      if (config.search.fuzzyThreshold < 0 || config.search.fuzzyThreshold > 1) {
        errors.push('Fuzzy threshold must be between 0 and 1');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Reset to default configuration
   */
  reset() {
    this.currentProfile = 'development';
    this.activeABTests.clear();
    this.customOverrides = {};
    this.saveToStorage();
    
    console.log('🔄 Configuration reset to defaults');
    return this.getActiveConfig();
  }
  
  /**
   * Export configuration
   */
  exportConfig() {
    return {
      profile: this.currentProfile,
      activeABTests: Array.from(this.activeABTests),
      customOverrides: this.customOverrides,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
  }
  
  /**
   * Import configuration
   */
  importConfig(configData) {
    try {
      if (configData.profile && configProfiles[configData.profile]) {
        this.currentProfile = configData.profile;
      }
      
      if (configData.activeABTests) {
        this.activeABTests = new Set(configData.activeABTests.filter(
          test => abTestConfigs[test]
        ));
      }
      
      if (configData.customOverrides) {
        this.customOverrides = configData.customOverrides;
      }
      
      this.saveToStorage();
      
      console.log('📥 Configuration imported successfully');
      return this.getActiveConfig();
    } catch (error) {
      console.error('Failed to import configuration:', error);
      throw error;
    }
  }
  
  // Utility methods
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  
  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }
  
  setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current) || typeof current[keys[i]] !== 'object') {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
  }
  
  removeNestedValue(obj, path) {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) return;
      current = current[keys[i]];
    }
    
    delete current[keys[keys.length - 1]];
  }
  
  flattenObject(obj, prefix = '') {
    const flattened = {};
    
    for (const key in obj) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        Object.assign(flattened, this.flattenObject(obj[key], newKey));
      } else {
        flattened[newKey] = obj[key];
      }
    }
    
    return flattened;
  }
  
  saveToStorage() {
    if (typeof localStorage !== 'undefined') {
      try {
        const data = {
          profile: this.currentProfile,
          activeABTests: Array.from(this.activeABTests),
          customOverrides: this.customOverrides
        };
        localStorage.setItem('rulerConfig', JSON.stringify(data));
      } catch (error) {
        console.warn('Failed to save configuration to localStorage:', error);
      }
    }
  }
  
  loadFromStorage() {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('rulerConfig');
        if (stored) {
          const data = JSON.parse(stored);
          this.currentProfile = data.profile || 'development';
          this.activeABTests = new Set(data.activeABTests || []);
          this.customOverrides = data.customOverrides || {};
        }
      } catch (error) {
        console.warn('Failed to load configuration from localStorage:', error);
      }
    }
  }
}

// Global configuration manager instance
export const configManager = new RulerConfigManager();

// Export utility functions
export const getCurrentConfig = () => configManager.getActiveConfig();
export const loadProfile = (profile) => configManager.loadProfile(profile);
export const enableABTest = (test) => configManager.enableABTest(test);
export const disableABTest = (test) => configManager.disableABTest(test);
export const setConfigOverride = (path, value) => configManager.setOverride(path, value);
export const getConfigSummary = () => configManager.getConfigSummary();
export const resetConfig = () => configManager.reset();
export const exportConfig = () => configManager.exportConfig();
export const importConfig = (data) => configManager.importConfig(data);

// Auto-detect environment and load appropriate profile
const detectEnvironment = () => {
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.NODE_ENV === 'production') return 'production';
    if (process.env.NODE_ENV === 'test') return 'testing';
  }
  
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'development';
    }
    if (window.location.hostname.includes('test') || window.location.hostname.includes('staging')) {
      return 'testing';
    }
  }
  
  return 'production';
};

// Initialize with appropriate profile
const detectedEnv = detectEnvironment();
if (configManager.currentProfile !== detectedEnv) {
  configManager.loadProfile(detectedEnv);
}

console.log(`🌍 Ruler system initialized with ${detectedEnv} configuration`);

export default configManager;
