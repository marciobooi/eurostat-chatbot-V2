import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./locales/en.json";
import frTranslation from "./locales/fr.json";
import deTranslation from "./locales/de.json";

// Constants
export const CONFIG = {
  COOKIE_NAME: "preferred_language",
  DEFAULT_LANGUAGE: "en",
  SUPPORTED_LANGUAGES: ["en", "fr", "de"],
  COOKIE_EXPIRATION: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
};

// Language resources configuration
const resources = {
  [CONFIG.SUPPORTED_LANGUAGES[0]]: { translation: enTranslation },
  [CONFIG.SUPPORTED_LANGUAGES[1]]: { translation: frTranslation },
  [CONFIG.SUPPORTED_LANGUAGES[2]]: { translation: deTranslation },
};

// Helper functions
export const getCurrentLanguage = () => i18n.language || CONFIG.DEFAULT_LANGUAGE;
export const isValidLanguage = (lang) => CONFIG.SUPPORTED_LANGUAGES.includes(lang);

// i18n initialization
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: CONFIG.DEFAULT_LANGUAGE,
    supportedLngs: CONFIG.SUPPORTED_LANGUAGES,
    detection: {
      order: ["cookie", "navigator"],
      lookupCookie: CONFIG.COOKIE_NAME,
      caches: ["cookie"],
      cookieExpirationDate: new Date(Date.now() + CONFIG.COOKIE_EXPIRATION),
      cookieDomain: window.location.hostname,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
