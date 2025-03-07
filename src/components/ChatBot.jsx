import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import ScrollButton from './ScrollButton';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { handleSendMessage, handleClearChat, handleSuggestionClick, handleScroll } from '../utils/chatHandlers';
import '../styles/ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { t, i18n } = useTranslation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const onScroll = () => {
    handleScroll(messagesContainerRef.current, setShowScrollButton);
  };

  const onSend = (e) => {
    e.preventDefault();
    if (!input.trim()) {
      return;
    }
    handleSendMessage(input, i18n.language, setMessages, setIsTyping, setInput, messages, isTyping);
  };

  const onClearChat = () => {
    handleClearChat(setMessages, t);
  };

  const onSuggestionClick = (topic) => {
    handleSuggestionClick(topic, i18n.language, setMessages, setIsTyping, setInput, messages, isTyping);
  };

  const getSmartMessages = () => {
    if (!messages.length) return [];
    const lastMessage = messages[messages.length - 1];
    return lastMessage.sender === 'bot' && lastMessage.suggestions ? 
           lastMessage.suggestions : [];
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div 
      className="chat-bot-container"
      role="region"
      aria-label={t('common.chat')}
    >
      <div 
        className="messages" 
        ref={messagesContainerRef} 
        onScroll={onScroll}
        role="log"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <div className="no-messages" role="status">
            {t('chat.no_messages')}
          </div>
        )}
        
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg}
            onSuggestionClick={onSuggestionClick}
          />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      <ScrollButton 
        visible={showScrollButton} 
        onClick={scrollToBottom} 
        ariaLabel={t('accessibility.scroll_button')}
      />

      {/* Smart Messages Container */}
      {getSmartMessages().length > 0 && (
        <div className="smart-messages-container" role="region" aria-label={t('suggestions.title')}>
          {getSmartMessages().map((suggestion, index) => (
            <button
              key={index}
              className="smart-message-btn"
              onClick={() => onSuggestionClick(suggestion)}
              aria-label={t('suggestions.click_to_learn', { topic: suggestion })}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

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

      <div className="control-panel">
        <button
          onClick={onClearChat}
          className="clear-button"
          aria-label={t('accessibility.clear_button')}
          title={t('common.clear_chat')}
        >
          <FontAwesomeIcon icon={faTrash} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
