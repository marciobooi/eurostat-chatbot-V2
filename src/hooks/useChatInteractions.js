import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageService } from '../services/MessageService';
import { useChatContext } from '../contexts/ChatContext';
import { fetchEurostatData } from '../utils/eurostatApi';
import { findEnergyDefinition } from '../utils/energyHandlers';

/**
 * Custom hook to manage core chat interaction logic.
 * Encapsulates actions like sending messages, handling visualization selections,
 * clearing chat, and processing suggestion clicks.
 * It leverages `ChatContext` for state updates and `MessageService` for message processing.
 * @returns {Object} An object containing various handler functions for chat interactions.
 */
export const useChatInteractions = () => {
  const { t, i18n } = useTranslation();
  const {
    input,
    setInput,
    isTyping,
    setIsTyping,
    updateMessages,
    setUsedVisualizations,
    allMessages,
    scrollToBottom
  } = useChatContext();

  // Handles sending a user's message.
  // It processes the input, gets a bot response via MessageService,
  // updates the chat messages, and handles UI states like typing indicators.
  const handleSendMessage = useCallback(async (e) => {
    e?.preventDefault();
    
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setIsTyping(true);

    try {
      // Process the input and get responses
      const [userMessageObj, botResponse] = await MessageService.processUserInput(userMessage, i18n.language);
      
      // Add messages to chat
      updateMessages(prev => [...prev, userMessageObj, botResponse]);
      
      // Only scroll after bot response is complete
      setTimeout(() => {
        scrollToBottom(true);
      }, 100);
    } catch (error) {
      console.error('Error in chat interaction:', error);
      updateMessages(prev => [
        ...prev,
        { sender: 'user', text: userMessage },
        MessageService.createErrorResponse(i18n.language)
      ]);
      setTimeout(() => {
        scrollToBottom(true);
      }, 100);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, setInput, setIsTyping, updateMessages, i18n.language, scrollToBottom]);

  // Handles the selection of a visualization type for a message.
  // Fetches data for the visualization, creates a new visualization message,
  // and adds it to the chat.
  const handleVisualizationSelect = useCallback(async ({ type, message, usedType }) => {
    try {
      setUsedVisualizations(prev => [...prev, usedType]);
      const { data } = await fetchEurostatData(message.fuelType, 'visualization', type);
      
      const visualizationMessage = MessageService.createVisualizationMessage(
        message,
        type,
        data, 
        message.language
      );
      updateMessages(prev => [...prev, visualizationMessage]);
      setTimeout(() => {
        scrollToBottom(true);
      }, 100);
    } catch (error) {
      console.error('Error handling visualization:', error);
      updateMessages(prev => [...prev, MessageService.createErrorResponse(i18n.language)]);
      setTimeout(() => {
        scrollToBottom(true);
      }, 100);
    }
  }, [setUsedVisualizations, updateMessages, i18n.language, scrollToBottom]);

  // Clears all messages from the chat and resets to the initial welcome message.
  // Also clears the record of used visualizations.
  const handleClearChat = useCallback(() => {
    const welcomeMessage = MessageService.createWelcomeMessage(i18n.language);
    updateMessages([welcomeMessage]);
    setUsedVisualizations([]); 
  }, [updateMessages, setUsedVisualizations, i18n.language]);

  // Handles clicks on smart suggestion messages.
  // It fetches a definition or information related to the suggestion
  // and displays it as a bot response in the chat.
  const handleSuggestionClick = useCallback(async (suggestion) => {
    try {
      const definition = await findEnergyDefinition(suggestion, i18n.language);
      const userMessage = MessageService.createUserMessage(suggestion, i18n.language);
      const botResponse = MessageService.createBotResponse(definition, i18n.language);
      updateMessages(prev => [...prev, userMessage, botResponse]);
      setTimeout(() => {
        scrollToBottom(true);
      }, 100);
    } catch (error) {
      console.error('Error handling suggestion:', error);
      updateMessages(prev => [...prev, MessageService.createErrorResponse(i18n.language)]);
      setTimeout(() => {
        scrollToBottom(true);
      }, 100);
    }
  }, [updateMessages, i18n.language, scrollToBottom]);

  return {
    handleSendMessage,
    handleVisualizationSelect,
    handleClearChat,
    handleSuggestionClick
  };
};