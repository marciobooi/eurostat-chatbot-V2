import React from 'react';
import { useTranslation } from 'react-i18next';
import './ChatBot.css';

const TypingIndicator = () => {
  const { t } = useTranslation();
  
  return (
    <div className="typing-wrapper" aria-label={t('typing')}>
      <div className="typing-indicator" role="status">
        <div className="typing-bubble"></div>
        <div className="typing-bubble"></div>
        <div className="typing-bubble"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
