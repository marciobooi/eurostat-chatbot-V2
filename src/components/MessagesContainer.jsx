import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

/**
 * MessagesContainer component handles the display of chat messages
 */
const MessagesContainer = ({
  messagesContainerRef,
  messagesEndRef,
  showMoreButton,
  handleShowMore,
  visibleMessages,
  isTyping,
  t,
  onVisualizationSelect,
  usedVisualizations,
  allMessages,
  renderChartMessage,
  onScroll = () => {} // Default no-op function
}) => {
  return (
    <div 
      className="messages" 
      ref={messagesContainerRef}
      role="log"
      aria-live="polite"
      onScroll={onScroll}
    >
      {/* Show More button at the top of the messages */}
      {showMoreButton && (
        <div className="show-more-container">
          <button
            onClick={handleShowMore}
            className="show-more-button"
            aria-label={t('accessibility.show_more_button')}
            type="button"
            data-tooltip-id="show-more-tooltip"
            data-tooltip-content={t('tooltips.show_more')}
          >
            <FontAwesomeIcon icon={faHistory} aria-hidden="true" /> 
            {t('chat.show_more')}
          </button>
          <Tooltip id="show-more-tooltip" place="bottom" effect="solid" />
        </div>
      )}
      
      {visibleMessages.length === 0 && (
        <div className="no-messages" role="status">
          {t('chat.no_messages')}
        </div>
      )}
      
      {visibleMessages.map((msg, index) => (
        <ChatMessage
          key={`msg-${allMessages.length - visibleMessages.length + index}`}
          message={msg}
          onVisualizationSelect={onVisualizationSelect}
          usedVisualizations={usedVisualizations}
        >
          {msg.isVisualization && renderChartMessage(msg)}
        </ChatMessage>
      ))}

      {isTyping && <TypingIndicator />}

      <div ref={messagesEndRef} aria-hidden="true" />
    </div>
  );
};

MessagesContainer.propTypes = {
  messagesContainerRef: PropTypes.object.isRequired,
  messagesEndRef: PropTypes.object.isRequired,
  showMoreButton: PropTypes.bool.isRequired,
  handleShowMore: PropTypes.func.isRequired,
  visibleMessages: PropTypes.array.isRequired,
  isTyping: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  onVisualizationSelect: PropTypes.func.isRequired,
  usedVisualizations: PropTypes.arrayOf(PropTypes.string).isRequired,
  allMessages: PropTypes.array.isRequired,
  renderChartMessage: PropTypes.func.isRequired,
  onScroll: PropTypes.func // Made optional
};

export default MessagesContainer;