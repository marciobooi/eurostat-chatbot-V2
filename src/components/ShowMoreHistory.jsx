import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory } from '@fortawesome/free-solid-svg-icons';

const ShowMoreHistory = ({ onClick, visible, remainingCount }) => {
  const { t, i18n } = useTranslation();
  if (!visible) return null;

  return (
    <div className="show-more-container" lang={i18n.language}>
      <button 
        onClick={onClick} 
        className="show-more-button"
        lang={i18n.language}
      >
        <FontAwesomeIcon icon={faHistory} className="mr-2" />
        {t('show_more', { count: remainingCount })}
      </button>
    </div>
  );
};

export default ShowMoreHistory;
