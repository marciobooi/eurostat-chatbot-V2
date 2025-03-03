/**
 * Common question phrases by language
 */
export const commonQuestionPhrases = {
  en: [
    "what is",
    "tell me about",
    "how does",
    "explain",
    "describe",
    "what are",
    "can you tell me about",
    "i'd like to know about",
    "i want to know about",
    "please explain",
    "information on",
    "information about",
    "details about",
    "tell me more about",
  ],
  fr: [
    "qu'est-ce que",
    "qu'est ce que",
    "parle-moi de",
    "comment",
    "explique",
    "décris",
    "quels sont",
    "quelles sont",
    "peux-tu me parler de",
    "j'aimerais savoir",
    "je veux savoir",
    "s'il te plaît explique",
    "information sur",
    "détails sur",
    "dis-moi plus sur",
  ],
  de: [
    "was ist",
    "erzähl mir von",
    "wie",
    "erkläre",
    "beschreibe",
    "was sind",
    "kannst du mir sagen",
    "ich möchte wissen",
    "ich will wissen",
    "bitte erkläre",
    "informationen über",
    "details über",
    "sag mir mehr über",
  ],
};

/**
 * Question words by language
 */
export const questionWords = {
  en: ['what', 'how', 'why', 'where', 'when', 'which', 'who', 'whom', 'whose', 'can', 'could', 'should', 'would', 'will', 'do', 'does', 'did', 'is', 'are', 'was', 'were', 'have', 'has', 'had'],
  fr: ['que', 'quoi', 'comment', 'pourquoi', 'où', 'quand', 'quel', 'quelle', 'quels', 'quelles', 'qui', 'peux', 'pouvez', 'peut', 'peuvent', 'est', 'sont', 'était', 'étaient', 'a', 'as', 'avez', 'ont', 'avaient'],
  de: ['was', 'wie', 'warum', 'weshalb', 'wo', 'wann', 'welche', 'welcher', 'welches', 'wer', 'wem', 'wessen', 'kann', 'kannst', 'können', 'könnte', 'könnten', 'soll', 'sollte', 'würde', 'wird', 'ist', 'sind', 'war', 'waren', 'habe', 'hat', 'haben']
};

/**
 * Check if text contains a question word
 * @param {string} text - Text to check
 * @param {string} language - Language code
 * @returns {boolean} True if contains question word
 */
export const containsQuestionWord = (text, language = "en") => {
  const normalizedText = text.toLowerCase();
  const words = normalizedText.split(/\s+/);
  const qWords = questionWords[language] || questionWords.en;

  return qWords.some((qw) => words.includes(qw));
};
