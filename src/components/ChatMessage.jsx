import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRobot } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

/**
 * ChatMessage component renders a single message in the chat
 * @param {Object} props - Component props
 * @param {Object} props.message - Message data object
 */
const ChatMessage = ({ message }) => {
  const { t } = useTranslation();
  const isBot = message.sender === 'bot';

  // Determine appropriate CSS classes and icon
  const icon = isBot ? faRobot : faUser;
  const messageClass = isBot ? 'bot-message' : 'user-message';
  const wrapperClass = isBot ? 'bot-wrapper' : 'user-wrapper';
  const iconClass = isBot ? 'bot-icon' : 'user-icon';

  return (
    <div className={`message-wrapper ${wrapperClass}`}>
      <div className={`message-icon ${iconClass}`}>
        <FontAwesomeIcon 
          icon={icon} 
          className="icon" 
          aria-hidden="true"
        />
      </div>
      <div 
        className={messageClass}
        lang={message.language}
        role="article"
        aria-label={t(isBot ? 'accessibility.bot_message' : 'accessibility.user_message')}
      >
        {isBot && message.title && (
          <h3 className="message-title">{message.title}</h3>
        )}
        <div className="message-text">
          {message.text}
        </div>
      </div>
    </div>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.shape({
    sender: PropTypes.oneOf(['bot', 'user']).isRequired,
    text: PropTypes.string.isRequired,
    title: PropTypes.string,
    language: PropTypes.string,
  }).isRequired,
};

export default ChatMessage;
