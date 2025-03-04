import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useTranslation } from 'react-i18next';
import './LineChart.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Eurostat color palette
const colors = {
  primary: '#0E47CB',
  hover: '#1651D4',
  grid: '#E9ECEF',
  text: '#495057'
};

const LineChart = ({ data }) => {
  const chartRef = useRef(null);
  const { t } = useTranslation();

  const chartData = {
    labels: data.map(item => item.year),
    datasets: [
      {
        label: t('visualization.line.label'),
        data: data.map(item => item.value),
        borderColor: colors.primary,
        backgroundColor: `${colors.primary}20`,
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: colors.primary,
        pointHoverBackgroundColor: colors.hover,
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#FFFFFF',
        titleColor: colors.text,
        bodyColor: colors.text,
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
        borderColor: colors.grid,
        borderWidth: 1,
        callbacks: {
          label: (context) => t('visualization.line.tooltip.value', {
            year: context.label,
            value: Math.round(context.raw)
          })
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: colors.grid,
          drawBorder: false,
        },
        ticks: {
          color: colors.text,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: colors.grid,
          drawBorder: false,
        },
        ticks: {
          color: colors.text,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12
          }
        },
        beginAtZero: true
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  return (
    <div className="visualization-container">
      <div 
        className="visualization-chart-wrapper"
        role="img"
        aria-label={t('visualization.line.aria.description')}
      >
        {/* Legend */}
        <div className="visualization-legend">
          <div className="legend-header">
            <div className="legend-title">{t('visualization.line.legendTitle')}</div>
            <div className="legend-subtitle">{t('visualization.line.legendSubtitle')}</div>
          </div>
          {data.map((item, index) => (
            <div key={item.year} className="legend-item">
              <div className="legend-year">{item.year}</div>
              <div className="legend-value">
                {Math.round(item.value)}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="visualization-chart-container">
          <Line
            ref={chartRef}
            data={chartData}
            options={options}
            aria-label={t('visualization.line.aria.data')}
          />
        </div>
      </div>
      <p className="visualization-source">
        {t('visualization.source')}: {t('visualization.eurostat')}
      </p>
    </div>
  );
};

LineChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default LineChart;