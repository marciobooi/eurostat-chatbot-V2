import React, { useRef, useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsHeatmap from 'highcharts/modules/heatmap';
import { getChartData } from '../services/eurostatAPI';
import './Chart.css';

// Initialize Heatmap module
HighchartsHeatmap(Highcharts);

const Chart = ({ 
  type, 
  dataset,
  indicator_type,
  fuelCode,
  selectedCountry = 'DE',
  selectedFuel = 'Solid fossil fuels',
  title, 
  remainingVisualizationTypes = [], 
  onVisualizationChange,
  animate = false 
}) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data when component mounts or parameters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getChartData({
          dataset,
          indicator_type,
          fuelCode,
          chartType: type,
          selectedCountry,
          selectedFuel
        });
        
        setChartData(data);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError(err.message);
        // Set fallback data
        setChartData(generateFallbackData());
      } finally {
        setLoading(false);
      }
    };

    if (dataset && indicator_type && fuelCode) {
      fetchData();
    } else {
      // Use fallback data if required props are missing
      setChartData(generateFallbackData());
      setLoading(false);
    }
  }, [type, dataset, indicator_type, fuelCode, selectedCountry, selectedFuel]);

  // Generate fallback sample data
  const generateFallbackData = () => {
    switch (type) {
      case 'pie':
        return [
          { name: 'Hard Coal', y: 45.8, color: '#4F46E5' },
          { name: 'Brown Coal', y: 32.1, color: '#7C3AED' },
          { name: 'Coal Products', y: 22.1, color: '#EC4899' }
        ];
      case 'line':
        return {
          categories: ['2019', '2020', '2021', '2022', '2023'],
          series: [{
            name: selectedCountry || 'Germany',
            data: [145.6, 132.4, 128.9, 135.2, 142.1],
            color: '#4F46E5'
          }]
        };
      case 'bar':
        return {
          categories: ['Germany', 'France', 'Italy', 'Spain', 'Poland'],
          series: [{
            name: 'Production (2023)',
            data: [245.8, 198.3, 156.7, 134.2, 123.9],
            color: '#4F46E5'
          }]
        };
      case 'stacked':
        return {
          categories: ['Germany', 'France', 'Italy', 'Spain', 'Poland'],
          series: [
            { name: 'Hard coal', data: [45, 25, 35, 20, 55], color: '#4F46E5' },
            { name: 'Brown coal', data: [25, 15, 20, 15, 25], color: '#7C3AED' },
            { name: 'Oil products', data: [30, 40, 25, 35, 20], color: '#EC4899' }
          ]
        };
      case 'heatmap':
        return {
          data: [
            [0, 0, 45], [1, 0, 52], [2, 0, 48],
            [0, 1, 38], [1, 1, 42], [2, 1, 45],
            [0, 2, 35], [1, 2, 38], [2, 2, 41]
          ],
          categories: {
            x: ['2021', '2022', '2023'],
            y: ['Germany', 'France', 'Italy']
          }
        };
      default:
        return [];
    }
  };

  // Revolut-style chart configuration
  const getChartOptions = () => {
    // Map our chart types to Highcharts types
    const getHighchartsType = () => {
      switch (type) {
        case 'bar': return 'column';
        case 'stacked': return 'column';
        case 'heatmap': return 'heatmap';
        case 'line': return 'line';
        case 'pie': return 'pie';
        default: return 'column';
      }
    };

    const baseOptions = {
      chart: {
        type: getHighchartsType(),
        backgroundColor: 'transparent',
        spacing: [20, 20, 20, 20],
        style: {
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
        animation: animate ? { duration: 800, easing: 'easeOutQuart' } : false,
        height: 280
      },
      title: {
        text: null
      },
      credits: { enabled: false },
      legend: {
        enabled: type === 'pie' || type === 'stacked',
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical',
        itemStyle: {
          fontSize: '12px',
          color: '#64748B',
          fontWeight: '500'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'transparent',
        borderRadius: 12,
        style: {
          color: '#F8FAFC',
          fontSize: '12px',
          fontWeight: '500'
        }
      },
      plotOptions: {
        pie: {
          innerSize: '60%',
          borderWidth: 0,
          dataLabels: { enabled: false },
          showInLegend: true
        },
        column: {
          borderRadius: 8,
          borderWidth: 0,
          groupPadding: 0.1,
          pointPadding: 0.05,
          stacking: type === 'stacked' ? 'normal' : null
        },
        line: {
          lineWidth: 3,
          marker: {
            radius: 6,
            lineWidth: 2,
            lineColor: '#FFFFFF'
          }
        },
        heatmap: {
          dataLabels: {
            enabled: true,
            color: '#000000',
            style: {
              fontSize: '10px',
              fontWeight: '500'
            }
          }
        }
      },
      xAxis: (type !== 'pie') ? {
        categories: type === 'heatmap' ? chartData?.categories?.x : chartData?.categories,
        lineColor: 'transparent',
        tickColor: 'transparent',
        labels: {
          style: {
            fontSize: '11px',
            color: '#64748B',
            fontWeight: '500'
          }
        },
        gridLineColor: 'transparent'
      } : undefined,
      yAxis: (type !== 'pie') ? {
        title: { text: null },
        categories: type === 'heatmap' ? chartData?.categories?.y : undefined,
        gridLineColor: '#F1F5F9',
        gridLineWidth: 1,
        labels: {
          style: {
            fontSize: '11px',
            color: '#64748B',
            fontWeight: '500'
          }
        }
      } : undefined,
      series: type === 'pie' ? [{
        data: chartData || []
      }] : type === 'heatmap' ? [{
        name: 'Energy Data',
        data: chartData?.data || [],
        dataLabels: {
          enabled: true,
          color: '#000000'
        }
      }] : (chartData?.series || [])
    };

    return baseOptions;
  };

  if (loading) {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h4 className="chart-title">Loading chart...</h4>
          <span className="chart-type-badge">{type}</span>
        </div>
        <div className="chart-loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h4 className="chart-title">Chart unavailable</h4>
          <span className="chart-type-badge error">error</span>
        </div>
        <div className="chart-error">
          <p>Unable to load chart data. Showing sample data instead.</p>
        </div>
        <div className="chart-wrapper">
          <HighchartsReact
            ref={chartRef}
            highcharts={Highcharts}
            options={getChartOptions()}
            immutable={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h4 className="chart-title">
          {type === 'pie' && '📊 Distribution'}
          {type === 'bar' && '📈 Country Comparison'}
          {type === 'line' && '📉 Trends Over Time'}
          {type === 'heatmap' && '🔥 Country-Year Patterns'}
          {type === 'stacked' && '📚 Fuel Composition'}
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
                {chartType === 'heatmap' && '🔥'}
                {chartType === 'stacked' && '📚'}
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
