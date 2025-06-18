import { useState, useRef, useEffect } from 'react';
import { findBestMatch, getGlobalRulerResult } from '../utils/ruler.js';
import HelpModal from './HelpModal';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m the Eurostat Energy Chatbot. Ask me about energy definitions, fuel codes, or any energy-related terms.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');  const [isLoading, setIsLoading] = useState(false);
  const [focusedMessageIndex, setFocusedMessageIndex] = useState(-1);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);  const clearButtonRef = useRef(null);
  const sendButtonRef = useRef(null);
  const helpButtonRef = useRef(null);

  // Accessibility: Track if user is using keyboard navigation
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);
  // Live region for screen readers
  const [liveRegionContent, setLiveRegionContent] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Keyboard navigation handlers
  const handleKeyDown = (e) => {
    setIsKeyboardUser(true);
    
    // Handle global chat shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'k':
          e.preventDefault();          clearChat();
          announceToScreenReader('Chat cleared');
          break;        case 'l':
          e.preventDefault();
          inputRef.current?.focus();
          break;
        case '/':
          e.preventDefault();
          setShowHelpModal(true);
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
  };

  const handleMouseDown = () => {
    setIsKeyboardUser(false);
  };

  const navigateMessages = (direction) => {
    const newIndex = direction === 'up' 
      ? Math.max(0, focusedMessageIndex - 1)
      : Math.min(messages.length - 1, focusedMessageIndex + 1);
    
    navigateToMessage(newIndex);
  };

  const navigateToMessage = (index) => {
    setFocusedMessageIndex(index);
    const messageElements = messagesContainerRef.current?.querySelectorAll('.message');
    if (messageElements && messageElements[index]) {
      messageElements[index].focus();
      messageElements[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Announce message to screen reader
      const message = messages[index];
      if (message) {
        const announcement = `${message.type === 'bot' ? 'Bot' : 'User'} message: ${message.content}`;
        announceToScreenReader(announcement);
      }
    }
  };

  const announceToScreenReader = (message) => {
    setLiveRegionContent(message);
    // Clear after announcement
    setTimeout(() => setLiveRegionContent(''), 1000);
  };

  // Handle input keyboard shortcuts
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      setInputValue('');
      announceToScreenReader('Input cleared');
    }
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

  // Add global keyboard event listeners
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Focus input with '/' key (like Discord, Slack)
      if (e.key === '/' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [focusedMessageIndex, messages]);
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
      // Use the ruler to find a match
      const result = findBestMatch(query);
      
      // Add additional delay for more realistic typing simulation
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      let botResponse;
      if (result && result.match) {
        const match = result.match;
        botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          content: formatMatchResponse(match, result),
          timestamp: new Date(),
          matchData: result
        };
      } else {
        botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          content: 'I couldn\'t find a specific match for that term. Could you try rephrasing your question or using different keywords?',
          timestamp: new Date(),
          isError: true
        };
      }

      // Simulate typing the response character by character
      await typeMessage(botResponse);
      
    } catch (error) {
      console.error('Error processing message:', error);
      const errorResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      await typeMessage(errorResponse);
    } finally {
      setIsLoading(false);
    }
  };

  const typeMessage = async (message) => {
    // Add the message with empty content first
    const emptyMessage = { ...message, content: '', isTyping: true };
    setMessages(prev => [...prev, emptyMessage]);

    // Type the message character by character
    const fullContent = message.content;
    let currentContent = '';
    
    for (let i = 0; i < fullContent.length; i++) {
      currentContent += fullContent[i];
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, content: currentContent }
            : msg
        )
      );
      
      // Variable typing speed for more natural feel
      const delay = fullContent[i] === ' ' ? 50 : 
                   fullContent[i] === '.' ? 200 :
                   fullContent[i] === ',' ? 150 :
                   Math.random() * 40 + 20;
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Mark typing as complete
    setMessages(prev => 
      prev.map(msg => 
        msg.id === message.id 
          ? { ...msg, isTyping: false }
          : msg
      )
    );
  };

  const formatMatchResponse = (match, result) => {
    let response = `**${match.title}**\n\n`;
    
    if (match.fuelCode) {
      response += `**Fuel Code:** ${match.fuelCode}\n\n`;
    }
    
    if (match.text) {
      response += `${match.text}\n\n`;
    }
    
    if (match.keywords && match.keywords.length > 0) {
      response += `**Related terms:** ${match.keywords.join(', ')}\n\n`;
    }
    
    response += `*Found using ${result.method} matching with ${(result.confidence * 100).toFixed(1)}% confidence*`;
    
    return response;
  };

  const formatMessage = (content) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');  };
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
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: 'Hello! I\'m the Eurostat Energy Chatbot. Ask me about energy definitions, fuel codes, or any energy-related terms.',
        timestamp: new Date()
      }
    ]);
    setFocusedMessageIndex(-1);
    inputRef.current?.focus();
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
        <div className="header-buttons">
          <button 
            ref={helpButtonRef}
            onClick={openHelpModal} 
            className="help-button" 
            title="Show keyboard shortcuts (Ctrl+/)"
            aria-label="Show keyboard shortcuts help. Keyboard shortcut: Control slash"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </button>
          <button 
            ref={clearButtonRef}
            onClick={clearChat} 
            className="clear-button" 
            title="Clear chat history (Ctrl+K)"
            aria-label="Clear chat history. Keyboard shortcut: Control K"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c0 1 1 2 2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </button>
        </div>
      </div>
      <div 
        className="chat-messages"
        ref={messagesContainerRef}
        role="log"
        aria-live="polite"
        aria-label="Chat conversation"
        aria-describedby="chat-description"
        tabIndex="0"
        onKeyDown={handleKeyDown}
      >
        <div className="keyboard-instructions" aria-hidden={!isKeyboardUser}>
          Use arrow keys to navigate messages, Enter to interact, / to focus input
        </div>
        
        {messages.map((message, index) => (
          <div 
            key={message.id} 
            className={`message ${message.type} ${message.isError ? 'error' : ''} ${message.isTyping ? 'typing' : ''} ${index === focusedMessageIndex ? 'focused' : ''}`}
            role="article"
            aria-label={`${message.type === 'bot' ? 'Bot' : 'User'} message`}
            tabIndex="-1"
            data-message-index={index}
          >
            <div className="message-avatar" aria-hidden="true">
              {message.type === 'bot' ? (
                <div className="bot-avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 8V4H8"/>
                    <rect width="16" height="12" x="4" y="8" rx="2"/>
                    <path d="M2 14h2"/>
                    <path d="M20 14h2"/>
                    <path d="M15 13v2"/>
                    <path d="M9 13v2"/>
                  </svg>
                </div>
              ) : (
                <div className="user-avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="message-content">
              <div className="message-header sr-only">
                {message.type === 'bot' ? 'Bot' : 'User'} said at {message.timestamp.toLocaleTimeString()}:
              </div>
              <div 
                className="message-text"
                dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                role="text"
              />
              {message.isTyping && (
                <div className="typing-cursor" aria-hidden="true">|</div>
              )}
              <div className="message-timestamp" aria-hidden="true">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              
              {/* Additional information for screen readers */}
              {message.matchData && (
                <div className="sr-only">
                  Match found using {message.matchData.method} method with {Math.round(message.matchData.confidence * 100)}% confidence.
                </div>
              )}
            </div>
          </div>
        ))}        
        {isLoading && (
          <div className="message bot loading" role="status" aria-live="polite">
            <div className="message-avatar" aria-hidden="true">
              <div className="bot-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 8V4H8"/>
                  <rect width="16" height="12" x="4" y="8" rx="2"/>
                  <path d="M2 14h2"/>
                  <path d="M20 14h2"/>
                  <path d="M15 13v2"/>
                  <path d="M9 13v2"/>
                </svg>
              </div>
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </div>
              <div className="sr-only">Bot is typing...</div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
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
            type="submit" 
            className="send-button"
            disabled={!inputValue.trim() || isLoading}
            aria-label={isLoading ? 'Message is being processed' : 'Send message'}
          >
            {isLoading ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22,2 15,22 11,13 2,9 22,2"/>
              </svg>            )}
          </button>
        </div>
      </form>

      {/* Help Modal */}
      <HelpModal isOpen={showHelpModal} onClose={closeHelpModal} />
    </div>
  );
};

export default Chat;
