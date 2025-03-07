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

  const renderSuggestionSection = (suggestionGroup) => {
    if (!suggestionGroup?.items?.length) return null;

    return (
      <div 
        className="suggestion-section"
        role="group"
        aria-label={t(`suggestions.${suggestionGroup.type}`)}
      >
        <p className="suggestion-label">
          {t(`suggestions.${suggestionGroup.type}`, { defaultValue: suggestionGroup.label })}:
        </p>
        <div className="suggestions-list">
          {suggestionGroup.items.map((item, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(item)}
              className="suggestion-chip"
              role="button"
              aria-label={t('suggestions.click_to_learn', { topic: item })}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderSuggestions = () => {
    if (!message.suggestions?.length) return null;

    return (
      <div className="suggestions-container">
        {Array.isArray(message.suggestions) ? (
          // Handle legacy format
          <div className="suggestion-section">
            <p className="suggestion-label">{t('suggestions.related_topics')}:</p>
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
        ) : (
          // Handle new categorized format
          message.suggestions.map((group, index) => (
            <React.Fragment key={index}>
              {renderSuggestionSection(group)}
            </React.Fragment>
          ))
        )}
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
        {isBot && renderSuggestions()}
      </div>
    </div>
  );
};

export default ChatMessage;
