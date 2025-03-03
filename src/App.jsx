import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ChatBot from './components/ChatBot';
import './App.css';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Add animation class after initial render
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-container');
      if (chatContainer) {
        chatContainer.classList.add('chat-loaded');
      }
    }, 100);

    // Set HTML lang attribute
    document.documentElement.lang = i18n.language;

    // Update HTML lang attribute when language changes
    const handleLanguageChange = (lang) => {
      document.documentElement.lang = lang;
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <div className="App">
      <div className="chat-container">
        <ChatBot />
      </div>
    </div>
  );
}

export default App;
