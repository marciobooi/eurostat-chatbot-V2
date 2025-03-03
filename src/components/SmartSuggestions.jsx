import React from 'react';
import { useTranslation } from 'react-i18next';
import { getCurrentLanguage } from '../i18n';
import { LanguageValidator } from '../utils/languageUtils';

const SmartSuggestions = ({ suggestions = [], onSuggestionClick }) => {
  const { t, i18n } = useTranslation();
  
  if (!suggestions || suggestions.length === 0) return null;
  
  const currentLang = getCurrentLanguage();
  const validLang = LanguageValidator.validate(currentLang);

  return (
    <div 
      className="suggestions-container" 
      role="region" 
      aria-label={t('suggested_topics')}
      lang={validLang}
    >
      <div className="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="suggestion-button"
            role="button"
            aria-label={t('click_to_learn_about', { topic: suggestion })}
            lang={validLang}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SmartSuggestions;
