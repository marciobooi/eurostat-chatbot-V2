import { getRandomFromArray } from './random';

const welcomeMessages = {
  en: [
    'Hello! How can I help you with energy statistics?',
    'Hi there! I can provide information about energy consumption and production.',
    'Greetings! Need help with energy statistics? I\'m your assistant.',
    'Welcome! How may I assist you with energy data today?'
  ],
  fr: [
    'Bonjour ! Comment puis-je vous aider avec les statistiques énergétiques ?',
    'Salut ! Je peux vous fournir des informations sur la consommation et la production d\'énergie.',
    'Bienvenue ! Besoin d\'aide avec les statistiques énergétiques ?'
  ],
  de: [
    'Hallo! Wie kann ich Ihnen mit Energiestatistiken helfen?',
    'Guten Tag! Ich kann Ihnen Informationen über Energieverbrauch und -produktion geben.',
    'Willkommen! Brauchen Sie Hilfe mit Energiestatistiken?'
  ]
};

const unknownResponses = {
  en: [
    'I specialize in energy statistics. Could you rephrase your question about energy data?',
    'That\'s beyond my knowledge, but feel free to ask me about energy consumption or production.',
    'I\'m focused on energy topics. How can I help you with energy-related questions?'
  ],
  fr: [
    'Je suis spécialisé dans les statistiques énergétiques. Pourriez-vous reformuler votre question ?',
    'Cela dépasse mes connaissances, mais n\'hésitez pas à me poser des questions sur l\'énergie.',
    'Je me concentre sur les sujets énergétiques. Comment puis-je vous aider ?'
  ],
  de: [
    'Ich bin auf Energiestatistiken spezialisiert. Könnten Sie Ihre Frage zur Energie umformulieren?',
    'Das übersteigt mein Wissen, aber fragen Sie mich gerne zur Energienutzung oder -produktion.',
    'Ich konzentriere mich auf Energiethemen. Wie kann ich Ihnen mit energiebezogenen Fragen helfen?'
  ]
};

export const getRandomWelcomeMessage = (language = 'en') => {
  const messages = welcomeMessages[language] || welcomeMessages.en;
  return getRandomFromArray(messages);
};

export const getRandomUnknownResponse = (language = 'en') => {
  const responses = unknownResponses[language] || unknownResponses.en;
  return getRandomFromArray(responses);
};
