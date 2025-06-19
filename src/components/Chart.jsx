import React, { useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './Chart.css';

const Chart = ({ 
  type, 
  data, 
  title, 
  remainingVisualizationTypes = [], 
  onVisualizationChange,
  animate = false 
}) => {  const chartRef = useRef(null);

  // Generate sample data based on fuel types (you can replace with real data)
  const generateChartData = () => {
    const sampleData = [
      { name: 'Hard Coal', y: 45, color: '#6366f1' },      // Indigo
      { name: 'Brown Coal', y: 30, color: '#8b5cf6' },     // Violet  
      { name: 'Coal Products', y: 25, color: '#06b6d4' }   // Cyan
    ];

    const lineData = [
      { name: 'Hard Coal', data: [65, 70, 80, 85, 75, 90, 95], color: '#6366f1' },
      { name: 'Brown Coal', data: [45, 50, 60, 55, 65, 70, 68], color: '#8b5cf6' },
      { name: 'Coal Products', data: [25, 30, 35, 40, 45, 50, 48], color: '#06b6d4' }
    ];

    if (type === 'line') return lineData;
    return sampleData;
  };

  // Revolut-style chart configuration
  const getChartOptions = () => {
    const baseOptions = {
      chart: {
        type: type === 'bar' ? 'column' : type,
        backgroundColor: 'transparent',
        spacing: [20, 20, 20, 20],
        style: {
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
        animation: animate ? { duration: 800, easing: 'easeOutQuart' } : false,
        height: 280
      },
      title: {
        text: title || '',
        style: {
          fontSize: '16px',
          fontWeight: '600',
          color: '#1f2937'
        },
        align: 'left',
        margin: 25
      },
      credits: { enabled: false },
      legend: {
        enabled: type !== 'pie',
        align: 'left',
        verticalAlign: 'top',
        layout: 'horizontal',
        itemStyle: {
          fontSize: '13px',
          fontWeight: '500',
          color: '#6b7280'
        },
        itemHoverStyle: { color: '#374151' },
        symbolRadius: 6,
        symbolHeight: 12,
        symbolWidth: 12,
        itemMarginBottom: 8,
        y: 35
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        borderColor: 'transparent',
        borderRadius: 12,
        style: {
          color: 'white',
          fontSize: '13px',
          fontWeight: '500'
        },
        shadow: {
          color: 'rgba(0, 0, 0, 0.2)',
          offsetX: 0,
          offsetY: 4,
          opacity: 0.6,
          width: 8
        },
        useHTML: true
      },
      plotOptions: {
        series: {
          animation: animate ? { duration: 800, easing: 'easeOutQuart' } : false,
          borderRadius: type === 'bar' ? 8 : 0,
          dataLabels: {
            enabled: type === 'pie',
            style: {
              fontSize: '12px',
              fontWeight: '600',
              color: 'white',
              textOutline: 'none'
            },
            distance: -30,
            format: '{point.percentage:.0f}%'
          }
        },
        pie: {
          innerSize: '45%', // Donut style like Revolut
          borderWidth: 0,
          states: {
            hover: {
              halo: { size: 0 }
            }
          }
        },
        column: {
          borderRadius: {
            radius: 8,
            scope: 'point'
          },
          groupPadding: 0.15,
          pointPadding: 0.1
        },
        line: {
          lineWidth: 3,
          states: {
            hover: {
              lineWidth: 4
            }
          },
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true,
                radius: 6,
                lineWidth: 0
              }
            }
          }
        }
      },
      xAxis: type === 'line' ? {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        lineWidth: 0,
        tickWidth: 0,
        labels: {
          style: {
            fontSize: '12px',
            color: '#9ca3af'
          },
          y: 20
        },
        gridLineWidth: 0
      } : {},
      yAxis: type !== 'pie' ? {
        title: { text: null },
        gridLineColor: '#f3f4f6',
        gridLineWidth: 1,
        lineWidth: 0,
        tickWidth: 0,
        labels: {
          style: {
            fontSize: '12px',
            color: '#9ca3af'
          },
          x: -10
        }
      } : {},
      series: type === 'pie' ? [{
        name: 'Share',
        data: generateChartData(),
        showInLegend: false
      }] : generateChartData()
    };

    return baseOptions;
  };  return (
    <div className="chart-container">
      <div className="chart-header">
        <h4 className="chart-title">
          {type === 'pie' && '📊 Distribution'}
          {type === 'bar' && '📈 Production Trends'}
          {type === 'line' && '📉 Consumption Pattern'}
        </h4>
        <span className="chart-type-badge">{type} chart</span>
      </div>
      
      <div className="chart-wrapper">
        <HighchartsReact
          ref={chartRef}
          highcharts={Highcharts}
          options={getChartOptions()}
          immutable={false}
        />
      </div>
      
      {/* Remaining visualization buttons */}
      {remainingVisualizationTypes && remainingVisualizationTypes.length > 0 && (
        <div className="remaining-visualizations">
          <span className="remaining-label">View as:</span>
          <div className="remaining-buttons">
            {remainingVisualizationTypes.map((chartType, idx) => (
              <button
                key={idx}
                className="chart-switch-button"
                onClick={() => onVisualizationChange && onVisualizationChange(chartType)}
                title={`Switch to ${chartType} chart`}
              >
                {chartType === 'pie' && '🥧'}
                {chartType === 'bar' && '📊'}
                {chartType === 'line' && '📈'}
                <span>{chartType}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chart;
