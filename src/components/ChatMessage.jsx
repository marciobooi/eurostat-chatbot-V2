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

  const renderRelatedTopics = () => {
    if (!message.suggestions?.length) return null;

    return (
      <div 
        className="related-topics"
        role="group"
        aria-label={t('suggestions.related_topics')}
      >
        <p className="related-topics-label">
          {t('suggestions.related_topics')}:
        </p>
        <div className="suggestions-list">
          {message.suggestions.map((topic, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(topic)}
              className="suggestion-chip"
              role="button"
              aria-label={t('suggestions.click_to_learn', { topic })}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    );
  };

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
        {isBot && renderRelatedTopics()}
      </div>
    </div>
  );
};

export default ChatMessage;
