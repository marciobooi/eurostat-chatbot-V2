import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRobot, faSmile, faMeh, faFrown } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import './ChatBot.css';

const ChatMessage = ({ message, onSuggestionClick }) => {
  const { t, i18n } = useTranslation();
  const isBot = message.sender === 'bot';
  const messageLabel = isBot ? t('bot_message') : t('user_message');

  // Switch to message language if different from current
  if (message.language && message.language !== i18n.language) {
    i18n.changeLanguage(message.language);
  }

  const renderMoodIndicator = (contextInfo) => {
    if (!contextInfo?.emotionalState) return null;
    
    const { isPositive, isNegative } = contextInfo.emotionalState;
    const icon = isPositive ? faSmile : (isNegative ? faFrown : faMeh);
    
    return (
      <div className="mood-indicator" aria-hidden="true">
        <FontAwesomeIcon icon={icon} className="mood-icon" />
      </div>
    );
  };

  const renderContextualSuggestions = (contextInfo) => {
    if (!contextInfo?.shouldFollowUp) return null;
    
    return (
      <div className="contextual-suggestions">
        {contextInfo.recentTopics.map((topic, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(topic)}
            className="context-suggestion-link"
            lang={message.language}
          >
            {topic}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div 
      className={`message-wrapper ${isBot ? 'bot-wrapper' : 'user-wrapper'}`}
      role="listitem"
      aria-label={messageLabel}
      lang={message.language}
    >
      <div 
        className={`message-icon ${isBot ? 'bot-icon' : 'user-icon'}`}
        aria-hidden="true"
      >
        <FontAwesomeIcon 
          icon={isBot ? faRobot : faUser} 
          className="icon"
        />
      </div>
      <div 
        className={isBot ? 'bot-message' : 'user-message'}
        role="region"
        aria-label={messageLabel}
      >
        {isBot && message.contextInfo && renderMoodIndicator(message.contextInfo)}
        <span>{message.text}</span>
        {message.suggestions && (
          <div className="message-suggestions">
            {message.suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick(suggestion)}
                className="suggestion-link"
                lang={message.language}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        {isBot && message.contextInfo && renderContextualSuggestions(message.contextInfo)}
      </div>
    </div>
  );
};

export default ChatMessage;
