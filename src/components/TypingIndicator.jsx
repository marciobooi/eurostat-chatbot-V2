import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import './TypingIndicator.css';

const TypingIndicator = ({ 
  isVisible = false, 
  message = "Bot is typing...",
  showAvatar = true,
  size = "default" // "small", "default", "large"
}) => {
  if (!isVisible) return null;

  return (
    <div 
      className={`typing-indicator-container ${size}`} 
      role="status" 
      aria-live="polite"
    >
      {showAvatar && (
        <div className="typing-avatar" aria-hidden="true">
          <div className="bot-avatar">
            <FontAwesomeIcon icon={faRobot} />
          </div>
        </div>
      )}
      
      <div className="typing-content">
        <div className="typing-animation">
          <span className="typing-dot" aria-hidden="true"></span>
          <span className="typing-dot" aria-hidden="true"></span>
          <span className="typing-dot" aria-hidden="true"></span>
        </div>
        
        {/* Screen reader only content */}
        <div className="sr-only">{message}</div>
        
        {/* Optional visible message */}
        <div className="typing-message" aria-hidden="true">
          {message}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
