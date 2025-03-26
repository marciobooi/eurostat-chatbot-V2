/**
 * Utility functions for storing and retrieving chat data
 * Handles cookies and cross-tab communication
 */

// Cookie duration in days
const COOKIE_DURATION = 7;

const DB_NAME = 'eurostatChatDB';
const DB_VERSION = 1;
const CHAT_STORE = 'chatHistory';
const STATS_STORE = 'energyStats';

/**
 * Initialize IndexedDB database
 * @returns {Promise<IDBDatabase>}
 */
export const initializeDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create chat history store
      if (!db.objectStoreNames.contains(CHAT_STORE)) {
        db.createObjectStore(CHAT_STORE, { keyPath: 'id', autoIncrement: true });
      }
      
      // Create energy statistics store
      if (!db.objectStoreNames.contains(STATS_STORE)) {
        db.createObjectStore(STATS_STORE, { keyPath: 'key' });
      }
    };
  });
};

/**
 * Saves chat messages to a cookie
 * @param {Array} messages - Array of chat message objects
 */
export const saveChatToCookie = (messages) => {
  try {
    // Don't store empty chat sessions
    if (!messages || messages.length === 0) {
      clearChatFromCookie();
      return;
    }

    // Convert messages to string and save to cookie
    const messagesString = JSON.stringify(messages);
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + COOKIE_DURATION);

    // Set the cookie
    document.cookie = `chat_history=${encodeURIComponent(messagesString)};expires=${expirationDate.toUTCString()};path=/;SameSite=Strict`;
    
    // Also store in localStorage for cross-tab functionality
    localStorage.setItem('chat_history', messagesString);

    // Broadcast the update to other tabs
    broadcastChatUpdate(messagesString);
  } catch (error) {
    console.error('Error saving chat to storage:', error);
  }
};

/**
 * Save chat history to IndexedDB
 * @param {Array} messages - Array of chat messages
 */
export const saveChatToIndexedDB = async (messages) => {
  try {
    const db = await initializeDB();
    const transaction = db.transaction(CHAT_STORE, 'readwrite');
    const store = transaction.objectStore(CHAT_STORE);

    await new Promise((resolve, reject) => {
      const request = store.put({
        messages,
        timestamp: Date.now()
      });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // Keep using existing localStorage/cookie methods as fallback
    saveChatToCookie(messages);
  } catch (error) {
    console.error('Error saving to IndexedDB:', error);
    // Fallback to existing storage method
    saveChatToCookie(messages);
  }
};

/**
 * Removes chat history from cookies
 */
export const clearChatFromCookie = () => {
  try {
    // Set cookie with expired date to clear it
    document.cookie = 'chat_history=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict';
    
    // Also clear from localStorage
    localStorage.removeItem('chat_history');
    
    // Broadcast clear to other tabs
    broadcastChatUpdate(null);
  } catch (error) {
    console.error('Error clearing chat from storage:', error);
  }
};

/**
 * Loads chat messages from cookies
 * @returns {Array|null} Array of chat messages or null if not found
 */
export const loadChatFromCookie = () => {
  try {
    // Try to get chat from cookie
    const cookies = document.cookie.split(';');
    const chatCookie = cookies.find(cookie => cookie.trim().startsWith('chat_history='));
    
    if (chatCookie) {
      const chatHistoryStr = decodeURIComponent(chatCookie.split('=')[1]);
      return JSON.parse(chatHistoryStr);
    }
    
    // If not in cookie, try localStorage
    const localStorageChat = localStorage.getItem('chat_history');
    if (localStorageChat) {
      return JSON.parse(localStorageChat);
    }
    
    return null;
  } catch (error) {
    console.error('Error loading chat from storage:', error);
    return null;
  }
};

/**
 * Load chat history from IndexedDB
 * @returns {Promise<Array>} Chat messages
 */
export const loadChatFromIndexedDB = async () => {
  try {
    const db = await initializeDB();
    const transaction = db.transaction(CHAT_STORE, 'readonly');
    const store = transaction.objectStore(CHAT_STORE);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      
      request.onsuccess = () => {
        const records = request.result;
        if (records.length > 0) {
          // Get the most recent chat history
          const latestRecord = records.reduce((latest, current) => 
            current.timestamp > latest.timestamp ? current : latest
          );
          resolve(latestRecord.messages);
        } else {
          // Try fallback storage methods
          resolve(loadChatFromCookie());
        }
      };
      
      request.onerror = () => {
        console.error('Error reading from IndexedDB:', request.error);
        // Fallback to existing storage method
        resolve(loadChatFromCookie());
      };
    });
  } catch (error) {
    console.error('Error accessing IndexedDB:', error);
    // Fallback to existing storage method
    return loadChatFromCookie();
  }
};

/**
 * Broadcasts chat updates to other tabs using the BroadcastChannel API
 * Falls back to localStorage for older browsers
 * @param {string|null} messagesString - Stringified messages or null if clearing
 */
export const broadcastChatUpdate = (messagesString) => {
  try {
    // Try using BroadcastChannel API (modern browsers)
    if (window.BroadcastChannel) {
      const chatChannel = new BroadcastChannel('chat_sync');
      chatChannel.postMessage({
        type: 'chat_update',
        data: messagesString
      });
      return;
    }
    
    // Fallback for older browsers using storage events
    const timestamp = new Date().getTime();
    localStorage.setItem('chat_sync', JSON.stringify({
      timestamp,
      data: messagesString
    }));
  } catch (error) {
    console.error('Error broadcasting chat update:', error);
  }
};

/**
 * Sets up listeners for chat updates from other tabs
 * @param {Function} updateCallback - Function to call when updates are received
 * @returns {Function} Cleanup function to remove listeners
 */
export const setupCrossTabbingSyncListeners = (updateCallback) => {
  let chatChannel = null;
  
  try {
    // Set up BroadcastChannel (modern browsers)
    if (window.BroadcastChannel) {
      chatChannel = new BroadcastChannel('chat_sync');
      
      const handleBroadcast = (event) => {
        if (event.data && event.data.type === 'chat_update') {
          const messages = event.data.data ? JSON.parse(event.data.data) : null;
          updateCallback(messages);
        }
      };
      
      chatChannel.addEventListener('message', handleBroadcast);
    }
    
    // Set up storage event listener (fallback)
    const handleStorageChange = (event) => {
      if (event.key === 'chat_sync') {
        try {
          const syncData = JSON.parse(event.newValue);
          if (syncData && syncData.data) {
            const messages = syncData.data ? JSON.parse(syncData.data) : null;
            updateCallback(messages);
          }
        } catch (error) {
          console.error('Error processing storage event:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Return cleanup function
    return () => {
      if (chatChannel) {
        chatChannel.close();
      }
      window.removeEventListener('storage', handleStorageChange);
    };
  } catch (error) {
    console.error('Error setting up cross-tab sync:', error);
    return () => {}; // Return empty cleanup function
  }
};