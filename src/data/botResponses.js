/**
 * Centralized bot response dictionary
 * Contains various types of responses organized by category and language
 * All individual response dictionaries are imported and consolidated here
 */

// Import individual response dictionaries
import { welcomeMessages } from "./welcomeMessages";
import { farewellMessages } from "./farewellMessages";
import { gratitudeMessages } from "./gratitudeMessages";
import { promptMessages } from "./promptMessages";
import { errorMessages } from "./errorMessages";
import { thinkingMessages } from "./thinkingMessages";
import { unknownResponses } from "./unknownResponses";
import { empathyPhrases } from "./empathyPhrases";
import { reassurancePhrases } from "./reassurancePhrases";


// Consolidated bot responses
export const botResponses = {
  // Greeting responses
  greeting: welcomeMessages,

  // Farewell responses
  farewell: farewellMessages,

  // Gratitude responses
  gratitude: gratitudeMessages,

  // Prompt responses (used to prompt the user for more information)
  prompt: promptMessages,

  // Error responses
  error: errorMessages,

  // Thinking responses (displayed while the bot is "thinking")
  thinking: thinkingMessages,

  // Confused/unknown responses (when the bot doesn't understand)
  confused: unknownResponses,

  // Empathy phrases (to make responses more human-like)
  empathy: empathyPhrases,

  // Reassurance phrases (to reassure the user)
  reassurance: reassurancePhrases,
};

/**
 * Get a specific type of response
 * @param {string} type - The type of response to get
 * @param {string} language - The language code
 * @returns {Array} Array of responses of the specified type
 */
export const getResponseByType = (type, language = "en") => {
  if (!botResponses[type]) {
    console.warn(`Response type not found: ${type}`);
    return [];
  }

  const responses = botResponses[type][language] || botResponses[type].en;
  return responses || [];
};

export default botResponses;
