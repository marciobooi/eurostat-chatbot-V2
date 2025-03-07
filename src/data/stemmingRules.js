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

  // Time-related terms
  "monthly": "month",
  "monthly data": "month",
  "per month": "month",
  "month by month": "month",
  "months": "month",
  "annual": "year",
  "annually": "year",
  "yearly": "year",
  "per year": "year",
  "year by year": "year",
  "years": "year",
  
  // Fuel types
  "natural gas": "gas",
  "lng": "gas",
  "liquefied natural gas": "gas",
  "petroleum": "oil",
  "crude oil": "oil",
  "crude": "oil",
  "petrol": "oil",
  "gasoline": "oil",
  "diesel": "oil",
  
  // Activities
  "imports": "import",
  "importing": "import",
  "imported": "import",
  "exports": "export",
  "exporting": "export",
  "exported": "export",
  "produces": "produce",
  "produced": "produce",
  "producing": "produce",
  "production": "produce",
  "consumes": "consume",
  "consumed": "consume",
  "consuming": "consume",
  "consumption": "consume",
  
  // Units
  "cubic meters": "m3",
  "cubic metre": "m3",
  "cubic metres": "m3",
  "m³": "m3",
  "million cubic meters": "mcm",
  "million cubic metres": "mcm",
  "terajoules": "tj",
  "gigawatt hours": "gwh",
  "gigawatt hour": "gwh",
  "gwhr": "gwh",
  "thousand tonnes": "kt",
  "kilotonnes": "kt",
  "thousand tons": "kt",
  "million tonnes": "mt",
  "megatonnes": "mt",
  "million tons": "mt",
  
  // Time periods
  "january": "jan",
  "february": "feb",
  "march": "mar",
  "april": "apr",
  "may": "may",
  "june": "jun",
  "july": "jul",
  "august": "aug",
  "september": "sep",
  "october": "oct",
  "november": "nov",
  "december": "dec",
  
  // Common combinations
  "monthly gas": "gas month",
  "monthly oil": "oil month",
  "annual gas": "gas year",
  "annual oil": "oil year",
  "gas consumption": "gas consume",
  "oil consumption": "oil consume",
  "gas production": "gas produce",
  "oil production": "oil produce",
  "electricity generation": "electricity produce",
  "power generation": "electricity produce"
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

export const applyStemming = (text) => {
  if (!text) return text;
  
  const words = text.toLowerCase().split(' ');
  const stemmed = [];
  
  // First try multi-word matches
  for (let i = 0; i < words.length; i++) {
      let found = false;
      
      // Try increasingly smaller phrases
      for (let j = 3; j > 0; j--) {
          if (i + j <= words.length) {
              const phrase = words.slice(i, i + j).join(' ');
              if (stemmingRules[phrase]) {
                  stemmed.push(stemmingRules[phrase]);
                  i += j - 1;
                  found = true;
                  break;
              }
          }
      }
      
      // If no multi-word match found, try single word
      if (!found) {
          stemmed.push(stemmingRules[words[i]] || words[i]);
      }
  }
  
  return stemmed.join(' ');
};

export default {
  stemmingRules,
  applyStemming
};
