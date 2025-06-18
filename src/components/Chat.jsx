import { useState, useRef, useEffect } from 'react';
import { processMessage } from '../utils/intentMessages.js';
import { useKeyboardNavigation } from '../utils/keyboardNavigation.js';
import { getTimeBasedWelcomeMessage } from '../data/WelcomeMessages.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faQuestionCircle, 
  faTrash, 
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import HelpModal from './HelpModal';
import TypingIndicator from './TypingIndicator';
import LoadingSpinner from './LoadingSpinner';
import MessageList from './MessageList';
import './Chat.css';

const Chat = () => {
  // Get a dynamic welcome message based on time of day
  const welcomeMessage = getTimeBasedWelcomeMessage();
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: welcomeMessage.content,
      timestamp: welcomeMessage.timestamp
    }
  ]);const [inputValue, setInputValue] = useState('');  const [isLoading, setIsLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);  const clearButtonRef = useRef(null);
  const sendButtonRef = useRef(null);
  const helpButtonRef = useRef(null);
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
  const clearChat = () => {
    // Get a fresh welcome message when clearing chat
    const newWelcomeMessage = getTimeBasedWelcomeMessage();
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: newWelcomeMessage.content,
        timestamp: newWelcomeMessage.timestamp
      }
    ]);
    inputRef.current?.focus();
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
  }, [messages]);
  const handleSubmit = async (e) => {
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
    setIsLoading(true);

    // Add typing animation delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Use the intent message processor
      const response = await processMessage(query);
      
      // Add additional delay for more realistic typing simulation
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        responseType: response.type,
        isError: response.isError,
        matchData: response.matchData || null
      };

      // Add the bot response directly
      setMessages(prev => [...prev, botResponse]);
      
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
          <h1 id="chat-title">Eurostat Energy Chatbot</h1>
          <p id="chat-description">Ask about energy definitions and fuel codes</p>
        </div>
        <div className="header-buttons">          <button 
            ref={helpButtonRef}
            onClick={openHelpModal} 
            className="help-button" 
            title="Show keyboard shortcuts (Ctrl+/)"
            aria-label="Show keyboard shortcuts help. Keyboard shortcut: Control slash"
            type="button"
          >
            <FontAwesomeIcon icon={faQuestionCircle} />
          </button>          <button 
            ref={clearButtonRef}
            onClick={clearChat} 
            className="clear-button" 
            title="Clear chat history (Ctrl+K)"
            aria-label="Clear chat history. Keyboard shortcut: Control K"
            type="button"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>      <div className="chat-content">
        <MessageList
          ref={messagesContainerRef}
          messages={messages}
          focusedMessageIndex={focusedMessageIndex}
          isKeyboardUser={isKeyboardUser}
          messagesEndRef={messagesEndRef}
          formatMessage={formatMessage}
        />
        
        <TypingIndicator 
          isVisible={isLoading}
          message="Bot is typing..."
          showAvatar={true}
          size="default"
        />
      </div>
      
      <form onSubmit={handleSubmit} className="chat-input-form" role="search">
        <div className="input-group">
          <label htmlFor="chat-input" className="sr-only">
            Type your energy-related question here
          </label>
          <input
            id="chat-input"
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Ask about energy terms, fuel codes, or definitions..."
            className="chat-input"
            disabled={isLoading}
            aria-describedby="input-help"
            aria-label="Type your energy-related question"
            autoComplete="off"
            spellCheck="true"
          />
          <div id="input-help" className="sr-only">
            Press Enter to send, Escape to clear, or use keyboard shortcuts: Ctrl+K to clear chat, / to focus input
          </div>
          <button 
            ref={sendButtonRef}
            type="submit"            className="send-button"
            disabled={!inputValue.trim() || isLoading}
            aria-label={isLoading ? 'Message is being processed' : 'Send message'}
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
      </form>

      {/* Help Modal */}
      <HelpModal isOpen={showHelpModal} onClose={closeHelpModal} />
    </div>
  );
};

export default Chat;
