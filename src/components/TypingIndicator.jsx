import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import './TypingIndicator.css';

const TypingIndicator = ({ 
  isVisible = false, 
  message,
  showAvatar = true,
  size = "default" // "small", "default", "large"
}) => {
  const { t } = useTranslation();
  
  // Use provided message or fall back to translation
  const displayMessage = message || t('messages.botTyping');
  
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
        <div className="sr-only">{displayMessage}</div>
        
        {/* Optional visible message */}
        <div className="typing-message" aria-hidden="true">
          {displayMessage}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
