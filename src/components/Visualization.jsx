import React from 'react';
import {
  PieChart, Pie, LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import './Visualization.css';

// Eurostat color palette
const colors = {
  primary: '#0E47CB',    // Eurostat blue
  secondary: '#FFA629',  // Eurostat orange
  tertiary: '#24B9B9',  // Teal
  quaternary: '#FF6B6B', // Coral
  background: '#F8F9FA',
  grid: '#E9ECEF',
  text: '#495057'
};

const chartConfig = {
  style: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '12px'
  },
  margin: { top: 10, right: 30, left: 0, bottom: 0 }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="tooltip-value" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Visualization = ({ type, data, description }) => {
  const renderChart = () => {
    switch (type) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart margin={chartConfig.margin}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={{ stroke: colors.text, strokeWidth: 1 }}
                stroke={colors.background}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={index} 
                    fill={[colors.primary, colors.secondary, colors.tertiary, colors.quaternary][index % 4]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                formatter={(value) => <span style={{ color: colors.text }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={chartConfig.margin}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis 
                dataKey="year" 
                stroke={colors.text}
                style={chartConfig.style}
                tick={{ fill: colors.text }}
              />
              <YAxis 
                stroke={colors.text}
                style={chartConfig.style}
                tick={{ fill: colors.text }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="line"
                formatter={(value) => <span style={{ color: colors.text }}>{value}</span>}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={colors.primary}
                strokeWidth={2}
                dot={{ fill: colors.primary, stroke: colors.background, strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: colors.background, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={chartConfig.margin}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis 
                dataKey="country" 
                stroke={colors.text}
                style={chartConfig.style}
                tick={{ fill: colors.text }}
              />
              <YAxis 
                stroke={colors.text}
                style={chartConfig.style}
                tick={{ fill: colors.text }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="rect"
                formatter={(value) => <span style={{ color: colors.text }}>{value}</span>}
              />
              <Bar
                dataKey="value"
                fill={colors.primary}
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={index} 
                    fill={[colors.primary, colors.secondary, colors.tertiary, colors.quaternary][index % 4]} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={chartConfig.margin}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis 
                dataKey="year" 
                stroke={colors.text}
                style={chartConfig.style}
                tick={{ fill: colors.text }}
              />
              <YAxis 
                stroke={colors.text}
                style={chartConfig.style}
                tick={{ fill: colors.text }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="square"
                formatter={(value) => <span style={{ color: colors.text }}>{value}</span>}
              />
              <Area
                type="monotone"
                dataKey="pipeline"
                stackId="1"
                stroke={colors.primary}
                fill={colors.primary}
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="lng"
                stackId="1"
                stroke={colors.secondary}
                fill={colors.secondary}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="visualization-container">
      <div className="visualization-chart">
        {renderChart()}
      </div>
      {description && (
        <p className="visualization-description">{description}</p>
      )}
    </div>
  );
};

export default Visualization;