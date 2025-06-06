import React from 'react';
import PropTypes from 'prop-types';

const SmartSuggestions = ({ smartMessages, handleSuggestionClick, t }) => {
  if (!smartMessages || smartMessages.length === 0) {
    return null;
  }

  return (
    <div
      className="smart-messages-container"
      role="region"
      aria-label={t('suggestions.title')}
    >
      {smartMessages.map((suggestion, index) => (
        <button
          key={`suggestion-${index}`}
          className="smart-message-btn"
          onClick={() => handleSuggestionClick(suggestion)}
          aria-label={t('suggestions.click_to_learn', { topic: suggestion })}
          type="button"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

SmartSuggestions.propTypes = {
  smartMessages: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleSuggestionClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default SmartSuggestions;
