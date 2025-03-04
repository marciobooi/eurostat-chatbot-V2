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
import { chartColors } from '../../utils/chartColors';


// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data }) => {
  const chartRef = useRef(null);
  const { t } = useTranslation();

  const chartData = {
    labels: data.map(item => item.country),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map((_, index) => chartColors.blues[index % chartColors.blues.length]),
        hoverBackgroundColor: data.map((_, index) => chartColors.bluesHover[index % chartColors.bluesHover.length]),
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
        titleColor: chartColors.text,
        bodyColor: chartColors.text,
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
        borderColor: chartColors.grid,
        borderWidth: 1,
        callbacks: {
            label: (context) => t('visualization.pie.tooltip.value', {
              name: context.label,
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
          color: chartColors.text,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12
          }
        }
      },
      y: {
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