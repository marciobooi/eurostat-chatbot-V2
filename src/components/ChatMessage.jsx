import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRobot, faChartPie, faChartBar, faChartLine, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import { useChatInteractions } from '../hooks/useChatInteractions';
import Spinner from './Spinner';
import PieChart from './PieChart';
import BarChart from './BarChart';
import LineChart from './LineChart';
import 'react-tooltip/dist/react-tooltip.css';
import '../styles/Visualization.css';

const vizIconMap = {
  'pie': faChartPie,
  'bar': faChartBar,
  'line': faChartLine
};

/**
 * ChatMessage component renders a single message in the chat
 */
const ChatMessage = ({ message, children, onVisualizationSelect, usedVisualizations = [] }) => {
  const { t } = useTranslation();
  const { handleVisualizationSelect } = useChatInteractions();
  const [isLoading, setIsLoading] = useState(false);

  // Determine appropriate CSS classes and icon
  const isBot = message.sender === 'bot';
  const icon = isBot ? faRobot : faUser;
  const messageClass = isBot ? 'bot-message' : 'user-message';

  // Get available visualization types
  const visualizationTypes = Array.isArray(message.visualizationType) 
    ? message.visualizationType 
    : message.visualizationType 
      ? [message.visualizationType]
      : [];

  // Filter out used visualization types and current visualization
  const remainingVisualizations = visualizationTypes.filter(
    type => !usedVisualizations.includes(type) && type !== message.currentVisualization
  );

  const onVisualizationClick = async (type) => {
    try {
      setIsLoading(true);
      await handleVisualizationSelect({ 
        type, 
        message,
        usedType: type 
      });
    } catch (error) {
      console.error('Error handling visualization click:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render chart based on type
  const renderVisualization = () => {
    if (!message.chartData || !message.chartType) return null;
    
    switch (message.chartType.toLowerCase()) {
      case 'pie':
        return <PieChart data={message.chartData} type="pie" />;
      case 'bar':
        return <BarChart data={message.chartData} type="bar" />;
      case 'line':
        return <LineChart data={message.chartData} type="line" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`message-wrapper ${isBot ? 'bot-wrapper' : 'user-wrapper'}`}
      role="article"
      aria-label={t(isBot ? 'accessibility.bot_message' : 'accessibility.user_message')}
    >
      <div className={`message-icon ${isBot ? 'bot-icon' : 'user-icon'}`}>
        <FontAwesomeIcon icon={icon} aria-hidden="true" />
      </div>
      <div className={messageClass}>
        {isBot && message.title && (
          <h3 className="message-title">{message.title}</h3>
        )}
        <div className="message-text">
          {message.text.startsWith('visualization.') ? t(message.text) : message.text}

          {message.isVisualization && (
            <div>
              {renderVisualization()}
            </div>
          )}

          {isBot && (message.hasVisualization || message.link || message.isVisualization) && (
            <div className="message-visualization-options">
              {/* Show visualization options if we have available types */}
              {message.hasVisualization && remainingVisualizations.length > 0 && 
                remainingVisualizations.map((type, index) => (
                  <button
                    key={`viz-${type}-${index}`}
                    className="message-visualization-icon-button"
                    aria-label={t('visualization.show_chart', { type })}
                    type="button"
                    data-tooltip-id={`viz-tooltip-${type}-${index}`}
                    data-tooltip-content={t('tooltips.visualization', { type })}
                    onClick={() => onVisualizationClick(type)}
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
              {/* Always show external link if available */}
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
                    icon={faUpRightFromSquare}
                    className="viz-icon"
                    aria-hidden="true"
                  />
                </a>
              )}
            </div>
          )}

          {isLoading && <Spinner size="1.5rem" />}
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
    hasVisualization: PropTypes.bool,
    visualizationType: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string
    ]), // Allow both array and string since we handle both
    link: PropTypes.string,
    fuelType: PropTypes.string,
    chartData: PropTypes.array
  }).isRequired,
  children: PropTypes.node,
  usedVisualizations: PropTypes.arrayOf(PropTypes.string)
};

export default ChatMessage;
