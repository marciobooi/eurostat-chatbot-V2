import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRobot, faSmile, faMeh, faFrown } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { getCurrentLanguage } from '../i18n';
import { LanguageValidator } from '../utils/languageUtils';
import './ChatBot.css';

const ChatMessage = ({ message, onSuggestionClick }) => {
  const { t } = useTranslation();
  const currentLang = getCurrentLanguage();
  const validLang = LanguageValidator.validate(currentLang);

  const isBot = message.sender === 'bot';
  const icon = isBot ? faRobot : faUser;
  const messageClass = isBot ? 'bot-message' : 'user-message';
  const wrapperClass = isBot ? 'bot-wrapper' : 'user-wrapper';

  const handleSuggestionClick = (suggestion) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };

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
            onClick={() => handleSuggestionClick(topic)}
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
        lang={message.language || validLang}
      >
        <ReactMarkdown
          components={{
            a: ({node, ...props}) => (
              <a 
                {...props} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (props.href?.startsWith('#')) {
                    e.preventDefault();
                    handleSuggestionClick(props.href.slice(1));
                  }
                }}
              />
            )
          }}
        >
          {message.text}
        </ReactMarkdown>
        
        {isBot && message.suggestions?.length > 0 && (
          <div 
            className="message-suggestions"
            role="group"
            aria-label={t('related_topics')}
          >
            {message.suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-link"
                role="button"
                aria-label={t('click_to_learn_about', { topic: suggestion })}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        
        {isBot && message.category === 'unknown' && message.contextInfo?.recentTopics?.length > 0 && (
          <div 
            className="recent-topics"
            role="group"
            aria-label={t('recent_topics')}
          >
            <p className="recent-topics-label">
              {t('recent_topics_label')}:
            </p>
            <div className="recent-topics-list">
              {message.contextInfo.recentTopics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(topic)}
                  className="suggestion-link"
                  role="button"
                  aria-label={t('click_to_learn_about', { topic })}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {isBot && message.contextInfo && renderMoodIndicator(message.contextInfo)}
        {isBot && message.contextInfo && renderContextualSuggestions(message.contextInfo)}
      </div>
    </div>
  );
};

export default ChatMessage;
