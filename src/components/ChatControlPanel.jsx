import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';

const ChatControlPanel = ({ handleClearChat, t }) => {
  return (
    <div className="control-panel">
      <button
        onClick={handleClearChat}
        className="clear-button"
        aria-label={t('accessibility.clear_button')}
        title={t('common.clear_chat')}
        type="button"
        data-tooltip-id="clear-chat-tooltip"
        data-tooltip-content={t('tooltips.clear_button')}
      >
        <FontAwesomeIcon icon={faTrash} aria-hidden="true" />
      </button>
      <Tooltip id="clear-chat-tooltip" place="top" effect="solid" />
    </div>
  );
};

ChatControlPanel.propTypes = {
  handleClearChat: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default ChatControlPanel;
