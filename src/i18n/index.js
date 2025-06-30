import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Cookies from 'js-cookie';

// Import translations
import en from './locales/en.json';
import fr from './locales/fr.json';
import de from './locales/de.json';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  de: { translation: de }
};

const cookieOptions = {
  expires: 365, // 1 year
  sameSite: 'lax',
  secure: window.location.protocol === 'https:'
};

// Custom language detector that prioritizes cookies
const customLanguageDetector = {
  name: 'customDetector',
  lookup() {
    // First check for saved language in cookies
    const savedLang = Cookies.get('eurostat-chatbot-language');
    if (savedLang && ['en', 'fr', 'de'].includes(savedLang)) {
      return savedLang;
    }
    
    // Fallback to browser language
    const browserLang = navigator.language?.split('-')[0];
    if (['en', 'fr', 'de'].includes(browserLang)) {
      return browserLang;
    }
    
    // Default to English
    return 'en';
  },
  cacheUserLanguage(lng) {
    Cookies.set('eurostat-chatbot-language', lng, cookieOptions);
  }
};

i18n
  .use({
    type: 'languageDetector',
    init: () => {},
    detect: customLanguageDetector.lookup,
    cacheUserLanguage: customLanguageDetector.cacheUserLanguage
  })
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    detection: {
      order: ['customDetector'],
      caches: ['customDetector']
    },
    react: {
      useSuspense: false
    }
  });

// Export function to change language
export const changeLanguage = (lng) => {
  i18n.changeLanguage(lng);
  Cookies.set('eurostat-chatbot-language', lng, cookieOptions);
};

// Export function to get current language
export const getCurrentLanguage = () => i18n.language || 'en';

// Export available languages
export const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

export default i18n;
