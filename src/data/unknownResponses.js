import { getRandomFromArray } from '../utils/random';

export const unknownResponses = {
  en: [
    "I don't have specific information about that, but I can help you with energy-related questions.",
    "I'm not familiar with that specific topic. Could you ask me about energy statistics instead?",
    "While I don't know about that, I'd be happy to help you with energy data and statistics.",
    "That's beyond my knowledge, but feel free to ask me about energy consumption or production.",
    "I specialize in energy statistics. Could you rephrase your question about energy data?",
    "I'm not sure about that, but I can provide information about energy-related topics.",
    "Let me help you with energy statistics instead. What would you like to know?"
  ],
  fr: [
    "Je n'ai pas d'informations spécifiques à ce sujet, mais je peux vous aider avec des questions liées à l'énergie.",
    "Je ne connais pas ce sujet spécifique. Pourriez-vous me poser des questions sur les statistiques énergétiques ?",
    "Bien que je ne sache pas cela, je peux vous aider avec les données énergétiques.",
    "Cela dépasse mes connaissances, mais n'hésitez pas à me poser des questions sur la consommation ou la production d'énergie.",
    "Je suis spécialisé dans les statistiques énergétiques. Pourriez-vous reformuler votre question sur les données énergétiques ?",
    "Je ne suis pas sûr de cela, mais je peux vous fournir des informations sur les sujets liés à l'énergie.",
    "Laissez-moi plutôt vous aider avec les statistiques énergétiques. Que souhaitez-vous savoir ?"
  ],
  de: [
    "Ich habe keine spezifischen Informationen dazu, aber ich kann Ihnen bei Fragen zur Energie helfen.",
    "Dieses spezielle Thema kenne ich nicht. Könnten Sie mich stattdessen zur Energiestatistik befragen?",
    "Obwohl ich das nicht weiß, kann ich Ihnen gerne bei Energiedaten helfen.",
    "Das geht über mein Wissen hinaus, aber fragen Sie mich gerne zur Energieverbrauch oder -produktion.",
    "Ich bin auf Energiestatistik spezialisiert. Könnten Sie Ihre Frage zu Energiedaten umformulieren?",
    "Ich bin mir da nicht sicher, aber ich kann Ihnen Informationen zu energiebezogenen Themen geben.",
    "Lassen Sie mich Ihnen stattdessen mit Energiestatistiken helfen. Was möchten Sie wissen?"
  ]
};

// We don't need to export this function as it's now handled in randomResponses.js
