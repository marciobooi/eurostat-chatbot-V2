/**
 * Unknown/Fallback response messages for the chatbot
 * These are used when the chatbot cannot classify the user's intent
 * or when no specific match is found for definition requests
 */

/**
 * Unknown/Fallback response messages for the chatbot
 * These are used when the chatbot cannot classify the user's intent
 * or when no specific match is found for definition requests
 */

import i18n from '../i18n/index.js';

export const UNKNOWN_RESPONSES = {
  en: [
    "I'm here to help with energy-related questions, definitions, and fuel codes. What would you like to know?",
    "I specialize in Eurostat energy statistics and terminology. Could you ask me about a specific energy term or fuel code?",
    "I'm not quite sure what you're looking for. Try asking me about energy definitions, fuel classifications, or energy balance terminology.",
    "I'm designed to help with energy data questions. Could you rephrase your question to focus on energy topics?",
    "Let me help you with energy-related information. What specific energy term, definition, or fuel code would you like to explore?",
    "I'm your Eurostat energy assistant. I can help with energy definitions, fuel codes, and energy balance concepts. What interests you?",
    "I didn't quite catch that. I'm here to assist with energy statistics, definitions, and classifications. What can I help you understand?",
    "I'm focused on helping with Eurostat energy data. Could you ask me about renewable energy, fossil fuels, or energy efficiency topics?",
    "I'm not sure I understood your request. I excel at explaining energy terminology, fuel codes, and statistical definitions. What would you like to learn?",
    "I'm here to make energy data easier to understand. Try asking me about specific energy sources, consumption patterns, or energy balance components."
  ],
  fr: [
    "Je suis là pour vous aider avec les questions liées à l'énergie, les définitions et les codes de combustible. Que souhaitez-vous savoir ?",
    "Je me spécialise dans les statistiques énergétiques d'Eurostat et la terminologie. Pourriez-vous me poser une question sur un terme énergétique spécifique ou un code de combustible ?",
    "Je ne suis pas tout à fait sûr de ce que vous cherchez. Essayez de me poser des questions sur les définitions énergétiques, les classifications de combustibles ou la terminologie du bilan énergétique.",
    "Je suis conçu pour aider avec les questions de données énergétiques. Pourriez-vous reformuler votre question pour vous concentrer sur les sujets énergétiques ?",
    "Laissez-moi vous aider avec les informations liées à l'énergie. Quel terme énergétique, définition ou code de combustible spécifique souhaiteriez-vous explorer ?",
    "Je suis votre assistant énergétique Eurostat. Je peux vous aider avec les définitions énergétiques, les codes de combustible et les concepts de bilan énergétique. Qu'est-ce qui vous intéresse ?",
    "Je n'ai pas tout à fait saisi. Je suis là pour vous aider avec les statistiques énergétiques, les définitions et les classifications. Que puis-je vous aider à comprendre ?",
    "Je me concentre sur l'aide avec les données énergétiques d'Eurostat. Pourriez-vous me poser des questions sur les énergies renouvelables, les combustibles fossiles ou les sujets d'efficacité énergétique ?",
    "Je ne suis pas sûr d'avoir compris votre demande. J'excelle à expliquer la terminologie énergétique, les codes de combustible et les définitions statistiques. Que souhaiteriez-vous apprendre ?",
    "Je suis là pour rendre les données énergétiques plus faciles à comprendre. Essayez de me poser des questions sur des sources d'énergie spécifiques, des modèles de consommation ou des composants du bilan énergétique."
  ],
  de: [
    "Ich bin hier, um bei energiebezogenen Fragen, Definitionen und Brennstoffcodes zu helfen. Was möchten Sie wissen?",
    "Ich spezialisiere mich auf Eurostat-Energiestatistiken und -terminologie. Könnten Sie mir eine Frage zu einem spezifischen Energiebegriff oder Brennstoffcode stellen?",
    "Ich bin mir nicht ganz sicher, wonach Sie suchen. Versuchen Sie, mich nach Energiedefinitionen, Brennstoffklassifikationen oder Energiebilanz-Terminologie zu fragen.",
    "Ich bin darauf ausgelegt, bei Energiedatenfragen zu helfen. Könnten Sie Ihre Frage umformulieren, um sich auf Energiethemen zu konzentrieren?",
    "Lassen Sie mich Ihnen bei energiebezogenen Informationen helfen. Welchen spezifischen Energiebegriff, welche Definition oder welchen Brennstoffcode möchten Sie erkunden?",
    "Ich bin Ihr Eurostat-Energieassistent. Ich kann bei Energiedefinitionen, Brennstoffcodes und Energiebilanz-Konzepten helfen. Was interessiert Sie?",
    "Ich habe das nicht ganz verstanden. Ich bin hier, um bei Energiestatistiken, Definitionen und Klassifikationen zu helfen. Was kann ich Ihnen helfen zu verstehen?",
    "Ich konzentriere mich darauf, bei Eurostat-Energiedaten zu helfen. Könnten Sie mich nach erneuerbaren Energien, fossilen Brennstoffen oder Energieeffizienzthemen fragen?",
    "Ich bin mir nicht sicher, ob ich Ihre Anfrage verstanden habe. Ich bin gut darin, Energieterminologie, Brennstoffcodes und statistische Definitionen zu erklären. Was möchten Sie lernen?",
    "Ich bin hier, um Energiedaten leichter verständlich zu machen. Versuchen Sie, mich nach spezifischen Energiequellen, Verbrauchsmustern oder Energiebilanz-Komponenten zu fragen."
  ]
};

export const NO_MATCH_RESPONSES = {
  en: [
    "I couldn't find a specific match for that term. Could you try rephrasing your question or using different keywords? I specialize in energy definitions, fuel codes, and energy-related terminology.",
    "I don't have information about that specific term in my energy database. Try using related energy keywords or check the spelling of technical terms.",
    "That term isn't in my energy glossary. Could you try a different approach? I can help with renewable energy, fossil fuels, energy efficiency, and fuel classifications.",
    "I couldn't locate that in my energy definitions. Perhaps try asking about energy sources, consumption, generation, or transformation processes?",
    "I don't recognize that term in my energy database. I'm most helpful with questions about energy balances, fuel codes, and energy statistical concepts.",
    "That doesn't match anything in my energy knowledge base. Try asking about specific energy types like solar, wind, coal, oil, gas, or nuclear energy.",
    "I couldn't find a definition for that term. I excel at explaining energy production, consumption, imports, exports, and energy transformation processes.",
    "That term isn't familiar to me in the energy context. I can help with energy indicators, renewable sources, fossil fuels, and energy efficiency topics.",
    "I don't have information about that specific term. Try asking about energy balances, primary energy, final energy consumption, or energy conversion processes.",
    "I couldn't match that to any energy definitions. I'm designed to help with Eurostat energy methodology, fuel classifications, and energy statistical frameworks."
  ],
  fr: [
    "Je n'ai pas pu trouver de correspondance spécifique pour ce terme. Pourriez-vous essayer de reformuler votre question ou d'utiliser des mots-clés différents ? Je me spécialise dans les définitions énergétiques, les codes de combustible et la terminologie liée à l'énergie.",
    "Je n'ai pas d'informations sur ce terme spécifique dans ma base de données énergétiques. Essayez d'utiliser des mots-clés énergétiques connexes ou vérifiez l'orthographe des termes techniques.",
    "Ce terme ne figure pas dans mon glossaire énergétique. Pourriez-vous essayer une approche différente ? Je peux aider avec les énergies renouvelables, les combustibles fossiles, l'efficacité énergétique et les classifications de combustibles.",
    "Je n'ai pas pu localiser cela dans mes définitions énergétiques. Peut-être essayez de poser des questions sur les sources d'énergie, la consommation, la génération ou les processus de transformation ?",
    "Je ne reconnais pas ce terme dans ma base de données énergétiques. Je suis plus utile avec les questions sur les bilans énergétiques, les codes de combustible et les concepts statistiques énergétiques.",
    "Cela ne correspond à rien dans ma base de connaissances énergétiques. Essayez de poser des questions sur des types d'énergie spécifiques comme l'énergie solaire, éolienne, le charbon, le pétrole, le gaz ou l'énergie nucléaire.",
    "Je n'ai pas pu trouver de définition pour ce terme. J'excelle à expliquer la production d'énergie, la consommation, les importations, les exportations et les processus de transformation énergétique.",
    "Ce terme ne m'est pas familier dans le contexte énergétique. Je peux aider avec les indicateurs énergétiques, les sources renouvelables, les combustibles fossiles et les sujets d'efficacité énergétique.",
    "Je n'ai pas d'informations sur ce terme spécifique. Essayez de poser des questions sur les bilans énergétiques, l'énergie primaire, la consommation finale d'énergie ou les processus de conversion énergétique.",
    "Je n'ai pas pu faire correspondre cela à des définitions énergétiques. Je suis conçu pour aider avec la méthodologie énergétique d'Eurostat, les classifications de combustibles et les cadres statistiques énergétiques."
  ],
  de: [
    "Ich konnte keine spezifische Übereinstimmung für diesen Begriff finden. Könnten Sie versuchen, Ihre Frage umzuformulieren oder andere Schlüsselwörter zu verwenden? Ich spezialisiere mich auf Energiedefinitionen, Brennstoffcodes und energiebezogene Terminologie.",
    "Ich habe keine Informationen über diesen spezifischen Begriff in meiner Energiedatenbank. Versuchen Sie, verwandte Energie-Schlüsselwörter zu verwenden oder die Rechtschreibung technischer Begriffe zu überprüfen.",
    "Dieser Begriff steht nicht in meinem Energie-Glossar. Könnten Sie einen anderen Ansatz versuchen? Ich kann bei erneuerbaren Energien, fossilen Brennstoffen, Energieeffizienz und Brennstoffklassifikationen helfen.",
    "Ich konnte das nicht in meinen Energiedefinitionen finden. Vielleicht versuchen Sie, nach Energiequellen, Verbrauch, Erzeugung oder Transformationsprozessen zu fragen?",
    "Ich erkenne diesen Begriff nicht in meiner Energiedatenbank. Ich bin am hilfreichsten bei Fragen zu Energiebilanzen, Brennstoffcodes und energiestatistischen Konzepten.",
    "Das passt zu nichts in meiner Energie-Wissensbasis. Versuchen Sie, nach spezifischen Energietypen wie Solar-, Wind-, Kohle-, Öl-, Gas- oder Kernenergie zu fragen.",
    "Ich konnte keine Definition für diesen Begriff finden. Ich bin gut darin, Energieproduktion, -verbrauch, -importe, -exporte und Energietransformationsprozesse zu erklären.",
    "Dieser Begriff ist mir im Energiekontext nicht vertraut. Ich kann bei Energieindikatoren, erneuerbaren Quellen, fossilen Brennstoffen und Energieeffizienz-Themen helfen.",
    "Ich habe keine Informationen über diesen spezifischen Begriff. Versuchen Sie, nach Energiebilanzen, Primärenergie, Endenergieverbrauch oder Energieumwandlungsprozessen zu fragen.",
    "Ich konnte das nicht mit Energiedefinitionen abgleichen. Ich bin darauf ausgelegt, bei Eurostat-Energiemethodik, Brennstoffklassifikationen und energiestatistischen Rahmenwerken zu helfen."
  ]
};

export const CLARIFICATION_RESPONSES = {
  en: [
    "Could you be more specific? I can help with energy definitions, fuel codes, renewable energy types, or energy balance components.",
    "I'd love to help! Could you specify what aspect of energy you're interested in? For example: definitions, fuel classifications, or energy statistics?",
    "Let me assist you better. Are you looking for information about energy sources, energy consumption, energy efficiency, or fuel codes?",
    "I can provide detailed information about energy topics. What specifically would you like to know about? Energy production? Consumption? Definitions?",
    "To give you the best answer, could you clarify what type of energy information you need? I cover definitions, classifications, and statistical concepts.",
    "I'm here to help with energy data! Could you specify whether you're asking about renewable energy, fossil fuels, energy balances, or something else?",
    "Let me know what energy topic interests you most. I can explain energy definitions, fuel types, consumption patterns, or statistical methodologies.",
    "I'd be happy to explain energy concepts! Are you interested in energy sources, energy transformation, energy efficiency, or energy statistics?",
    "To provide the most helpful response, could you tell me more about what energy information you're seeking? Definitions? Classifications? Methodology?",
    "I have extensive knowledge about energy topics. What specific area would you like to explore? Energy production, consumption, imports, exports, or transformations?"
  ],
  fr: [
    "Pourriez-vous être plus spécifique ? Je peux aider avec les définitions énergétiques, les codes de combustible, les types d'énergies renouvelables ou les composants du bilan énergétique.",
    "J'aimerais vous aider ! Pourriez-vous spécifier quel aspect de l'énergie vous intéresse ? Par exemple : définitions, classifications de combustibles ou statistiques énergétiques ?",
    "Permettez-moi de mieux vous aider. Cherchez-vous des informations sur les sources d'énergie, la consommation d'énergie, l'efficacité énergétique ou les codes de combustible ?",
    "Je peux fournir des informations détaillées sur les sujets énergétiques. Que souhaiteriez-vous savoir spécifiquement ? Production d'énergie ? Consommation ? Définitions ?",
    "Pour vous donner la meilleure réponse, pourriez-vous préciser quel type d'informations énergétiques vous avez besoin ? Je couvre les définitions, classifications et concepts statistiques.",
    "Je suis là pour aider avec les données énergétiques ! Pourriez-vous spécifier si vous posez des questions sur les énergies renouvelables, les combustibles fossiles, les bilans énergétiques ou autre chose ?",
    "Faites-moi savoir quel sujet énergétique vous intéresse le plus. Je peux expliquer les définitions énergétiques, les types de combustibles, les modèles de consommation ou les méthodologies statistiques.",
    "Je serais heureux d'expliquer les concepts énergétiques ! Êtes-vous intéressé par les sources d'énergie, la transformation énergétique, l'efficacité énergétique ou les statistiques énergétiques ?",
    "Pour fournir la réponse la plus utile, pourriez-vous me dire plus sur les informations énergétiques que vous recherchez ? Définitions ? Classifications ? Méthodologie ?",
    "J'ai des connaissances approfondies sur les sujets énergétiques. Quel domaine spécifique aimeriez-vous explorer ? Production d'énergie, consommation, importations, exportations ou transformations ?"
  ],
  de: [
    "Könnten Sie spezifischer sein? Ich kann bei Energiedefinitionen, Brennstoffcodes, Arten erneuerbarer Energien oder Energiebilanz-Komponenten helfen.",
    "Ich würde gerne helfen! Könnten Sie spezifizieren, welcher Aspekt der Energie Sie interessiert? Zum Beispiel: Definitionen, Brennstoffklassifikationen oder Energiestatistiken?",
    "Lassen Sie mich Ihnen besser helfen. Suchen Sie Informationen über Energiequellen, Energieverbrauch, Energieeffizienz oder Brennstoffcodes?",
    "Ich kann detaillierte Informationen über Energiethemen liefern. Was möchten Sie spezifisch wissen? Energieproduktion? Verbrauch? Definitionen?",
    "Um Ihnen die beste Antwort zu geben, könnten Sie klären, welche Art von Energieinformationen Sie benötigen? Ich decke Definitionen, Klassifikationen und statistische Konzepte ab.",
    "Ich bin hier, um bei Energiedaten zu helfen! Könnten Sie spezifizieren, ob Sie nach erneuerbaren Energien, fossilen Brennstoffen, Energiebilanzen oder etwas anderem fragen?",
    "Lassen Sie mich wissen, welches Energiethema Sie am meisten interessiert. Ich kann Energiedefinitionen, Brennstofftypen, Verbrauchsmuster oder statistische Methodologien erklären.",
    "Ich würde gerne Energiekonzepte erklären! Interessieren Sie sich für Energiequellen, Energietransformation, Energieeffizienz oder Energiestatistiken?",
    "Um die hilfreichste Antwort zu geben, könnten Sie mir mehr darüber erzählen, welche Energieinformationen Sie suchen? Definitionen? Klassifikationen? Methodik?",
    "Ich habe umfassendes Wissen über Energiethemen. Welchen spezifischen Bereich möchten Sie erkunden? Energieproduktion, Verbrauch, Importe, Exporte oder Transformationen?"
  ]
};

/**
 * Get a random response from the specified response type
 */
export const getRandomUnknownResponse = (responseType = 'unknown') => {
  const currentLanguage = i18n.language || 'en';
  let responses;
  
  switch (responseType) {
    case 'no_match':
      responses = NO_MATCH_RESPONSES[currentLanguage] || NO_MATCH_RESPONSES.en;
      break;
    case 'clarification':
      responses = CLARIFICATION_RESPONSES[currentLanguage] || CLARIFICATION_RESPONSES.en;
      break;
    case 'unknown':
    default:
      responses = UNKNOWN_RESPONSES[currentLanguage] || UNKNOWN_RESPONSES.en;
      break;
  }
  
  if (!Array.isArray(responses) || responses.length === 0) {
    return "I'm here to help with energy-related questions. What would you like to know?";
  }
  
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
};
