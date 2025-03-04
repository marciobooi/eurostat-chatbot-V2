import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useTranslation } from 'react-i18next';
import './AreaChart.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

// Eurostat color palette
const colors = {
  primary: '#0E47CB',
  secondary: '#FFA629',
  grid: '#E9ECEF',
  text: '#495057'
};

const AreaChart = ({ data }) => {
  const chartRef = useRef(null);
  const { t } = useTranslation();

  const chartData = {
    labels: data.map(item => item.year),
    datasets: [
      {
        label: 'Pipeline',
        data: data.map(item => item.pipeline),
        borderColor: colors.primary,
        backgroundColor: `${colors.primary}20`,
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'LNG',
        data: data.map(item => item.lng),
        borderColor: colors.secondary,
        backgroundColor: `${colors.secondary}20`,
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      }
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
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
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
        stacked: true,
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
        aria-label={t('visualization.area.aria.description')}
      >
        {/* Legend */}
        <div className="visualization-legend">
          <div className="legend-header">
            <div className="legend-title">{t('visualization.area.legendTitle')}</div>
            <div className="legend-subtitle">{t('visualization.area.legendSubtitle')}</div>
          </div>
          {data.map((item, index) => (
            <div key={item.year} className="legend-item">
              <div className="legend-year">{item.year}</div>
              <div className="legend-values">
                <div className="legend-value-item">
                  <div 
                    className="legend-color pipeline"
                    style={{ backgroundColor: colors.primary }}
                  />
                  <span>{Math.round(item.pipeline)}</span>
                </div>
                <div className="legend-value-item">
                  <div 
                    className="legend-color lng"
                    style={{ backgroundColor: colors.secondary }}
                  />
                  <span>{Math.round(item.lng)}</span>
                </div>
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
            aria-label={t('visualization.area.aria.data')}
          />
        </div>
      </div>
      <p className="visualization-source">
        {t('visualization.source')}: {t('visualization.eurostat')}
      </p>
    </div>
  );
};

AreaChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.string.isRequired,
      pipeline: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default AreaChart;