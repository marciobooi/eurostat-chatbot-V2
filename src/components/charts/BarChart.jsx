import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useTranslation } from 'react-i18next';
import './BarChart.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Eurostat color palette
const colors = {
  bars: ['#0E47CB', '#1E56D6', '#2E66E1', '#3E75EC', '#4E85F7'],
  hover: ['#1651D4', '#2860DE', '#3870E9', '#487FF3', '#588FFF'],
  grid: '#E9ECEF',
  text: '#495057'
};

const BarChart = ({ data }) => {
  const chartRef = useRef(null);
  const { t } = useTranslation();

  const chartData = {
    labels: data.map(item => item.country),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map((_, index) => colors.bars[index % colors.bars.length]),
        hoverBackgroundColor: data.map((_, index) => colors.hover[index % colors.hover.length]),
        borderRadius: 6,
        maxBarThickness: 40,
        borderSkipped: false,
      }
    ]
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
          label: (context) => t('visualization.bar.tooltip.value', {
            country: context.label,
            value: Math.round(context.raw)
          })
        },
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
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    layout: {
      padding: {
        top: 20
      }
    }
  };

  return (
    <div className="visualization-container">
      <div 
        className="visualization-chart-wrapper"
        role="img"
        aria-label={t('visualization.bar.aria.description')}
      >
        {/* Legend */}
        <div className="visualization-legend">
          <div className="legend-header">
            <div className="legend-title">{t('visualization.bar.legendTitle')}</div>
            <div className="legend-subtitle">{t('visualization.bar.legendSubtitle')}</div>
          </div>
          {data.map((item, index) => (
            <div key={item.country} className="legend-item">
              <div className="legend-country-wrapper">
                <div
                  className="legend-color"
                  style={{ backgroundColor: colors.bars[index % colors.bars.length] }}
                />
                <div className="legend-country">{item.country}</div>
              </div>
              <div className="legend-value">
                {Math.round(item.value)}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="visualization-chart-container">
          <Bar
            ref={chartRef}
            data={chartData}
            options={options}
            aria-label={t('visualization.bar.aria.data')}
          />
        </div>
      </div>
      <p className="visualization-source">
        {t('visualization.source')}: {t('visualization.eurostat')}
      </p>
    </div>
  );
};

BarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      country: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default BarChart;