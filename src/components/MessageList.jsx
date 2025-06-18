import { forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faUser } from '@fortawesome/free-solid-svg-icons';
import './MessageList.css';

const MessageList = forwardRef(({
  messages,
  focusedMessageIndex,
  isKeyboardUser,
  messagesEndRef,
  formatMessage
}, messagesContainerRef) => {
  return (
    <div 
      className="messages-container"
      ref={messagesContainerRef}
      role="log"
      aria-live="polite"
      aria-label="Chat conversation"
      aria-describedby="chat-description"
      tabIndex="0"
    >
      <div className="keyboard-instructions" aria-hidden={!isKeyboardUser}>
        Use arrow keys to navigate messages, Enter to interact, / to focus input
      </div>
      
      {messages.map((message, index) => (
        <Message
          key={message.id}
          message={message}
          index={index}
          isTyping={false}
          isFocused={index === focusedMessageIndex}
          formatMessage={formatMessage}
        />
      ))}
      
      <div ref={messagesEndRef} />
    </div>
  );
});

const Message = ({ 
  message, 
  index, 
  isTyping, 
  isFocused, 
  formatMessage 
}) => {
  return (
    <div 
      className={`message ${message.type} ${message.isError ? 'error' : ''} ${isFocused ? 'focused' : ''}`}
      role="article"
      aria-label={`${message.type === 'bot' ? 'Bot' : 'User'} message`}
      tabIndex="-1"
      data-message-index={index}
    >
      <div className="message-avatar" aria-hidden="true">
        {message.type === 'bot' ? (
          <div className="bot-avatar">
            <FontAwesomeIcon icon={faRobot} />
          </div>
        ) : (
          <div className="user-avatar">
            <FontAwesomeIcon icon={faUser} />
          </div>
        )}
      </div>
      
      <div className="message-content">        <div className="message-header sr-only">
          {message.type === 'bot' ? 'Eurostat Energy Bot' : 'You'} said:
        </div>
        
        <div 
          className="message-text"
          dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
          role="text"
        />
        
        <div className="message-timestamp" aria-hidden="true">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        
        {/* Additional information for screen readers */}
        {message.matchData && (
          <div className="sr-only">
            Match found using {message.matchData.method} method with {Math.round(message.matchData.confidence * 100)}% confidence.
          </div>
        )}
        
        {message.isError && (
          <div className="error-indicator sr-only">
            This message indicates an error occurred
          </div>
        )}
      </div>
    </div>
  );
};

MessageList.displayName = 'MessageList';

export default MessageList;
