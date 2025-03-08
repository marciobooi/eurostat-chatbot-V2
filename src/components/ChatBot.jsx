import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTrash, faHistory } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'react-tooltip';
import ScrollButton from './ScrollButton';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { handleSendMessage, handleClearChat, handleSuggestionClick, handleScroll } from '../utils/chatHandlers';
import { saveChatToCookie, loadChatFromCookie, setupCrossTabbingSyncListeners } from '../utils/storageHandlers';
import '../styles/ChatBot.css';

// Number of messages to display initially and to add when "Show More" is clicked
const MESSAGES_BATCH_SIZE = 20;

/**
 * ChatBot component provides the main chat interface
 * Handles message display, user input, and chat controls
 */
const ChatBot = () => {
  // State management
  const [allMessages, setAllMessages] = useState([]); // All messages from storage
  const [visibleMessages, setVisibleMessages] = useState([]); // Messages currently displayed
  const [displayCount, setDisplayCount] = useState(MESSAGES_BATCH_SIZE); // Number of messages to show
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);

  // Refs for DOM elements
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Translation hook
  const { t, i18n } = useTranslation();

  /**
   * Updates the number of visible messages when displayCount changes
   */
  useEffect(() => {
    if (allMessages.length > 0) {
      if (allMessages.length > displayCount) {
        // Show the latest batch of messages (most recent first)
        setVisibleMessages(allMessages.slice(allMessages.length - displayCount));
        setShowMoreButton(true);
      } else {
        // If we have fewer messages than the display count, just show all of them
        setVisibleMessages(allMessages);
        setShowMoreButton(false);
      }
    } else {
      setVisibleMessages([]);
      setShowMoreButton(false);
    }
  }, [allMessages, displayCount]);

  /**
   * Load more messages when the user clicks "Show More"
   */
  const handleShowMore = useCallback(() => {
    const newDisplayCount = Math.min(displayCount + MESSAGES_BATCH_SIZE, allMessages.length);
    setDisplayCount(newDisplayCount);
    
    // Remember scroll position to prevent jumping
    const container = messagesContainerRef.current;
    const scrollPosition = container.scrollHeight - container.scrollTop;
    
    // After updating, restore the relative scroll position
    setTimeout(() => {
      if (container) {
        container.scrollTop = container.scrollHeight - scrollPosition;
      }
    }, 50);
  }, [displayCount, allMessages.length]);

  /**
   * Custom setMessages function that also saves to cookies
   */
  const updateMessages = useCallback((newMessages) => {
    // If newMessages is a function, call it with current messages to get the new value
    if (typeof newMessages === 'function') {
      setAllMessages(prevMessages => {
        const updatedMessages = newMessages(prevMessages);
        saveChatToCookie(updatedMessages);
        return updatedMessages;
      });
    } else {
      // Otherwise just set the messages directly
      setAllMessages(newMessages);
      saveChatToCookie(newMessages);
    }
  }, []);

  /**
   * Smoothly scroll to the bottom of the messages container
   */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  /**
   * Handle container scroll to show/hide scroll button
   */
  const onScroll = useCallback(() => {
    handleScroll(messagesContainerRef.current, setShowScrollButton);
  }, []);

  /**
   * Handle user message submission
   */
  const onSend = useCallback((e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    
    handleSendMessage(
      input, 
      i18n.language, 
      updateMessages, // Use our custom updater 
      setIsTyping, 
      setInput, 
      allMessages, 
      isTyping
    );
    
    // Always show the latest messages when sending a new message
    setDisplayCount(MESSAGES_BATCH_SIZE);
  }, [input, i18n.language, allMessages, isTyping, updateMessages]);

  /**
   * Handle clearing the chat history
   */
  const onClearChat = useCallback(() => {
    handleClearChat(updateMessages, t); // Use our custom updater
    setDisplayCount(MESSAGES_BATCH_SIZE);
  }, [t, updateMessages]);

  /**
   * Handle clicking on a suggestion topic
   */
  const onSuggestionClick = useCallback((topic) => {
    handleSuggestionClick(
      topic, 
      i18n.language, 
      updateMessages, // Use our custom updater
      setIsTyping, 
      setInput, 
      allMessages, 
      isTyping
    );
    
    // Reset to the most recent messages when clicking a suggestion
    setDisplayCount(MESSAGES_BATCH_SIZE);
  }, [i18n.language, allMessages, isTyping, updateMessages]);

  /**
   * Get smart message suggestions from the last bot message
   */
  const getSmartMessages = useCallback(() => {
    if (!allMessages.length) return [];
    const lastMessage = allMessages[allMessages.length - 1];
    return lastMessage.sender === 'bot' && lastMessage.suggestions ? 
           lastMessage.suggestions : [];
  }, [allMessages]);

  // Load saved chat history on initial render
  useEffect(() => {
    const savedChat = loadChatFromCookie();
    if (savedChat && savedChat.length > 0) {
      setAllMessages(savedChat);
      setDisplayCount(Math.min(MESSAGES_BATCH_SIZE, savedChat.length));
    }
  }, []);

  // Set up cross-tab synchronization
  useEffect(() => {
    const cleanupSync = setupCrossTabbingSyncListeners((syncedMessages) => {
      if (syncedMessages) {
        // Only update if we have messages and they're different from current
        if (JSON.stringify(syncedMessages) !== JSON.stringify(allMessages)) {
          setAllMessages(syncedMessages);
          setDisplayCount(Math.min(MESSAGES_BATCH_SIZE, syncedMessages.length));
        }
      } else {
        // If null was sent, clear messages
        setAllMessages([]);
        setDisplayCount(MESSAGES_BATCH_SIZE);
      }
    });
    
    // Cleanup function for the effect
    return cleanupSync;
  }, [allMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    // Only auto-scroll if we're looking at the most recent messages
    if (allMessages.length <= displayCount) {
      scrollToBottom();
    }
  }, [visibleMessages, scrollToBottom, allMessages.length, displayCount]);

  // Smart messages to display
  const smartMessages = getSmartMessages();

  return (
    <div 
      className="chat-bot-container"
      role="region"
      aria-label={t('common.chat')}
    >
      {/* Messages container */}
      <div 
        className="messages" 
        ref={messagesContainerRef} 
        onScroll={onScroll}
        role="log"
        aria-live="polite"
      >
        {/* Show More button at the top of the messages */}
        {showMoreButton && (
          <div className="show-more-container">
            <button
              onClick={handleShowMore}
              className="show-more-button"
              aria-label={t('accessibility.show_more_button')}
              type="button"
              data-tooltip-id="show-more-tooltip"
              data-tooltip-content={t('tooltips.show_more')}
            >
              <FontAwesomeIcon icon={faHistory} aria-hidden="true" /> 
              {t('chat.show_more')}
            </button>
            <Tooltip id="show-more-tooltip" place="bottom" effect="solid" />
          </div>
        )}
        
        {visibleMessages.length === 0 && (
          <div className="no-messages" role="status">
            {t('chat.no_messages')}
          </div>
        )}
        
        {visibleMessages.map((msg, index) => (
          <ChatMessage
            key={`msg-${allMessages.length - visibleMessages.length + index}`}
            message={msg}
          />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {/* Scroll button */}
      <ScrollButton 
        visible={showScrollButton} 
        onClick={scrollToBottom} 
        ariaLabel={t('accessibility.scroll_button')}
      />

      {/* Smart messages suggestion container */}
      {smartMessages.length > 0 && (
        <div 
          className="smart-messages-container" 
          role="region" 
          aria-label={t('suggestions.title')}
        >
          {smartMessages.map((suggestion, index) => (
            <button
              key={`suggestion-${index}`}
              className="smart-message-btn"
              onClick={() => onSuggestionClick(suggestion)}
              aria-label={t('suggestions.click_to_learn', { topic: suggestion })}
              type="button"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input form */}
      <form 
        onSubmit={onSend} 
        className="input-container"
        role="form"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('chat.placeholder')}
          disabled={isTyping}
          ref={inputRef}
          className="chat-input"
          aria-label={t('accessibility.input_field')}
          role="textbox"
          lang={i18n.language}
        />

        <button
          type="submit"
          className="send-button"
          disabled={!input.trim() || isTyping}
          aria-label={t('accessibility.send_button')}
        >
          <FontAwesomeIcon icon={faPaperPlane} aria-hidden="true" />
        </button>
      </form>

      {/* Control panel */}
      <div className="control-panel">
        <button
          onClick={onClearChat}
          className="clear-button"
          aria-label={t('accessibility.clear_button')}
          title={t('common.clear_chat')}
          type="button"
          data-tooltip-id="clear-chat-tooltip"
          data-tooltip-content={t('tooltips.clear_button')}
        >
          <FontAwesomeIcon icon={faTrash} aria-hidden="true" />
        </button>
        <Tooltip id="clear-chat-tooltip" place="top" effect="solid" />
      </div>
    </div>
  );
};

export default ChatBot;
