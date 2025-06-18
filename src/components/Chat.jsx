import { useState, useRef, useEffect } from 'react';
import { findBestMatch, getGlobalRulerResult } from '../utils/ruler.js';
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
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
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
      .replace(/\n/g, '<br />');
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
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-title">
          <h2>Eurostat Energy Chatbot</h2>
          <p>Ask about energy definitions and fuel codes</p>
        </div>
        <button onClick={clearChat} className="clear-button" title="Clear chat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c0 1 1 2 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
        </button>
      </div>
        <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type} ${message.isError ? 'error' : ''} ${message.isTyping ? 'typing' : ''}`}>
            <div className="message-avatar">
              {message.type === 'bot' ? (
                <div className="bot-avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="message-content">
              <div 
                className="message-text"
                dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
              />
              {message.isTyping && (
                <div className="typing-cursor">|</div>
              )}
              <div className="message-timestamp">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message bot loading">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="input-group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about energy terms, fuel codes, or definitions..."
            className="chat-input"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={!inputValue.trim() || isLoading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22,2 15,22 11,13 2,9 22,2"/>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
