import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import '../styles/ChatBot.css';

/**
 * ScrollButton component provides a button to scroll to the bottom of messages
 * Only renders when there are messages out of view
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Whether the button should be visible
 * @param {Function} props.onClick - Click handler function
 * @param {string} props.ariaLabel - Accessibility label for the button
 */
const ScrollButton = ({ visible, onClick, ariaLabel }) => {
  if (!visible) return null;
  
  return (
    <button
      className="scroll-button"
      onClick={onClick}
      aria-label={ariaLabel}
      title={ariaLabel}
      type="button"
    >
      <FontAwesomeIcon icon={faArrowDown} aria-hidden="true" />
    </button>
  );
};

ScrollButton.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string.isRequired
};

export default ScrollButton;



