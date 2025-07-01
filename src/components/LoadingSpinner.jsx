import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCircleNotch, faCog } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  isLoading = false,
  type = "spinner", // "spinner", "dots", "pulse", "cog"
  size = "default", // "small", "default", "large"
  color = "inherit",
  message = null,
  inline = false
}) => {
  const { t } = useTranslation();
  if (!isLoading) return null;

  const getSpinnerIcon = () => {
    switch (type) {
      case 'cog':
        return faCog;
      case 'circle':
        return faCircleNotch;
      default:
        return faSpinner;
    }
  };

  const renderSpinner = () => {
    if (type === 'dots') {
      return (
        <div className={`loading-dots ${size}`}>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      );
    }

    if (type === 'pulse') {
      return (
        <div className={`loading-pulse ${size}`}>
          <div className="pulse-circle"></div>
        </div>
      );
    }

    return (
      <FontAwesomeIcon 
        icon={getSpinnerIcon()} 
        spin 
        className={`loading-icon ${size}`}
        style={{ color: color !== 'inherit' ? color : undefined }}
      />
    );
  };

  if (inline) {
    return (
      <span className="loading-spinner-inline" role="status" aria-label={t('accessibility.loading')}>
        {renderSpinner()}
        {message && <span className="loading-message">{message}</span>}
      </span>
    );
  }

  return (
    <div 
      className={`loading-spinner-container ${size}`} 
      role="status" 
      aria-live="polite"
      aria-label={message || t('accessibility.loading')}
    >
      {renderSpinner()}
      {message && (
        <div className="loading-message">
          {message}
        </div>
      )}
      <div className="sr-only">Loading, please wait...</div>
    </div>
  );
};

export default LoadingSpinner;
