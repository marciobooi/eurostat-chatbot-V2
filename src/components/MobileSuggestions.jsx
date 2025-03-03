import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb,
  faXmark,
  faChevronRight,
  faChevronUp, // Import for toggle icon
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

/**
 * Mobile-specific suggestions component
 * Displays suggestions in a popup panel accessible via a button
 * Uses JS default parameters instead of defaultProps
 */
const MobileSuggestions = ({ suggestions = [], onSuggestionClick }) => {
  const { t } = useTranslation();
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [hasSuggestions, setHasSuggestions] = useState(false);
  const [isNewSuggestion, setIsNewSuggestion] = useState(false);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  // Track when new suggestions are added
  useEffect(() => {
    // If we have suggestions
    if (suggestions && suggestions.length > 0) {
      setHasSuggestions(true);

      // Animate to indicate new suggestions
      setIsNewSuggestion(true);
      const timer = setTimeout(() => {
        setIsNewSuggestion(false);
      }, 3000); // Stop animating after 3 seconds

      return () => clearTimeout(timer);
    } else {
      setHasSuggestions(false);
      setIsPanelVisible(false); // Hide panel if no suggestions
    }
  }, [suggestions]);

  // Close panel when clicking outside
  useEffect(() => {
    if (!isPanelVisible) return;

    const handleClickOutside = (event) => {
      // Skip if clicking on button or panel itself
      if (
        buttonRef.current?.contains(event.target) ||
        panelRef.current?.contains(event.target)
      ) {
        return;
      }

      setIsPanelVisible(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isPanelVisible]);

  // Handle suggestion click
  const handleItemClick = (suggestion) => {
    onSuggestionClick(suggestion);
    setIsPanelVisible(false);
  };

  // Handle toggling the panel
  const togglePanel = () => {
    setIsPanelVisible((prevState) => !prevState);
    setIsNewSuggestion(false); // Stop animation on click
  };

  // Define the button classes
  const buttonClasses = `suggestions-button${
    hasSuggestions ? " has-suggestions" : ""
  }${isNewSuggestion ? " pulse" : ""}${isPanelVisible ? " active" : ""}`;

  const panelClasses = `mobile-suggestions-panel${
    isPanelVisible ? " visible" : ""
  }`;

  const overlayClasses = `dark-overlay${isPanelVisible ? " visible" : ""}`;

  // Don't render anything if no suggestions
  if (!hasSuggestions) return null;

  return (
    <>
      {/* Button to toggle suggestions panel with icon that changes based on panel state */}
      <button
        ref={buttonRef}
        className={buttonClasses}
        onClick={togglePanel}
        aria-label={
          isPanelVisible
            ? t("hide_suggestions", "Hide suggestions")
            : t("show_suggestions", "Show suggestions")
        }
        aria-expanded={isPanelVisible}
      >
        <FontAwesomeIcon icon={isPanelVisible ? faChevronUp : faLightbulb} />
      </button>

      {/* Dark overlay behind the panel */}
      <div
        className={overlayClasses}
        onClick={() => setIsPanelVisible(false)}
      ></div>

      {/* Suggestions panel */}
      <div
        ref={panelRef}
        className={panelClasses}
        aria-hidden={!isPanelVisible}
        role="dialog"
        aria-label={t("suggested_topics", "Suggested topics")}
      >
        <div className="mobile-suggestions-header">
          <h3>{t("suggested_topics", "Suggested topics")}</h3>
          <button
            onClick={() => setIsPanelVisible(false)}
            aria-label={t("close", "Close")}
            className="close-button"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="mobile-suggestions-list">
          {suggestions && suggestions.map ? (
            suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="mobile-suggestion-item"
                onClick={() => handleItemClick(suggestion)}
              >
                <span>{suggestion}</span>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  aria-hidden="true"
                  className="suggestion-icon"
                />
              </button>
            ))
          ) : (
            <div className="no-suggestions">
              {t("no_suggestions", "No suggestions available")}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Add prop type validation
MobileSuggestions.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.string),
  onSuggestionClick: PropTypes.func.isRequired,
};

// Remove defaultProps and use default parameters in the function signature instead

export default MobileSuggestions;
