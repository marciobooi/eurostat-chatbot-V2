import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { saveChatToCookie, loadChatFromCookie, setupCrossTabbingSyncListeners } from '../utils/storageHandlers';
import { MessageService } from '../services/MessageService';

// Messages per batch when loading more
const MESSAGES_BATCH_SIZE = 15;
// Minimum number of messages before showing the "Show More" button
const MIN_MESSAGES_FOR_BUTTON = 15;

export const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

/**
 * Provides chat-related state and actions to its children components.
 * Manages messages (all, visible, pagination), user input, typing status,
 * scroll behavior, and cross-tab synchronization.
 */
export const ChatProvider = ({ children }) => {
  const [allMessages, setAllMessages] = useState([]);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [displayCount, setDisplayCount] = useState(MESSAGES_BATCH_SIZE);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const [usedVisualizations, setUsedVisualizations] = useState([]);
  const [lastMentionedCountry, setLastMentionedCountry] = useState(null);
  const [lastMentionedEnergyType, setLastMentionedEnergyType] = useState(null);

  const { i18n } = useTranslation();
  const messagesEndRef = useRef(null);

  // Enhanced scroll handler function with immediate option
  const scrollToBottom = useCallback((immediate = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: immediate ? 'auto' : 'smooth',
        block: 'end'
      });
    }
  }, []);

  // Update visible messages when total messages or display count changes
  useEffect(() => {
    if (allMessages.length > 0) {
      // Calculate the slice of messages to display based on `displayCount`.
      const startIndex = Math.max(0, allMessages.length - displayCount);
      setVisibleMessages(allMessages.slice(startIndex));
      
      // Determine if the "Show More" button should be visible:
      // - There must be at least a minimum number of messages total.
      // - There must be more messages stored in `allMessages` than currently visible.
      setShowMoreButton(
        allMessages.length >= MIN_MESSAGES_FOR_BUTTON && 
        allMessages.length > displayCount
      );
      
      // Scroll immediately to the bottom when new messages are added or visibility changes.
      // This ensures the latest messages are in view.
      scrollToBottom(true);
    } else {
      setVisibleMessages([]);
      setShowMoreButton(false);
    }
  }, [allMessages, displayCount, scrollToBottom]);

  // Initialize with welcome message or load saved chat from cookies on component mount or language change.
  useEffect(() => {
    const savedChat = loadChatFromCookie();
    
    if (savedChat?.length > 0) {
      // Validate loaded messages to ensure text is string (handles potential malformed cookie data).
      const validatedChat = savedChat.map(msg => ({
        ...msg,
        text: typeof msg.text === 'string' ? msg.text : JSON.stringify(msg.text)
      }));
      
      setAllMessages(validatedChat);
      
      // Ensure at least the most recent batch of messages is shown, even if history is longer.
      setDisplayCount(Math.min(MESSAGES_BATCH_SIZE, validatedChat.length));
    } else {
      // If no saved chat, create and display a welcome message.
      const welcomeMessage = MessageService.createWelcomeMessage(i18n.language);
      setAllMessages([welcomeMessage]);
      setDisplayCount(MESSAGES_BATCH_SIZE);
    }
    // Dependency on i18n.language means chat re-initializes if language changes.
    // This ensures the welcome message is in the correct language.
  }, [i18n.language]); // Intentionally re-runs on language change.

  // Set up listeners for cross-tab chat synchronization.
  // Updates local chat state if changes are detected from other tabs.
  useEffect(() => {
    // `setupCrossTabbingSyncListeners` returns a cleanup function.
    return setupCrossTabbingSyncListeners((syncedMessages) => {
      if (syncedMessages) {
        // Update local state only if the synced messages are different from current state
        // to avoid unnecessary re-renders.
        if (JSON.stringify(syncedMessages) !== JSON.stringify(allMessages)) {
          setAllMessages(syncedMessages);
          // Reset display count to show the latest messages from the synced chat.
          setDisplayCount(Math.min(MESSAGES_BATCH_SIZE, syncedMessages.length));
        }
      } else {
        // If syncedMessages is null/undefined (e.g., chat cleared in another tab), clear local chat.
        setAllMessages([]);
        setDisplayCount(MESSAGES_BATCH_SIZE);
      }
    });
    // Dependency on `allMessages` ensures the comparison inside the listener uses the latest state.
  }, [allMessages]);

  const updateMessages = useCallback((newMessagesOrUpdater) => {
    // Accepts either a new array of messages or an updater function.
    if (typeof newMessagesOrUpdater === 'function') {
      setAllMessages(prevMessages => {
        const updatedMessages = newMessagesOrUpdater(prevMessages);
        saveChatToCookie(updatedMessages); // Persist changes.
        
        // Adjust display count to ensure new messages are visible.
        const newCount = Math.max(
          displayCount,
          Math.min(MESSAGES_BATCH_SIZE, updatedMessages.length)
        );
        
        if (updatedMessages.length > prevMessages.length) { // If new messages were actually added
          setDisplayCount(newCount);
          // Schedule an immediate scroll after state updates to show the new message.
          setTimeout(() => scrollToBottom(true), 0);
        }
        
        return updatedMessages;
      });
    } else {
      // Direct state update with new messages array.
      setAllMessages(newMessagesOrUpdater);
      saveChatToCookie(newMessagesOrUpdater); // Persist changes.
      
      if (newMessagesOrUpdater.length > 0) {
        const newCount = Math.min(MESSAGES_BATCH_SIZE, newMessagesOrUpdater.length);
        setDisplayCount(newCount);
        setTimeout(() => scrollToBottom(true), 0); // Scroll to show messages.
      }
    }
  }, [displayCount, scrollToBottom]);

  const loadMoreMessages = useCallback(() => {
    setDisplayCount(prev => Math.min(prev + MESSAGES_BATCH_SIZE, allMessages.length));
  }, [allMessages.length]);

  const resetToRecentMessages = useCallback(() => {
    setDisplayCount(MESSAGES_BATCH_SIZE);
  }, []);

  const value = {
    // State
    allMessages,
    visibleMessages,
    displayCount,
    input,
    isTyping,
    showScrollButton,
    showMoreButton,
    usedVisualizations,
    messagesEndRef,
    lastMentionedCountry,
    lastMentionedEnergyType,

    // Updaters
    setInput,
    setIsTyping,
    setShowScrollButton,
    setUsedVisualizations,
    setLastMentionedCountry,
    setLastMentionedEnergyType,
    updateMessages,
    loadMoreMessages,
    resetToRecentMessages,
    scrollToBottom
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};