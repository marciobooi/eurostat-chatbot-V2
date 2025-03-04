import { useState, useEffect, useRef, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot,
  faUser,
  faTrash,
  faPaperPlane,
  faMicrophone, // Add microphone icon import
  faMicrophoneSlash, // Add microphone-slash icon import
  faChartPie,
  faChartLine,
  faChartBar,
  faChartArea,
  faBug, // Add debug icon
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import SmartSuggestions from "./SmartSuggestions";
import MobileSuggestions from "./MobileSuggestions"; // Import mobile suggestions component
import ScrollButton from "./ScrollButton"; // Import the ScrollButton component
import { getEnergyInfo } from "../utils/getEnergyInfo";
import { getRelatedTopics } from "../data/energyDictionary";
import {
  calculateThinkingTime,
  calculateTypingTime,
} from "../utils/aiBehavior";
import {
  getRandomWelcomeMessage,
  getRandomUnknownResponse,
  getContextAwareResponse,
  getRandomFarewellMessage,
  getRandomGratitudeResponse,
  getRandomErrorMessage,
  getRandomPromptMessage,
  formatResponse,
  getFollowUpSuggestionsForTopic,
} from "../utils/responseUtils";
import { ContextManager } from "../utils/contextManager";
import { AnalyticsManager } from "../utils/analyticsManager";
import { SessionManager } from "../utils/sessionManager";
import "./ChatBot.css";
import "./ChatBotMobile.css"; // Import mobile-specific styles
import { findIntent } from "../utils/nlpHelper";
import speechRecognitionHandler from "../utils/speechRecognitionHandler";
import Visualization from './Visualization';
import { visualizationConfig } from '../data/visualizationConfig';
import { energyDictionary } from "../data/energyDictionary";
import { isAffirmative } from '../data/affirmativeResponses';
// Import the NLP test utilities
import { showRecognizedEntities } from "../utils/testNLP";

const ChatBot = () => {
  // Remove the inline ScrollButton component definition since we now import it

  const { t, i18n } = useTranslation();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesContainerRef = useRef(null);
  const sessionManagerRef = useRef(null);
  const inputRef = useRef(null);
  const [isListening, setIsListening] = useState(false); // Add state for speech recognition
  const [speechSupported, setSpeechSupported] = useState(false); // Check if speech recognition is supported
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767); // Add mobile detection state
  const [currentFuel, setCurrentFuel] = useState(null);
  const [shownVisualizations, setShownVisualizations] = useState([]);
  const [suggestedTopic, setSuggestedTopic] = useState(null);
  // Add NLP debug mode state
  const [debugNLPMode, setDebugNLPMode] = useState(false);

  const contextManager = useMemo(() => new ContextManager(), []);
  const analyticsManager = useMemo(() => new AnalyticsManager(), []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    const scrolledUp = scrollHeight - scrollTop - clientHeight > 50;
    setShowScrollButton(scrolledUp);
  };

  // Initialize the session manager and analytics
  useEffect(() => {
    if (!sessionManagerRef.current) {
      sessionManagerRef.current = new SessionManager(i18n.language);
      const sessionManager = sessionManagerRef.current.init();

      // Initialize analytics for the session
      analyticsManager.trackSessionStart(i18n.language);

      // Get messages from session storage
      const storedMessages = sessionManager.getMessages();

      if (storedMessages && storedMessages.length > 0) {
        console.log("Found stored messages:", storedMessages.length);
        setMessages(storedMessages);

        // Check for welcome back message
        const welcomeBackMessage = sessionManager.getWelcomeBackMessage();
        if (welcomeBackMessage) {
          setTimeout(() => {
            setMessages((prev) => [...prev, welcomeBackMessage]);
            analyticsManager.trackBotResponse(welcomeBackMessage);
          }, 1000);
        }
      } else {
        console.log("No stored messages, showing welcome message");
        // Show welcome message for new sessions
        const welcomeMessage = {
          sender: "bot",
          text: getRandomWelcomeMessage(i18n.language),
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
        sessionManager.addMessage(welcomeMessage);
        analyticsManager.trackBotResponse(welcomeMessage);
      }
    }

    // Focus input when component loads
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);

    // Cleanup analytics when component unmounts
    return () => {
      analyticsManager.trackSessionEnd();
    };
  }, [i18n.language, analyticsManager]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isThinking]);

  // Add scroll event listener
  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener("scroll", handleScroll);
      return () =>
        messagesContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Handle language changes
  useEffect(() => {
    const handleLanguageChange = (lang) => {
      if (sessionManagerRef.current) {
        sessionManagerRef.current.language = lang;
      }
    };

    i18n.on("languageChanged", handleLanguageChange);
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  // Check for speech recognition support on component mount
  useEffect(() => {
    const isSupported = speechRecognitionHandler.isSupported();
    setSpeechSupported(isSupported);

    // Set up the handler callbacks
    if (isSupported) {
      speechRecognitionHandler.onResult = (transcript) => {
        setInput(transcript);

        // Auto-submit after a short delay
        setTimeout(() => {
          const form = inputRef.current?.form;
          if (form) {
            form.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true })
            );
          }
        }, 500);
      };

      speechRecognitionHandler.onEnd = () => {
        setIsListening(false);
      };

      speechRecognitionHandler.onError = () => {
        setIsListening(false);
      };

      // Initialize with current language
      speechRecognitionHandler.setLanguage(i18n.language);
    }

    // Cleanup function
    return () => {
      if (isSupported) {
        speechRecognitionHandler.stop();
      }
    };
  }, []);

  // Update language when i18n language changes
  useEffect(() => {
    if (speechSupported) {
      speechRecognitionHandler.setLanguage(i18n.language);
    }
  }, [i18n.language, speechSupported]);

  // Handle visibility changes to stop recognition when page is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && isListening) {
        toggleSpeechRecognition();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isListening]);

  // Toggle speech recognition
  const toggleSpeechRecognition = () => {
    if (!speechSupported) return;

    if (!isListening) {
      // Start listening
      const success = speechRecognitionHandler.start();
      if (success) {
        setIsListening(true);
        analyticsManager.trackSpeechRecognition(true);
      } else {
        analyticsManager.trackSpeechRecognition(false);
      }
    } else {
      // Stop listening
      speechRecognitionHandler.stop();
      setIsListening(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim().toLowerCase();
    if (!trimmedInput || isTyping || isThinking) return;

    // Check if this is a response to a topic suggestion first
    if (suggestedTopic && isAffirmative(trimmedInput, i18n.language)) {
      const userMessage = {
        text: trimmedInput,
        sender: "user",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Clear the suggestion and input
      setSuggestedTopic(null);
      setInput("");
      
      // Handle the suggested topic
      handleSuggestionClick(suggestedTopic);
      return;
    }

    const userMessage = {
      text: trimmedInput,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    // Add user message to state and session
    setMessages((prev) => [...prev, userMessage]);
    if (sessionManagerRef.current) {
      sessionManagerRef.current.addMessage(userMessage);
    }

    // Track user message
    analyticsManager.trackUserMessage(trimmedInput);

    setInput("");
    setSuggestions([]);

    // If NLP debug mode is on, show entity recognition results
    if (debugNLPMode) {
      const nlpAnalysis = showRecognizedEntities(trimmedInput, i18n.language);
      const debugMessage = {
        text: nlpAnalysis,
        sender: "bot",
        category: "debug-nlp",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, debugMessage]);
      // Don't store debug messages in the session history
    }

    // Start thinking animation
    setIsThinking(true);
    const thinkingTime = calculateThinkingTime(trimmedInput, contextManager);
    await new Promise((resolve) => setTimeout(resolve, thinkingTime));
    setIsThinking(false);

    // Start typing animation
    setIsTyping(true);

    try {
      // First, detect intent
      const intentResult = findIntent(trimmedInput, i18n.language);
      let botMessageText;
      let responseTopic = null;

      // Handle specific intents
      if (intentResult.intent !== "unknown" && intentResult.confidence > 0.3) {
        // Get appropriate response based on intent from the correct dictionary
        switch (intentResult.intent) {
          case "greeting":
            botMessageText = getRandomWelcomeMessage(i18n.language);
            break;
          case "farewell":
            botMessageText = getRandomFarewellMessage(i18n.language);
            break;
          case "gratitude":
            botMessageText = getRandomGratitudeResponse(i18n.language);
            break;
          case "help":
            botMessageText = getRandomPromptMessage(i18n.language);
            break;
          default:
            // Try to get domain-specific answer for other intents
            try {
              const response = await getEnergyInfo(trimmedInput, i18n.language);

              // Check if we have a valid response with an answer
              if (response && response.answer) {
                responseTopic = response.key || null;
                const baseResponse = getContextAwareResponse(
                  trimmedInput,
                  contextManager,
                  response.answer
                );

                // Use formatResponse to add topic connections and other enhancements
                botMessageText = formatResponse(baseResponse, {
                  topic: responseTopic,
                  addEmpathy: true,
                  addReassurance: true,
                  language: i18n.language,
                });

                // Update context if available
                if (
                  contextManager &&
                  typeof contextManager.updateContext === "function"
                ) {
                  contextManager.updateContext(trimmedInput, response);
                }

                // Get related topics for suggestions
                const relatedTopics = response.key
                  ? getRelatedTopics(response.key, i18n.language)
                  : [];

                if (relatedTopics && relatedTopics.length > 0) {
                  setSuggestions(relatedTopics);
                }

                // Add follow-up suggestions if we have a topic
                if (responseTopic) {
                  const followUpSuggestions = getFollowUpSuggestionsForTopic(
                    responseTopic,
                    i18n.language
                  );

                  // You can either add these to the bot's message or set them as separate suggestions
                  // Here we're adding one random follow-up suggestion to the end of the bot message
                  if (followUpSuggestions.length > 0) {
                    const randomSuggestion =
                      followUpSuggestions[
                        Math.floor(Math.random() * followUpSuggestions.length)
                      ];
                    botMessageText = `${botMessageText}\n\n${randomSuggestion}`;
                  }
                }
              } else {
                // No valid answer in the response
                botMessageText = getRandomUnknownResponse(i18n.language);
              }
            } catch (error) {
              console.error("Error getting energy info:", error);
              botMessageText = getRandomUnknownResponse(i18n.language);
            }
        }
      } else {
        // Try to get domain-specific answer for unclear intent
        try {
          const response = await getEnergyInfo(trimmedInput, i18n.language);

          // Only process if we have a valid response
          if (response && response.answer) {
            responseTopic = response.key || null;
            const baseResponse = getContextAwareResponse(
              trimmedInput,
              contextManager,
              response.answer
            );

            // Use formatResponse to add topic connections and other enhancements
            botMessageText = formatResponse(baseResponse, {
              topic: responseTopic,
              addEmpathy: true,
              addReassurance: true,
              language: i18n.language,
            });

            // Handle visualization suggestions for fuel topics
            if (visualizationConfig[responseTopic]) {
              handleFuelResponse(responseTopic, response);
            }

            // Update context if available
            if (
              contextManager &&
              typeof contextManager.updateContext === "function"
            ) {
              contextManager.updateContext(trimmedInput, response);
            }

            // Get related topics for suggestions
            const relatedTopics = response.key
              ? getRelatedTopics(response.key, i18n.language)
              : [];

            if (relatedTopics && relatedTopics.length > 0) {
              setSuggestions(relatedTopics);
            }

            // Add follow-up suggestions if we have a topic
            if (responseTopic) {
              const followUpSuggestions = getFollowUpSuggestionsForTopic(
                responseTopic,
                i18n.language
              );

              // You can either add these to the bot's message or set them as separate suggestions
              // Here we're adding one random follow-up suggestion to the end of the bot message
              if (followUpSuggestions.length > 0) {
                const randomSuggestion =
                  followUpSuggestions[
                    Math.floor(Math.random() * followUpSuggestions.length)
                  ];
                botMessageText = `${botMessageText}\n\n${randomSuggestion}`;
              }
            }
          } else {
            // Handle unknown response with potential match info
            const matchScore =
              response && typeof response.confidence !== "undefined"
                ? response.confidence
                : 0;

            const matchInfo =
              matchScore > 0.3 && response && response.baseTopic
                ? { score: matchScore, topic: response.baseTopic }
                : null;

            botMessageText = getRandomUnknownResponse(i18n.language, matchInfo);
          }
        } catch (error) {
          console.error("Error getting energy info for unclear intent:", error);
          botMessageText = getRandomUnknownResponse(i18n.language);
        }
      }

      // Calculate typing time
      const typingTime = calculateTypingTime(botMessageText);
      await new Promise((resolve) => setTimeout(resolve, typingTime));

      // Create initial bot response
      const botMessage = {
        text: t('responses.topic_description', {
          text: botMessageText.split('Let me share the key facts about this:')[0],
          topic: responseTopic
        }),
        sender: "bot",
        topic: responseTopic,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
      if (sessionManagerRef.current) {
        sessionManagerRef.current.addMessage(botMessage);
      }

      // If this is a fuel topic that has visualizations, add a new message after a delay
      if (visualizationConfig[responseTopic]) {
        const config = visualizationConfig[responseTopic];
        
        // Wait before showing visualization options
        setTimeout(() => {
          const vizOptionsMessage = {
            text: t('visualization.more_to_discover', { 
              topic: responseTopic,
              count: config.visualizations.length 
            }),
            sender: "bot",
            topic: responseTopic,
            category: 'visualization-options',
            hasVisualizations: true,
            timestamp: new Date().toISOString(),
          };
          
          setMessages(prev => [...prev, vizOptionsMessage]);
          setCurrentFuel(responseTopic); // Set current fuel here instead of in handleFuelResponse
          setShownVisualizations([]); // Reset shown visualizations
        }, 2000); // 2-second delay for natural flow
      }

      // Track successful bot response
      analyticsManager.trackBotResponse(botMessage, true);
    } catch (error) {
      console.error("Error processing message:", error);

      const errorMessage = {
        sender: "bot",
        text: getRandomErrorMessage(i18n.language),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      if (sessionManagerRef.current) {
        sessionManagerRef.current.addMessage(errorMessage);
      }

      // Track failed bot response
      analyticsManager.trackBotResponse(errorMessage, false);
    } finally {
      setIsTyping(false);
    }
  };

  // Modified handleSuggestionClick function to auto-submit
  const handleSuggestionClick = (topic) => {
    // Set the input value
    setInput(`Tell me about ${topic}`);

    // Track suggestion click in analytics
    analyticsManager.trackSuggestionClick(topic);

    // Auto-submit after a short delay to ensure the input is updated
    setTimeout(() => {
      // Instead of just focusing, we'll trigger the form submission
      const form = document.querySelector(".input-container");
      if (form) {
        // Create and dispatch a submit event
        const submitEvent = new Event("submit", {
          cancelable: true,
          bubbles: true,
        });
        form.dispatchEvent(submitEvent);
      }
    }, 100); // Short delay to ensure state updates
  };

  const handleClearChat = () => {
    // Track session end before clearing
    analyticsManager.trackSessionEnd();

    // Clear the chat and reset everything
    if (sessionManagerRef.current) {
      sessionManagerRef.current.clear();
    }

    setMessages([]);
    setSuggestions([]);

    // Add a new welcome message
    setTimeout(() => {
      const welcomeMessage = {
        sender: "bot",
        text: getRandomWelcomeMessage(i18n.language),
        timestamp: new Date().toISOString(),
      };

      setMessages([welcomeMessage]);
      if (sessionManagerRef.current) {
        sessionManagerRef.current.addMessage(welcomeMessage);
      }

      // Start tracking a new session
      analyticsManager.trackSessionStart(i18n.language);
      analyticsManager.trackBotResponse(welcomeMessage);
    }, 100);
  };

  // Add window resize handler to detect mobile/desktop view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once to set initial state

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Reset visualization state when changing topics
  const resetVisualizationState = () => {
    setCurrentFuel(null);
    setShownVisualizations([]);
  };

  // Handle fuel-related response
  const handleFuelResponse = (fuelType, response) => {
    if (visualizationConfig[fuelType]) {
      setCurrentFuel(fuelType);
      setShownVisualizations([]);
    }
  };

  // Handle visualization selection
  const handleVisualizationSelect = (visualization) => {
    setShownVisualizations(prev => [...prev, visualization.type]);
    
    // Add visualization chart message
    const vizMessage = {
      text: '',
      visualization: visualization,
      sender: 'bot',
      category: 'visualization',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, vizMessage]);

    // If there are remaining visualizations, add a new options message
    const config = visualizationConfig[currentFuel];
    const remainingVisualizations = config.visualizations.filter(
      v => !shownVisualizations.includes(v.type) && v.type !== visualization.type
    );

    if (remainingVisualizations.length > 0) {
      // Add new visualization options message
      setTimeout(() => {
        const vizOptionsMessage = {
          text: t('visualization.more_options_available', { 
            topic: currentFuel,
            count: remainingVisualizations.length 
          }),
          sender: "bot",
          topic: currentFuel,
          category: 'visualization-options',
          hasVisualizations: true,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, vizOptionsMessage]);
      }, 1000);
    } else {
      // If no more visualizations, suggest random topic
      const nextTopic = getRandomTopic();
      setSuggestedTopic(nextTopic);
      setTimeout(() => {
        const suggestionMessage = {
          text: t('visualization.suggest_next_topic', { 
            currentTopic: currentFuel,
            nextTopic: nextTopic 
          }),
          sender: 'bot',
          category: 'suggestion',
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, suggestionMessage]);
        analyticsManager.trackBotResponse(suggestionMessage);
      }, 1000);
    }
  };

  const handleUserMessage = async (input) => {
    const trimmedInput = input.toLowerCase();
    
    // Check if this is a response to a topic suggestion
    if (suggestedTopic && isAffirmative(trimmedInput, i18n.language)) {
      const userMessage = {
        text: trimmedInput,
        sender: "user",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Clear the suggestion and input
      setSuggestedTopic(null);
      setInput("");
      
      // Handle the suggested topic
      handleSuggestionClick(suggestedTopic);
      return;
    }

    // Rest of handleUserMessage logic remains the same
    // ...existing code...
  };

  // Get random topic from energy dictionary
  const getRandomTopic = () => {
    const topics = Object.keys(energyDictionary.en).filter(topic =>
      topic !== currentFuel && // Don't suggest current topic
      visualizationConfig[topic] && // Only suggest topics with visualizations
      energyDictionary.en[topic].text // Make sure topic has content
    );
    return topics[Math.floor(Math.random() * topics.length)];
  };

  const renderVisualizationButtons = (fuel) => {
    if (!visualizationConfig[fuel]) return null;
    
    const remainingVisualizations = visualizationConfig[fuel].visualizations.filter(
      v => !shownVisualizations.includes(v.type)
    );

    if (remainingVisualizations.length === 0) return null;

    return (
      <div className="message-visualization-options">
        {remainingVisualizations.map((viz, index) => (
          <button
            key={index}
            className="message-visualization-button"
            onClick={() => handleVisualizationSelect(viz)}
            aria-label={t('visualization.viz_button_label', { type: viz.type })}
          >
            <FontAwesomeIcon icon={getVisualizationIcon(viz.type)} className="viz-icon" />
            <span>{viz.label}</span>
          </button>
        ))}
      </div>
    );
  };

  const getVisualizationIcon = (type) => {
    switch (type) {
      case 'pie':
        return faChartPie;
      case 'line':
        return faChartLine;
      case 'bar':
        return faChartBar;
      case 'area':
        return faChartArea;
      default:
        return faChartPie;
    }
  };

  // Update the renderMessage function to handle visualization messages
  const renderMessage = (msg) => {
    if (msg.category === 'visualization') {
      return (
        <Visualization
          type={msg.visualization.type}
          data={msg.visualization.data}
          description={msg.visualization.description}
        />
      );
    } else if (msg.category === 'debug-nlp') {
      return (
        <div className="message-content debug-message">
          <pre className="nlp-analysis">{msg.text}</pre>
        </div>
      );
    }

    return (
      <div className="message-content">
        {msg.text && <div className="message-text">{msg.text}</div>}
        {msg.hasVisualizations && visualizationConfig[msg.topic] && renderVisualizationButtons(msg.topic)}
      </div>
    );
  };

  // Toggle NLP debug mode
  const toggleNLPDebugMode = () => {
    setDebugNLPMode(prev => !prev);
    
    // Show a message indicating the mode change
    const message = {
      text: debugNLPMode 
        ? "NLP Debug Mode turned OFF" 
        : "NLP Debug Mode turned ON - I'll now show analysis of recognized entities in your messages",
      sender: "bot",
      category: "system",
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, message]);
  };

  return (
    <div className="chat-bot-container">
      <div className="messages" ref={messagesContainerRef} onScroll={handleScroll}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-wrapper ${msg.sender === "bot" ? "bot-wrapper" : "user-wrapper"}`}
          >
            <div className="message-icon">
              <FontAwesomeIcon icon={msg.sender === "bot" ? faRobot : faUser} />
            </div>
            <div className={msg.sender === "bot" ? "bot-message" : "user-message"}>
              {renderMessage(msg)}
            </div>
          </div>
        ))}

        {/* Show typing indicator while bot is responding */}
        {isTyping && !isThinking && (
          <div className="message-wrapper bot-wrapper">
            <div className="message-icon bot-icon">
              <FontAwesomeIcon icon={faRobot} />
            </div>
            <div className="typing-indicator">
              <div className="typing-bubble"></div>
              <div className="typing-bubble"></div>
              <div className="typing-bubble"></div>
            </div>
          </div>
        )}

        {/* Show thinking indicator */}
        {isThinking && (
          <div className="message-wrapper bot-wrapper">
            <div className="message-icon bot-icon">
              <FontAwesomeIcon icon={faRobot} />
            </div>
            <div className="bot-message">{t("thinking", "Thinking...")}</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Show standard suggestions only on desktop */}
      {!isMobile && (
        <SmartSuggestions
          suggestions={suggestions}
          onSuggestionClick={handleSuggestionClick}
        />
      )}

      {/* Add scroll button */}
      <ScrollButton visible={showScrollButton} onClick={scrollToBottom} />

      {/* Input form */}
      <form onSubmit={handleSend} className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("ask_question", "Ask something about energy statistics...")}
          disabled={isTyping || isThinking}
          ref={inputRef}
          className="chat-input"
        />
        

        <button
          type="submit"
          className="send-button"
          disabled={!input.trim() || isTyping || isThinking}
          aria-label={t("send", "Send")}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>

      {/* Control panel */}
      <div className="control-panel">
        <button
          onClick={handleClearChat}
          className="clear-button"
          aria-label={t("clear_chat", "Clear chat")}
          title={t("clear_chat", "Clear chat")}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>

        {/* Add debug mode toggle button */}
        <button
          onClick={toggleNLPDebugMode}
          className={`debug-nlp-button ${debugNLPMode ? "active" : ""}`}
          aria-label={debugNLPMode ? "Turn off NLP debug mode" : "Turn on NLP debug mode"}
          title={debugNLPMode ? "Turn off NLP debug mode" : "Turn on NLP debug mode"}
        >
          <FontAwesomeIcon icon={faBug} />
        </button>

        {/* Add speech recognition button if supported */}
        {speechSupported && (
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`speech-button ${isListening ? "listening" : ""}`}
            aria-label={
              isListening
                ? t("stop_listening", "Stop listening")
                : t("start_listening", "Start voice input")
            }
          >
            <FontAwesomeIcon
              icon={isListening ? faMicrophoneSlash : faMicrophone}
            />
          </button>
        )}

        {/* Add mobile suggestions button when in mobile view */}
        {isMobile && (
          <MobileSuggestions
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        )}
      </div>
    </div>
  );
};

export default ChatBot;
