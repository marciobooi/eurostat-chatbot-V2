import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRobot } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { getCurrentLanguage } from '../i18n';

const ChatMessage = ({ message, onSuggestionClick }) => {
  const { t } = useTranslation();
  const currentLang = getCurrentLanguage();

  const isBot = message.sender === 'bot';
  const icon = isBot ? faRobot : faUser;
  const messageClass = isBot ? 'bot-message' : 'user-message';
  const wrapperClass = isBot ? 'bot-wrapper' : 'user-wrapper';

  return (
    <div className={`message-wrapper ${wrapperClass}`}>
      <div className={`message-icon ${isBot ? 'bot-icon' : 'user-icon'}`}>
        <FontAwesomeIcon 
          icon={icon} 
          className="icon" 
          aria-hidden="true"
        />
      </div>
      <div 
        className={messageClass}
        lang={message.language}
        role="article"
        aria-label={t(isBot ? 'accessibility.bot_message' : 'accessibility.user_message')}
      >
        {isBot && message.title && (
          <h3 className="message-title">{message.title}</h3>
        )}
        <div className="message-text">
          {isBot && message.text ? message.text : message.text}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
