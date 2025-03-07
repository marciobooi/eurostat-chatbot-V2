import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import '../styles/ChatBot.css';

const TypingIndicator = () => {
  const { t } = useTranslation();

  return (
    <div 
      className="message-wrapper bot-wrapper"
      role="status"
      aria-label={t('accessibility.typing_indicator')}
    >
      <div className="message-icon bot-icon">
        <FontAwesomeIcon icon={faRobot} aria-hidden="true" />
      </div>
      <div className="typing-indicator">
        <div className="typing-bubble"></div>
        <div className="typing-bubble"></div>
        <div className="typing-bubble"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
