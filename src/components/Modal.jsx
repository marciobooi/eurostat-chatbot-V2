import { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import './Modal.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  ariaLabelledBy,
  ariaDescribedBy 
}) => {
  const { t } = useTranslation();
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
          <h2 id={ariaLabelledBy}>{title}</h2>          <button 
            onClick={onClose}
            className="modal-close-button"
            aria-label={t('accessibility.closeModal')}
            type="button"
          >
            <FontAwesomeIcon icon={faTimes} />
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
