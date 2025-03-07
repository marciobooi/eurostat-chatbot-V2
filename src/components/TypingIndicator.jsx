import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import '../styles/ChatBot.css';

/**
 * TypingIndicator component displays an animation to show the bot is "typing"
 * Provides visual feedback to users while waiting for a response
 */
const TypingIndicator = () => {
  const { t } = useTranslation();

  return (
    <div 
      className="message-wrapper bot-wrapper"
      role="status"
      aria-live="polite"
      aria-label={t('accessibility.typing_indicator')}
    >
      <div className="message-icon bot-icon">
        <FontAwesomeIcon icon={faRobot} aria-hidden="true" />
      </div>
      <div className="typing-indicator">
        <div className="typing-bubble" aria-hidden="true"></div>
        <div className="typing-bubble" aria-hidden="true"></div>
        <div className="typing-bubble" aria-hidden="true"></div>
        <span className="sr-only">{t('chat.typing')}</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
