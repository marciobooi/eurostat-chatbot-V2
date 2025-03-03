import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const ScrollButton = ({ onClick, visible }) => {
  const { t, i18n } = useTranslation();
  if (!visible) return null;

  return (
    <button
      onClick={onClick}
      className="scroll-button"
      aria-label={t('scroll_to_bottom')}
      title={t('scroll_to_bottom')}
      lang={i18n.language}
    >
      <FontAwesomeIcon icon={faArrowDown} aria-hidden="true" />
    </button>
  );
};

export default ScrollButton;
