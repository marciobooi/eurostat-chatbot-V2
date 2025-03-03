const affirmativePatterns = {
  en: [
    /\b(yes|yeah|yep|sure|ok|okay|definitely|absolutely|right|correct|agreed|indeed|yup|confirm|fine|good)\b/i,
    /\b(tell|show|give|share)\s+me\s+(more|about|it)\b/i,
    /\b(i'?m?\s+)?(interested|curious|want|would like)\b/i,
    /\b(go|continue|proceed)\s+(on|ahead|forward)\b/i,
    /\b(sounds?|looks?)\s+(good|great|interesting|fine)\b/i,
    /\bplease\s+do\b/i
  ],
  fr: [
    /\b(oui|ouais|ok|okay|certainement|absolument|exact|en effet|bien|bon|d'accord|effectivement|volontiers)\b/i,
    /\b(dis|montre|parle|raconte|explique)\s*(m'en|moi)\s+(plus|davantage)\b/i,
    /\b(je\s+)?(suis|voudrais|veux|aimerais|souhaite)\b/i,
    /\b(continue[rz]?|poursui[svt]|va[sy]|allez)\b/i,
    /\bça\s+(m')?intéresse\b/i,
    /\bs'il\s+(te|vous)\s+pla[iî]t\b/i
  ],
  de: [
    /\b(ja|jo|jep|klar|okay|ok|definitiv|absolut|richtig|stimmt|genau|gewiss|gerne)\b/i,
    /\b(erzähl|zeig|gib|teil)\s+(mir|uns)\s+(mehr|weiter|darüber)\b/i,
    /\b(ich\s+)?(bin|möchte|will|würde)\b/i,
    /\b(mach|fahr|geh)\s+(weiter|fort)\b/i,
    /\b(klingt|scheint|hört\s+sich)\s+(gut|interessant|prima|toll)\b/i,
    /\bbitte\b/i
  ]
};

const SUPPORTED_LANGUAGES = ['en', 'fr', 'de'];
const DEFAULT_LANGUAGE = 'en';

const validateLanguage = (language) => {
  if (!language || !SUPPORTED_LANGUAGES.includes(language)) {
    console.warn(`Invalid or unsupported language: ${language}. Falling back to ${DEFAULT_LANGUAGE}`);
    return DEFAULT_LANGUAGE;
  }
  return language;
};

const normalizeText = (text) => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-zA-Z0-9\s]/g, '') // Keep uppercase letters
    .replace(/\s+/g, ' ')
    .trim();
};

export const isAffirmative = (input, language) => {
  if (!input) return false;
  
  const validLang = validateLanguage(language);
  const patterns = affirmativePatterns[validLang] || affirmativePatterns[DEFAULT_LANGUAGE];
  
  const normalizedInput = input.toLowerCase().trim();
  return patterns.some(pattern => pattern.test(normalizedInput));
};
