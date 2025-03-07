import { findEnergyDefinition } from './energyHandlers';
import { createBotResponse } from './botResponseHandlers';
import toast from 'react-hot-toast';

/**
 * Handles sending a message in the chat
 * @param {string} input - The user's input message
 * @param {string} language - The current language
 * @param {Function} setMessages - Function to update messages state
 * @param {Function} setIsTyping - Function to update typing state
 * @param {Function} setInput - Function to update input state
 * @param {Array} messages - Current chat messages
 * @param {boolean} isTyping - Current typing state
 */
export const handleSendMessage = (input, language, setMessages, setIsTyping, setInput, messages, isTyping) => {
  if (!input.trim() || isTyping) {
    return;
  }
  
  const userMessage = { 
    sender: 'user', 
    text: input.trim(),
    language 
  };
  
  setMessages(prev => [...prev, userMessage]);

  const definition = findEnergyDefinition(input.trim(), language);
  
  if (definition) {
    setIsTyping(true);
    setTimeout(() => {
      const botResponse = createBotResponse(definition, language);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  }
  
  setInput('');
};

/**
 * Handles clearing the chat history
 * @param {Function} setMessages - Function to update messages state
 * @param {Function} confirmMessage - Function to show confirmation dialog
 * @returns {void}
 */
export const handleClearChat = (setMessages, t) => {
  setMessages([]);
  toast.success(t('toast.clearChat'), {
    duration: 2000,
    position: 'top-right',
    style: {
      background: '#ebfbee',
      color: '#059669',
      border: '1px solid #34d399'
    },
  });
};

/**
 * Handles clicking on a suggestion topic
 * @param {string} topic - The suggested topic
 * @param {string} language - The current language
 * @param {Function} setMessages - Function to update messages state
 * @param {Function} setIsTyping - Function to update typing state
 * @param {Function} setInput - Function to update input state
 * @param {Array} messages - Current chat messages
 * @param {boolean} isTyping - Current typing state
 */
export const handleSuggestionClick = (topic, language, setMessages, setIsTyping, setInput, messages, isTyping) => {
  const userMessage = { 
    sender: 'user', 
    text: topic,
    language 
  };
  
  setMessages(prev => [...prev, userMessage]);
  
  // When clicking a suggestion, use an exact match search to find the specific definition
  const definition = findEnergyDefinition(topic, language, true); // Pass true for exactMatch
  
  if (definition) {
    setIsTyping(true);
    setTimeout(() => {
      const botResponse = createBotResponse(definition, language);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  }
};

/**
 * Handles scrolling in the chat container
 * @param {HTMLElement} containerRef - Reference to the container element
 * @param {Function} setShowScrollButton - Function to update scroll button visibility
 */
export const handleScroll = (containerRef, setShowScrollButton) => {
  if (!containerRef) return;
  const { scrollTop, scrollHeight, clientHeight } = containerRef;
  setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
};