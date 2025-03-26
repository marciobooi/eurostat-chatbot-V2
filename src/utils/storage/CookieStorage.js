import { BaseStorage } from './BaseStorage';

export class CookieStorage extends BaseStorage {
  constructor(config = {}) {
    super();
    this.prefix = config.prefix || 'eurostat_';
    this.duration = config.duration || 7; // days
    this.path = config.path || '/';
    this.sameSite = config.sameSite || 'Strict';
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

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + this.duration);

      document.cookie = `${fullKey}=${encodeURIComponent(JSON.stringify(item))};` +
        `expires=${expirationDate.toUTCString()};` +
        `path=${this.path};` +
        `SameSite=${this.sameSite}`;

      return true;
    } catch (error) {
      console.error('Error saving to cookie:', error);
      return false;
    }
  }

  async load(key) {
    try {
      const fullKey = this.getFullKey(key);
      const cookies = document.cookie.split(';');
      const cookie = cookies.find(c => c.trim().startsWith(`${fullKey}=`));

      if (!cookie) return null;

      const value = cookie.split('=')[1];
      const item = JSON.parse(decodeURIComponent(value));
      return item.data;
    } catch (error) {
      console.error('Error loading from cookie:', error);
      return null;
    }
  }

  async delete(key) {
    try {
      const fullKey = this.getFullKey(key);
      document.cookie = `${fullKey}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${this.path}`;
      return true;
    } catch (error) {
      console.error('Error deleting cookie:', error);
      return false;
    }
  }

  async clear() {
    try {
      const cookies = document.cookie.split(';');
      
      cookies.forEach(cookie => {
        const key = cookie.split('=')[0].trim();
        if (key.startsWith(this.prefix)) {
          this.delete(key.slice(this.prefix.length));
        }
      });

      return true;
    } catch (error) {
      console.error('Error clearing cookies:', error);
      return false;
    }
  }

  async getAllKeys() {
    try {
      const cookies = document.cookie.split(';');
      return cookies
        .map(cookie => cookie.split('=')[0].trim())
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.slice(this.prefix.length));
    } catch (error) {
      console.error('Error getting cookie keys:', error);
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
      console.error('Error getting all cookies:', error);
      return [];
    }
  }
}