import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Toaster } from 'react-hot-toast';
import ChatBot from "./components/ChatBot";
import { getCurrentLanguage, isValidLanguage } from "./i18n";
import { ChatProvider } from "./contexts/ChatContext";
import { runTests } from "./utils/test";
import "./App.css";

function App() {
  const { t, i18n } = useTranslation();
  const [loaded, setLoaded] = useState(false);
  const testsRunRef = useRef(false);

  useEffect(() => {
    const initializeLanguage = async () => {
      const currentLang = getCurrentLanguage();
      if (!isValidLanguage(currentLang)) {
        console.warn(`Invalid language detected: ${currentLang}, falling back to default`);
      }
      setLoaded(true);

      // Run automated tests after app is loaded (only once)
      if (import.meta.env.DEV && !testsRunRef.current) {
        testsRunRef.current = true;
        await runTests();
      }
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
