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
const ChatMessage = ({ message, onVisualizationSelect, children, usedVisualizations = [] }) => {
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

  // Filter out already used visualization types
  const remainingVisualizations = message.visualizationType?.filter(
    type => !usedVisualizations.includes(type)
  ) || [];

  const handleVisualizationClick = async (type) => {
    try {
      if (!message.hasVisualization || !message.fuelType) {
        console.warn('No visualization data available or missing fuel type');
        return;
      }
      
      setIsLoading(true);
      
      const data = await fetchEurostatData(message.fuelType, 'visualization', type);
      
      onVisualizationSelect({
        type,
        data,
        title: message.title || message.text,
        fuelType: message.fuelType,
        usedType: type,
        link: message.link,
        visualizationType: message.visualizationType
      });
    } catch (error) {
      console.error('Error fetching visualization data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Visualization options component
  const renderVisualizationOptions = () => (
    <div className="message-visualization-options">
      {/* Show visualization buttons only if there are remaining visualizations */}
      {message.hasVisualization && remainingVisualizations.length > 0 && 
        remainingVisualizations.map((type, index) => (
          <button
            key={`viz-${type}-${index}`}
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
        ))
      }
      {/* Always show link button if link exists */}
      {message.link && (
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
      )}
    </div>
  );

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

        {/* Render chart visualization */}
        {children}

        {/* Show visualization options if the message is from bot and has visualizations or link */}
        {isBot && (
          (message.hasVisualization && remainingVisualizations.length > 0) || message.link
        ) && renderVisualizationOptions()}

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
    link: PropTypes.string,
    fuelType: PropTypes.string
  }).isRequired,
  onVisualizationSelect: PropTypes.func.isRequired,
  children: PropTypes.node,
  usedVisualizations: PropTypes.arrayOf(PropTypes.string)
};

export default ChatMessage;
