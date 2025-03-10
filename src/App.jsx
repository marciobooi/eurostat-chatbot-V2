import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Toaster } from 'react-hot-toast';
import ChatBot from "./components/ChatBot";
import { getCurrentLanguage, isValidLanguage } from "./i18n";
import { ChatProvider } from "./contexts/ChatContext";
import "./App.css";

function App() {
  const { t, i18n } = useTranslation();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const initializeLanguage = async () => {
      const currentLang = getCurrentLanguage();
      if (!isValidLanguage(currentLang)) {
        console.warn(`Invalid language detected: ${currentLang}, falling back to default`);
      }
      setLoaded(true);
    };
    initializeLanguage();
  }, []);

  return (
    <ChatProvider>
      <div className="app-container">
        <Toaster />
        <main className="app-main">
          <div className={`chat-container ${loaded ? "chat-loaded" : ""}`}>
            <ChatBot />
          </div>
        </main>
      </div>
    </ChatProvider>
  );
}

export default App;
