import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import './HelpModal.css';

const HelpModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  
  return (    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('help.title')}
      ariaLabelledBy="help-modal-title"
      ariaDescribedBy="help-modal-description"
    >
      <div className="shortcuts-section">
        <h3>{t('help.messageNavigation')}</h3>
        <div className="shortcut-item">
          <kbd>↑</kbd> <kbd>↓</kbd>
          <span>{t('help.shortcuts.navigateMessages')}</span>
        </div>
        <div className="shortcut-item">
          <kbd>Home</kbd>
          <span>{t('help.shortcuts.firstMessage')}</span>
        </div>
        <div className="shortcut-item">
          <kbd>End</kbd>
          <span>{t('help.shortcuts.lastMessage')}</span>
        </div>
      </div>

      <div className="shortcuts-section">
        <h3>{t('help.chatActions')}</h3>
        <div className="shortcut-item">
          <kbd>Enter</kbd>
          <span>{t('help.shortcuts.sendMessage')}</span>
        </div>
        <div className="shortcut-item">
          <kbd>Esc</kbd>
          <span>{t('help.shortcuts.clearInput')}</span>
        </div>
        <div className="shortcut-item">
          <kbd>Ctrl</kbd> + <kbd>K</kbd>
          <span>{t('help.shortcuts.clearChat')}</span>
        </div>
        <div className="shortcut-item">
          <kbd>Ctrl</kbd> + <kbd>L</kbd>
          <span>{t('help.shortcuts.focusInput')}</span>
        </div>
      </div>

      <div className="shortcuts-section">
        <h3>{t('help.quickAccess')}</h3>
        <div className="shortcut-item">
          <kbd>/</kbd>
          <span>{t('help.shortcuts.focusInput')} (from anywhere)</span>
        </div>
        <div className="shortcut-item">
          <kbd>Ctrl</kbd> + <kbd>/</kbd>
          <span>{t('help.shortcuts.showHelp')}</span>
        </div>
        <div className="shortcut-item">
          <kbd>Esc</kbd>
          <span>{t('help.shortcuts.closeModal')}</span>
        </div>
      </div>      <div className="modal-footer">
        <p>{t('help.footer')}</p>
      </div>
    </Modal>
  );
};

export default HelpModal;
