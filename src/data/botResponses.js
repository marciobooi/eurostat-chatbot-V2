/**
 * General chatbot responses categorized by type and language
 */
export const botResponses = {
  greeting: {
    en: [
      "Hello! How can I assist you today?",
      "Hi there! I'm ready to help with your energy questions.",
      "Welcome! What would you like to know about energy statistics?",
    ],
    fr: [
      "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
      "Salut ! Je suis prêt à répondre à vos questions sur l'énergie.",
      "Bienvenue ! Que souhaitez-vous savoir sur les statistiques énergétiques ?",
    ],
    de: [
      "Hallo! Wie kann ich Ihnen heute helfen?",
      "Guten Tag! Ich bin bereit, Ihre Fragen zur Energie zu beantworten.",
      "Willkommen! Was möchten Sie über Energiestatistiken wissen?",
    ],
  },
  farewell: {
    en: [
      "Goodbye! Feel free to come back if you have more questions.",
      "Thanks for chatting! Have a great day.",
      "See you next time! Feel free to return if you need more information.",
    ],
    fr: [
      "Au revoir ! N'hésitez pas à revenir si vous avez d'autres questions.",
      "Merci pour cette conversation ! Passez une bonne journée.",
      "À bientôt ! Revenez quand vous voudrez pour plus d'informations.",
    ],
    de: [
      "Auf Wiedersehen! Kommen Sie gerne wieder, wenn Sie weitere Fragen haben.",
      "Danke für das Gespräch! Haben Sie einen schönen Tag.",
      "Bis zum nächsten Mal! Kommen Sie gerne zurück, wenn Sie weitere Informationen benötigen.",
    ],
  },
  gratitude: {
    en: [
      "You're welcome! I'm happy to help.",
      "Glad I could assist you!",
      "It's my pleasure to provide you with information.",
    ],
    fr: [
      "Je vous en prie ! Je suis heureux de vous aider.",
      "Ravi d'avoir pu vous aider !",
      "C'est un plaisir de vous fournir ces informations.",
    ],
    de: [
      "Gern geschehen! Ich helfe gerne.",
      "Ich freue mich, dass ich Ihnen helfen konnte!",
      "Es ist mir ein Vergnügen, Ihnen Informationen zu geben.",
    ],
  },
  confused: {
    en: [
      "I'm not sure I understand. Could you rephrase that?",
      "I'm having trouble understanding your question. Can you try asking differently?",
      "Could you please clarify what you're asking about?",
    ],
    fr: [
      "Je ne suis pas sûr de comprendre. Pourriez-vous reformuler ?",
      "J'ai du mal à comprendre votre question. Pouvez-vous essayer de demander différemment ?",
      "Pourriez-vous préciser ce que vous demandez ?",
    ],
    de: [
      "Ich bin mir nicht sicher, ob ich das verstehe. Könnten Sie das umformulieren?",
      "Ich habe Schwierigkeiten, Ihre Frage zu verstehen. Können Sie versuchen, anders zu fragen?",
      "Könnten Sie bitte klären, wonach Sie fragen?",
    ],
  },
  prompt: {
    en: [
      "Is there something specific about energy you'd like to know?",
      "What aspect of energy statistics are you interested in?",
      "Feel free to ask about oil, gas, renewable energy, or consumption patterns.",
    ],
    fr: [
      "Y a-t-il quelque chose de spécifique sur l'énergie que vous aimeriez savoir ?",
      "Quel aspect des statistiques énergétiques vous intéresse ?",
      "N'hésitez pas à poser des questions sur le pétrole, le gaz, les énergies renouvelables ou les modes de consommation.",
    ],
    de: [
      "Gibt es etwas Bestimmtes über Energie, das Sie wissen möchten?",
      "Welcher Aspekt der Energiestatistik interessiert Sie?",
      "Fragen Sie gerne nach Öl, Gas, erneuerbaren Energien oder Verbrauchsmustern.",
    ],
  },
};

/**
 * Get a formatted response by type and language
 * @param {string} type - Response type
 * @param {string} language - Language code
 * @returns {string} Formatted response
 */
export const getResponseByType = (type, language = "en") => {
  const responses = botResponses[type]?.[language] || botResponses[type]?.en;
  if (!responses || !responses.length) {
    return "I'm here to help with energy statistics.";
  }

  const index = Math.floor(Math.random() * responses.length);
  return responses[index];
};
