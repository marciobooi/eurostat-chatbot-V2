export const MIN_WORD_LENGTH = 2;

// Language-specific stop words and common words to filter out
export const filteredWords = {
  en: [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
    'tell', 'can', 'just', 'could', 'these', 'know', 'into', 'your', 'then',
    'like', 'other', 'how', 'its', 'our', 'two', 'more', 'want', 'way', 'look',
    'first', 'also', 'new', 'because', 'day', 'use', 'no', 'man', 'find', 'here',
    'thing', 'give', 'many', 'well', 'only', 'those', 'see', 'take', 'when', 'which',
    'now', 'people', 'year', 'good', 'some', 'them', 'than', 'then', 'over', 'say'
  ],
  fr: [
    'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'ce', 'ces',
    'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'mon', 'ton',
    'son', 'notre', 'votre', 'leur', 'mes', 'tes', 'ses', 'nos', 'vos', 'leurs',
    'que', 'qui', 'quoi', 'dont', 'où', 'quand', 'comment', 'pourquoi', 'quel', 'quelle',
    'et', 'ou', 'mais', 'donc', 'car', 'ni', 'or', 'par', 'pour', 'en',
    'dans', 'sur', 'sous', 'avec', 'sans', 'chez', 'vers', 'avant', 'après', 'depuis',
    'être', 'avoir', 'faire', 'dire', 'aller', 'voir', 'vouloir', 'pouvoir', 'falloir', 'devoir',
    'très', 'bien', 'plus', 'moins', 'peu', 'beaucoup', 'trop', 'assez', 'tout', 'rien',
    'même', 'aussi', 'autre', 'encore', 'toujours', 'jamais', 'déjà', 'ici', 'là', 'puis',
    'oui', 'non', 'peut-être', 'certainement', 'probablement', 'sûrement', 'maintenant', 'alors', 'donc', 'cependant'
  ],
  de: [
    'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einer', 'einem',
    'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'sie', 'mein', 'dein',
    'sein', 'ihr', 'unser', 'euer', 'ihr', 'dieser', 'diese', 'dieses', 'jener', 'jene',
    'und', 'oder', 'aber', 'sondern', 'denn', 'weil', 'dass', 'ob', 'wenn', 'falls',
    'in', 'an', 'auf', 'bei', 'mit', 'nach', 'seit', 'von', 'aus', 'zu',
    'zur', 'zum', 'zur', 'ins', 'im', 'am', 'beim', 'vom', 'zum', 'zur',
    'sein', 'haben', 'werden', 'können', 'müssen', 'sollen', 'wollen', 'mögen', 'dürfen', 'lassen',
    'sehr', 'viel', 'mehr', 'weniger', 'ganz', 'halb', 'einig', 'manche', 'solche', 'andere',
    'hier', 'dort', 'da', 'hin', 'her', 'weg', 'fort', 'zurück', 'auf', 'ab',
    'ja', 'nein', 'vielleicht', 'wahrscheinlich', 'sicher', 'bestimmt', 'jetzt', 'gleich', 'bald', 'schon'
  ]
};

// Common prefixes and suffixes to filter across languages
export const commonAffixes = {
  prefixes: ['re', 'un', 'in', 'dis', 'en', 'non', 'pre', 'pro', 'anti'],
  suffixes: ['ly', 'ing', 'ed', 'ment', 'tion', 'able', 'ible', 'ful', 'less', 'ness']
};

// Language-specific minimum word lengths
export const minWordLengths = {
  en: 3,
  fr: 3,
  de: 4
};

// Helper function to check if a word is too short for its language
export const isWordTooShort = (word, language) => {
  const minLength = minWordLengths[language] || MIN_WORD_LENGTH;
  return word.length < minLength;
};