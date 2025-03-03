export const SUPPORTED_LANGUAGES = ["en", "fr", "de"];
export const DEFAULT_LANGUAGE = "en";

const WORD_MAPPINGS = {
  en: {
    oil: ["oil", "oils", "oily", "petroleum", "crude"],
    fuel: ["fuel", "fuels", "fueling", "fuelled", "petrol", "gas"],
  },
  fr: {
    oil: ["huile", "huiles", "pétrole", "pétrolier", "brut"],
    fuel: ["carburant", "carburants", "essence", "gasoil", "combustible"],
  },
  de: {
    oil: ["öl", "öle", "erdöl", "rohöl", "petroleum"],
    fuel: ["brennstoff", "kraftstoff", "treibstoff", "benzin", "sprit"],
  },
};

/**
 * Language validation and utilities
 */

export class LanguageValidator {
  static supportedLanguages = ["en", "fr", "de"];
  static defaultLanguage = "en";

  /**
   * Validate and normalize language code
   * @param {string} lang - Language code to validate
   * @returns {string} Valid language code
   */
  static validate(lang) {
    if (!lang) return this.defaultLanguage;

    const normalizedLang = lang.toLowerCase().trim().substring(0, 2);
    return this.supportedLanguages.includes(normalizedLang)
      ? normalizedLang
      : this.defaultLanguage;
  }

  /**
   * Get list of supported languages
   * @returns {string[]} Supported language codes
   */
  static getSupportedLanguages() {
    return [...this.supportedLanguages];
  }

  /**
   * Check if a language is supported
   * @param {string} lang - Language code to check
   * @returns {boolean} True if supported
   */
  static isSupported(lang) {
    return this.supportedLanguages.includes(this.validate(lang));
  }

  /**
   * Get language name from code
   * @param {string} lang - Language code
   * @returns {string} Language name
   */
  static getLanguageName(lang) {
    const names = {
      en: "English",
      fr: "Français",
      de: "Deutsch",
    };

    return names[this.validate(lang)] || names.en;
  }

  static getDefault() {
    return DEFAULT_LANGUAGE;
  }

  static normalizeText(text, language) {
    if (!text) return "";

    const validLang = this.validate(language);
    let normalized = text.toLowerCase().trim();

    // Apply language-specific normalization
    switch (validLang) {
      case "fr":
        // Handle French-specific characters and variations
        normalized = normalized
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/œ/g, "oe")
          .replace(/æ/g, "ae")
          .replace(/\bp[ée]trol/g, "petrol")
          .replace(/\bgazo(le|il)/g, "gasoil");
        break;

      case "de":
        // Handle German-specific characters and variations
        normalized = normalized
          .replace(/ä/g, "ae")
          .replace(/ö/g, "oe")
          .replace(/ü/g, "ue")
          .replace(/ß/g, "ss")
          .replace(/\boel/g, "ol")
          .replace(/\bbenzin/g, "fuel");
        break;

      default:
        // English normalization
        normalized = normalized
          .replace(/\bgas(oline)?\b/g, "fuel")
          .replace(/\bpetroleum\b/g, "oil");
    }

    // Try to match with known word variations
    const mappings =
      WORD_MAPPINGS[validLang] || WORD_MAPPINGS[DEFAULT_LANGUAGE];
    for (const [baseWord, variations] of Object.entries(mappings)) {
      if (variations.some((v) => normalized.includes(v))) {
        normalized = normalized.replace(
          new RegExp(variations.join("|"), "g"),
          baseWord
        );
      }
    }

    return normalized;
  }

  static normalizeSearchTerms(terms, language) {
    if (!terms || !Array.isArray(terms)) return [];

    const validLang = this.validate(language);
    return terms.map((term) => this.normalizeText(term, validLang));
  }

  static getBestWordMatch(word, language) {
    const validLang = this.validate(language);
    const normalized = this.normalizeText(word, validLang);
    const mappings =
      WORD_MAPPINGS[validLang] || WORD_MAPPINGS[DEFAULT_LANGUAGE];

    // Find if the normalized word matches any base word or variation
    for (const [baseWord, variations] of Object.entries(mappings)) {
      if (normalized === baseWord || variations.includes(normalized)) {
        return baseWord;
      }
    }

    return normalized;
  }
}
