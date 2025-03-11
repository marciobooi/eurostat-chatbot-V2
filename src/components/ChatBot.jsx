import React, { useRef, useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'react-tooltip';
import ScrollButton from './ScrollButton';
import MessagesContainer from './MessagesContainer';
import PieChart from './PieChart';
import LineChart from './LineChart';
import BarChart from './BarChart';
import { useChatContext } from '../contexts/ChatContext';
import { useChatInteractions } from '../hooks/useChatInteractions';
import { MessageService } from '../services/MessageService';
import '../styles/ChatBot.css';
import '../styles/ChatBotMobile.css';

/**
 * ChatBot component provides the main chat interface
 */
const ChatBot = () => {
  // Hooks
  const { t, i18n } = useTranslation();
  const {
    input,
    setInput,
    isTyping,
    showScrollButton,
    showMoreButton,
    usedVisualizations,
    visibleMessages,
    allMessages,
    setShowScrollButton,
    loadMoreMessages,
    updateMessages,
    messagesEndRef,
    scrollToBottom
  } = useChatContext();

  const {
    handleSendMessage,
    handleVisualizationSelect,
    handleClearChat,
    handleSuggestionClick
  } = useChatInteractions();

  // Refs
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll handlers
  const onScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const scrollThreshold = 100;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > scrollThreshold);
  }, [setShowScrollButton]);

  // Chart rendering
  const renderChartMessage = useCallback((message) => {
    if (!message.isVisualization) return null;

    const props = {
      dataset: message.dataset,
      fuelType: message.fuelType,
      language: message.language,
      data: message.chartData || [],
      type: message.visualizationType // Pass the type to chart components
    };

    // Handle visualizationType as either string or array
    const chartType = typeof message.visualizationType === 'string' 
      ? message.visualizationType.toLowerCase()
      : null;

    switch (chartType) {
      case 'pie': return <PieChart {...props} />;
      case 'line': return <LineChart {...props} />;
      case 'bar': return <BarChart {...props} />;
      default: return null;
    }
  }, []);

  // Get smart message suggestions
  const smartMessages = allMessages.length > 0 
    ? (allMessages[allMessages.length - 1]?.suggestions || [])
    : [];

  return (
    <div 
      className="chat-bot-container"
      role="region"
      aria-label={t('common.chat')}
    >
      {/* Messages container */}
      <MessagesContainer 
        messagesContainerRef={messagesContainerRef}
        messagesEndRef={messagesEndRef}
        showMoreButton={showMoreButton}
        handleShowMore={loadMoreMessages}
        visibleMessages={visibleMessages}
        isTyping={isTyping}
        t={t}
        onVisualizationSelect={handleVisualizationSelect}
        usedVisualizations={usedVisualizations}
        allMessages={allMessages}
        renderChartMessage={renderChartMessage}
        onScroll={onScroll}
      />

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
              onClick={() => handleSuggestionClick(suggestion)}
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
        onSubmit={handleSendMessage} 
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
          onClick={handleClearChat}
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
