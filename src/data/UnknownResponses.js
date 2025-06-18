/**
 * Unknown/Fallback response messages for the chatbot
 * These are used when the chatbot cannot classify the user's intent
 * or when no specific match is found for definition requests
 */

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
  ]
};

/**
 * Get a random response from the specified response type
 */
export const getRandomUnknownResponse = (responseType = 'unknown') => {
  let responses;
  
  switch (responseType) {
    case 'no_match':
      responses = NO_MATCH_RESPONSES.en;
      break;
    case 'clarification':
      responses = CLARIFICATION_RESPONSES.en;
      break;
    case 'unknown':
    default:
      responses = UNKNOWN_RESPONSES.en;
      break;
  }
  
  if (!Array.isArray(responses) || responses.length === 0) {
    return "I'm here to help with energy-related questions. What would you like to know?";
  }
  
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
};
