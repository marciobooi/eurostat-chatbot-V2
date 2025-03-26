import { BaseStorage } from './BaseStorage';

export class LocalStorage extends BaseStorage {
  constructor(config = {}) {
    super();
    this.prefix = config.prefix || 'eurostat_';
    this.broadcastChannel = this.setupBroadcastChannel();
  }

  setupBroadcastChannel() {
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      return new BroadcastChannel('storage_sync');
    }
    return null;
  }

  getFullKey(key) {
    return `${this.prefix}${key}`;
  }

  async save(key, data) {
    try {
      const fullKey = this.getFullKey(key);
      const item = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(fullKey, JSON.stringify(item));

      // Broadcast change to other tabs
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({
          type: 'storage_update',
          key: fullKey,
          data: item
        });
      }

      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  async load(key) {
    try {
      const fullKey = this.getFullKey(key);
      const item = localStorage.getItem(fullKey);
      if (!item) return null;

      const parsed = JSON.parse(item);
      return parsed.data;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }

  async delete(key) {
    try {
      const fullKey = this.getFullKey(key);
      localStorage.removeItem(fullKey);

      // Broadcast deletion to other tabs
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({
          type: 'storage_delete',
          key: fullKey
        });
      }

      return true;
    } catch (error) {
      console.error('Error deleting from localStorage:', error);
      return false;
    }
  }

  async clear() {
    try {
      // Only clear items with our prefix
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Broadcast clear to other tabs
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({
          type: 'storage_clear'
        });
      }

      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  async getAllKeys() {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(this.prefix)) {
          keys.push(key.slice(this.prefix.length));
        }
      }
      return keys;
    } catch (error) {
      console.error('Error getting keys from localStorage:', error);
      return [];
    }
  }

  async getAll() {
    try {
      const items = [];
      const keys = await this.getAllKeys();
      for (const key of keys) {
        const data = await this.load(key);
        if (data !== null) {
          items.push(data);
        }
      }
      return items;
    } catch (error) {
      console.error('Error getting all items from localStorage:', error);
      return [];
    }
  }

  addStorageListener(callback) {
    if (this.broadcastChannel) {
      this.broadcastChannel.addEventListener('message', callback);
      return () => this.broadcastChannel.removeEventListener('message', callback);
    }
    return () => {};
  }
}