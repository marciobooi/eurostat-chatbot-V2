import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { saveChatToCookie, loadChatFromCookie, setupCrossTabbingSyncListeners } from '../utils/storageHandlers';
import { MessageService } from '../services/MessageService';

// Changing from 20 to 15 messages per batch
const MESSAGES_BATCH_SIZE = 15;
// Minimum number of messages before showing the "Show More" button
const MIN_MESSAGES_FOR_BUTTON = 15;

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [allMessages, setAllMessages] = useState([]);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [displayCount, setDisplayCount] = useState(MESSAGES_BATCH_SIZE);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const [usedVisualizations, setUsedVisualizations] = useState([]);

  const { i18n } = useTranslation();
  const messagesEndRef = useRef(null);

  // Scroll handler function
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Update visible messages when total messages or display count changes
  useEffect(() => {
    if (allMessages.length > 0) {
      const startIndex = Math.max(0, allMessages.length - displayCount);
      setVisibleMessages(allMessages.slice(startIndex));
      
      // Only show the "Show More" button if we have enough messages AND there are more to load
      setShowMoreButton(allMessages.length > MIN_MESSAGES_FOR_BUTTON && allMessages.length > displayCount);
      
      scrollToBottom(); // Auto-scroll when messages update
    } else {
      setVisibleMessages([]);
      setShowMoreButton(false);
    }
  }, [allMessages, displayCount, scrollToBottom]);

  // Initialize with welcome message or load saved chat
  useEffect(() => {
    const savedChat = loadChatFromCookie();
    
    if (savedChat?.length > 0) {
      // Ensure any loaded messages have string text values
      const validatedChat = savedChat.map(msg => ({
        ...msg,
        text: typeof msg.text === 'string' ? msg.text : JSON.stringify(msg.text)
      }));
      setAllMessages(validatedChat);
      // Only show last MESSAGES_BATCH_SIZE messages initially
      setDisplayCount(Math.min(MESSAGES_BATCH_SIZE, validatedChat.length));
    } else {
      const welcomeMessage = MessageService.createWelcomeMessage(i18n.language);
      setAllMessages([welcomeMessage]);
      setDisplayCount(MESSAGES_BATCH_SIZE);
    }
  }, [i18n.language]);

  // Cross-tab synchronization
  useEffect(() => {
    return setupCrossTabbingSyncListeners((syncedMessages) => {
      if (syncedMessages) {
        if (JSON.stringify(syncedMessages) !== JSON.stringify(allMessages)) {
          setAllMessages(syncedMessages);
          setDisplayCount(Math.min(MESSAGES_BATCH_SIZE, syncedMessages.length));
        }
      } else {
        setAllMessages([]);
        setDisplayCount(MESSAGES_BATCH_SIZE);
      }
    });
  }, [allMessages]);

  const updateMessages = useCallback((newMessages) => {
    if (typeof newMessages === 'function') {
      setAllMessages(prevMessages => {
        const updatedMessages = newMessages(prevMessages);
        saveChatToCookie(updatedMessages);
        return updatedMessages;
      });
    } else {
      setAllMessages(newMessages);
      saveChatToCookie(newMessages);
    }
  }, []);

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

    // Updaters
    setInput,
    setIsTyping,
    setShowScrollButton,
    setUsedVisualizations,
    updateMessages,
    loadMoreMessages,
    resetToRecentMessages,
    scrollToBottom
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;