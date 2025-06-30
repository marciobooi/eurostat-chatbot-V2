import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { processMessage } from '../utils/intentMessages.js';
import { useKeyboardNavigation } from '../utils/keyboardNavigation.js';
import { getTimeBasedWelcomeMessage } from '../data/WelcomeMessages.js';
import { 
  storageManager, 
  getChatHistory, 
  addChatMessage, 
  clearChatHistory, 
  getUserPreferences,
  addSearchQuery 
} from '../utils/storage.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faQuestionCircle, 
  faTrash, 
  faPaperPlane,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import HelpModal from './HelpModal';
import SettingsModal from './SettingsModal';
import TypingIndicator from './TypingIndicator';
import LoadingSpinner from './LoadingSpinner';
import MessageList from './MessageList';
import './Chat.css';

const Chat = () => {
  const { t } = useTranslation();
  
  // Load user preferences with error handling
  const getUserPreferencesWithFallback = () => {
    try {
      return getUserPreferences();
    } catch (error) {
      console.warn('Error loading user preferences, using defaults:', error);
      return {
        autoSave: true,
        showWelcomeMessage: true,
        maxChatHistory: 100,
        defaultCountry: 'EU27_2020'
      };
    }
  };
  
  const userPreferences = getUserPreferencesWithFallback();
  
  // Initialize messages from storage or with welcome message
  const initializeMessages = () => {
    try {
      const savedHistory = getChatHistory();
      if (savedHistory.length > 0 && userPreferences.autoSave) {
        return savedHistory;
      } else {
        // Get a dynamic welcome message based on time of day
        const welcomeMessage = getTimeBasedWelcomeMessage();
        return [{
          id: 1,
          type: 'bot',
          content: welcomeMessage.content,
          timestamp: welcomeMessage.timestamp
        }];
      }
    } catch (error) {
      console.warn('Error loading chat history, starting fresh:', error);
      const welcomeMessage = getTimeBasedWelcomeMessage();
      return [{
        id: 1,
        type: 'bot',
        content: welcomeMessage.content,
        timestamp: welcomeMessage.timestamp
      }];
    }
  };
  
  const [messages, setMessages] = useState(initializeMessages);
  const [inputValue, setInputValue] = useState('');  const [isLoading, setIsLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currentSubfuels, setCurrentSubfuels] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);  const messagesContainerRef = useRef(null);  const clearButtonRef = useRef(null);
  const sendButtonRef = useRef(null);
  const helpButtonRef = useRef(null);
  const settingsButtonRef = useRef(null);
  // Live region for screen readers
  const [liveRegionContent, setLiveRegionContent] = useState('');

  const announceToScreenReader = (message) => {
    setLiveRegionContent(message);
    // Clear after announcement
    setTimeout(() => setLiveRegionContent(''), 1000);
  };

  // Help modal functions
  const openHelpModal = () => {
    setShowHelpModal(true);
    announceToScreenReader('Keyboard shortcuts help opened');
  };
  const closeHelpModal = () => {
    setShowHelpModal(false);
    announceToScreenReader('Keyboard shortcuts help closed');
    // Return focus to help button
    helpButtonRef.current?.focus();
  };

  const openSettingsModal = () => {
    setShowSettingsModal(true);
    announceToScreenReader('Settings modal opened');
  };

  const closeSettingsModal = () => {
    setShowSettingsModal(false);
    announceToScreenReader('Settings modal closed');
    // Return focus to settings button
    settingsButtonRef.current?.focus();
  };  const clearChat = () => {
    // Clear storage
    try {
      clearChatHistory();
    } catch (error) {
      console.warn('Error clearing chat history:', error);
    }
    
    // Get a fresh welcome message when clearing chat
    const newWelcomeMessage = getTimeBasedWelcomeMessage();
    const welcomeMessageObj = {
      id: 1,
      type: 'bot',
      content: newWelcomeMessage.content,
      timestamp: newWelcomeMessage.timestamp
    };
    
    setMessages([welcomeMessageObj]);
    setCurrentSubfuels([]);
    inputRef.current?.focus();
    
    // Save the welcome message to storage
    try {
      const userPreferences = getUserPreferencesWithFallback();
      if (userPreferences.autoSave) {
        addChatMessage(welcomeMessageObj);
      }
    } catch (error) {
      console.warn('Error saving welcome message:', error);
    }
  };
  // Handle subfuel button clicks
  const handleSubfuelClick = async (subfuelName) => {
    if (isLoading) return;

    // Add user message for the subfuel click
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: subfuelName,
      timestamp: new Date(),
      isSubfuelClick: true
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);    // Save user message to storage
    try {
      const userPreferences = getUserPreferencesWithFallback();
      if (userPreferences.autoSave) {
        addChatMessage(userMessage);
      }
    } catch (error) {
      console.warn('Error saving subfuel click to storage:', error);
    }

    // Add typing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Process the subfuel name as a definition request
      const response = await processMessage(subfuelName);
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        responseType: response.type,        isError: response.isError,
        matchData: response.matchData || null,
        subfuels: response.subfuels || [],
        hasVisualization: response.hasVisualization || false,
        visualizationType: response.visualizationType || [],
        link: response.link || '',
        // API parameters for chart data
        dataset: response.dataset || null,
        indicator_type: response.indicator_type || null,
        fuelCode: response.fuelCode || null
      };

      setMessages(prev => [...prev, botResponse]);
        // Save bot response to storage
      try {
        const userPreferences = getUserPreferencesWithFallback();
        if (userPreferences.autoSave) {
          addChatMessage(botResponse);
        }
      } catch (error) {
        console.warn('Error saving subfuel response to storage:', error);
      }
      
      // Update current subfuels for the button area
      if (response.subfuels && response.subfuels.length > 0) {
        setCurrentSubfuels(response.subfuels);
      } else {
        setCurrentSubfuels([]);
      }      
    } catch (error) {
      console.error('Error processing subfuel:', error);
      const errorResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error while looking up that fuel type. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorResponse]);
        // Save error message to storage
      try {
        const userPreferences = getUserPreferencesWithFallback();
        if (userPreferences.autoSave) {
          addChatMessage(errorResponse);
        }
      } catch (error) {
        console.warn('Error saving subfuel error to storage:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  // Handle visualization button clicks
  const handleVisualizationClick = (chartType) => {
    // TODO: Implement chart visualization
  };

  // Handle link button clicks
  const handleLinkClick = (link) => {
    // Open link in new tab
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  // Use keyboard navigation hook
  const {
    focusedMessageIndex,
    isKeyboardUser,
    handleInputKeyDown,
    setFocusedMessageIndex
  } = useKeyboardNavigation({
    messages,
    inputRef,
    messagesContainerRef,
    helpButtonRef,
    clearButtonRef,
    sendButtonRef,
    onClearChat: clearChat,
    onOpenHelp: openHelpModal,
    onAnnounce: announceToScreenReader,
    onSubmit: (e) => handleSubmit(e)
  });
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    
    // Announce new messages to screen readers
    if (messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === 'bot') {
        const announcement = `New bot response: ${lastMessage.content.substring(0, 100)}${lastMessage.content.length > 100 ? '...' : ''}`;
        announceToScreenReader(announcement);
      }
    }
  }, [messages]);  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const query = inputValue.trim();
    setInputValue('');
    setIsLoading(true);    // Save user message to storage and search history
    try {
      const userPreferences = getUserPreferencesWithFallback();
      if (userPreferences.autoSave) {
        addChatMessage(userMessage);
        addSearchQuery(query);
      }
    } catch (error) {
      console.warn('Error saving user message to storage:', error);
    }

    // Add typing animation delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Use the intent message processor
      const response = await processMessage(query);
        // Add additional delay for more realistic typing simulation
      await new Promise(resolve => setTimeout(resolve, 1200));      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        responseType: response.type,
        isError: response.isError,
        matchData: response.matchData || null,
        subfuels: response.subfuels || [],
        hasVisualization: response.hasVisualization || false,
        visualizationType: response.visualizationType || [],
        link: response.link || '',
        // API parameters for chart data
        dataset: response.dataset || null,
        indicator_type: response.indicator_type || null,
        fuelCode: response.fuelCode || null
      };

      // Add the bot response directly
      setMessages(prev => [...prev, botResponse]);
        // Save bot message to storage
      try {
        const userPreferences = getUserPreferencesWithFallback();
        if (userPreferences.autoSave) {
          addChatMessage(botResponse);
        }
      } catch (error) {
        console.warn('Error saving bot response to storage:', error);
      }
      
      // Update current subfuels for the button area
      if (response.subfuels && response.subfuels.length > 0) {
        setCurrentSubfuels(response.subfuels);
      } else {
        setCurrentSubfuels([]);
      }
      
    } catch (error) {
      console.error('Error processing message:', error);
      const errorResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorResponse]);
        // Save error message to storage
      try {
        const userPreferences = getUserPreferencesWithFallback();
        if (userPreferences.autoSave) {
          addChatMessage(errorResponse);
        }
      } catch (error) {
        console.warn('Error saving error message to storage:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const formatMessage = (content) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div 
      className={`chat-container ${isKeyboardUser ? 'keyboard-navigation' : ''}`}
      role="application"
      aria-label="Eurostat Energy Chatbot"
    >
      {/* Live region for screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {liveRegionContent}
      </div>

      {/* Skip link for keyboard users */}
      <a href="#chat-input" className="skip-link">
        Skip to chat input
      </a>      <div className="chat-header" role="banner">
        <div className="chat-title">
          <h1 id="chat-title">{t('chat.title')}</h1>
          <p id="chat-description">{t('chat.description')}</p>
        </div>
        <div className="header-buttons">          <button 
            ref={helpButtonRef}
            onClick={openHelpModal} 
            className="help-button" 
            title={t('chat.help')}
            aria-label={`${t('chat.help')}. Keyboard shortcut: Control slash`}
            type="button"
          ><FontAwesomeIcon icon={faQuestionCircle} />
          </button>          <button 
            ref={settingsButtonRef}
            onClick={openSettingsModal} 
            className="help-button" 
            title={t('chat.settings')}
            aria-label={t('chat.settings')}
            type="button"
          >
            <FontAwesomeIcon icon={faCog} />
          </button>          <button 
            ref={clearButtonRef}
            onClick={clearChat} 
            className="clear-button" 
            title={`${t('chat.clearChat')} (Ctrl+K)`}
            aria-label={`${t('chat.clearChat')}. Keyboard shortcut: Control K`}
            type="button"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>      <div className="chat-content">        <MessageList
          ref={messagesContainerRef}
          messages={messages}
          focusedMessageIndex={focusedMessageIndex}
          isKeyboardUser={isKeyboardUser}
          messagesEndRef={messagesEndRef}
          formatMessage={formatMessage}
          onVisualizationClick={handleVisualizationClick}
          onLinkClick={handleLinkClick}
        />          <TypingIndicator 
          isVisible={isLoading}
          message={t('messages.botTyping')}
          showAvatar={true}
          size="default"
        />
      </div>      {/* Subfuel buttons section */}
      {currentSubfuels.length > 0 && (
        <div className="subfuel-section" role="group" aria-label={t('subfuels.title')}>
          <div className="subfuel-section-header">
            {t('subfuels.title')}
          </div>
          <div className="subfuel-buttons-container">
            {currentSubfuels.map((subfuel, idx) => (
              <button
                key={idx}                className="subfuel-button"
                onClick={() => handleSubfuelClick(subfuel)}
                disabled={isLoading}
                aria-label={`${t('subfuels.clickToExplore')} ${subfuel}`}
                title={`${t('subfuels.clickToExplore')} ${subfuel}`}
              >
                {subfuel}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="chat-input-form" role="search">        <div className="input-group">
          <label htmlFor="chat-input" className="sr-only">
            {t('chat.inputPlaceholder')}
          </label>
          <input
            id="chat-input"
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={t('chat.inputPlaceholder')}
            className="chat-input"
            disabled={isLoading}
            aria-describedby="input-help"
            aria-label={t('chat.inputPlaceholder')}
            autoComplete="off"
            spellCheck="true"
          />
          <div id="input-help" className="sr-only">
            Press Enter to send, Escape to clear, or use keyboard shortcuts: Ctrl+K to clear chat, / to focus input
          </div>          <button 
            ref={sendButtonRef}
            type="submit"            className="send-button"
            disabled={!inputValue.trim() || isLoading}
            aria-label={isLoading ? t('accessibility.messageBeingProcessed') : t('chat.sendButton')}
          >
            {isLoading ? (
              <LoadingSpinner 
                isLoading={true}
                type="spinner"
                size="small"
                inline={true}
              />
            ) : (
              <FontAwesomeIcon icon={faPaperPlane} />
            )}
          </button>
        </div>
      </form>      {/* Help Modal */}
      <HelpModal isOpen={showHelpModal} onClose={closeHelpModal} />
      
      {/* Settings Modal */}
      <SettingsModal isOpen={showSettingsModal} onClose={closeSettingsModal} />
    </div>
  );
};

export default Chat;
