import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import { useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useTranslation } from 'react-i18next';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

// Eurostat color palette
const colors = {
  primary: ['#0E47CB', '#1E56D6', '#2E66E1', '#3E75EC', '#4E85F7'],
  hover: ['#1651D4', '#2860DE', '#3870E9', '#487FF3', '#588FFF'],
};

const PieChart = ({ data }) => {
  const chartRef = useRef(null);
  const { t } = useTranslation();

  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: colors.primary,
        hoverBackgroundColor: colors.hover,
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 5,
        spacing: 2,
        offset: 0,
        hoverOffset: 5,
        width: 250,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    rotation: -90,
    circumference: 360,   
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#FFFFFF',
        titleColor: '#495057',
        bodyColor: '#495057',
        titleFont: {
          size: 13,
          weight: 'bold',
          family: 'Inter, system-ui, sans-serif'
        },
        bodyFont: {
          family: 'Inter, system-ui, sans-serif'
        },
        padding: 12,
        cornerRadius: 8,
        boxShadow: '0 2px 4px rgba(14, 71, 203, 0.1)',
        borderColor: '#E9ECEF',
        borderWidth: 1,
        callbacks: {
          label: (context) => t('visualization.pie.tooltip.value', {
            name: context.label,
            value: Math.round(context.raw)
          })
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 800,
      easing: 'easeOutQuart'
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
  };

  return (
    <div className="visualization-container">
      <div 
        className="visualization-chart-wrapper"
        role="img"
        aria-label={t('visualization.pie.aria.description')}
      >
        {/* Legend */}
        <div className="visualization-legend">
          {data.map((item, index) => (
            <div key={item.name} className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: colors.primary[index] }}
              />
              <div className="legend-text">
                <div className="legend-label">
                  {item.name}
                </div>
                <div className="legend-value">
                  {Math.round(item.value)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="visualization-chart-container">
          <Doughnut
            ref={chartRef}
            data={chartData}
            options={options}
            aria-label={t('visualization.pie.aria.data')}
          />
        </div>
      </div>
      <p className="visualization-source">
        {t('visualization.source')}: {t('visualization.eurostat')}
      </p>
    </div>
  );
};

PieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default PieChart;