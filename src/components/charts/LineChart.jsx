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
import { chartColors } from '../../utils/chartColors';


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

const LineChart = ({ data }) => {
  const chartRef = useRef(null);
  const { t } = useTranslation();

  const chartData = {
    labels: data.map(item => item.year),
    datasets: [
      {
        label: t('visualization.line.label'),
        data: data.map(item => item.value),
        borderColor: chartColors.primary,
        backgroundColor: chartColors.withOpacity(chartColors.primary, 0.1),
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: chartColors.primary,
        pointHoverBackgroundColor: chartColors.bluesHover[0],
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
          color: chartColors.grid,
          drawBorder: false,
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
        aria-label={t('visualization.line.aria.description')}
      >
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