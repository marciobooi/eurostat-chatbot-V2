import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { getCookie, setCookie } from "./utils/cookies";

import enTranslation from "./locales/en.json";
import frTranslation from "./locales/fr.json";
import deTranslation from "./locales/de.json";

// Resources for default language loading
const resources = {
  en: {
    translation: enTranslation,
  },
  fr: {
    translation: frTranslation,
  },
  de: {
    translation: deTranslation,
  },
};

const COOKIE_NAME = "preferred_language";
const DEFAULT_LANGUAGE = "en";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: ["en", "fr", "de"],

    // Use cookies for language detection with highest priority
    detection: {
      order: ["cookie", "navigator"],
      lookupCookie: COOKIE_NAME,
      caches: ["cookie"],
      cookieExpirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      cookieDomain: window.location.hostname,
    },

    interpolation: {
      escapeValue: false,
    },
  });

/**
 * Get current language from i18n (which checks cookies)
 * @returns {string} Current language code
 */
export const getCurrentLanguage = () => {
  // First check cookies directly
  const cookieLang = getCookie(COOKIE_NAME);
  if (cookieLang) return cookieLang;

  // Fallback to i18n's current language
  return i18n.language || DEFAULT_LANGUAGE;
};

/**
 * Change language and update cookie
 * @param {string} language - Language code to change to
 */
export const changeLanguage = async (language) => {
  if (language) {
    try {
      await i18n.changeLanguage(language);
      // Update cookie to remember this language preference
      setCookie(COOKIE_NAME, language, 365);
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  }
};

export default i18n;
