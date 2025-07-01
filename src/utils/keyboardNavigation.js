/**
 * Keyboard Navigation Hook
 * Handles all keyboard shortcuts and navigation for the chat interface
 */

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useKeyboardNavigation = ({
  messages,
  inputRef,
  messagesContainerRef,
  helpButtonRef,
  clearButtonRef,
  sendButtonRef,
  onClearChat,
  onOpenHelp,
  onAnnounce,
  onSubmit
}) => {
  const { t } = useTranslation();
  const [focusedMessageIndex, setFocusedMessageIndex] = useState(-1);
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  // Navigation functions
  const navigateMessages = useCallback((direction) => {
    const newIndex = direction === 'up' 
      ? Math.max(0, focusedMessageIndex - 1)
      : Math.min(messages.length - 1, focusedMessageIndex + 1);
    
    navigateToMessage(newIndex);
  }, [focusedMessageIndex, messages.length]);

  const navigateToMessage = useCallback((index) => {
    setFocusedMessageIndex(index);
    const messageElements = messagesContainerRef.current?.querySelectorAll('.message');
    if (messageElements && messageElements[index]) {
      messageElements[index].focus();
      messageElements[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Announce message to screen reader
      const message = messages[index];
      if (message && onAnnounce) {
        const announcement = t('accessibility.messageAnnouncement', {
          type: message.type === 'bot' ? t('accessibility.botMessage') : t('accessibility.userMessage'),
          content: message.content
        });
        onAnnounce(announcement);
      }
    }
  }, [messages, messagesContainerRef, onAnnounce]);

  // Main keyboard event handler
  const handleKeyDown = useCallback((e) => {
    setIsKeyboardUser(true);
    
    // Handle global chat shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'k':
          e.preventDefault();
          onClearChat();
          onAnnounce && onAnnounce(t('accessibility.chatCleared'));
          break;
        case 'l':
          e.preventDefault();
          inputRef.current?.focus();
          break;
        case '/':
          e.preventDefault();
          onOpenHelp();
          break;
        default:
          break;
      }
    }

    // Handle arrow key navigation in messages
    if (e.target === messagesContainerRef.current || e.target.closest('.message')) {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          navigateMessages('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          navigateMessages('down');
          break;
        case 'Home':
          e.preventDefault();
          navigateToMessage(0);
          break;
        case 'End':
          e.preventDefault();
          navigateToMessage(messages.length - 1);
          break;
        default:
          break;
      }
    }
  }, [focusedMessageIndex, messages, navigateMessages, navigateToMessage, onClearChat, onOpenHelp, onAnnounce, inputRef, messagesContainerRef]);
  // Input field keyboard shortcuts
  const handleInputKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (onSubmit) {
        onSubmit(e);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.target.value = '';
      onAnnounce && onAnnounce(t('accessibility.inputCleared'));
      // Trigger change event to update parent state
      const event = new Event('input', { bubbles: true });
      e.target.dispatchEvent(event);
    }
  }, [onAnnounce, onSubmit]);

  // Mouse interaction handler
  const handleMouseDown = useCallback(() => {
    setIsKeyboardUser(false);
  }, []);

  // Global keyboard shortcuts (like / to focus input)
  const handleGlobalKeyDown = useCallback((e) => {
    // Focus input with '/' key (like Discord, Slack)
    if (e.key === '/' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      inputRef.current?.focus();
    }
  }, [inputRef]);

  // Reset focused message when messages change
  useEffect(() => {
    if (focusedMessageIndex >= messages.length) {
      setFocusedMessageIndex(messages.length - 1);
    }
  }, [messages.length, focusedMessageIndex]);

  // Add global event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [handleGlobalKeyDown, handleKeyDown, handleMouseDown]);

  return {
    focusedMessageIndex,
    isKeyboardUser,
    handleInputKeyDown,
    setFocusedMessageIndex,
    navigateToMessage
  };
};

/**
 * Keyboard shortcuts configuration
 */
export const KEYBOARD_SHORTCUTS = {
  global: [
    { keys: ['Ctrl', 'K'], description: 'Clear entire chat', action: 'clearChat' },
    { keys: ['Ctrl', 'L'], description: 'Focus input field', action: 'focusInput' },
    { keys: ['Ctrl', '/'], description: 'Show keyboard shortcuts', action: 'showHelp' },
    { keys: ['/'], description: 'Focus input field (from anywhere)', action: 'quickFocus' }
  ],
  navigation: [
    { keys: ['↑', '↓'], description: 'Navigate through messages', action: 'navigateMessages' },
    { keys: ['Home'], description: 'Go to first message', action: 'firstMessage' },
    { keys: ['End'], description: 'Go to last message', action: 'lastMessage' }
  ],
  input: [
    { keys: ['Enter'], description: 'Send message', action: 'sendMessage' },
    { keys: ['Esc'], description: 'Clear input field', action: 'clearInput' }
  ],
  modal: [
    { keys: ['Esc'], description: 'Close modal', action: 'closeModal' }
  ]
};

/**
 * Accessibility utilities
 */
export const A11Y_UTILS = {
  // Screen reader announcements
  announce: (message, priority = 'polite') => {
    const announcement = new CustomEvent('screenreader:announce', {
      detail: { message, priority }
    });
    document.dispatchEvent(announcement);
  },

  // Focus management
  trapFocus: (container) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  },

  // Get readable key combination
  getKeyCombo: (keys) => {
    return keys.map(key => {
      switch (key) {
        case 'Ctrl': return 'Ctrl';
        case 'Cmd': return '⌘';
        case 'Alt': return 'Alt';
        case 'Shift': return 'Shift';
        case '↑': return '↑';
        case '↓': return '↓';
        case 'Enter': return 'Enter';
        case 'Esc': return 'Esc';
        case 'Home': return 'Home';
        case 'End': return 'End';
        case '/': return '/';
        default: return key;
      }
    }).join(' + ');
  }
};
