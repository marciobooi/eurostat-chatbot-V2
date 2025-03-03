import { commonQuestionPhrases } from "../data/questionPhrases";
import nlp from "compromise";
import sentences from "compromise-sentences";
import numbers from "compromise-numbers";
import dates from "compromise-dates";
import winkNLP from "wink-nlp";
import model from "wink-eng-lite-web-model";

// Initialize NLP processors and extend Compromise with plugins
const nlpProcessor = winkNLP(model);
nlp.extend(sentences);
nlp.extend(numbers);
nlp.extend(dates);

// Helper function to safely get tokens from winkNLP
const safeTokenize = (text) => {
  if (!text || typeof text !== "string") return [];
  try {
    const doc = nlpProcessor.readDoc(text);
    return doc.tokens().out();
  } catch (error) {
    console.warn("Error in safeTokenize:", error);
    return text.toLowerCase().split(/\s+/); // Fallback to simple tokenization
  }
};

// Add stemming for word roots
const stemWord = (word) => {
  // Simple stemming rules for energy domain
  const rules = [
    { suffix: "ing", minLength: 5 },
    { suffix: "tion", minLength: 6 },
    { suffix: "ed", minLength: 4 },
    { suffix: "s", minLength: 3 },
  ];

  let stemmed = word.toLowerCase();
  for (const rule of rules) {
    if (stemmed.length >= rule.minLength && stemmed.endsWith(rule.suffix)) {
      stemmed = stemmed.slice(0, -rule.suffix.length);
      break;
    }
  }
  return stemmed;
};

export const cleanQuery = (query = "") => {
  if (!query) return "";

  try {
    const tokens = safeTokenize(query);
    return tokens.filter(Boolean).join(" ").toLowerCase().trim();
  } catch (error) {
    console.warn("Error in cleanQuery:", error);
    return query.toLowerCase().trim();
  }
};

export const extractTopicFromQuery = (query, language) => {
  try {
    const cleanedQuery = cleanQuery(query);
    if (!cleanedQuery || !language) return "";

    // For single-word queries, try stemming
    if (!cleanedQuery.includes(" ")) {
      return stemWord(cleanedQuery);
    }

    const phrases = commonQuestionPhrases[language];
    if (!phrases) {
      console.warn(`No question phrases found for language: ${language}`);
      return cleanedQuery;
    }

    // Use compromise for initial processing
    let doc = nlp(cleanedQuery);

    // Remove question phrases
    phrases.forEach((phrase) => {
      doc = doc.replace(phrase, "");
    });

    // Extract topics and nouns
    const topics = doc.topics().text();
    const nouns = doc.nouns().text();

    // Use the most specific information available
    const extractedTopic = topics || nouns || cleanedQuery;
    return stemWord(extractedTopic); // Apply stemming to extracted topic
  } catch (error) {
    console.warn("Error in extractTopicFromQuery:", error);
    return stemWord(query.trim()); // Apply stemming even in error case
  }
};

/**
 * Extract entities from text with language support
 * @param {string} text - Text to analyze
 * @param {string} [language='en'] - Language code
 * @returns {Object} Extracted entities
 */
export const extractEntities = (text, language = "en") => {
  if (!text) return { organizations: [], places: [], numbers: [], dates: [] };

  try {
    const doc = nlp(text);

    // Initialize with empty arrays
    const entities = {
      organizations: [],
      places: [],
      numbers: [],
      dates: [],
    };

    // Extract organizations (fallback to nouns starting with capital letters)
    const orgs = doc.match("#Organization+").out("array");
    entities.organizations = orgs.length
      ? orgs
      : doc.match("[A-Z][a-z]+").out("array");

    // Extract places
    entities.places = doc.places().out("array");

    // Extract numbers using the numbers plugin
    entities.numbers = doc.numbers().out("array");

    // Extract dates using the dates plugin, with fallback
    try {
      entities.dates = doc.dates().out("array");
    } catch (error) {
      console.warn("Date extraction failed, using fallback:", error);
      // Language-specific date extraction patterns
      const datePatterns = {
        en: /\b(?:today|tomorrow|yesterday|(?:next|last) (?:week|month|year)|(?:in |after |before )?\d+ (?:days?|weeks?|months?|years?))\b/gi,
        fr: /\b(?:aujourd'hui|demain|hier|(?:la |le )?(?:semaine|mois|année) (?:prochaine?|dernière?)|(?:dans |après |avant )?\d+ (?:jours?|semaines?|mois|ans?))\b/gi,
        de: /\b(?:heute|morgen|gestern|(?:nächste[rn]?|letzte[rn]?) (?:Woche|Monat|Jahr)|(?:in |nach |vor )?\d+ (?:Tage?n?|Wochen?|Monate?n?|Jahre?n?))\b/gi,
      };

      const lang = ["en", "fr", "de"].includes(language) ? language : "en";
      const dateMatches = text.match(datePatterns[lang]) || [];
      entities.dates = dateMatches;
    }

    return entities;
  } catch (error) {
    console.warn("Error in extractEntities:", error);
    return { organizations: [], places: [], numbers: [], dates: [] };
  }
};

export const getSentenceSentiment = (text) => {
  if (!text) return 0;

  try {
    const doc = nlp(text);
    // Use simple word matching for sentiment
    const positive = doc.match(
      "(good|great|excellent|awesome|nice|wonderful|fantastic|amazing|love|happy|positive|helpful)"
    ).length;
    const negative = doc.match(
      "(bad|poor|terrible|awful|horrible|hate|negative|unhelpful|wrong|worse|worst)"
    ).length;

    return (positive - negative) / (positive + negative + 1);
  } catch (error) {
    console.warn("Error in getSentenceSentiment:", error);
    return 0;
  }
};

export const extractKeyPhrases = (text) => {
  if (!text) return [];

  try {
    const doc = nlp(text);
    return doc
      .phrases()
      .json()
      .map((phrase) => phrase.text)
      .filter((phrase) => phrase.split(" ").length > 1);
  } catch (error) {
    console.warn("Error in extractKeyPhrases:", error);
    return [];
  }
};

export const detectLanguage = (text) => {
  if (!text) return null;

  try {
    const words = safeTokenize(text);

    const langScores = {
      en: 0,
      fr: 0,
      de: 0,
    };

    words.forEach((word) => {
      if (commonQuestionPhrases.en.some((phrase) => word.includes(phrase)))
        langScores.en++;
      if (commonQuestionPhrases.fr.some((phrase) => word.includes(phrase)))
        langScores.fr++;
      if (commonQuestionPhrases.de.some((phrase) => word.includes(phrase)))
        langScores.de++;
    });

    // Find language with highest score
    const [detectedLang, score] = Object.entries(langScores).reduce((a, b) =>
      a[1] > b[1] ? a : b
    );

    // Only return detected language if we have some confidence
    return score > 0 ? detectedLang : null;
  } catch (error) {
    console.warn("Error in detectLanguage:", error);
    return null;
  }
};

/**
 * Simple NLP utilities for intent recognition
 */
const intentPatterns = {
  question: {
    en: [
      /\?$/,
      /what/,
      /how/,
      /when/,
      /where/,
      /which/,
      /why/,
      /can you/,
      /could you/,
    ],
    fr: [
      /\?$/,
      /qu[e']/,
      /comment/,
      /quand/,
      /où/,
      /quel(le)?/,
      /pourquoi/,
      /peux-tu/,
      /pourrais-tu/,
    ],
    de: [
      /\?$/,
      /was/,
      /wie/,
      /wann/,
      /wo/,
      /welche[rs]?/,
      /warum/,
      /kannst du/,
      /könntest du/,
    ],
  },
  command: {
    en: [/^(please |)tell me/, /^show/, /^find/, /^search/, /^get/, /^give/],
    fr: [
      /^(s'il vous plaît |)dites-moi/,
      /^montre[zr]?/,
      /^trouve[zr]?/,
      /^cherche[zr]?/,
      /^donne[zr]?/,
    ],
    de: [/^(bitte |)sag mir/, /^zeig/, /^find/, /^such/, /^gib/],
  },
  gratitude: {
    en: [/thank/, /thanks/, /appreciate/, /helpful/],
    fr: [/merci/, /remercie/, /apprécier?/, /utile/],
    de: [/dank/, /danke/, /schätzen/, /nützlich/],
  },
  greeting: {
    en: [
      /^hi($|\s)/,
      /^hello($|\s)/,
      /^hey($|\s)/,
      /^good (morning|afternoon|evening)/,
      /^greetings/,
    ],
    fr: [/^salut($|\s)/, /^bonjour($|\s)/, /^bonsoir($|\s)/, /^coucou($|\s)/],
    de: [/^hallo($|\s)/, /^guten (morgen|tag|abend)/, /^servus($|\s)/, /^grüß/],
  },
  farewell: {
    en: [/bye/, /goodbye/, /see you/, /farewell/, /until next time/],
    fr: [/au revoir/, /adieu/, /à bientôt/, /à la prochaine/],
    de: [/tschüss/, /auf wiedersehen/, /bis später/, /bis bald/],
  },
};

/**
 * Detect intent from user input
 * @param {string} input - User input
 * @param {string} [language='en'] - Language code
 * @returns {string} Intent type
 */
export const findIntent = (input, language = "en") => {
  if (!input) return "unknown";

  const text = input.toLowerCase().trim();
  const patterns = intentPatterns;
  const lang = ["en", "fr", "de"].includes(language) ? language : "en";

  // Check each intent type
  for (const [intent, langPatterns] of Object.entries(patterns)) {
    const regexes = langPatterns[lang] || langPatterns.en;
    if (regexes.some((regex) => regex.test(text))) {
      return intent;
    }
  }

  // Default to question if contains specific words
  const questionWords = {
    en: ["what", "how", "when", "where", "which", "why"],
    fr: ["quoi", "comment", "quand", "où", "quel", "pourquoi"],
    de: ["was", "wie", "wann", "wo", "welche", "warum"],
  };

  const words = text.split(/\s+/);
  if (questionWords[lang].some((qw) => words.includes(qw))) {
    return "question";
  }

  return "statement";
};

/**
 * Analyze sentiment of text
 * @param {string} text - Text to analyze
 * @param {string} [language='en'] - Language code
 * @returns {Object} Sentiment analysis
 */
export const analyzeSentiment = (text, language = "en") => {
  if (!text) return { score: 0, magnitude: 0, type: "neutral" };

  try {
    const normalizedText = text.toLowerCase().trim();
    const lang = ["en", "fr", "de"].includes(language) ? language : "en";

    const sentimentPatterns = {
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
        ],
      },
    };

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
  } catch (error) {
    console.error("Error in analyzeSentiment:", error);
    return { score: 0, magnitude: 0, type: "neutral" };
  }
};
