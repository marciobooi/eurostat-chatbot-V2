import { useState, useEffect, useRef, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot,
  faUser,
  faTrash,
  faPaperPlane,
  faMicrophone, // Add microphone icon import
  faMicrophoneSlash, // Add microphone-slash icon import
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import SmartSuggestions from "./SmartSuggestions";
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
import { findIntent } from "../utils/nlpHelper";

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
  const [speechRecognition, setSpeechRecognition] = useState(null); // Store speech recognition instance
  const [speechSupported, setSpeechSupported] = useState(false); // Check if speech recognition is supported

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

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();

      // Configure speech recognition
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      // Set language based on current i18n language
      recognition.lang =
        i18n.language === "fr"
          ? "fr-FR"
          : i18n.language === "de"
          ? "de-DE"
          : "en-US";

      // Handle results
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);

        // Optional: auto-submit after a short delay
        setTimeout(() => {
          const form = inputRef.current?.form;
          if (form) {
            form.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true })
            );
          }
        }, 500);
      };

      // Handle end of speech recognition
      recognition.onend = () => {
        setIsListening(false);
      };

      // Handle errors
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      setSpeechRecognition(recognition);
    } else {
      console.log("Speech recognition not supported in this browser");
    }
  }, [i18n.language]);

  // Update recognition language when app language changes
  useEffect(() => {
    if (speechRecognition) {
      speechRecognition.lang =
        i18n.language === "fr"
          ? "fr-FR"
          : i18n.language === "de"
          ? "de-DE"
          : "en-US";
    }
  }, [i18n.language, speechRecognition]);

  // Track speech recognition usage
  const toggleSpeechRecognition = () => {
    if (!speechSupported || !speechRecognition) return;

    if (isListening) {
      speechRecognition.stop();
      setIsListening(false);
    } else {
      try {
        speechRecognition.start();
        setIsListening(true);
        analyticsManager.trackSpeechRecognition(true); // Track successful start
      } catch (error) {
        console.error("Speech recognition error:", error);
        analyticsManager.trackSpeechRecognition(false); // Track failed start
        // Try to reset and restart if there's an error
        speechRecognition.stop();
        setTimeout(() => {
          try {
            speechRecognition.start();
            setIsListening(true);
          } catch (innerError) {
            console.error("Failed to restart speech recognition:", innerError);
            setIsListening(false);
          }
        }, 100);
      }
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isTyping || isThinking) return;

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

      // Create and add bot response
      const botMessage = {
        text: botMessageText,
        sender: "bot",
        topic: responseTopic,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
      if (sessionManagerRef.current) {
        sessionManagerRef.current.addMessage(botMessage);
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

  return (
    <div className="chat-bot-container">
      <div ref={messagesContainerRef} className="messages" aria-live="polite">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-wrapper ${
              msg.sender === "bot" ? "bot-wrapper" : "user-wrapper"
            }`}
          >
            <div
              className={`message-icon ${
                msg.sender === "bot" ? "bot-icon" : "user-icon"
              }`}
            >
              <FontAwesomeIcon icon={msg.sender === "bot" ? faRobot : faUser} />
            </div>
            <div
              className={msg.sender === "bot" ? "bot-message" : "user-message"}
            >
              {msg.text}

              {/* Welcome back suggestions inside the message */}
              {msg.isWelcomeBack && msg.topic && (
                <div className="suggestions-container">
                  <button
                    className="suggestion-chip"
                    onClick={() => handleSuggestionClick(msg.topic)}
                  >
                    {t("continue_topic", {
                      topic: msg.topic,
                      defaultValue: `Continue with ${msg.topic}`,
                    })}
                  </button>
                  <button
                    className="suggestion-chip"
                    onClick={() =>
                      handleSuggestionClick(t("new_topic", "a new topic"))
                    }
                  >
                    {t("start_new", "Start a new topic")}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Thinking indicator */}
        {isThinking && (
          <div className="message-wrapper bot-wrapper">
            <div className="message-icon bot-icon">
              <FontAwesomeIcon icon={faRobot} />
            </div>
            <div className="bot-message">{t("thinking", "Thinking...")}</div>
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && !isThinking && (
          <div className="message-wrapper bot-wrapper">
            <div className="message-icon bot-icon">
              <FontAwesomeIcon icon={faRobot} />
            </div>
            <div className="typing-indicator">
              <span className="typing-bubble"></span>
              <span className="typing-bubble"></span>
              <span className="typing-bubble"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Use the imported ScrollButton component */}
      <ScrollButton visible={showScrollButton} onClick={scrollToBottom} />

      <SmartSuggestions
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
      />

      <form onSubmit={handleSend} className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t(
            "ask_question",
            "Ask something about energy statistics..."
          )}
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

      <div className="control-panel">
        <button
          onClick={handleClearChat}
          className="clear-button"
          aria-label={t("clear_chat", "Clear chat")}
          title={t("clear_chat", "Clear chat")}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>

        {/* Add speech recognition button */}
        {speechSupported && (
          <button
            onClick={toggleSpeechRecognition}
            className={`speech-button ${isListening ? "listening" : ""}`}
            aria-label={
              isListening
                ? t("stop_listening", "Stop listening")
                : t("start_listening", "Start voice input")
            }
            title={
              isListening
                ? t("stop_listening", "Stop listening")
                : t("start_listening", "Start voice input")
            }
            disabled={isThinking || isTyping}
          >
            <FontAwesomeIcon
              icon={isListening ? faMicrophone : faMicrophoneSlash}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatBot;
