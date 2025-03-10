import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageService } from '../services/MessageService';
import { useChatContext } from '../contexts/ChatContext';
import { fetchEurostatData } from '../utils/eurostatApi';

export const useChatInteractions = () => {
  const { t, i18n } = useTranslation();
  const {
    input,
    setInput,
    isTyping,
    setIsTyping,
    updateMessages,
    setUsedVisualizations,
    allMessages
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
    } catch (error) {
      console.error('Error in chat interaction:', error);
      updateMessages(prev => [
        ...prev,
        { sender: 'user', text: userMessage },
        MessageService.createErrorResponse(i18n.language)
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, setInput, setIsTyping, updateMessages, i18n.language]);

  const handleVisualizationSelect = useCallback(async ({ type, message, usedType }) => {
    try {
      // Add the used type to the list of used visualizations
      setUsedVisualizations(prev => [...prev, usedType]);

      // Get visualization data
      const { data } = await fetchEurostatData(message.fuelType, 'visualization', type);

      // Create a new visualization message
      const visualizationMessage = MessageService.createVisualizationMessage(
        message,
        type,
        data, 
        message.language
      );

      // Add the new visualization message to chat
      updateMessages(prev => [...prev, visualizationMessage]);

    } catch (error) {
      console.error('Error handling visualization:', error);
      updateMessages(prev => [...prev, MessageService.createErrorResponse(i18n.language)]);
    }
  }, [setUsedVisualizations, updateMessages, i18n.language]);

  const handleClearChat = useCallback(() => {
    const welcomeMessage = MessageService.createWelcomeMessage(i18n.language);
    updateMessages([welcomeMessage]);
    setUsedVisualizations([]); 
  }, [updateMessages, setUsedVisualizations, i18n.language]);

  const handleSuggestionClick = useCallback(async (suggestion) => {
    setInput(suggestion);
    handleSendMessage({ preventDefault: () => {} });
  }, [setInput, handleSendMessage]);

  return {
    handleSendMessage,
    handleVisualizationSelect,
    handleClearChat,
    handleSuggestionClick
  };
};