import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRobot, faChartPie, faChartBar, faChartLine, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { fetchEurostatData } from '../utils/eurostatApi';

/**
 * ChatMessage component renders a single message in the chat
 * @param {Object} props - Component props
 * @param {Object} props.message - Message data object
 */
const ChatMessage = ({ message, onVisualizationSelect, children }) => {
  const { t } = useTranslation();
  const isBot = message.sender === 'bot';
  const [isLoading, setIsLoading] = useState(false);

  // Determine appropriate CSS classes and icon
  const icon = isBot ? faRobot : faUser;
  const messageClass = isBot ? 'bot-message' : 'user-message';
  const wrapperClass = isBot ? 'bot-wrapper' : 'user-wrapper';
  const iconClass = isBot ? 'bot-icon' : 'user-icon';

  // Map of visualization types to their corresponding icons
  const vizIconMap = {
    'pie': faChartPie,
    'bar': faChartBar,
    'line': faChartLine
  };

  const handleVisualizationClick = async (type) => {
    try {
      if (!message.hasVisualization || !message.text) {
        console.warn('No visualization data available');
        return;
      }
      
      setIsLoading(true);
      
      // Fetch data from Eurostat API
      const fuelType = message.title?.toLowerCase() || message.text.toLowerCase();
      const data = await fetchEurostatData(fuelType, 'visualization', type);
      console.log('Visualization data:', data);
      
      // Send the visualization data to parent
      onVisualizationSelect({
        type,
        data,
        title: message.title || message.text,
        fuelType
      });
    } catch (error) {
      console.error('Error fetching visualization data:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Render visualization if present */}
        {children}

        {/* Display visualization icons and link icon for bot messages */}
        {isBot && (message.hasVisualization || message.link) && (
          <div className="message-visualization-options">
            {/* Visualization type icons */}
            {message.hasVisualization && message.visualizationType && 
              message.visualizationType.map((type, index) => (
                <React.Fragment key={`viz-${type}-${index}`}>
                  <button
                    className="message-visualization-icon-button"
                    aria-label={t('visualization.show_chart', { type })}
                    type="button"
                    data-tooltip-id={`viz-tooltip-${type}-${index}`}
                    data-tooltip-content={t('tooltips.visualization', { type })}
                    onClick={() => handleVisualizationClick(type)}
                    disabled={isLoading}
                  >
                    <FontAwesomeIcon
                      icon={vizIconMap[type] || faChartBar}
                      className="viz-icon"
                      aria-hidden="true"
                    />
                  </button>
                  <Tooltip id={`viz-tooltip-${type}-${index}`} place="top" effect="solid" />
                </React.Fragment>
              ))
            }
            
            {/* External link icon - always display if link exists in message */}
            {message.link && (
              <React.Fragment>
                <a
                  href={message.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="message-visualization-icon-button"
                  aria-label={t('common.view_source')}
                  data-tooltip-id="external-link-tooltip"
                  data-tooltip-content={t('tooltips.external_link')}
                >
                  <FontAwesomeIcon
                    icon={faExternalLinkAlt}
                    className="viz-icon"
                    aria-hidden="true"
                  />
                </a>
                <Tooltip id="external-link-tooltip" place="top" effect="solid" />
              </React.Fragment>
            )}
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="visualization-loading">
            {t('visualization.loading')}
          </div>
        )}
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
    hasVisualization: PropTypes.bool,
    visualizationType: PropTypes.arrayOf(PropTypes.string),
    link: PropTypes.string
  }).isRequired,
  onVisualizationSelect: PropTypes.func.isRequired,
  children: PropTypes.node
};

export default ChatMessage;
