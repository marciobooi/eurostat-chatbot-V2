export const SUPPORTED_LANGUAGES = ['en', 'fr', 'de'];
export const DEFAULT_LANGUAGE = 'en';

export class LanguageValidator {
  static validate(language) {
    if (!language || !SUPPORTED_LANGUAGES.includes(language)) {
      console.warn(`Invalid or unsupported language: ${language}. Falling back to ${DEFAULT_LANGUAGE}`);
      return DEFAULT_LANGUAGE;
    }
    return language;
  }

  static isSupported(language) {
    return SUPPORTED_LANGUAGES.includes(language);
  }

  static getDefault() {
    return DEFAULT_LANGUAGE;
  }

  static getSupportedLanguages() {
    return [...SUPPORTED_LANGUAGES];
  }

  static normalizeText(text, language) {
    if (!text) return '';

    // Language-specific normalization rules
    switch (language) {
      case 'fr':
        // Handle French-specific characters and patterns
        return text
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
          .replace(/œ/g, 'oe')
          .replace(/æ/g, 'ae')
          .toLowerCase()
          .trim();
      
      case 'de':
        // Handle German-specific characters and patterns
        return text
          .replace(/ä/g, 'ae')
          .replace(/ö/g, 'oe')
          .replace(/ü/g, 'ue')
          .replace(/ß/g, 'ss')
          .toLowerCase()
          .trim();
      
      default:
        // Default English normalization
        return text.toLowerCase().trim();
    }
  }
}