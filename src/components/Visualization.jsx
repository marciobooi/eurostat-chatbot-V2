import React from 'react';
import PropTypes from 'prop-types';
import PieChart from './charts/PieChart';
import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';
import AreaChart from './charts/AreaChart';
import './Visualization.css';

const Visualization = ({ type, data, description }) => {
  const renderChart = () => {
    switch (type) {
      case 'pie':
        return <PieChart data={data} />;
      case 'line':
        return <LineChart data={data} />;
      case 'bar':
        return <BarChart data={data} />;
      case 'area':
        return <AreaChart data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="visualization-container">
         {description && (
        <h6 className="visualization-description">{description}</h6>
      )}
      {renderChart()}
     
    </div>
  );
};

Visualization.propTypes = {
  type: PropTypes.oneOf(['pie', 'line', 'bar', 'area']).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.number,
    year: PropTypes.string,
    country: PropTypes.string,
    pipeline: PropTypes.number,
    lng: PropTypes.number,
  })).isRequired,
  description: PropTypes.string,
};

export default Visualization;