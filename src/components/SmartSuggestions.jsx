import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const SmartSuggestions = ({ suggestions, onSuggestionClick }) => {
  const { t } = useTranslation();
  if (!suggestions?.length) return null;

  return (
    <div className="suggestions-container mt-2">
      <div className="text-sm text-gray-500 mb-1">
        <FontAwesomeIcon icon={faLightbulb} className="mr-2" aria-hidden="true" />
        {t('suggestions_title')}
      </div>
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
