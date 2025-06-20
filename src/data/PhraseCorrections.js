/**
 * Context-aware phrase corrections for energy queries
 * These handle multi-word patterns and common phrase typos that spell checkers miss
 */

export const PHRASE_CORRECTIONS = {
  // Time-related phrase patterns
  timePatterns: [
    { pattern: /\b(ths|thi|thsi|tihs)\s+(year|yr)\b/gi, replacement: 'this year' },
    { pattern: /\b(las|lst|lat)\s+(year|yr)\b/gi, replacement: 'last year' },
    { pattern: /\b(nex|nxt|net)\s+(year|yr)\b/gi, replacement: 'next year' },
    { pattern: /\b(curent|currnet|curnt|curren)\s+(year|yr)\b/gi, replacement: 'current year' },
    { pattern: /\b(previus|previos|previous)\s+(year|yr)\b/gi, replacement: 'previous year' },
    { pattern: /\b(followng|folowing|following)\s+(year|yr)\b/gi, replacement: 'following year' },
    
    // Quarter patterns
    { pattern: /\b(ths|thi|thsi)\s+(quarter|qtr)\b/gi, replacement: 'this quarter' },
    { pattern: /\b(las|lst)\s+(quarter|qtr)\b/gi, replacement: 'last quarter' },
    { pattern: /\b(nex|nxt)\s+(quarter|qtr)\b/gi, replacement: 'next quarter' },
    
    // Month patterns
    { pattern: /\b(ths|thi|thsi)\s+(month|mon)\b/gi, replacement: 'this month' },
    { pattern: /\b(las|lst)\s+(month|mon)\b/gi, replacement: 'last month' },
    { pattern: /\b(nex|nxt)\s+(month|mon)\b/gi, replacement: 'next month' }
  ],

  // Energy compound term patterns
  energyPatterns: [
    // Fossil fuel patterns
    { pattern: /\bsolid\s+(fosil|fosils|fossil|fossils)\s+(fuels?)\b/gi, replacement: 'solid fossil fuels' },
    { pattern: /\b(fosil|fosils)\s+(fuels?)\b/gi, replacement: 'fossil fuels' },
    { pattern: /\b(fosil|fossil)\s+(fue|fuel)\b/gi, replacement: 'fossil fuel' },
    
    // Renewable energy patterns
    { pattern: /\b(renawable|renewble|reneable)\s+(energy|enrgy)\b/gi, replacement: 'renewable energy' },
    { pattern: /\b(sustanble|sustainble|sustainable)\s+(energy|enrgy)\b/gi, replacement: 'sustainable energy' },
    { pattern: /\b(clen|clean|cleen)\s+(energy|enrgy)\b/gi, replacement: 'clean energy' },
    { pattern: /\b(gren|green|grean)\s+(energy|enrgy)\b/gi, replacement: 'green energy' },
    
    // Nuclear energy patterns
    { pattern: /\b(nucler|nucelar|nuclear)\s+(energy|enrgy|power|powr)\b/gi, replacement: 'nuclear energy' },
    { pattern: /\b(atomic|atomc)\s+(energy|enrgy|power|powr)\b/gi, replacement: 'atomic energy' },
    
    // Natural gas patterns
    { pattern: /\b(natual|natuarl|natural)\s+(gas|gass|ga)\b/gi, replacement: 'natural gas' },
    { pattern: /\b(liqufied|liquified|liquefied)\s+(natual|natural)\s+(gas|gass)\b/gi, replacement: 'liquefied natural gas' },
    
    // Oil patterns
    { pattern: /\b(crud|crude|crued)\s+(oil|oill|ol)\b/gi, replacement: 'crude oil' },
    { pattern: /\b(petrolum|petroleum|petrolium)\s+(products?)\b/gi, replacement: 'petroleum products' },
    
    // Energy processes
    { pattern: /\b(energy|enrgy)\s+(consuption|consumtion|consumption)\b/gi, replacement: 'energy consumption' },
    { pattern: /\b(energy|enrgy)\s+(producion|production|producton)\b/gi, replacement: 'energy production' },
    { pattern: /\b(energy|enrgy)\s+(generaton|generation|genertion)\b/gi, replacement: 'energy generation' },
    { pattern: /\b(energy|enrgy)\s+(suply|supply|suplly)\b/gi, replacement: 'energy supply' },
    { pattern: /\b(energy|enrgy)\s+(demnd|demand|deman)\b/gi, replacement: 'energy demand' },
    
    // Electricity patterns
    { pattern: /\b(electricty|electricity|electrcity)\s+(generaton|generation)\b/gi, replacement: 'electricity generation' },
    { pattern: /\b(electricty|electricity|electrcity)\s+(consuption|consumption)\b/gi, replacement: 'electricity consumption' },
    { pattern: /\b(electricty|electricity|electrcity)\s+(producion|production)\b/gi, replacement: 'electricity production' }
  ],

  // Country-specific patterns for common typos
  countryPatterns: [
    { pattern: /\b(protugal|protugual|potugal|portugual|portugl)\b/gi, replacement: 'portugal' },
    { pattern: /\b(spian|psain|sapain|span|spai)\b/gi, replacement: 'spain' },
    { pattern: /\b(frnace|franec|fracne|frane|franc)\b/gi, replacement: 'france' },
    { pattern: /\b(germay|geramny|germnay|germny|german)\b/gi, replacement: 'germany' },
    { pattern: /\b(itlay|itayl|ialy|ital|itly)\b/gi, replacement: 'italy' },
    { pattern: /\b(netherlnds|netherland|netherlads|netherlnads)\b/gi, replacement: 'netherlands' },
    { pattern: /\b(belguim|belgum|belgim|belgiu)\b/gi, replacement: 'belgium' },
    { pattern: /\b(austira|austia|austriaa|austra)\b/gi, replacement: 'austria' },
    { pattern: /\b(polan|poalnd|polnd|poand)\b/gi, replacement: 'poland' },
    { pattern: /\b(swden|sweed|sweedn|swede)\b/gi, replacement: 'sweden' },
    { pattern: /\b(denmar|denmatk|denmrk|denmar)\b/gi, replacement: 'denmark' }
  ]
};

/**
 * Apply context-aware phrase corrections to text
 * @param {string} text - The text to correct
 * @returns {string} - The corrected text
 */
export const applyPhraseCorrections = (text) => {
  let correctedText = text;
  
  // Combine all pattern arrays
  const allPatterns = [
    ...PHRASE_CORRECTIONS.timePatterns,
    ...PHRASE_CORRECTIONS.energyPatterns,
    ...PHRASE_CORRECTIONS.countryPatterns
  ];
  
  // Apply each pattern correction
  allPatterns.forEach(({ pattern, replacement }) => {
    if (pattern.test(correctedText)) {
      const before = correctedText;
      correctedText = correctedText.replace(pattern, replacement);
      if (before !== correctedText) {
        console.log(`🔧 Phrase correction: "${before}" → "${correctedText}"`);
      }
    }
  });
  
  return correctedText;
};

/**
 * Get all available phrase patterns for debugging
 * @returns {object} Object containing pattern categories and counts
 */
export const getPhrasePatternStats = () => {
  return {
    timePatterns: PHRASE_CORRECTIONS.timePatterns.length,
    energyPatterns: PHRASE_CORRECTIONS.energyPatterns.length,
    countryPatterns: PHRASE_CORRECTIONS.countryPatterns.length,
    totalPatterns: PHRASE_CORRECTIONS.timePatterns.length + 
                   PHRASE_CORRECTIONS.energyPatterns.length + 
                   PHRASE_CORRECTIONS.countryPatterns.length
  };
};
