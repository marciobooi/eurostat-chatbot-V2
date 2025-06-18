import { useRef, useEffect } from 'react';
import './Modal.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  ariaLabelledBy,
  ariaDescribedBy 
}) => {
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  // Handle keyboard events
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  // Handle clicks outside modal to close it
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Focus the modal after it's rendered
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      ref={backdropRef}
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      <div 
        ref={modalRef}
        className="modal-container"
        onKeyDown={handleKeyDown}
        tabIndex="-1"
      >
        <div className="modal-header">
          <h2 id={ariaLabelledBy}>{title}</h2>
          <button 
            onClick={onClose}
            className="modal-close-button"
            aria-label="Close modal"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div id={ariaDescribedBy} className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
