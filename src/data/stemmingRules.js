/**
 * Stemming rules for different languages
 * These rules help reduce words to their base forms
 */

export const stemmingRules = {
  // English stemming rules
  en: [
    { suffix: "ing", minLength: 5 },
    { suffix: "tion", minLength: 6 },
    { suffix: "ed", minLength: 4 },
    { suffix: "s", minLength: 3 },
    { suffix: "ly", minLength: 4 },
    { suffix: "ment", minLength: 6 },
    { suffix: "ness", minLength: 5 },
    { suffix: "ity", minLength: 5 },
    { suffix: "es", minLength: 4 },
  ],

  // French stemming rules
  fr: [
    { suffix: "er", minLength: 5 }, // parler -> parl
    { suffix: "ir", minLength: 5 }, // finir -> fin
    { suffix: "re", minLength: 5 }, // prendre -> prend
    { suffix: "ant", minLength: 5 }, // parlant -> parl
    { suffix: "tion", minLength: 6 }, // création -> créa
    { suffix: "ment", minLength: 6 }, // lentement -> lente
    { suffix: "eur", minLength: 5 }, // chercheur -> cherch
    { suffix: "euse", minLength: 6 }, // chercheuse -> cherch
    { suffix: "eux", minLength: 5 }, // heureux -> heur
    { suffix: "aux", minLength: 5 }, // nationaux -> nation
    { suffix: "e", minLength: 4 }, // grande -> grand
  ],

  // German stemming rules
  de: [
    { suffix: "en", minLength: 4 }, // spielen -> spiel
    { suffix: "ern", minLength: 5 }, // ändern -> änd
    { suffix: "eln", minLength: 5 }, // handeln -> hand
    { suffix: "ung", minLength: 5 }, // zeitung -> zeit
    { suffix: "heit", minLength: 5 }, // freiheit -> frei
    { suffix: "keit", minLength: 5 }, // möglich -> möglich
    { suffix: "lich", minLength: 5 }, // freundlich -> freund
    { suffix: "ig", minLength: 4 }, // mächtig -> mächt
    { suffix: "isch", minLength: 5 }, // historisch -> histor
    { suffix: "er", minLength: 4 }, // spieler -> spiel
    { suffix: "st", minLength: 4 }, // spielst -> spiel
  ],
};

/**
 * Apply stemming to a word based on language
 * @param {string} word - Word to stem
 * @param {string} language - Language code (en, fr, de)
 * @returns {string} Stemmed word
 */
export const stemWord = (word, language = "en") => {
  if (!word || typeof word !== "string" || word.length < 3) {
    return word ? word.toLowerCase() : "";
  }

  // Get rules for the specified language, fallback to English if not found
  const rules = stemmingRules[language.toLowerCase()] || stemmingRules.en;

  let stemmed = word.toLowerCase();

  // Try each rule in order
  for (const rule of rules) {
    if (stemmed.length >= rule.minLength && stemmed.endsWith(rule.suffix)) {
      stemmed = stemmed.slice(0, -rule.suffix.length);
      break; // Apply only one rule
    }
  }

  return stemmed;
};

export default stemmingRules;
