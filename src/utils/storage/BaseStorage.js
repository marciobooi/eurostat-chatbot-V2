/**
 * Base interface for storage implementations
 */
export class BaseStorage {
  async save(key, data) {
    throw new Error('save() must be implemented');
  }

  async load(key) {
    throw new Error('load() must be implemented');
  }

  async delete(key) {
    throw new Error('delete() must be implemented');
  }

  async clear() {
    throw new Error('clear() must be implemented');
  }
}

/**
 * Storage factory for creating storage implementations
 */
export class StorageFactory {
  static createStorage(type, config = {}) {
    switch (type) {
      case 'indexeddb':
        return new IndexedDBStorage(config);
      case 'localstorage':
        return new LocalStorage(config);
      case 'cookie':
        return new CookieStorage(config);
      default:
        throw new Error(`Unknown storage type: ${type}`);
    }
  }
}