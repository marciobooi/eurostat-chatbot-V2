import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ChatBot from './components/ChatBot';
import { getCurrentLanguage, changeLanguage } from './i18n';
import { LanguageValidator } from './utils/languageUtils';
import './App.css';

function App() {
  const { t, i18n } = useTranslation();
  const [loaded, setLoaded] = useState(false);
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());

  useEffect(() => {
    const initializeLanguage = async () => {
      const validLang = LanguageValidator.validate(currentLang);
      if (validLang !== currentLang) {
        await changeLanguage(validLang);
        setCurrentLang(validLang);
      }
      setLoaded(true);
    };

    initializeLanguage();
  }, []);

  const handleLanguageChange = async (lang) => {
    const validLang = LanguageValidator.validate(lang);
    await changeLanguage(validLang);
    setCurrentLang(validLang);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>{t('app_title')}</h1>
        <div className="language-selector">
          {LanguageValidator.getSupportedLanguages().map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`lang-button ${currentLang === lang ? 'active' : ''}`}
              aria-label={t('switch_to_language', { language: t(lang) })}
              aria-pressed={currentLang === lang}
            >
              {t(lang)}
            </button>
          ))}
        </div>
      </header>
      <main className="app-main">
        <div className={`chat-container ${loaded ? 'chat-loaded' : ''}`}>
          <ChatBot />
        </div>
      </main>
      <footer className="app-footer">
        <p>{t('powered_by')}</p>
      </footer>
    </div>
  );
}

export default App;
