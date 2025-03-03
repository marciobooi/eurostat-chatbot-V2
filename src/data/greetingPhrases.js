/**
 * Greeting phrases in different languages
 */
export const greetingPhrases = {
  en: [
    "hi",
    "hello",
    "hey",
    "greetings",
    "good morning",
    "good afternoon",
    "good evening",
    "howdy",
    "sup",
    "what's up",
    "yo",
  ],
  fr: ["bonjour", "salut", "coucou", "bonsoir", "hey", "hello"],
  de: [
    "hallo",
    "guten morgen",
    "guten tag",
    "guten abend",
    "grüß gott",
    "servus",
    "hi",
    "hey",
    "grüß dich",
  ],
};

/**
 * Check if text is a greeting
 * @param {string} text - Text to check
 * @param {string} language - Language code
 * @returns {boolean} True if the text is a greeting
 */
export const isGreeting = (text, language = "en") => {
  if (!text) return false;

  const normalizedText = text.toLowerCase();
  const langGreetings = greetingPhrases[language] || greetingPhrases.en;

  return langGreetings.some((greeting) => normalizedText.includes(greeting));
};

export default greetingPhrases;
