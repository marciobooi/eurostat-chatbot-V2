import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRobot } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import './ChatBot.css';

const ChatMessage = ({ message, onSuggestionClick }) => {
  const { t } = useTranslation();
  const isBot = message.sender === 'bot';
  const messageLabel = isBot ? t('bot_message') : t('user_message');

  return (
    <div 
      className={`message-wrapper ${isBot ? 'bot-wrapper' : 'user-wrapper'}`}
      role="listitem"
      aria-label={messageLabel}
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
        <span>{message.text}</span>
        {message.suggestions && (
          <div className="message-suggestions">
            {message.suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick(suggestion)}
                className="suggestion-link"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
