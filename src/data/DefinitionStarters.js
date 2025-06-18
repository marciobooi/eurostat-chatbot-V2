/**
 * Starter phrases for definition responses
 * These are used to make energy definition responses more natural and engaging
 * by adding variety to how definitions are introduced
 */

export const DEFINITION_STARTERS = {
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
  ]
};

export const CONFIDENCE_PHRASES = {
  high: { // 90-100% confidence
    en: [
      "I found an exact match for your query.",
      "This is a precise definition from our energy database.",
      "Here's the official Eurostat definition.",
      "I have a complete match for this energy term.",
      "This is the standard definition used in EU energy statistics."
    ]
  },
  medium: { // 70-89% confidence
    en: [
      "I found a closely related energy term.",
      "This appears to be what you're looking for.",
      "Here's a similar energy concept that might help.",
      "I found a matching energy definition.",
      "This energy term seems relevant to your query."
    ]
  },
  low: { // Below 70% confidence
    en: [
      "I found a potentially related energy term.",
      "This might be what you're looking for.",
      "Here's a loosely related energy concept.",
      "I found this similar energy definition.",
      "This energy term might be relevant to your search."
    ]
  }
};

export const SUBFUEL_INTRO_PHRASES = {
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
  ]
};

/**
 * Get a random starter phrase for definitions
 */
export const getRandomStarter = () => {
  const starters = DEFINITION_STARTERS.en;
  const randomIndex = Math.floor(Math.random() * starters.length);
  return starters[randomIndex];
};

/**
 * Get a confidence-based phrase
 */
export const getConfidencePhrase = (confidence) => {
  let level;
  if (confidence >= 90) {
    level = 'high';
  } else if (confidence >= 70) {
    level = 'medium';
  } else {
    level = 'low';
  }
  
  const phrases = CONFIDENCE_PHRASES[level].en;
  const randomIndex = Math.floor(Math.random() * phrases.length);
  return phrases[randomIndex];
};

/**
 * Get a random subfuel introduction phrase
 */
export const getSubfuelIntro = () => {
  const intros = SUBFUEL_INTRO_PHRASES.en;
  const randomIndex = Math.floor(Math.random() * intros.length);
  return intros[randomIndex];
};
