import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faChartLine, faChartBar, faChartArea } from '@fortawesome/free-solid-svg-icons';

const VisualizationSuggestions = ({ 
  currentFuel,
  availableVisualizations,
  onVisualizationSelect,
  shownVisualizations = []
}) => {
  const { t } = useTranslation();

  if (!currentFuel || !availableVisualizations || availableVisualizations.length === 0) {
    return null;
  }

  const remainingVisualizations = availableVisualizations.filter(
    v => !shownVisualizations.includes(v.type)
  );

  if (remainingVisualizations.length === 0) {
    return null;
  }

  const getVisualizationIcon = (type) => {
    switch (type) {
      case 'pie':
        return faChartPie;
      case 'line':
        return faChartLine;
      case 'bar':
        return faChartBar;
      case 'area':
        return faChartArea;
      default:
        return faChartPie;
    }
  };

  return (
    <div className="visualization-suggestions" role="region" aria-label={t('available_visualizations')}>
      <div className="visualization-options">
        {remainingVisualizations.map((viz, index) => (
          <button
            key={index}
            className="visualization-option"
            onClick={() => onVisualizationSelect(viz)}
            aria-label={t('viz_button_label', { type: viz.type })}
          >
            <FontAwesomeIcon icon={getVisualizationIcon(viz.type)} className="viz-icon" />
            <span>{viz.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VisualizationSuggestions;