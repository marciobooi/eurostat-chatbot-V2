import { findEnergyDefinition } from './energyHandlers';
import { createBotResponse, createErrorResponse } from './botResponseHandlers';
import { clearChatFromCookie } from './storageHandlers';
import { welcomeMessages } from '../dictionaries/welcomeMessages';
import { getRandomElement } from './randomUtils';
import { CONFIG } from '../i18n';
import toast from 'react-hot-toast';

/**
 * Constants for timing and animation
 */
const CONSTANTS = {
  TYPING_DELAY: 1000, // ms
  TOAST_DURATION: 2000 // ms
};

/**
 * Creates a welcome message from the bot
 */
const createWelcomeMessage = (language = CONFIG.DEFAULT_LANGUAGE) => {
  const messages = welcomeMessages[language] || welcomeMessages[CONFIG.DEFAULT_LANGUAGE];
  return {
    sender: 'bot',
    text: getRandomElement(messages),
    language
  };
};

/**
 * Handles sending a message in the chat
 */
export const handleSendMessage = async (input, setMessages, setIsTyping, setInput, language = CONFIG.DEFAULT_LANGUAGE) => {
  try {
    // Create user message
    const userMessage = {
      sender: 'user',
      text: input.trim(),
      language
    };
    setMessages(prev => [...prev, userMessage]);

    // Find energy definition with proper language support
    const definition = await findEnergyDefinition(input.trim(), language);
    
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
 */
export const handleClearChat = (setMessages, t) => {
  setMessages([]);
  clearChatFromCookie();
  toast.success(t('toast.clearChat'), { duration: CONSTANTS.TOAST_DURATION });
};