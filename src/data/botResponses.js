/**
 * General chatbot responses categorized by type and language
 */
export const botResponses = {
  greeting: {
    en: [
      "Hello! How can I assist you today with energy statistics?",
      "Hi there! I'm ready to help with your energy questions.",
      "Welcome! What would you like to know about energy data?",
      "Greetings! I can provide information on energy consumption, production, and more.",
      "Hello! Ask me about energy statistics and I'll do my best to help.",
    ],
    fr: [
      "Bonjour ! Comment puis-je vous aider aujourd'hui avec les statistiques énergétiques ?",
      "Salut ! Je suis prêt à répondre à vos questions sur l'énergie.",
      "Bienvenue ! Que souhaitez-vous savoir sur les données énergétiques ?",
      "Bonjour ! Je peux vous fournir des informations sur la consommation, la production d'énergie et plus encore.",
      "Bonjour ! Posez-moi des questions sur les statistiques énergétiques et je ferai de mon mieux pour vous aider.",
    ],
    de: [
      "Hallo! Wie kann ich Ihnen heute mit Energiestatistiken helfen?",
      "Guten Tag! Ich bin bereit, Ihre Fragen zur Energie zu beantworten.",
      "Willkommen! Was möchten Sie über Energiedaten wissen?",
      "Grüß Gott! Ich kann Ihnen Informationen zu Energieverbrauch, -produktion und mehr geben.",
      "Hallo! Fragen Sie mich zu Energiestatistiken und ich werde mein Bestes tun, um zu helfen.",
    ],
  },

  farewell: {
    en: [
      "Goodbye! Feel free to come back if you have more questions.",
      "Thanks for chatting! Have a great day.",
      "See you next time! Feel free to return if you need more information.",
      "Farewell! Don't hesitate to ask more energy questions later.",
      "Thank you for using our service. Goodbye!",
    ],
    fr: [
      "Au revoir ! N'hésitez pas à revenir si vous avez d'autres questions.",
      "Merci pour cette conversation ! Passez une bonne journée.",
      "À bientôt ! Revenez quand vous voudrez pour plus d'informations.",
      "Adieu ! N'hésitez pas à poser plus de questions sur l'énergie plus tard.",
      "Merci d'avoir utilisé notre service. Au revoir !",
    ],
    de: [
      "Auf Wiedersehen! Kommen Sie gerne wieder, wenn Sie weitere Fragen haben.",
      "Danke für das Gespräch! Haben Sie einen schönen Tag.",
      "Bis zum nächsten Mal! Kommen Sie gerne zurück, wenn Sie weitere Informationen benötigen.",
      "Auf Wiedersehen! Zögern Sie nicht, später weitere Fragen zur Energie zu stellen.",
      "Vielen Dank für die Nutzung unseres Dienstes. Auf Wiedersehen!",
    ],
  },

  gratitude: {
    en: [
      "You're welcome! I'm happy to help.",
      "Glad I could assist you!",
      "It's my pleasure to provide you with information.",
      "No problem at all! That's what I'm here for.",
      "Happy to be of service!",
    ],
    fr: [
      "Je vous en prie ! Je suis heureux de vous aider.",
      "Ravi d'avoir pu vous aider !",
      "C'est un plaisir de vous fournir ces informations.",
      "Pas de problème ! C'est pour ça que je suis là.",
      "Heureux d'être à votre service !",
    ],
    de: [
      "Gern geschehen! Ich helfe gerne.",
      "Ich freue mich, dass ich Ihnen helfen konnte!",
      "Es ist mir ein Vergnügen, Ihnen Informationen zu geben.",
      "Kein Problem! Dafür bin ich da.",
      "Ich freue mich, Ihnen behilflich sein zu können!",
    ],
  },

  confused: {
    en: [
      "I'm not sure I understand. Could you rephrase that?",
      "I'm having trouble understanding your question. Can you try asking differently?",
      "Could you please clarify what you're asking about?",
      "I'm specialized in energy topics. Can you ask something about energy data?",
      "I don't have information on that topic yet. How about asking about energy consumption or production?",
    ],
    fr: [
      "Je ne suis pas sûr de comprendre. Pourriez-vous reformuler ?",
      "J'ai du mal à comprendre votre question. Pouvez-vous essayer de demander différemment ?",
      "Pourriez-vous préciser ce que vous demandez ?",
      "Je suis spécialisé dans les sujets énergétiques. Pouvez-vous demander quelque chose sur les données énergétiques ?",
      "Je n'ai pas encore d'informations sur ce sujet. Que diriez-vous d'une question sur la consommation ou la production d'énergie ?",
    ],
    de: [
      "Ich bin mir nicht sicher, ob ich das verstehe. Könnten Sie das umformulieren?",
      "Ich habe Schwierigkeiten, Ihre Frage zu verstehen. Können Sie versuchen, anders zu fragen?",
      "Könnten Sie bitte klären, wonach Sie fragen?",
      "Ich bin auf Energiethemen spezialisiert. Können Sie etwas zu Energiedaten fragen?",
      "Ich habe noch keine Informationen zu diesem Thema. Wie wäre es mit einer Frage zum Energieverbrauch oder zur Energieproduktion?",
    ],
  },

  prompt: {
    en: [
      "Is there something specific about energy you'd like to know?",
      "What aspect of energy statistics are you interested in?",
      "Feel free to ask about oil, gas, renewable energy, or consumption patterns.",
      "I can provide data on energy production, consumption, or renewable sources. What interests you?",
      "Would you like to learn about energy trends, fossil fuels, or renewable sources?",
    ],
    fr: [
      "Y a-t-il quelque chose de spécifique sur l'énergie que vous aimeriez savoir ?",
      "Quel aspect des statistiques énergétiques vous intéresse ?",
      "N'hésitez pas à poser des questions sur le pétrole, le gaz, les énergies renouvelables ou les modes de consommation.",
      "Je peux fournir des données sur la production d'énergie, la consommation ou les sources renouvelables. Qu'est-ce qui vous intéresse ?",
      "Souhaitez-vous en savoir plus sur les tendances énergétiques, les combustibles fossiles ou les sources renouvelables ?",
    ],
    de: [
      "Gibt es etwas Bestimmtes über Energie, das Sie wissen möchten?",
      "Welcher Aspekt der Energiestatistik interessiert Sie?",
      "Fragen Sie gerne nach Öl, Gas, erneuerbaren Energien oder Verbrauchsmustern.",
      "Ich kann Daten zur Energieerzeugung, zum Verbrauch oder zu erneuerbaren Quellen liefern. Was interessiert Sie?",
      "Möchten Sie mehr über Energietrends, fossile Brennstoffe oder erneuerbare Quellen erfahren?",
    ],
  },

  thinking: {
    en: [
      "Let me think about that...",
      "Processing your question...",
      "Searching for relevant information...",
      "Analyzing energy data...",
      "Looking that up for you...",
    ],
    fr: [
      "Laissez-moi réfléchir à cela...",
      "Traitement de votre question en cours...",
      "Recherche d'informations pertinentes...",
      "Analyse des données énergétiques...",
      "Je cherche cette information pour vous...",
    ],
    de: [
      "Lassen Sie mich darüber nachdenken...",
      "Verarbeitung Ihrer Frage...",
      "Suche nach relevanten Informationen...",
      "Analyse der Energiedaten...",
      "Ich schaue das für Sie nach...",
    ],
  },

  error: {
    en: [
      "I'm sorry, something went wrong. Could you try again?",
      "I encountered a technical issue. Could you rephrase your question?",
      "Oops! I wasn't able to process that properly. Let's try again.",
      "There was an error in my processing. Could you ask in a different way?",
      "I apologize for the inconvenience. Could we try a different question?",
    ],
    fr: [
      "Je suis désolé, quelque chose s'est mal passé. Pourriez-vous réessayer ?",
      "J'ai rencontré un problème technique. Pourriez-vous reformuler votre question ?",
      "Oups ! Je n'ai pas pu traiter cela correctement. Réessayons.",
      "Il y a eu une erreur dans mon traitement. Pourriez-vous demander d'une autre façon ?",
      "Je m'excuse pour le désagrément. Pourrions-nous essayer une autre question ?",
    ],
    de: [
      "Es tut mir leid, etwas ist schiefgelaufen. Könnten Sie es erneut versuchen?",
      "Ich bin auf ein technisches Problem gestoßen. Könnten Sie Ihre Frage umformulieren?",
      "Hoppla! Ich konnte das nicht richtig verarbeiten. Versuchen wir es noch einmal.",
      "Bei meiner Verarbeitung ist ein Fehler aufgetreten. Könnten Sie anders fragen?",
      "Ich entschuldige mich für die Unannehmlichkeiten. Könnten wir eine andere Frage stellen?",
    ],
  },
};

/**
 * Get a formatted response by type and language
 * @param {string} type - Response type (greeting, farewell, etc.)
 * @param {string} language - Language code
 * @returns {string} Formatted response
 */
export const getResponseByType = (type, language = "en") => {
  const responseCategory = botResponses[type];
  if (!responseCategory) {
    console.warn(`Response category '${type}' not found`);
    return "I'm here to help with energy statistics.";
  }

  const responses = responseCategory[language] || responseCategory.en;
  if (!responses || responses.length === 0) {
    console.warn(`No responses found for '${type}' in language '${language}'`);
    return "I'm here to help with energy statistics.";
  }

  const index = Math.floor(Math.random() * responses.length);
  return responses[index];
};

export default botResponses;
