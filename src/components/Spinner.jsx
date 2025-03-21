import React from 'react';
import PropTypes from 'prop-types';

const Spinner = ({ size = '2rem', color = '#0E47CB' }) => {
  return (
    <div 
      className="spinner"
      style={{ 
        '--spinner-size': size,
        '--spinner-color': color 
      }}
      role="status"
      aria-label="Loading"
    >
      <div className="spinner-inner"></div>
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string
};

export default Spinner;