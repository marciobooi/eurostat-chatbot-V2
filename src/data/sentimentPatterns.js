/**
 * Sentiment analysis patterns for different languages
 */
export const sentimentPatterns = {
  positive: {
    en: [
      /good/,
      /great/,
      /excellent/,
      /amazing/,
      /wonderful/,
      /helpful/,
      /thanks/,
      /thank/,
      /love/,
      /like/,
      /pleased/,
      /satisfied/,
      /impressive/,
    ],
    fr: [
      /bon/,
      /bien/,
      /excellent/,
      /incroyable/,
      /merveilleux/,
      /utile/,
      /merci/,
      /adore/,
      /aime/,
      /plaît/,
      /satisfait/,
      /impressionnant/,
    ],
    de: [
      /gut/,
      /toll/,
      /ausgezeichnet/,
      /erstaunlich/,
      /wunderbar/,
      /hilfreich/,
      /danke/,
      /liebe/,
      /mag/,
      /gefällt/,
      /zufrieden/,
      /beeindruckend/,
    ],
  },
  negative: {
    en: [
      /bad/,
      /terrible/,
      /awful/,
      /useless/,
      /not helpful/,
      /wrong/,
      /incorrect/,
      /stupid/,
      /hate/,
      /dislike/,
      /unfortunate/,
      /disappointing/,
    ],
    fr: [
      /mauvais/,
      /terrible/,
      /affreux/,
      /inutile/,
      /pas utile/,
      /incorrecte?/,
      /stupide/,
      /déteste/,
      /n'aime pas/,
      /malheureux/,
      /décevant/,
    ],
    de: [
      /schlecht/,
      /schrecklich/,
      /furchtbar/,
      /nutzlos/,
      /nicht hilfreich/,
      /falsch/,
      /dumm/,
      /hasse/,
      /mag nicht/,
      /unglücklich/,
      /enttäuschend/,
    ],
  },
};

/**
 * Analyze sentiment of text
 * @param {string} text - Text to analyze
 * @param {string} language - Language code
 * @returns {Object} Sentiment analysis result
 */
export const analyzeSentiment = (text, language = "en") => {
  if (!text) return { score: 0, magnitude: 0, type: "neutral" };

  const normalizedText = text.toLowerCase().trim();
  const lang = ["en", "fr", "de"].includes(language) ? language : "en";

  let positiveCount = 0;
  let negativeCount = 0;

  // Count positive and negative patterns
  for (const pattern of sentimentPatterns.positive[lang] ||
    sentimentPatterns.positive.en) {
    if (pattern.test(normalizedText)) positiveCount++;
  }

  for (const pattern of sentimentPatterns.negative[lang] ||
    sentimentPatterns.negative.en) {
    if (pattern.test(normalizedText)) negativeCount++;
  }

  // Calculate sentiment score (-1 to 1)
  const totalWords = normalizedText.split(/\s+/).length;
  const magnitude = (positiveCount + negativeCount) / Math.max(totalWords, 1);
  const score =
    totalWords > 0
      ? (positiveCount - negativeCount) /
        Math.max(positiveCount + negativeCount, 1)
      : 0;

  let type = "neutral";
  if (score > 0.3) type = "positive";
  else if (score < -0.3) type = "negative";

  return { score, magnitude, type };
};
