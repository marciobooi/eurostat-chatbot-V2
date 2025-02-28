const affirmativeResponses = {
  en: ['yes', 'YES', 'Yes', 'sure', 'Sure', 'okay', 'Okay', 'OK', 'ok', 'yeah', 'Yeah', 'yep', 'Yep', 'absolutely', 'Absolutely', 'of course', 'Of course', 'continue', 'Continue'],
  fr: ['oui', 'OUI', 'Oui', 'bien sûr', 'Bien sûr', 'd\'accord', 'D\'accord', 'ok', 'OK', 'ouais', 'Ouais', 'absolument', 'Absolument'],
  de: ['ja', 'JA', 'Ja', 'sicher', 'Sicher', 'okay', 'Okay', 'OK', 'ok', 'natürlich', 'Natürlich']
};

const normalizeText = (text) => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-zA-Z0-9\s]/g, '') // Keep uppercase letters
    .replace(/\s+/g, ' ')
    .trim();
};

export const isAffirmative = (input, language = 'en') => {
  if (!input) return false;
  
  const normalizedInput = normalizeText(input);
  const responses = affirmativeResponses[language] || affirmativeResponses.en;
  
  return responses.some(response => {
    const normalizedResponse = normalizeText(response);
    return normalizedInput.toLowerCase() === normalizedResponse.toLowerCase() ||
           normalizedInput.toLowerCase().startsWith(normalizedResponse.toLowerCase());
  });
};
