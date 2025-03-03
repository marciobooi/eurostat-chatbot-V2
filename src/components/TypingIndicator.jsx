import React from 'react';
import { useTranslation } from 'react-i18next';
import './ChatBot.css';

const TypingIndicator = () => {
  const { t, i18n } = useTranslation();
  
  return (
    <div 
      className="typing-wrapper" 
      aria-label={t('typing')}
      lang={i18n.language}
    >
      <div 
        className="typing-indicator" 
        role="status"
        aria-live="polite"
      >
        <div className="typing-bubble"></div>
        <div className="typing-bubble"></div>
        <div className="typing-bubble"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
