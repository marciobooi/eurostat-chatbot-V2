import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import '../styles/ChatBot.css';

const ScrollButton = ({ visible, onClick, ariaLabel }) => {
  if (!visible) return null;

  return (
    <button
      className="scroll-button"
      onClick={onClick}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <FontAwesomeIcon icon={faArrowDown} aria-hidden="true" />
    </button>
  );
};

export default ScrollButton;



