/**
 * Common words in different languages
 * Used for language detection and processing
 */

export const commonWords = {
  en: [
    // Articles
    'a', 'an', 'the',
    
    // Pronouns
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 
    'me', 'him', 'her', 'us', 'them',
    'my', 'your', 'his', 'her', 'its', 'our', 'their',
    'mine', 'yours', 'hers', 'ours', 'theirs',
    'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'themselves',
    'this', 'that', 'these', 'those',
    
    // Prepositions
    'in', 'on', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
    'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from',
    
    // Conjunctions
    'and', 'but', 'or', 'nor', 'so', 'yet', 'because', 'although', 'since', 'unless',
    'if', 'when', 'where', 'while', 'though',
    
    // Common verbs
    'be', 'am', 'is', 'are', 'was', 'were', 'been', 'being',
    'have', 'has', 'had', 'having',
    'do', 'does', 'did', 'done', 'doing',
    'can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must',
    'go', 'goes', 'went', 'gone', 'going',
    'know', 'knows', 'knew', 'known', 'knowing',
    'think', 'thinks', 'thought', 'thinking',
    'say', 'says', 'said', 'saying',
    'see', 'sees', 'saw', 'seen', 'seeing',
    'get', 'gets', 'got', 'getting',
    
    // Time indicators
    'now', 'today', 'tomorrow', 'yesterday', 'soon', 'later', 'then',
    
    // Place indicators
    'here', 'there', 'everywhere', 'somewhere', 'nowhere',
    
    // Frequency indicators
    'always', 'never', 'sometimes', 'often', 'rarely', 'usually', 'occasionally'
  ],
  
  fr: [
    // Articles
    'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'ce', 'cette', 'ces',
    
    // Pronouns
    'je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles',
    'me', 'te', 'se', 'lui', 'nous', 'vous', 'leur',
    'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses',
    'notre', 'nos', 'votre', 'vos', 'leur', 'leurs',
    'moi', 'toi', 'lui', 'elle', 'nous', 'vous', 'eux', 'elles',
    'moi-même', 'toi-même', 'lui-même', 'elle-même', 'nous-mêmes', 'vous-mêmes', 'eux-mêmes', 'elles-mêmes',
    'ce', 'cela', 'ceci', 'celui', 'celle', 'ceux', 'celles',
    
    // Prepositions
    'à', 'de', 'en', 'dans', 'sur', 'sous', 'par', 'pour', 'avec', 'sans', 'contre',
    'avant', 'après', 'pendant', 'depuis', 'jusqu`à', 'vers', 'entre',
    
    // Conjunctions
    'et', 'ou', 'mais', 'donc', 'car', 'ni', 'or', 'pourtant', 'cependant', 'néanmoins',
    'si', 'quand', 'comme', 'lorsque', 'puisque', 'quoique', 'bien que',
    
    // Common verbs
    'être', 'suis', 'es', 'est', 'sommes', 'êtes', 'sont', 'étais', 'était', 'étions', 'étiez', 'étaient',
    'avoir', 'ai', 'as', 'a', 'avons', 'avez', 'ont', 'avais', 'avait', 'avions', 'aviez', 'avaient',
    'faire', 'fais', 'fait', 'faisons', 'faites', 'font',
    'aller', 'vais', 'vas', 'va', 'allons', 'allez', 'vont',
    'dire', 'dis', 'dit', 'disons', 'dites', 'disent',
    'voir', 'vois', 'voit', 'voyons', 'voyez', 'voient',
    'pouvoir', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent',
    'vouloir', 'veux', 'veut', 'voulons', 'voulez', 'veulent',
    'devoir', 'dois', 'doit', 'devons', 'devez', 'doivent',
    'savoir', 'sais', 'sait', 'savons', 'savez', 'savent',
    
    // Time indicators
    'maintenant', 'aujourd`hui', 'demain', 'hier', 'bientôt', 'plus tard', 'alors',
    
    // Place indicators
    'ici', 'là', 'partout', 'quelque part', 'nulle part',
    
    // Frequency indicators
    'toujours', 'jamais', 'parfois', 'souvent', 'rarement', 'habituellement', 'occasionnellement'
  ],
  
  de: [
    // Articles
    'der', 'die', 'das', 'ein', 'eine', 'eines', 'einer', 'einem', 'einen',
    
    // Pronouns
    'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'sie',
    'mich', 'dich', 'ihn', 'uns', 'euch', 'ihnen',
    'mein', 'dein', 'sein', 'ihr', 'unser', 'euer', 'ihr',
    'meiner', 'deiner', 'seiner', 'ihrer', 'unserer', 'eurer', 'ihrer',
    'mir', 'dir', 'ihm', 'ihr', 'uns', 'euch', 'ihnen',
    'dieser', 'diese', 'dieses', 'jener', 'jene', 'jenes',
    'selbst', 'mich selbst', 'dich selbst', 'sich selbst', 'uns selbst', 'euch selbst', 'sich selbst',
    
    // Prepositions
    'in', 'an', 'auf', 'über', 'unter', 'vor', 'hinter', 'neben', 'zwischen',
    'mit', 'ohne', 'für', 'gegen', 'aus', 'bei', 'nach', 'von', 'zu', 'um',
    
    // Conjunctions
    'und', 'oder', 'aber', 'denn', 'weil', 'wenn', 'als', 'ob', 'dass', 'obwohl',
    'während', 'bevor', 'nachdem', 'seit', 'damit', 'sodass', 'falls', 'sofern',
    
    // Common verbs
    'sein', 'bin', 'bist', 'ist', 'sind', 'seid', 'war', 'warst', 'waren', 'wart',
    'haben', 'habe', 'hast', 'hat', 'haben', 'habt', 'hatte', 'hattest', 'hatten', 'hattet',
    'werden', 'werde', 'wirst', 'wird', 'werden', 'werdet',
    'können', 'kann', 'kannst', 'können', 'könnt',
    'müssen', 'muss', 'musst', 'müssen', 'müsst',
    'sollen', 'soll', 'sollst', 'sollen', 'sollt',
    'wollen', 'will', 'willst', 'wollen', 'wollt',
    'mögen', 'mag', 'magst', 'mögen', 'mögt',
    'gehen', 'gehe', 'gehst', 'geht',
    'kommen', 'komme', 'kommst', 'kommt',
    'machen', 'mache', 'machst', 'macht',
    'sagen', 'sage', 'sagst', 'sagt',
    'sehen', 'sehe', 'siehst', 'sieht',
    
    // Time indicators
    'jetzt', 'heute', 'morgen', 'gestern', 'bald', 'später', 'dann',
    
    // Place indicators
    'hier', 'dort', 'überall', 'irgendwo', 'nirgendwo',
    
    // Frequency indicators  
    'immer', 'nie', 'manchmal', 'oft', 'selten', 'gewöhnlich', 'gelegentlich'
  ]
};

/**
 * Get common words for a specific language
 * @param {string} language - Language code
 * @returns {string[]} Array of common words for the language
 */
export const getCommonWords = (language = 'en') => {
  return commonWords[language] || commonWords.en;
};

export default commonWords;
