import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const ScrollButton = ({ onClick, visible }) => {
  const { t } = useTranslation();
  if (!visible) return null;

  return (
    <div className="scroll-button-container">
      <button
        onClick={onClick}
        className="scroll-button"
        aria-label={t('scroll_to_bottom')}
        title={t('scroll_to_bottom')}
      >
        <FontAwesomeIcon icon={faArrowDown} aria-hidden="true" />
      </button>
    </div>
  );
};

export default ScrollButton;
