import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { getLastUsedLanguage } from "./utils/chatHistory";

// Import translation files directly.
import enTranslation from "./locales/en.json";
import frTranslation from "./locales/fr.json";
import deTranslation from "./locales/de.json";

// Create a resources object with your translations.
const resources = {
  en: { translation: enTranslation },
  fr: { translation: frTranslation },
  de: { translation: deTranslation },
};

// Get last used language from chat history
const lastUsedLanguage = getLastUsedLanguage();

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ["en", "fr", "de"],
    fallbackLng: "en",
    lng: lastUsedLanguage, // Use last used language if available
    // debug: true,
    interpolation: {
      escapeValue: false, // React already escapes by default
      format: (value, format) => {
        if (format === "capitalize") {
          return value.charAt(0).toUpperCase() + value.slice(1);
        }
        return value;
      },
    },
    detection: {
      order: ["cookie", "localStorage", "querystring", "navigator", "htmlTag"],
      caches: ["cookie"], // Store the language in cookies
      cookieMinutes: 10080, // Cookie expires in 7 days (10080 minutes)
      cookieDomain: window.location.hostname, // Use current domain
    },
  });

export default i18n;
