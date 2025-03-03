import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { getCurrentLanguage } from "../i18n";
import { LanguageValidator } from "../utils/languageUtils";

/**
 * Displays clickable topic suggestions
 */
const SmartSuggestions = ({ suggestions = [], onSuggestionClick }) => {
  const { t } = useTranslation();

  if (!suggestions || suggestions.length === 0) return null;

  const currentLang = getCurrentLanguage();
  const validLang = LanguageValidator.validate(currentLang);

  return (
    <div
      className="suggestions-container"
      role="region"
      aria-label={t("suggested_topics", "Suggested topics")}
      lang={validLang}
    >
      <div className="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="suggestion-chip"
            role="button"
            aria-label={t("click_to_learn_about", {
              topic: suggestion,
              defaultValue: `Click to learn about ${suggestion}`,
            })}
            lang={validLang}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

// Add PropTypes to fix the warnings
SmartSuggestions.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.string),
  onSuggestionClick: PropTypes.func.isRequired,
};

export default SmartSuggestions;
