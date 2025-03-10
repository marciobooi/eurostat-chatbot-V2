import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useChatContext } from '../contexts/ChatContext';
import { MessageService } from '../services/MessageService';
import { fetchEurostatData } from '../utils/eurostatApi';
import { clearChatFromCookie } from '../utils/storageHandlers';
import toast from 'react-hot-toast';

const TYPING_DELAY = 1000;

export const useChatInteractions = () => {
  const { t, i18n } = useTranslation();
  const {
    input,
    isTyping,
    setInput,
    setIsTyping,
    updateMessages,
    resetToRecentMessages,
    setUsedVisualizations,
    allMessages
  } = useChatContext();

  const handleSendMessage = useCallback(async (e) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    // Reset visualizations
    setUsedVisualizations([]);
    
    const userMessage = MessageService.createUserMessage(input, i18n.language);
    
    // Add user message and possibly welcome message
    updateMessages(prev => {
      if (prev.length === 0) {
        return [MessageService.createWelcomeMessage(i18n.language), userMessage];
      }
      return [...prev, userMessage];
    });

    try {
      setIsTyping(true);
      
      // Process user input with delay to simulate typing
      setTimeout(async () => {
        const botResponse = await MessageService.processUserInput(input, i18n.language);
        updateMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, TYPING_DELAY);
    } catch (error) {
      console.error("Error processing message:", error);
      setTimeout(() => {
        const errorResponse = MessageService.createErrorResponse(
          t('errors.processing'),
          i18n.language
        );
        updateMessages(prev => [...prev, errorResponse]);
        setIsTyping(false);
      }, TYPING_DELAY);
    }
    
    setInput('');
    resetToRecentMessages();
  }, [input, isTyping, i18n.language, setInput, setIsTyping, updateMessages, resetToRecentMessages, setUsedVisualizations, t]);

  const handleVisualizationSelect = useCallback(async ({ type, message, usedType }) => {
    if (!message.hasVisualization || !message.fuelType) {
      console.warn('No visualization data available or missing fuel type');
      return;
    }
    
    try {
      const data = await fetchEurostatData(message.fuelType, 'visualization', type);
      
      // Create visualization message
      const visualizationMessage = MessageService.createVisualizationMessage(
        message,
        type,
        data,
        t,
        i18n.language
      );

      // Track used visualization
      setUsedVisualizations(prev => [...prev, usedType]);
      
      // Add visualization message
      updateMessages(prev => [...prev, visualizationMessage]);
      resetToRecentMessages();
    } catch (error) {
      console.error('Error fetching visualization data:', error);
      const errorResponse = MessageService.createErrorResponse(
        t('errors.visualization'),
        i18n.language
      );
      updateMessages(prev => [...prev, errorResponse]);
    }
  }, [i18n.language, updateMessages, setUsedVisualizations, resetToRecentMessages, t]);

  const handleClearChat = useCallback(() => {
    updateMessages([MessageService.createWelcomeMessage(i18n.language)]);
    clearChatFromCookie();
    resetToRecentMessages();
    
    toast.success(t('toast.clearChat'), {
      duration: 2000,
      position: 'top-right',
      style: {
        background: '#ebfbee',
        color: '#059669',
        border: '1px solid #34d399'
      },
    });
  }, [i18n.language, updateMessages, resetToRecentMessages, t]);

  const handleSuggestionClick = useCallback(async (topic) => {
    if (isTyping) return;
    
    // Reset visualizations
    setUsedVisualizations([]);
    
    const userMessage = MessageService.createUserMessage(topic, i18n.language);
    updateMessages(prev => [...prev, userMessage]);
    
    try {
      setIsTyping(true);
      
      setTimeout(async () => {
        const botResponse = await MessageService.processUserInput(topic, i18n.language);
        updateMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, TYPING_DELAY);
    } catch (error) {
      console.error("Error processing suggestion:", error);
      setTimeout(() => {
        const errorResponse = MessageService.createErrorResponse(
          t('errors.suggestion'),
          i18n.language
        );
        updateMessages(prev => [...prev, errorResponse]);
        setIsTyping(false);
      }, TYPING_DELAY);
    }
    
    resetToRecentMessages();
  }, [isTyping, i18n.language, updateMessages, setIsTyping, setUsedVisualizations, resetToRecentMessages, t]);

  return {
    handleSendMessage,
    handleVisualizationSelect,
    handleClearChat,
    handleSuggestionClick
  };
};