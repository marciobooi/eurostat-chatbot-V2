import Modal from './Modal';
import './HelpModal.css';

const HelpModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Keyboard Shortcuts"
      ariaLabelledBy="help-modal-title"
      ariaDescribedBy="help-modal-description"
    >
      <div className="shortcuts-section">
        <h3>Message Navigation</h3>
        <div className="shortcut-item">
          <kbd>↑</kbd> <kbd>↓</kbd>
          <span>Navigate through messages</span>
        </div>
        <div className="shortcut-item">
          <kbd>Home</kbd>
          <span>Go to first message</span>
        </div>
        <div className="shortcut-item">
          <kbd>End</kbd>
          <span>Go to last message</span>
        </div>
      </div>

      <div className="shortcuts-section">
        <h3>Chat Actions</h3>
        <div className="shortcut-item">
          <kbd>Enter</kbd>
          <span>Send message</span>
        </div>
        <div className="shortcut-item">
          <kbd>Esc</kbd>
          <span>Clear input field</span>
        </div>
        <div className="shortcut-item">
          <kbd>Ctrl</kbd> + <kbd>K</kbd>
          <span>Clear entire chat</span>
        </div>
        <div className="shortcut-item">
          <kbd>Ctrl</kbd> + <kbd>L</kbd>
          <span>Focus input field</span>
        </div>
      </div>

      <div className="shortcuts-section">
        <h3>Quick Access</h3>
        <div className="shortcut-item">
          <kbd>/</kbd>
          <span>Focus input field (from anywhere)</span>
        </div>
        <div className="shortcut-item">
          <kbd>Ctrl</kbd> + <kbd>/</kbd>
          <span>Show this help</span>
        </div>
        <div className="shortcut-item">
          <kbd>Esc</kbd>
          <span>Close this help modal</span>
        </div>
      </div>

      <div className="modal-footer">
        <p>Tip: Use <kbd>Tab</kbd> to navigate between interactive elements.</p>
      </div>
    </Modal>
  );
};

export default HelpModal;
