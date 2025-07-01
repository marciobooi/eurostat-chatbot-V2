
/**
 * Multilingual farewell words and responses
 * Supports English, French, and German
 */

import i18n from '../i18n/index.js';

const goodbyeWordsData = {
  en: [
    "goodbye",
    "see you",
    "farewell",
    "bye",
    "later",
    "so long",
    "take care",
    "cheerio",
    "bye bye",
    "catch you",
    "peace out",
    "ta-ta",
    "see ya",
    "toodle-oo",
    "cheers",
    "till then",
    "have a good day",
    "have a nice day",
    "talk to you later",
    "until next time"
  ],
  
  fr: [
    "au revoir",
    "à bientôt",
    "adieu",
    "salut",
    "à plus tard",
    "à la prochaine",
    "prenez soin de vous",
    "ciao",
    "bye",
    "à plus",
    "bonne journée",
    "bonne soirée",
    "passez une bonne journée",
    "à tout à l'heure",
    "on se revoit",
    "jusqu'à la prochaine fois",
    "portez-vous bien",
    "bonne continuation",
    "merci et au revoir",
    "tchao"
  ],
  
  de: [
    "auf wiedersehen",
    "bis bald",
    "tschüss",
    "servus",
    "bis später",
    "machs gut",
    "ciao",
    "bye",
    "bis dann",
    "schönen tag noch",
    "guten tag noch",
    "bis zum nächsten mal",
    "alles gute",
    "tschau",
    "wir sehen uns",
    "bis die tage",
    "pfüati",
    "ade",
    "leben sie wohl",
    "mach's gut"
  ]
};

const farewellResponsesData = {
  en: [
    "Goodbye! Feel free to come back if you have more questions.",
    "Thanks for chatting! Have a great day.",
    "See you next time! Feel free to return if you need more information.",
    "Farewell! Don't hesitate to ask more energy questions later.",
    "Thank you for using our service. Goodbye!",
    "Take care! I'm here whenever you need assistance.",
    "Have a great day! Come back anytime.",
    "It was a pleasure chatting with you. See you soon!",
    "Goodbye for now! Let me know if you ever need help.",
    "Wishing you all the best! See you next time."
  ],
  
  fr: [
    "Au revoir ! N'hésitez pas à revenir si vous avez d'autres questions.",
    "Merci d'avoir discuté ! Passez une excellente journée.",
    "À la prochaine ! N'hésitez pas à revenir si vous avez besoin de plus d'informations.",
    "Adieu ! N'hésitez pas à poser d'autres questions énergétiques plus tard.",
    "Merci d'avoir utilisé notre service. Au revoir !",
    "Prenez soin de vous! Je suis là quand vous avez besoin d'aide.",
    "Passez une excellente journée ! Revenez quand vous voulez.",
    "C'était un plaisir de discuter avec vous. À bientôt !",
    "Au revoir pour l'instant ! Faites-moi savoir si vous avez besoin d'aide.",
    "Je vous souhaite le meilleur ! À la prochaine fois."
  ],
  
  de: [
    "Auf Wiedersehen! Kommen Sie gerne zurück, wenn Sie weitere Fragen haben.",
    "Danke fürs Chatten! Haben Sie einen schönen Tag.",
    "Bis zum nächsten Mal! Kommen Sie gerne zurück, wenn Sie mehr Informationen brauchen.",
    "Auf Wiedersehen! Zögern Sie nicht, später weitere Energiefragen zu stellen.",
    "Vielen Dank für die Nutzung unseres Services. Auf Wiedersehen!",
    "Machen Sie's gut! Ich bin da, wann immer Sie Hilfe brauchen.",
    "Haben Sie einen schönen Tag! Kommen Sie jederzeit zurück.",
    "Es war mir eine Freude, mit Ihnen zu chatten. Bis bald!",
    "Auf Wiedersehen erstmal! Lassen Sie mich wissen, wenn Sie Hilfe brauchen.",
    "Alles Gute für Sie! Bis zum nächsten Mal."
  ]
};

// Function to get goodbye words for current language
export const getGoodbyeWords = () => {
  const currentLanguage = i18n.language || 'en';
  return goodbyeWordsData[currentLanguage] || goodbyeWordsData.en;
};

// Function to get farewell responses for current language
export const getFarewellResponses = () => {
  const currentLanguage = i18n.language || 'en';
  return farewellResponsesData[currentLanguage] || farewellResponsesData.en;
};

// Legacy exports for backward compatibility - return full multilingual data
export const goodbyeWords = goodbyeWordsData;

export const FAREWELL_RESPONSES = farewellResponsesData;
