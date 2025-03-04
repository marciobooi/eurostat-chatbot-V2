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
import { chartColors } from '../../utils/chartColors';


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

const AreaChart = ({ data }) => {
  const chartRef = useRef(null);
  const { t } = useTranslation();

  const chartData = {
    labels: data.map(item => item.year),
    datasets: [
      {
        label: 'Pipeline',
        data: data.map(item => item.pipeline),
        borderColor: chartColors.primary,
        backgroundColor: chartColors.withOpacity(chartColors.primary, 0.1),
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
      {
        label: 'LNG',
        data: data.map(item => item.lng),
        borderColor: chartColors.secondary,
        backgroundColor: chartColors.withOpacity(chartColors.secondary, 0.1),
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
        titleColor: chartColors.text,
        bodyColor: chartColors.text,
        titleFont: {
          size: 13,
          weight: 'bold',
          family: 'arial, sans-serif',
        },
        bodyFont: {
            family: 'arial, sans-serif',
        },
        padding: 12,
        cornerRadius: 8,
        boxShadow: '0 2px 4px rgba(14, 71, 203, 0.1)',
        borderColor: chartColors.grid,
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: chartColors.text,
          font: {
            family: 'arial, sans-serif',
            size: 12
          }
        }
      },
      y: {
        stacked: true,
        grid: {
          color: chartColors.grid,
          drawBorder: false,
        },
        ticks: {
          color: chartColors.text,
          font: {
            family: 'arial, sans-serif',
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

      {/* Bottom Legend */}
      <div className="visualization-bottom-legend">
        {data.map((item) => (
          <div key={item.year} className="legend-item">
            <div className="legend-year">{item.year}</div>
            <div className="legend-values">
              <div className="legend-indicator">
                <div 
                  className="legend-area pipeline"
                  style={{ backgroundColor: chartColors.primary }}
                />
                <span className="legend-label">Pipeline</span>
              </div>
              <div className="legend-indicator">
                <div 
                  className="legend-area lng"
                  style={{ backgroundColor: chartColors.secondary }}
                />
                <span className="legend-label">LNG</span>
              </div>
            </div>
          </div>
        ))}
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