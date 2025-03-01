import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faTrash, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { getEnergyInfo } from '../utils/getEnergyInfo';
import { energyDictionary, getRelatedTopics } from '../data/energyDictionary';
import { getCookie } from '../utils/cookies';
import i18n from '../i18n';
import './ChatBot.css';
import { saveChatHistory, loadChatHistory, clearChatHistory } from '../utils/chatHistory';
import { calculateThinkingTime, calculateTypingTime } from '../utils/aiBehavior';
import { getRandomWelcomeMessage, getRandomUnknownResponse } from '../utils/randomResponses';
import { ContextManager } from '../utils/contextManager';
import { AnalyticsManager } from '../utils/analyticsManager';
import SmartSuggestions from './SmartSuggestions';
import { isAffirmative } from '../data/affirmativeResponses';
import { getFollowUpQuestion, getFollowUpSuggestion } from '../data/followUpQuestions';
import ScrollButton from './ScrollButton';
import ShowMoreHistory from './ShowMoreHistory';
import { useTranslation } from 'react-i18next';

const ChatBot = () => {
  const { t } = useTranslation();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const contextManager = useMemo(() => new ContextManager(), []);
  const analyticsManager = useMemo(() => new AnalyticsManager(), []);
  const [suggestions, setSuggestions] = useState([]);
  const [followUpTopic, setFollowUpTopic] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState(15);
  const messagesContainerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const scrolledUp = scrollHeight - scrollTop - clientHeight > 50; // Reduced threshold
    setShowScrollButton(scrolledUp);
  };

  const updateContainerHeight = () => {
    if (messagesContainerRef.current) {
      setContainerHeight(messagesContainerRef.current.scrollHeight);
    }
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(updateContainerHeight);
    if (messagesContainerRef.current) {
      resizeObserver.observe(messagesContainerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    updateContainerHeight();
  }, [messages, visibleMessages]);

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', handleScroll);
      return () => messagesContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const loadMoreMessages = () => {
    setVisibleMessages(prev => prev + 15);
  };

  const displayedMessages = messages.slice(-visibleMessages);
  const hasMoreMessages = messages.length > visibleMessages;

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isThinking]);

  // Load chat history on component mount
  useEffect(() => {
    const lang = getCookie('i18next') || 'en';
    if (lang !== language) {
      setLanguage(lang);
      i18n.changeLanguage(lang);
    }

    const historicMessages = loadChatHistory();
    if (historicMessages.length > 0) {
      setMessages(historicMessages);
      // Find last meaningful bot message
      const lastBotMessage = historicMessages
        .filter(msg => msg.sender === 'bot' && msg.category && msg.category !== 'unknown' && msg.category !== 'followup')
        .pop();
      
      if (lastBotMessage?.category) {
        // Extract the base topic (remove 'definition' or other suffixes)
        const baseTopic = lastBotMessage.category.split(' ')[0];
        const followUpQuestion = getFollowUpQuestion(baseTopic, language);
        const relatedTopics = getRelatedTopics(baseTopic, language);
        
        if (followUpQuestion && relatedTopics.length > 0) {
          setFollowUpTopic(baseTopic);
          const welcomeBack = {
            text: followUpQuestion,
            sender: 'bot',
            category: 'followup'
          };
          setMessages([...historicMessages, welcomeBack]);
          setSuggestions(relatedTopics);
        }
      }
    } else {
      // Show welcome message only if no history exists
      const welcomeMessage = {
        text: getRandomWelcomeMessage(lang),
        sender: 'bot'
      };
      setMessages([welcomeMessage]);
    }
  }, [language]);

  // Save messages to cookie whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Check for affirmative response to follow-up
    if (followUpTopic && isAffirmative(input, language)) {
      const relatedTopics = getRelatedTopics(followUpTopic, language);
      if (relatedTopics?.length > 0) {
        setSuggestions(relatedTopics);
        setFollowUpTopic(null);
        
        const botResponse = {
          text: t('suggestions_title'),
          sender: 'bot',
          category: 'suggestions',
          suggestions: relatedTopics // Add suggestions to message object
        };
        setMessages(prev => [...prev, botResponse]);
        return;
      }
    }

    // Handle normal message flow
    const startTime = Date.now();
    setIsThinking(true);
    await new Promise(resolve => setTimeout(resolve, calculateThinkingTime(input)));
    setIsThinking(false);
    
    setIsTyping(true);
    const response = getEnergyInfo(input, language);
    
    // Track analytics and process response
    analyticsManager.trackQuestion(input, response.isKnown, language, Date.now() - startTime);
    const botMessageText = response.isKnown 
      ? energyDictionary[language][response.key]?.definition 
      : getRandomUnknownResponse(language);
    
    if (response.isKnown) {
      analyticsManager.trackTopic(response.key);
      contextManager.addToContext(input, response.key);
      // Get related topics for the current topic
      const relatedTopics = getRelatedTopics(response.key, language);
      setSuggestions(relatedTopics || []);
    } else {
      setSuggestions([]);
    }
    
    setTimeout(() => {
      const botMessage = { 
        text: botMessageText, 
        sender: 'bot',
        category: response.key 
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, calculateTypingTime(botMessageText));
  };

  const handleSuggestionClick = async (topic) => {
    // Direct trigger of response
    setIsThinking(true);
    const response = getEnergyInfo(`tell me about ${topic}`, language);
    await new Promise(resolve => setTimeout(resolve, calculateThinkingTime(topic)));
    setIsThinking(false);
    
    setIsTyping(true);
    const botMessageText = response.isKnown 
      ? energyDictionary[language][response.key]?.definition 
      : getRandomUnknownResponse(language);
    
    setTimeout(() => {
      const botMessage = { 
        text: botMessageText, 
        sender: 'bot',
        category: response.key 
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsTyping(false);

      // Check for more follow-up suggestions
      if (response.isKnown) {
        const newSuggestion = getFollowUpSuggestion(response.key, language);
        if (newSuggestion) {
          setSuggestions(newSuggestion.topics);
        }
      }
    }, calculateTypingTime(botMessageText));
  };

  const handleClearChat = () => {
    clearChatHistory();
    contextManager.clearContext();
    setMessages([]);
    setSuggestions([]);
    setTimeout(() => {
      const welcomeMessage = {
        text: getRandomWelcomeMessage(language),
        sender: 'bot'
      };
      setMessages([welcomeMessage]);
    }, 100);
  };

  return (
    <div className="chat-container flex flex-col max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg relative">
      <div 
        ref={messagesContainerRef}
        className="messages relative flex-grow overflow-y-auto mb-4 p-4 bg-gray-100 rounded-lg space-y-4"
      >
        {hasMoreMessages && (
          <ShowMoreHistory 
            visible={true} 
            onClick={loadMoreMessages}
            remainingCount={messages.length - visibleMessages}
          />
        )}
        {displayedMessages.map((msg, index) => (
          <ChatMessage 
            key={index} 
            message={msg} 
            onSuggestionClick={handleSuggestionClick}
          />
        ))}
        {isThinking && (
          <div className="bot-message bg-gray-100 text-gray-700 rounded-lg p-4 shadow-lg">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faRobot} className="mr-2" />
              <span>{i18n.t('thinking')}</span>
            </div>
          </div>
        )}
        {isTyping && !isThinking && (
          <div className="bot-message bg-gray-100 text-gray-700 rounded-lg p-4 shadow-lg">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faRobot} className="mr-2" />
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <ScrollButton 
        visible={showScrollButton}
        onClick={scrollToBottom}
        label={t('scroll_to_bottom')}
      />
      <SmartSuggestions 
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
        title={t('suggestions_title')}
        ariaLabel={t('aria_suggestions')}
      />
      <div 
        className="input-container flex items-center p-2 border-t border-gray-300 space-x-2"
        role="form"
        aria-label={t('send_message')}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t('input_placeholder')}
          className="w-full p-2 border border-gray-300 rounded-md shadow-inner text-lg"
          aria-label={t('input_placeholder')}
        />
        <button
          onClick={handleSend}
          className="action-button send-button"
          aria-label={t('send_message')}
        >
          <FontAwesomeIcon icon={faPaperPlane} aria-hidden="true" />
        </button>
      </div>
      <div className='flex justify-center p-2'>
        <button
          onClick={handleClearChat}
          className="action-button clear-button"
          aria-label={t('clear_chat')}
          title={t('clear_chat')}
        >
          <FontAwesomeIcon icon={faTrash} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
