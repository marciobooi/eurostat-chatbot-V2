// Common question phrases to filter out when extracting topics
export const commonQuestionPhrases = {
  en: [
    'what is',
    'what are',
    'what about',
    'tell me about',
    'can you tell me',
    'do you know',
    'how much',
    'how many',
    'where is',
    'where are',
    'when is',
    'when are',
    'why is',
    'why are',
    'could you',
    'would you',
    'please tell me',
    'i want to know',
    'i would like to know',
    'explain',
    'describe',
    'give me information'
  ],
  fr: [
    'qu\'est-ce que',
    'qu\'est-ce qu\'',
    'qu\'est ce que',
    'qu\'est ce qu\'',
    'que sont',
    'parle-moi de',
    'parlez-moi de',
    'peux-tu me dire',
    'pouvez-vous me dire',
    'sais-tu',
    'savez-vous',
    'combien de',
    'où est',
    'où sont',
    'quand est',
    'quand sont',
    'pourquoi est',
    'pourquoi sont',
    'pourrais-tu',
    'pourriez-vous',
    'dis-moi',
    'dites-moi',
    'je veux savoir',
    'j\'aimerais savoir',
    'explique',
    'expliquez',
    'décris',
    'décrivez',
    'donne-moi des informations',
    'donnez-moi des informations'
  ],
  de: [
    'was ist',
    'was sind',
    'erzähl mir von',
    'erzählen sie mir von',
    'kannst du mir sagen',
    'können sie mir sagen',
    'weißt du',
    'wissen sie',
    'wie viel',
    'wie viele',
    'wo ist',
    'wo sind',
    'wann ist',
    'wann sind',
    'warum ist',
    'warum sind',
    'könntest du',
    'könnten sie',
    'bitte sag mir',
    'bitte sagen sie mir',
    'ich möchte wissen',
    'ich würde gerne wissen',
    'erkläre',
    'erklären sie',
    'beschreibe',
    'beschreiben sie',
    'gib mir informationen',
    'geben sie mir informationen'
  ]
};

// Language-specific question markers
export const questionMarkers = {
  en: ['?', 'what', 'how', 'where', 'when', 'why', 'which', 'who', 'whose', 'whom'],
  fr: ['?', 'que', 'quoi', 'comment', 'où', 'quand', 'pourquoi', 'quel', 'quelle', 'qui'],
  de: ['?', 'was', 'wie', 'wo', 'wann', 'warum', 'welche', 'welcher', 'wer', 'wessen']
};

// Helper function to detect questions in different languages
export const isQuestion = (text, language = 'en') => {
  if (!text) return false;
  
  const markers = questionMarkers[language] || questionMarkers.en;
  const normalizedText = text.toLowerCase().trim();
  
  // Check for question mark or question words
  return text.includes('?') || 
         markers.some(marker => normalizedText.startsWith(marker + ' ')) ||
         commonQuestionPhrases[language]?.some(phrase => 
           normalizedText.includes(phrase.toLowerCase())
         ) || false;
};
