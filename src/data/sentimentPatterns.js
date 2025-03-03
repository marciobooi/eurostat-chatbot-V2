/**
 * Sentiment patterns for detecting emotions in text
 */
export const sentimentPatterns = {
  positive: {
    en: [
      "good",
      "great",
      "excellent",
      "amazing",
      "wonderful",
      "fantastic",
      "awesome",
      "best",
      "better",
      "helpful",
      "useful",
      "thank",
      "thanks",
      "appreciate",
      "love",
      "like",
      "enjoy",
      "happy",
      "glad",
      "pleased",
      "positive",
      "nice",
      "well",
      "perfect",
    ],
    fr: [
      "bon",
      "bien",
      "excellent",
      "étonnant",
      "merveilleux",
      "fantastique",
      "impressionnant",
      "meilleur",
      "utile",
      "merci",
      "apprécier",
      "aimer",
      "adorer",
      "profiter",
      "heureux",
      "content",
      "satisfait",
      "positif",
      "agréable",
      "parfait",
    ],
    de: [
      "gut",
      "grossartig",
      "ausgezeichnet",
      "erstaunlich",
      "wunderbar",
      "fantastisch",
      "toll",
      "beste",
      "besser",
      "hilfreich",
      "nützlich",
      "danke",
      "danken",
      "schätzen",
      "lieben",
      "mögen",
      "geniessen",
      "glücklich",
      "froh",
      "zufrieden",
      "positiv",
      "nett",
      "perfekt",
    ],
  },
  negative: {
    en: [
      "bad",
      "terrible",
      "horrible",
      "awful",
      "poor",
      "disappointing",
      "worst",
      "wrong",
      "difficult",
      "hard",
      "not helpful",
      "useless",
      "hate",
      "dislike",
      "sad",
      "unhappy",
      "disappointed",
      "negative",
      "problem",
      "issue",
      "error",
      "mistake",
      "fail",
      "failure",
    ],
    fr: [
      "mauvais",
      "terrible",
      "horrible",
      "affreux",
      "pauvre",
      "décevant",
      "pire",
      "faux",
      "difficile",
      "dur",
      "pas utile",
      "inutile",
      "détester",
      "triste",
      "malheureux",
      "déçu",
      "négatif",
      "problème",
      "erreur",
      "échec",
    ],
    de: [
      "schlecht",
      "schrecklich",
      "furchtbar",
      "entsetzlich",
      "arm",
      "enttäuschend",
      "schlimmste",
      "falsch",
      "schwierig",
      "hart",
      "nicht hilfreich",
      "nutzlos",
      "hassen",
      "nicht mögen",
      "traurig",
      "unglücklich",
      "enttäuscht",
      "negativ",
      "problem",
      "fehler",
      "versagen",
    ],
  },
  neutral: {
    en: [
      "ok",
      "okay",
      "fine",
      "average",
      "neutral",
      "fair",
      "moderate",
      "acceptable",
      "adequate",
      "mediocre",
      "sufficient",
      "reasonable",
    ],
    fr: [
      "ok",
      "bien",
      "moyen",
      "neutre",
      "juste",
      "modéré",
      "acceptable",
      "adéquat",
      "médiocre",
      "suffisant",
      "raisonnable",
    ],
    de: [
      "ok",
      "okay",
      "in ordnung",
      "durchschnittlich",
      "neutral",
      "fair",
      "mässig",
      "akzeptabel",
      "ausreichend",
      "mittelmässig",
      "genügend",
      "angemessen",
    ],
  },
};

/**
 * Get compromise-compatible regex pattern string for sentiment analysis
 * @param {string} type - Sentiment type (positive, negative, neutral)
 * @param {string} language - Language code
 * @returns {string} Pattern string for compromise.match()
 */
export const getCompromisePattern = (type = "positive", language = "en") => {
  // Get the appropriate word list for the sentiment type and language
  const words =
    sentimentPatterns[type]?.[language] ||
    sentimentPatterns[type]?.["en"] ||
    [];

  if (!words.length) return "";

  // Create a pattern that compromise can use
  return `(${words.join("|")})`;
};

/**
 * Get all sentiment patterns as compromise-compatible regex pattern strings
 * @param {string} language - Language code
 * @returns {Object} Object with positive, negative, and neutral patterns
 */
export const getAllCompromisePatterns = (language = "en") => {
  return {
    positive: getCompromisePattern("positive", language),
    negative: getCompromisePattern("negative", language),
    neutral: getCompromisePattern("neutral", language),
  };
};

/**
 * Analyze sentiment of text
 * @param {string} text - Text to analyze
 * @param {string} language - Language code
 * @returns {Object} Sentiment analysis results
 */
export const analyzeSentiment = (text, language = "en") => {
  if (!text) return { score: 0, sentiment: "neutral", confidence: 0 };

  const normalizedText = text.toLowerCase();

  const positivePatterns =
    sentimentPatterns.positive[language] || sentimentPatterns.positive.en;
  const negativePatterns =
    sentimentPatterns.negative[language] || sentimentPatterns.negative.en;
  const neutralPatterns =
    sentimentPatterns.neutral[language] || sentimentPatterns.neutral.en;

  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;

  // Count pattern occurrences
  for (const pattern of positivePatterns) {
    if (normalizedText.includes(pattern)) {
      positiveCount++;
    }
  }

  for (const pattern of negativePatterns) {
    if (normalizedText.includes(pattern)) {
      negativeCount++;
    }
  }

  for (const pattern of neutralPatterns) {
    if (normalizedText.includes(pattern)) {
      neutralCount++;
    }
  }

  // Calculate sentiment score (-1 to 1)
  const totalPatterns = positiveCount + negativeCount + neutralCount;
  const score =
    totalPatterns > 0 ? (positiveCount - negativeCount) / totalPatterns : 0;

  // Determine sentiment category
  let sentiment;
  if (score > 0.2) sentiment = "positive";
  else if (score < -0.2) sentiment = "negative";
  else sentiment = "neutral";

  // Calculate confidence (0 to 1)
  const confidence =
    totalPatterns > 0
      ? Math.abs(score) * (1 - neutralCount / totalPatterns)
      : 0;

  return {
    score: parseFloat(score.toFixed(2)),
    sentiment,
    confidence: parseFloat(confidence.toFixed(2)),
  };
};

export default sentimentPatterns;
