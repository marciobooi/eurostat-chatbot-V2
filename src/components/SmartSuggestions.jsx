import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const SmartSuggestions = ({ suggestions, onSuggestionClick, title }) => {
  const { t } = useTranslation();
  if (!suggestions?.length) return null;

  return (
    <div className="suggestions-container" role="region" aria-label={t('aria_suggestions')}>    
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="suggestion-chip"
            role="button"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SmartSuggestions;
