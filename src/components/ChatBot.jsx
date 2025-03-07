import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import ScrollButton from './ScrollButton';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { findEnergyDefinition, createBotResponse } from '../utils/energyHandlers';
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

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    
    const userMessage = { 
      sender: 'user', 
      text: input.trim(),
      language: i18n.language 
    };
    setMessages(prev => [...prev, userMessage]);

    const definition = findEnergyDefinition(input.trim(), i18n.language);
    if (definition) {
      setIsTyping(true);
      setTimeout(() => {
        const botResponse = createBotResponse(definition, i18n.language);
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1000);
    }
    
    setInput('');
  };

  const handleClearChat = () => {
    if (window.confirm(t('chat.clear_confirm'))) {
      setMessages([]);
    }
  };

  const handleSuggestionClick = (topic) => {
    setInput(topic);
    handleSend({ preventDefault: () => {} });
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
        onScroll={handleScroll}
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
            onSuggestionClick={handleSuggestionClick}
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

      <form 
        onSubmit={handleSend} 
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
          onClick={handleClearChat}
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
