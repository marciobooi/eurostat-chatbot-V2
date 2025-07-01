import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRobot, 
  faUser, 
  faChartPie, 
  faChartBar, 
  faChartLine, 
  faExternalLinkAlt,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import Chart from './Chart';
import './MessageList.css';

const MessageList = forwardRef(({
  messages,
  focusedMessageIndex,
  isKeyboardUser,
  messagesEndRef,
  formatMessage,
  onVisualizationClick,
  onLinkClick
}, messagesContainerRef) => {
  const { t } = useTranslation();

  // Helper function to safely format timestamps
  const formatTimestamp = (timestamp) => {
    try {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      if (isNaN(date.getTime())) {
        return t('errors.invalidTime');
      }
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.warn('Error formatting timestamp:', error);
      return t('errors.invalidTime');
    }
  };

  return (
    <div 
      className="messages-container"
      ref={messagesContainerRef}
      role="log"
      aria-live="polite"
      aria-label={t('accessibility.chatConversation')}
      aria-describedby="chat-description"
      tabIndex="0"
    >
      <div className="keyboard-instructions" aria-hidden={!isKeyboardUser}>
        {t('accessibility.keyboardInstructions')}
      </div>
      
      {messages.map((message, index) => (
        <Message
          key={message.id}
          message={message}
          index={index}
          isTyping={false}
          isFocused={index === focusedMessageIndex}
          formatMessage={formatMessage}
          formatTimestamp={formatTimestamp}
          onVisualizationClick={onVisualizationClick}
          onLinkClick={onLinkClick}
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
  formatMessage,
  formatTimestamp,
  onVisualizationClick,
  onLinkClick
}) => {
  // State to track which chart is currently displayed
  const [currentChartType, setCurrentChartType] = useState(null);
    // Helper function to get chart icon
  const getChartIcon = (chartType) => {
    switch (chartType) {
      case 'pie': return faChartPie;
      case 'bar': return faChartBar;
      case 'line': return faChartLine;
      case 'stacked': return faLayerGroup;
      default: return faChartBar;
    }
  };

  // Handle visualization button click
  const handleVisualizationClick = (chartType) => {
    setCurrentChartType(chartType);
    onVisualizationClick(chartType);
  };

  // Handle chart type change from within the chart
  const handleChartTypeChange = (newChartType) => {
    setCurrentChartType(newChartType);
    onVisualizationClick(newChartType);
  };

  // Get remaining visualization types (exclude currently displayed)
  const getRemainingVisualizationTypes = () => {
    if (!message.visualizationType || !currentChartType) {
      return message.visualizationType || [];
    }
    return message.visualizationType.filter(type => type !== currentChartType);
  };

  return (
    <div 
      className={`message ${message.type} ${message.isError ? 'error' : ''} ${isFocused ? 'focused' : ''}`}
      role="article"
      aria-label={`${message.type === 'bot' ? t('accessibility.botMessage') : t('accessibility.userMessage')}`}
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
      
      <div className="message-content">
        <div className="message-header sr-only">
          {message.type === 'bot' ? t('accessibility.botSaid') : t('accessibility.youSaid')}
        </div>
          <div 
          className="message-text"
          dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
          role="text"
        />        {/* Chart display for bot messages when a chart type is selected */}
        {message.type === 'bot' && currentChartType && message.hasVisualization && (
          <><Chart
              type={currentChartType}
              dataset={message.dataset || 'nrg_ind_id'}
              indicator_type={message.indicator_type || 'INDIC_NRG'}
              fuelCode={message.fuelCode || 'C0000X0350-0370'}
              selectedCountry="EU27_2020" // Default to EU27, will add country selection later
              selectedFuel={message.content.split('**')[1]?.split('**')[0] || 'Energy Data'}
              nrgBalCodes={message.nrgBalCodes || null}
              title={`${message.content.split('**')[1] || 'Energy Data'} - ${currentChartType} Chart`}
              remainingVisualizationTypes={getRemainingVisualizationTypes()}
              onVisualizationChange={handleChartTypeChange}
            />
          </>
        )}
        
        {/* Visualization and Link buttons for bot messages */}
        {message.type === 'bot' && (message.hasVisualization || message.link) && (
          <div className="message-actions" role="group" aria-label={t('accessibility.messageActions')}>
            {/* Visualization buttons - only show if no chart is currently displayed */}
            {message.hasVisualization && message.visualizationType && message.visualizationType.length > 0 && !currentChartType && (
              <div className="visualization-buttons">
                {message.visualizationType.map((chartType, idx) => (
                  <button
                    key={idx}
                    className="action-button visualization-button"
                    onClick={() => handleVisualizationClick(chartType)}
                    aria-label={t('accessibility.viewChart', { chartType })}
                    title={`View as ${chartType} chart`}
                  >
                    <FontAwesomeIcon icon={getChartIcon(chartType)} />
                    <span className="button-label">{chartType}</span>
                  </button>
                ))}
              </div>
            )}
            
            {/* Link button */}
            {message.link && (
              <button
                className="action-button link-button"
                onClick={() => onLinkClick(message.link)}
                aria-label={t('messages.openExternalLink')}
                title={t('messages.viewSourceInfo')}
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} />
                <span className="button-label">{t('messages.source')}</span>
              </button>
            )}
          </div>
        )}        <div className="message-timestamp" aria-hidden="true">
          {formatTimestamp(message.timestamp)}
        </div>
        
        {/* Additional information for screen readers */}
        {message.matchData && (
          <div className="sr-only">
            {t('messages.matchFound', { 
              method: message.matchData.method, 
              confidence: Math.round(message.matchData.confidence * 100) 
            })}
          </div>
        )}
        
        {message.isError && (
          <div className="error-indicator sr-only">
            {t('messages.errorOccurred')}
          </div>
        )}
      </div>
    </div>
  );
};

MessageList.displayName = 'MessageList';

export default MessageList;
