import { getCookie, setCookie } from "./cookies";
import { getFollowUpQuestion } from "../data/followUpQuestions";

// Storage keys
const MESSAGES_STORAGE_KEY = "eurostat_chat_messages";
const LAST_TOPIC_KEY = "eurostat_last_topic";
const SESSION_TIMEOUT = 30; // minutes before session is considered "resumed"

/**
 * Save messages to localStorage
 * @param {Array} messages - Array of message objects
 */
const saveToStorage = (messages) => {
  if (!messages || !Array.isArray(messages)) return;

  try {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    console.log(`Saved ${messages.length} messages to localStorage`);
  } catch (error) {
    console.error("Error saving messages to localStorage:", error);
  }
};

/**
 * Load messages from localStorage
 * @returns {Array|null} Array of message objects or null if not found
 */
const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (!data) return null;

    const messages = JSON.parse(data);
    console.log(`Loaded ${messages.length} messages from localStorage`);
    return messages;
  } catch (error) {
    console.error("Error loading messages from localStorage:", error);
    return null;
  }
};

/**
 * Clear stored messages
 */
const clearStorage = () => {
  try {
    localStorage.removeItem(MESSAGES_STORAGE_KEY);
    localStorage.removeItem(LAST_TOPIC_KEY);
    console.log("Cleared chat history from localStorage");
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};

/**
 * Session Manager class for handling chat persistence
 */
export class SessionManager {
  constructor(language = "en") {
    this.language = language;
    this.messages = [];
    this.lastTopic = null;
    this.initialized = false;
  }

  /**
   * Initialize from storage
   */
  init() {
    const storedMessages = loadFromStorage();

    if (storedMessages && storedMessages.length > 0) {
      this.messages = storedMessages;

      // Find the last topic from bot messages
      const botMessages = storedMessages.filter(
        (msg) => msg.sender === "bot" && msg.topic
      );

      if (botMessages.length > 0) {
        this.lastTopic = botMessages[botMessages.length - 1].topic;
        localStorage.setItem(LAST_TOPIC_KEY, this.lastTopic);
      }
    }

    this.initialized = true;
    return this;
  }

  /**
   * Add a message to the session
   * @param {Object} message - Message object
   */
  addMessage(message) {
    if (!message) return;

    // Add timestamp if missing
    if (!message.timestamp) {
      message.timestamp = new Date().toISOString();
    }

    // Track topic for bot messages
    if (message.sender === "bot" && message.topic) {
      this.lastTopic = message.topic;
      localStorage.setItem(LAST_TOPIC_KEY, message.topic);
    }

    this.messages.push(message);
    saveToStorage(this.messages);
  }

  /**
   * Get all messages
   * @returns {Array} Array of message objects
   */
  getMessages() {
    if (!this.initialized) this.init();
    return [...this.messages];
  }

  /**
   * Check if we should show a welcome back message
   * @returns {Object|null} Welcome back message or null
   */
  getWelcomeBackMessage() {
    if (!this.initialized) this.init();
    if (this.messages.length === 0) return null;

    // Check when the last message was sent
    const lastMessage = this.messages[this.messages.length - 1];
    const lastTimestamp = new Date(lastMessage.timestamp || Date.now());
    const minutesSinceLastMessage = (Date.now() - lastTimestamp) / (1000 * 60);

    // Only show welcome back if user has been gone for a while
    if (minutesSinceLastMessage < SESSION_TIMEOUT) return null;

    // If we have a last topic, create welcome back message
    if (this.lastTopic) {
      return {
        sender: "bot",
        text: `Welcome back! Would you like to continue our discussion about ${this.lastTopic}?`,
        topic: this.lastTopic,
        timestamp: new Date().toISOString(),
        isWelcomeBack: true,
      };
    }

    return null;
  }

  /**
   * Clear all messages
   */
  clear() {
    this.messages = [];
    this.lastTopic = null;
    clearStorage();
  }

  /**
   * Get the last discussed topic
   * @returns {string|null} Topic name or null
   */
  getLastTopic() {
    return this.lastTopic;
  }
}

export default SessionManager;

/**
 * The following functions are kept for backward compatibility
 */

export const saveConversation = (messages) => {
  saveToStorage(messages);
};

export const loadConversation = () => {
  return loadFromStorage();
};

export const clearConversation = () => {
  clearStorage();
};

export const checkForPreviousSession = (language) => {
  try {
    const storedMessages = loadFromStorage();
    if (!storedMessages || storedMessages.length === 0) return null;

    const lastMessage = storedMessages[storedMessages.length - 1];
    const lastTimestamp = new Date(lastMessage.timestamp || Date.now());
    const minutesSinceLastMessage = (Date.now() - lastTimestamp) / (1000 * 60);

    if (minutesSinceLastMessage < SESSION_TIMEOUT) return null;

    let lastTopic = null;

    // Find the last topic from bot messages
    const botMessages = storedMessages.filter(
      (msg) => msg.sender === "bot" && msg.topic
    );
    if (botMessages.length > 0) {
      lastTopic = botMessages[botMessages.length - 1].topic;
    }

    if (!lastTopic) return null;

    const followUp = getFollowUpQuestion(lastTopic, language);
    if (!followUp) return null;

    return {
      hasPreviousSession: true,
      lastTopic,
      messages: storedMessages,
      followUpQuestion: followUp.question,
    };
  } catch (error) {
    console.warn("Error checking for previous session:", error);
    return null;
  }
};
