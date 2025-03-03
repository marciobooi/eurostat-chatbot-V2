/**
 * Intent patterns for various languages
 */
export const intentPatterns = {
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
    en: [
      /^(please |)tell me/,
      /^show/,
      /^find/,
      /^search/,
      /^get/,
      /^give/,
      /^explain/,
      /^describe/,
    ],
    fr: [
      /^(s'il vous plaît |)dites-moi/,
      /^montre[zr]?/,
      /^trouve[zr]?/,
      /^cherche[zr]?/,
      /^donne[zr]?/,
      /^expliquez?/,
      /^décri[svt]/,
    ],
    de: [
      /^(bitte |)sag mir/,
      /^zeig/,
      /^find/,
      /^such/,
      /^gib/,
      /^erklär/,
      /^beschreib/,
    ],
  },
  gratitude: {
    en: [/thank/, /thanks/, /appreciate/, /helpful/, /grateful/],
    fr: [/merci/, /remercie/, /apprécier?/, /utile/, /reconnaissant/],
    de: [/dank/, /danke/, /schätzen/, /nützlich/, /dankbar/],
  },
  greeting: {
    en: [
      /^hi($|\s)/,
      /^hello($|\s)/,
      /^hey($|\s)/,
      /^good (morning|afternoon|evening)/,
      /^greetings/,
    ],
    fr: [
      /^salut($|\s)/,
      /^bonjour($|\s)/,
      /^bonsoir($|\s)/,
      /^coucou($|\s)/,
      /^bienvenue/,
    ],
    de: [
      /^hallo($|\s)/,
      /^guten (morgen|tag|abend)/,
      /^servus($|\s)/,
      /^grüß/,
      /^willkommen/,
    ],
  },
  farewell: {
    en: [/bye/, /goodbye/, /see you/, /farewell/, /until next time/],
    fr: [/au revoir/, /adieu/, /à bientôt/, /à la prochaine/, /ciao/],
    de: [/tschüss/, /auf wiedersehen/, /bis später/, /bis bald/, /ciao/],
  },
};

/**
 * Get intent for a specific text in a language
 * @param {string} text - Text to analyze
 * @param {string} language - Language code
 * @returns {string} Intent type or 'unknown'
 */
export const getIntent = (text, language = "en") => {
  if (!text) return "unknown";

  const normalizedText = text.toLowerCase().trim();
  const lang = ["en", "fr", "de"].includes(language) ? language : "en";

  // Check each intent type
  for (const [intent, langPatterns] of Object.entries(intentPatterns)) {
    const patterns = langPatterns[lang] || langPatterns.en;
    if (patterns.some((pattern) => pattern.test(normalizedText))) {
      return intent;
    }
  }

  return "unknown";
};
