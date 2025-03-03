import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ChatBot from "./components/ChatBot";
import { getCurrentLanguage } from "./i18n";
import { LanguageValidator } from "./utils/languageUtils";
import "./App.css";

function App() {
  const { t, i18n } = useTranslation();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const initializeLanguage = async () => {
      // Language is automatically loaded from cookies via i18n configuration
      const currentLang = getCurrentLanguage();
      const validLang = LanguageValidator.validate(currentLang);

      // Just validate the language but don't change it explicitly
      // as i18n already handles this from cookies
      setLoaded(true);
    };

    initializeLanguage();
  }, []);

  return (
    <div className="app-container">
      <main className="app-main">
        <div className={`chat-container ${loaded ? "chat-loaded" : ""}`}>
          <ChatBot />
        </div>
      </main>
    </div>
  );
}

export default App;
