import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageService } from '../services/MessageService';
import { useChatContext } from '../contexts/ChatContext';
import { fetchEurostatData } from '../utils/eurostatApi';
import { findEnergyDefinition } from '../utils/energyHandlers';

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
    scrollToBottom // Add scrollToBottom from context
  } = useChatContext();

  const handleSendMessage = useCallback(async (e) => {
    e?.preventDefault();
    
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setIsTyping(true);

    try {
      // Process the input and get responses using MessageService
      const [userMessageObj, botResponse] = await MessageService.processUserInput(userMessage, i18n.language);
      
      // Add messages to chat
      updateMessages(prev => [...prev, userMessageObj, botResponse]);
      scrollToBottom(); // Scroll after adding messages
    } catch (error) {
      console.error('Error in chat interaction:', error);
      updateMessages(prev => [
        ...prev,
        { sender: 'user', text: userMessage },
        MessageService.createErrorResponse(i18n.language)
      ]);
      scrollToBottom(); // Scroll even if there's an error
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, setInput, setIsTyping, updateMessages, i18n.language, scrollToBottom]);

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
      scrollToBottom(); // Scroll after adding visualization
    } catch (error) {
      console.error('Error handling visualization:', error);
      updateMessages(prev => [...prev, MessageService.createErrorResponse(i18n.language)]);
      scrollToBottom(); // Scroll even if there's an error
    }
  }, [setUsedVisualizations, updateMessages, i18n.language, scrollToBottom]);

  const handleClearChat = useCallback(() => {
    const welcomeMessage = MessageService.createWelcomeMessage(i18n.language);
    updateMessages([welcomeMessage]);
    setUsedVisualizations([]); 
  }, [updateMessages, setUsedVisualizations, i18n.language]);

  const handleSuggestionClick = useCallback(async (suggestion) => {
    try {
      const definition = await findEnergyDefinition(suggestion, i18n.language);
      const userMessage = MessageService.createUserMessage(suggestion, i18n.language);
      const botResponse = MessageService.createBotResponse(definition, i18n.language);
      updateMessages(prev => [...prev, userMessage, botResponse]);
      scrollToBottom(); // Scroll after adding suggestion messages
    } catch (error) {
      console.error('Error handling suggestion:', error);
      updateMessages(prev => [...prev, MessageService.createErrorResponse(i18n.language)]);
      scrollToBottom(); // Scroll even if there's an error
    }
  }, [updateMessages, i18n.language, scrollToBottom]);

  return {
    handleSendMessage,
    handleVisualizationSelect,
    handleClearChat,
    handleSuggestionClick
  };
};