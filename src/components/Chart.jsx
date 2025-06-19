import React, { useRef, useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { getChartData } from '../services/eurostatAPI';
import './Chart.css';

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
    console.log('🔍 Chart useEffect triggered with:', { type, dataset, indicator_type, fuelCode, selectedCountry, selectedFuel });
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('📡 About to call getChartData with:', { dataset, indicator_type, fuelCode, chartType: type, selectedCountry, selectedFuel });
        
        const data = await getChartData({
          dataset,
          indicator_type,
          fuelCode,
          chartType: type,
          selectedCountry,
          selectedFuel
        });
        
        console.log('✅ Chart data received:', data);
        setChartData(data);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (dataset && indicator_type && fuelCode) {
      fetchData();
    } else {
      setError('Missing required data parameters');
      setLoading(false);
    }
  }, [type, dataset, indicator_type, fuelCode, selectedCountry, selectedFuel]);
  // Revolut-style chart configuration
  const getChartOptions = () => {
    // Map our chart types to Highcharts types
    const getHighchartsType = () => {
      switch (type) {
        case 'bar': return 'column';
        case 'stacked': return 'column';
        case 'line': return 'line';
        case 'pie': return 'pie';
        default: return 'column';
      }
    };    const baseOptions = {
      chart: {
        type: getHighchartsType(),
        backgroundColor: 'transparent',
        spacing: [20, 20, 20, 20],
        style: {
          fontFamily: 'arial, sans-serif'
        },
        animation: animate ? { duration: 800, easing: 'easeOutQuart' } : false,
        height: 280
      },
      accessibility: {
        enabled: false
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
          lineWidth: 3,          marker: {
            radius: 6,
            lineWidth: 2,
            lineColor: '#FFFFFF'
          }
        }
      },
      xAxis: (type !== 'pie') ? {
        categories: chartData?.categories,
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
      } : undefined,      yAxis: (type !== 'pie') ? {
        title: { text: null },
        gridLineColor: '#F1F5F9',
        gridLineWidth: 1,
        labels: {
          style: {
            fontSize: '11px',
            color: '#64748B',
            fontWeight: '500'
          }
        }
      } : undefined,      series: type === 'pie' ? [{
        data: chartData || []
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
      <div className="chart-header">        <h4 className="chart-title">
          {type === 'pie' && '📊 Distribution'}
          {type === 'bar' && '📈 Country Comparison'}
          {type === 'line' && '📉 Trends Over Time'}
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
              >                {chartType === 'pie' && '🥧'}
                {chartType === 'bar' && '📊'}
                {chartType === 'line' && '📈'}
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
