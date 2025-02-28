import React from 'react';
import { useTranslation } from 'react-i18next';

const ShowMoreHistory = ({ onClick, visible, remainingCount }) => {
  const { t } = useTranslation();
  if (!visible) return null;

  return (
    <div className="show-more-container">
      <button onClick={onClick} className="show-more-button">
        {t('show_more', { count: remainingCount })}
      </button>
    </div>
  );
};

export default ShowMoreHistory;
