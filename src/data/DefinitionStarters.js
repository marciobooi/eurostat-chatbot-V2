/**
 * Multilingual starter phrases for definition responses
 * These are used to make energy definition responses more natural and engaging
 * by adding variety to how definitions are introduced
 * Supports English, French, and German
 */

import i18n from '../i18n/index.js';

const definitionStartersData = {
  en: [
    "Here's what I found about",
    "Let me explain",
    "According to Eurostat energy classifications,",
    "In the context of energy statistics,",
    "This energy term refers to",
    "Based on EU energy methodology,",
    "In energy balance terminology,",
    "From the Eurostat energy glossary,",
    "This fuel classification represents",
    "In energy statistical frameworks,",
    "According to energy reporting standards,",
    "This energy concept describes",
    "In the field of energy data,",
    "From an energy perspective,",
    "This terminology defines",
    "In Eurostat energy documentation,",
    "Within energy balance structures,",
    "This energy category encompasses",
    "According to fuel code standards,",
    "In energy transformation processes,"
  ],
  
  fr: [
    "Voici ce que j'ai trouvé sur",
    "Laissez-moi vous expliquer",
    "Selon les classifications énergétiques d'Eurostat,",
    "Dans le contexte des statistiques énergétiques,",
    "Ce terme énergétique fait référence à",
    "Basé sur la méthodologie énergétique de l'UE,",
    "En terminologie de bilan énergétique,",
    "D'après le glossaire énergétique d'Eurostat,",
    "Cette classification de combustible représente",
    "Dans les cadres statistiques énergétiques,",
    "Selon les normes de rapport énergétique,",
    "Ce concept énergétique décrit",
    "Dans le domaine des données énergétiques,",
    "D'un point de vue énergétique,",
    "Cette terminologie définit",
    "Dans la documentation énergétique d'Eurostat,",
    "À l'intérieur des structures de bilan énergétique,",
    "Cette catégorie énergétique englobe",
    "Selon les normes de codes de combustible,",
    "Dans les processus de transformation énergétique,"
  ],
  
  de: [
    "Hier ist was ich gefunden habe über",
    "Lassen Sie mich erklären",
    "Gemäß Eurostat-Energieklassifizierungen,",
    "Im Kontext von Energiestatistiken,",
    "Dieser Energiebegriff bezieht sich auf",
    "Basierend auf EU-Energiemethodik,",
    "In der Energiebilanz-Terminologie,",
    "Aus dem Eurostat-Energieglossar,",
    "Diese Brennstoffklassifizierung repräsentiert",
    "In energiestatistischen Rahmenwerken,",
    "Gemäß Energieberichtsstandards,",
    "Dieses Energiekonzept beschreibt",
    "Im Bereich der Energiedaten,",
    "Aus energetischer Sicht,",
    "Diese Terminologie definiert",
    "In der Eurostat-Energiedokumentation,",
    "Innerhalb von Energiebilanzstrukturen,",
    "Diese Energiekategorie umfasst",
    "Gemäß Brennstoffcode-Standards,",
    "In Energieumwandlungsprozessen,"
  ]
};

const confidencePhrasesData = {
  high: { // 90-100% confidence
    en: [
      "I found an exact match for your query.",
      "This is a precise definition from our energy database.",
      "Here's the official Eurostat definition.",
      "I have a complete match for this energy term.",
      "This is the standard definition used in EU energy statistics."
    ],
    fr: [
      "J'ai trouvé une correspondance exacte pour votre requête.",
      "Voici une définition précise de notre base de données énergétique.",
      "Voici la définition officielle d'Eurostat.",
      "J'ai une correspondance complète pour ce terme énergétique.",
      "Voici la définition standard utilisée dans les statistiques énergétiques de l'UE."
    ],
    de: [
      "Ich habe eine exakte Übereinstimmung für Ihre Anfrage gefunden.",
      "Dies ist eine präzise Definition aus unserer Energiedatenbank.",
      "Hier ist die offizielle Eurostat-Definition.",
      "Ich habe eine vollständige Übereinstimmung für diesen Energiebegriff.",
      "Dies ist die Standarddefinition, die in EU-Energiestatistiken verwendet wird."
    ]
  },
  medium: { // 70-89% confidence
    en: [
      "I found a closely related energy term.",
      "This appears to be what you're looking for.",
      "Here's a similar energy concept that might help.",
      "I found a matching energy definition.",
      "This energy term seems relevant to your query."
    ],
    fr: [
      "J'ai trouvé un terme énergétique étroitement lié.",
      "Cela semble être ce que vous cherchez.",
      "Voici un concept énergétique similaire qui pourrait aider.",
      "J'ai trouvé une définition énergétique correspondante.",
      "Ce terme énergétique semble pertinent pour votre requête."
    ],
    de: [
      "Ich habe einen eng verwandten Energiebegriff gefunden.",
      "Dies scheint zu sein, was Sie suchen.",
      "Hier ist ein ähnliches Energiekonzept, das helfen könnte.",
      "Ich habe eine passende Energiedefinition gefunden.",
      "Dieser Energiebegriff scheint relevant für Ihre Anfrage zu sein."
    ]
  },
  low: { // Below 70% confidence
    en: [
      "I found a potentially related energy term.",
      "This might be what you're looking for.",
      "Here's a loosely related energy concept.",
      "I found this similar energy definition.",
      "This energy term might be relevant to your search."
    ],
    fr: [
      "J'ai trouvé un terme énergétique potentiellement lié.",
      "Cela pourrait être ce que vous cherchez.",
      "Voici un concept énergétique vaguement lié.",
      "J'ai trouvé cette définition énergétique similaire.",
      "Ce terme énergétique pourrait être pertinent pour votre recherche."
    ],
    de: [
      "Ich habe einen möglicherweise verwandten Energiebegriff gefunden.",
      "Das könnte sein, was Sie suchen.",
      "Hier ist ein lose verwandtes Energiekonzept.",
      "Ich habe diese ähnliche Energiedefinition gefunden.",
      "Dieser Energiebegriff könnte für Ihre Suche relevant sein."
    ]
  }
};

const subfuelIntroPhrasesData = {
  en: [
    "This category includes the following energy sources:",
    "You can explore these specific fuel types:",
    "This energy group contains:",
    "Related energy subcategories:",
    "Available fuel classifications:",
    "Specific energy types in this category:",
    "This encompasses these fuel codes:",
    "Energy sources included:",
    "Subcategories available:",
    "Related fuel definitions:"
  ],
  fr: [
    "Cette catégorie comprend les sources d'énergie suivantes :",
    "Vous pouvez explorer ces types de combustibles spécifiques :",
    "Ce groupe énergétique contient :",
    "Sous-catégories énergétiques liées :",
    "Classifications de combustibles disponibles :",
    "Types d'énergie spécifiques dans cette catégorie :",
    "Cela englobe ces codes de combustible :",
    "Sources d'énergie incluses :",
    "Sous-catégories disponibles :",
    "Définitions de combustibles liées :"
  ],
  de: [
    "Diese Kategorie umfasst die folgenden Energiequellen:",
    "Sie können diese spezifischen Kraftstofftypen erkunden:",
    "Diese Energiegruppe enthält:",
    "Verwandte Energie-Unterkategorien:",
    "Verfügbare Kraftstoffklassifizierungen:",
    "Spezifische Energietypen in dieser Kategorie:",
    "Dies umfasst diese Kraftstoffcodes:",
    "Eingeschlossene Energiequellen:",
    "Verfügbare Unterkategorien:",
    "Verwandte Kraftstoffdefinitionen:"
  ]
};

// Function to get definition starters for current language
export const getDefinitionStarters = () => {
  const currentLanguage = i18n.language || 'en';
  return definitionStartersData[currentLanguage] || definitionStartersData.en;
};

// Function to get confidence phrases for current language
export const getConfidencePhrases = () => {
  const currentLanguage = i18n.language || 'en';
  return confidencePhrasesData;
};

// Function to get subfuel intro phrases for current language
export const getSubfuelIntroPhrases = () => {
  const currentLanguage = i18n.language || 'en';
  return subfuelIntroPhrasesData[currentLanguage] || subfuelIntroPhrasesData.en;
};

// Legacy exports for backward compatibility
export const DEFINITION_STARTERS = {
  en: getDefinitionStarters()
};

export const CONFIDENCE_PHRASES = getConfidencePhrases();

export const SUBFUEL_INTRO_PHRASES = {
  en: getSubfuelIntroPhrases()
};

/**
 * Get a random starter phrase for definitions
 */
export const getRandomStarter = () => {
  const starters = getDefinitionStarters();
  const randomIndex = Math.floor(Math.random() * starters.length);
  return starters[randomIndex];
};

/**
 * Get a confidence-based phrase
 */
export const getConfidencePhrase = (confidence) => {
  const currentLanguage = i18n.language || 'en';
  let level;
  if (confidence >= 90) {
    level = 'high';
  } else if (confidence >= 70) {
    level = 'medium';
  } else {
    level = 'low';
  }
  
  const confidencePhrases = getConfidencePhrases();
  const phrases = confidencePhrases[level][currentLanguage] || confidencePhrases[level].en;
  const randomIndex = Math.floor(Math.random() * phrases.length);
  return phrases[randomIndex];
};

/**
 * Get a random subfuel introduction phrase
 */
export const getSubfuelIntro = () => {
  const intros = getSubfuelIntroPhrases();
  const randomIndex = Math.floor(Math.random() * intros.length);
  return intros[randomIndex];
};
