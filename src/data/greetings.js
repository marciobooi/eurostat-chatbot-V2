/**
 * Multilingual greeting words and responses
 * Supports English, French, and German
 */

import i18n from '../i18n/index.js';

const greetingWordsData = {
  en: [
    'hi',
    'hello',
    'hey',
    'hiya',
    'howdy',
    'yo',
    'sup',
    'wassup',
    'what\'s up',
    'whatsup',
    'hey there',
    'hi there',
    'hello there',
    'good morning',
    'morning',
    'good afternoon',
    'afternoon',
    'good evening',
    'evening',
    'good day',
    'have a good day',
    'good night',
    'night',
    'what\'s good',
    'what\'s happening',
    'what\'s cracking',
    'how\'s it going',
    'how are you',
    'how you doing',
    'how\'s everything',
    'how\'s life',
    'how\'s things',
    'how\'s your day',
    'how\'s your morning',
    'how\'s your afternoon',
    'how\'s your evening',
    'greetings',
    'salutations',
    'pleased to meet you',
    'nice to meet you',
    'it\'s a pleasure to meet you',
    'how do you do',
    'welcome',
    'hallo',
    'g\'day',
    'top of the morning',
    'good to see you',
    'nice seeing you',
    'long time no see',
    'what\'s new',
    'how\'s tricks',
    'how goes it',
    'how\'s your week',
    'how\'s work',
    'how\'s the day treating you',
    'how\'s the weather',
    'lovely day',
    'beautiful day',
    'hope you\'re well',
    'hope you\'re doing well',
    'how have you been',
    'it\'s been a while',
    'good to hear from you',
    'thanks for stopping by'
  ],
  
  fr: [
    'salut',
    'bonjour',
    'bonsoir',
    'bonne nuit',
    'coucou',
    'allô',
    'hé',
    'hey',
    'bonjour là',
    'salut là',
    'bon matin',
    'matin',
    'bon après-midi',
    'après-midi',
    'bonne soirée',
    'soirée',
    'bonne journée',
    'journée',
    'quoi de neuf',
    'comment ça va',
    'comment allez-vous',
    'comment vous allez',
    'ça va',
    'comment ça se passe',
    'comment vous portez-vous',
    'comment vous sentez-vous',
    'salutations',
    'enchanté',
    'ravi de vous rencontrer',
    'plaisir de vous rencontrer',
    'bienvenue',
    'comment allez-vous aujourd\'hui',
    'passez une bonne journée',
    'bonne chance',
    'à bientôt',
    'comment était votre journée',
    'j\'espère que vous allez bien',
    'content de vous voir',
    'ça fait longtemps',
    'quelles nouvelles',
    'comment se porte le travail',
    'belle journée',
    'magnifique journée'
  ],
  
  de: [
    'hallo',
    'hi',
    'hey',
    'guten tag',
    'guten morgen',
    'morgen',
    'guten abend',
    'abend',
    'gute nacht',
    'nacht',
    'servus',
    'moin',
    'tach',
    'was geht',
    'wie geht\'s',
    'wie geht es ihnen',
    'wie geht es dir',
    'alles klar',
    'wie läuft\'s',
    'wie steht\'s',
    'grüß gott',
    'grüße',
    'freut mich',
    'schön sie zu treffen',
    'willkommen',
    'wie war ihr tag',
    'haben sie einen schönen tag',
    'schönen tag noch',
    'wie fühlen sie sich',
    'ich hoffe es geht ihnen gut',
    'schön sie zu sehen',
    'lange nicht gesehen',
    'was gibt\'s neues',
    'wie war die arbeit',
    'schöner tag',
    'herrlicher tag',
    'alles in ordnung'
  ]
};

const greetingResponsesData = {
  en: [
    'Hello! How can I assist you with Eurostat energy statistics today?',
    'Hi there! I am here to help you explore energy data, definitions, and classifications.',
    'Greetings! Feel free to ask me about fuel codes, energy balances, or any Eurostat energy topic.',
    'Welcome! I can help you navigate Eurostat energy terminology and statistical standards.',
    'Good to see you! Let me know what energy-related information you are looking for.',
    'Hello and welcome! I am your assistant for all things related to Eurostat energy data.',
    'Hi! Whether it is fuel codes or energy balances, I am here to help you understand the data.',
    'Welcome to the Eurostat Energy Assistant. What would you like to learn about today?',
    'Hello! I am ready to support your energy data exploration—just ask your question.',
    'Hi! I can provide insights into Eurostat energy classifications, definitions, and methodology.',
    'Hello! I am here to make Eurostat energy statistics easier to understand—how can I help?',
    'Welcome! I specialize in energy data and definitions used across the EU. What would you like to explore?',
    'Hi there! If you have questions about energy balances, fuel types, or statistical methods, I am here to assist.',
    'Greetings! I can help clarify Eurostat energy indicators, classifications, and reporting standards.',
    'Hello! Let us make sense of energy data together. What would you like to know today?',
    'Nice to meet you! I am your guide to Eurostat energy statistics and definitions.',
    'Hey! Ready to dive into energy data? I can help with fuel codes, definitions, and more.',
    'Good day! I am here to assist with any Eurostat energy-related questions you might have.',
    'Hello! Whether you need fuel classifications or energy balance explanations, I have got you covered.',
    'Hi! I am equipped to help with Eurostat energy methodology and statistical frameworks.'
  ],
  
  fr: [
    'Bonjour ! Comment puis-je vous aider avec les statistiques énergétiques d\'Eurostat aujourd\'hui ?',
    'Salut ! Je suis là pour vous aider à explorer les données, définitions et classifications énergétiques.',
    'Bonjour ! N\'hésitez pas à me poser des questions sur les codes de combustibles, les bilans énergétiques ou tout sujet énergétique d\'Eurostat.',
    'Bienvenue ! Je peux vous aider à naviguer dans la terminologie énergétique et les normes statistiques d\'Eurostat.',
    'Ravi de vous voir ! Dites-moi quelles informations énergétiques vous recherchez.',
    'Bonjour et bienvenue ! Je suis votre assistant pour tout ce qui concerne les données énergétiques d\'Eurostat.',
    'Salut ! Qu\'il s\'agisse de codes de combustibles ou de bilans énergétiques, je suis là pour vous aider à comprendre les données.',
    'Bienvenue à l\'Assistant Énergétique d\'Eurostat. Que souhaiteriez-vous apprendre aujourd\'hui ?',
    'Bonjour ! Je suis prêt à soutenir votre exploration des données énergétiques—posez simplement votre question.',
    'Salut ! Je peux fournir des insights sur les classifications, définitions et méthodologies énergétiques d\'Eurostat.',
    'Bonjour ! Je suis là pour rendre les statistiques énergétiques d\'Eurostat plus faciles à comprendre—comment puis-je aider ?',
    'Bienvenue ! Je me spécialise dans les données et définitions énergétiques utilisées dans l\'UE. Que souhaiteriez-vous explorer ?',
    'Salut ! Si vous avez des questions sur les bilans énergétiques, les types de combustibles ou les méthodes statistiques, je suis là pour vous aider.',
    'Bonjour ! Je peux clarifier les indicateurs énergétiques, classifications et normes de reporting d\'Eurostat.',
    'Bonjour ! Donnons ensemble un sens aux données énergétiques. Que souhaiteriez-vous savoir aujourd\'hui ?'
  ],
  
  de: [
    'Hallo! Wie kann ich Ihnen heute bei Eurostat-Energiestatistiken helfen?',
    'Hi! Ich bin hier, um Ihnen bei der Erkundung von Energiedaten, Definitionen und Klassifizierungen zu helfen.',
    'Grüße! Fragen Sie mich gerne nach Kraftstoffcodes, Energiebilanzen oder jedem Eurostat-Energiethema.',
    'Willkommen! Ich kann Ihnen bei der Navigation durch Eurostat-Energieterminologie und statistische Standards helfen.',
    'Schön, Sie zu sehen! Lassen Sie mich wissen, welche energiebezogenen Informationen Sie suchen.',
    'Hallo und willkommen! Ich bin Ihr Assistent für alles rund um Eurostat-Energiedaten.',
    'Hi! Ob es um Kraftstoffcodes oder Energiebilanzen geht, ich bin hier, um Ihnen beim Verständnis der Daten zu helfen.',
    'Willkommen beim Eurostat-Energie-Assistenten. Was möchten Sie heute lernen?',
    'Hallo! Ich bin bereit, Ihre Energiedaten-Erkundung zu unterstützen—stellen Sie einfach Ihre Frage.',
    'Hi! Ich kann Einblicke in Eurostat-Energieklassifizierungen, Definitionen und Methodik liefern.',
    'Hallo! Ich bin hier, um Eurostat-Energiestatistiken verständlicher zu machen—wie kann ich helfen?',
    'Willkommen! Ich spezialisiere mich auf Energiedaten und Definitionen, die in der EU verwendet werden. Was möchten Sie erkunden?',
    'Hi! Wenn Sie Fragen zu Energiebilanzen, Kraftstofftypen oder statistischen Methoden haben, bin ich hier, um zu helfen.',
    'Grüße! Ich kann Eurostat-Energieindikatoren, Klassifizierungen und Berichtsstandards klären.',
    'Hallo! Lassen Sie uns gemeinsam Energiedaten verstehen. Was möchten Sie heute wissen?'
  ]
};

// Function to get greeting words for current language
export const getGreetingWords = () => {
  const currentLanguage = i18n.language || 'en';
  return greetingWordsData[currentLanguage] || greetingWordsData.en;
};

// Function to get greeting responses for current language
export const getGreetingResponses = () => {
  const currentLanguage = i18n.language || 'en';
  return greetingResponsesData[currentLanguage] || greetingResponsesData.en;
};

// Legacy exports for backward compatibility
export const GREETING_WORDS = {
  en: getGreetingWords()
};

export const GREETING_RESPONSES = {
  en: getGreetingResponses()
};
