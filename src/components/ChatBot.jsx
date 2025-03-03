import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faTrash, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { getEnergyInfo } from '../utils/getEnergyInfo';
import { energyDictionary, getRelatedTopics } from '../data/energyDictionary';
import { getCookie } from '../utils/cookies';
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
  const { t, i18n } = useTranslation();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [followUpTopic, setFollowUpTopic] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState(15);
  const messagesContainerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);

  const contextManager = useMemo(() => new ContextManager(), []);
  const analyticsManager = useMemo(() => new AnalyticsManager(), []);

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
    const currentLang = i18n.language || 'en';
    const historicMessages = loadChatHistory();
    
    if (historicMessages.length === 0) {
      // Only show welcome message if no history exists
      const welcomeMessage = {
        text: getRandomWelcomeMessage(currentLang),
        sender: 'bot',
        language: currentLang
      };
      setMessages([welcomeMessage]);
    } else {
      setMessages(historicMessages);
      // Process last meaningful bot message for context
      const lastBotMessage = historicMessages
        .filter(msg => msg.sender === 'bot' && msg.category && msg.category !== 'unknown' && msg.category !== 'followup')
        .pop();
      
      if (lastBotMessage?.category) {
        const baseTopic = lastBotMessage.category.split(' ')[0];
        const followUpQuestion = getFollowUpQuestion(baseTopic, currentLang);
        if (followUpQuestion) {
          setFollowUpTopic(followUpQuestion.topic);
          setSuggestions(followUpQuestion.topics || []);
        }
      }
    }
  }, []);

  // Handle language changes
  useEffect(() => {
    const handleLanguageChange = (lang) => {
      // Update message history with new language
      setMessages(prev => prev.map(msg => ({
        ...msg,
        language: lang,
        text: msg.category && msg.sender === 'bot' && energyDictionary[lang]?.[msg.category]?.definition
          ? energyDictionary[lang][msg.category].definition
          : msg.text
      })));

      // Update suggestions in new language if any exist
      if (followUpTopic) {
        const newFollowUp = getFollowUpQuestion(followUpTopic, lang);
        if (newFollowUp) {
          setSuggestions(newFollowUp.topics || []);
        }
      }
    };

    // Listen for language changes
    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [followUpTopic, i18n]);

  // Save messages to cookie whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentLang = i18n.language;
    const userMessage = { 
      text: input, 
      sender: 'user',
      language: currentLang 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Check for affirmative response to follow-up
    if (followUpTopic && isAffirmative(input, currentLang)) {
      const relatedTopics = getRelatedTopics(followUpTopic, currentLang);
      if (relatedTopics?.length > 0) {
        setSuggestions(relatedTopics);
        setFollowUpTopic(null);
        
        const botResponse = {
          text: t('suggestions_title'),
          sender: 'bot',
          category: 'suggestions',
          suggestions: relatedTopics,
          language: currentLang
        };
        setMessages(prev => [...prev, botResponse]);
        return;
      }
    }

    const startTime = Date.now();
    setIsThinking(true);
    
    await new Promise(resolve => setTimeout(resolve, calculateThinkingTime(input, contextManager)));
    setIsThinking(false);
    
    setIsTyping(true);
    const response = getEnergyInfo(input, currentLang);
    
    analyticsManager.trackQuestion(input, response.isKnown, currentLang, Date.now() - startTime);
    
    let botMessageText = response.isKnown 
      ? energyDictionary[currentLang][response.key]?.definition 
      : getRandomUnknownResponse(currentLang);
    
    if (response.isKnown) {
      analyticsManager.trackTopic(response.key);
      contextManager.addToContext(input, response.key, currentLang);
      
      botMessageText = getContextAwareResponse(input, contextManager, botMessageText);
      
      const relatedTopics = getRelatedTopics(response.key, currentLang);
      setSuggestions(relatedTopics || []);
    } else {
      contextManager.addToContext(input, 'unknown', currentLang);
      setSuggestions([]);
    }

    setTimeout(() => {
      const botMessage = { 
        text: botMessageText, 
        sender: 'bot',
        category: response.key,
        contextInfo: contextManager.getContextualSuggestions(),
        language: currentLang
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      if (response.isKnown) {
        const contextSuggestions = contextManager.getContextualSuggestions();
        if (contextSuggestions.shouldFollowUp) {
          const newSuggestion = getFollowUpSuggestion(response.key, currentLang);
          if (newSuggestion) {
            setSuggestions(newSuggestion.topics);
          }
        }
      }
    }, calculateTypingTime(botMessageText, contextManager));
  };

  const handleSuggestionClick = async (topic) => {
    setIsThinking(true);
    const response = getEnergyInfo(`tell me about ${topic}`, i18n.language);
    await new Promise(resolve => setTimeout(resolve, calculateThinkingTime(topic, contextManager)));
    setIsThinking(false);
    
    setIsTyping(true);
    let botMessageText = response.isKnown 
      ? energyDictionary[i18n.language][response.key]?.definition 
      : getRandomUnknownResponse(i18n.language);
    
    if (response.isKnown) {
      botMessageText = getContextAwareResponse(`tell me about ${topic}`, contextManager, botMessageText);
    }
    
    setTimeout(() => {
      const botMessage = { 
        text: botMessageText, 
        sender: 'bot',
        category: response.key,
        contextInfo: contextManager.getContextualSuggestions(),
        language: i18n.language
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsTyping(false);

      if (response.isKnown) {
        const contextSuggestions = contextManager.getContextualSuggestions();
        if (contextSuggestions.shouldFollowUp) {
          const newSuggestion = getFollowUpSuggestion(response.key, i18n.language);
          if (newSuggestion) {
            setSuggestions(newSuggestion.topics);
          }
        }
      }
    }, calculateTypingTime(botMessageText, contextManager));
  };

  const handleClearChat = () => {
    clearChatHistory();
    contextManager.clearContext();
    setMessages([]);
    setSuggestions([]);
    setTimeout(() => {
      const welcomeMessage = {
        text: getRandomWelcomeMessage(i18n.language),
        sender: 'bot'
      };
      setMessages([welcomeMessage]);
    }, 100);
  };

  return (
    <div className="chat-bot-container">
      <div 
        ref={messagesContainerRef}
        className="messages"
        aria-live="polite"
        aria-label={t('aria_message_list')}
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
          <div className="message-wrapper bot-wrapper">
            <div className="message-icon bot-icon">
              <FontAwesomeIcon icon={faRobot} className="icon" />
            </div>
            <div className="bot-message">
              <div className="flex items-center">
                <span>{t('thinking')}</span>
              </div>
            </div>
          </div>
        )}
        {isTyping && !isThinking && (
          <div className="message-wrapper bot-wrapper">
            <div className="message-icon bot-icon">
              <FontAwesomeIcon icon={faRobot} className="icon" />
            </div>
            <div className="bot-message">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {showScrollButton && (
        <ScrollButton 
          visible={true}
          onClick={scrollToBottom}
        />
      )}
      
      <SmartSuggestions 
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
      />
      
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend(e)}
          placeholder={t('input_placeholder')}
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
      
      <div className="control-panel">
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
