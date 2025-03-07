import { findEnergyDefinition } from './energyHandlers';
import { createBotResponse, createErrorResponse } from './botResponseHandlers';
import { clearChatFromCookie } from './storageHandlers';
import toast from 'react-hot-toast';

/**
 * Constants for timing and animation
 */
const CONSTANTS = {
  TYPING_DELAY: 1000, // ms
  TOAST_DURATION: 2000 // ms
};

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
  // Validate input
  if (!input.trim() || isTyping) {
    return;
  }
  
  // Create user message object
  const userMessage = { 
    sender: 'user', 
    text: input.trim(),
    language 
  };
  
  // Add user message to chat
  setMessages(prev => [...prev, userMessage]);

  try {
    // Find definition based on user input
    const definition = findEnergyDefinition(input.trim(), language);
    
    // Always show typing indicator, whether definition found or not
    setIsTyping(true);
    
    setTimeout(() => {
      // Create bot response (will handle null definition cases)
      const botResponse = createBotResponse(definition, language);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, CONSTANTS.TYPING_DELAY);
  } catch (error) {
    // Handle any errors in processing
    console.error("Error processing message:", error);
    setIsTyping(true);
    
    setTimeout(() => {
      const errorResponse = createErrorResponse(
        "Sorry, I encountered an error processing your request.", 
        language
      );
      setMessages(prev => [...prev, errorResponse]);
      setIsTyping(false);
    }, CONSTANTS.TYPING_DELAY);
  }
  
  // Clear input field
  setInput('');
};

/**
 * Handles clearing the chat history
 * @param {Function} setMessages - Function to update messages state
 * @param {Function} t - Translation function
 */
export const handleClearChat = (setMessages, t) => {
  // Clear the messages state
  setMessages([]);
  
  // Clear the stored chat history from cookies and localStorage
  clearChatFromCookie();
  
  // Show confirmation toast to user
  toast.success(t('toast.clearChat'), {
    duration: CONSTANTS.TOAST_DURATION,
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
  // Prevent processing if already typing
  if (isTyping) {
    return;
  }
  
  // Create user message for suggestion
  const userMessage = { 
    sender: 'user', 
    text: topic,
    language 
  };
  
  // Add user message to chat
  setMessages(prev => [...prev, userMessage]);
  
  try {
    // Use exact match for suggestions to get the specific definition
    const definition = findEnergyDefinition(topic, language, true);
    
    // Show typing indicator
    setIsTyping(true);
    
    setTimeout(() => {
      // Create bot response
      const botResponse = createBotResponse(definition, language);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, CONSTANTS.TYPING_DELAY);
  } catch (error) {
    console.error("Error processing suggestion:", error);
    setIsTyping(true);
    
    setTimeout(() => {
      const errorResponse = createErrorResponse(
        "Sorry, I couldn't find information about that topic.", 
        language
      );
      setMessages(prev => [...prev, errorResponse]);
      setIsTyping(false);
    }, CONSTANTS.TYPING_DELAY);
  }
};

/**
 * Determines if scroll button should be shown based on scroll position
 * @param {HTMLElement} containerRef - Reference to the container element
 * @param {Function} setShowScrollButton - Function to update scroll button visibility
 */
export const handleScroll = (containerRef, setShowScrollButton) => {
  if (!containerRef) return;
  
  const { scrollTop, scrollHeight, clientHeight } = containerRef;
  const scrollThreshold = 100; // px
  const shouldShow = scrollHeight - scrollTop - clientHeight > scrollThreshold;
  
  setShowScrollButton(shouldShow);
};