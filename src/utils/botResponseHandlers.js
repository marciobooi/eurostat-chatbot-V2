/**
 * Handlers for processing and analyzing user messages
 */
import { MessageService } from '../services/MessageService';
import { getRandomElement } from './randomUtils';
import { unknownResponses } from '../dictionaries/unknownResponses';
import { errorMessages } from '../dictionaries/errorMessages';
import { empathyPhrases } from '../dictionaries/empathyPhrases';
import { energyDictionary } from './energyDictionary';
import { CONFIG } from '../i18n';
import { commonQuestionPhrases } from '../dictionaries/questionPhrases';
import { questionWords } from '../dictionaries/questionWords';

export const processUserMessage = async (message, language = 'en') => {
  try {
    const [userMessage, botResponse] = await MessageService.processUserInput(message, language);
    
    // Return the bot response directly if it's a relationship question
    if (botResponse.isRelationship) {
      return botResponse;
    }

    // For non-relationship questions, continue with normal analysis
    const result = await MessageService.analyzeMessage(message, language);
    const isQuestion = checkIsQuestion(message, language);
    const botResponseWithContext = {
      ...botResponse,
      nlpData: {
        ...result,
        isQuestion
      }
    };

    return botResponseWithContext;
  } catch (error) {
    console.error('Error processing message:', error);
    return MessageService.createErrorResponse(language);
  }
};

// Helper for checking if text is a question
const checkIsQuestion = (message, language) => {
  const words = questionWords[language] || questionWords[CONFIG.DEFAULT_LANGUAGE];
  const hasQuestionWord = words.some(word => 
    message.toLowerCase().includes(word.toLowerCase())
  );

  if (hasQuestionWord) return true;

  const phrasePatterns = commonQuestionPhrases[language] || commonQuestionPhrases[CONFIG.DEFAULT_LANGUAGE];
  return phrasePatterns.some(pattern => pattern.test(message));
};

export const generateBotResponse = async (processedMessage, language = 'en') => {
  try {
    // If the message is already a bot response (like from relationship handling), return it directly
    if (processedMessage.sender === 'bot') {
      return processedMessage;
    }

    const { nlpData } = processedMessage;
    const text = nlpData.topics?.[0]?.text?.toLowerCase() || '';
    
    const [_, botResponse] = await MessageService.processUserInput(text, language);
    return botResponse;
  } catch (error) {
    console.error('Error generating response:', error);
    return MessageService.createErrorResponse(language);
  }
};

/**
 * Create a response when the bot understands the query
 */
export const createBotResponse = (definition, language = CONFIG.DEFAULT_LANGUAGE) => {
  if (!definition) {
    return createUnknownResponse(language);
  }

  return {
    sender: 'bot',
    title: definition.title,
    text: definition.text,
    language,
    suggestions: [...(definition.subFuels || []), ...(definition.related || [])],
    hasVisualization: definition.hasVisualization || false,
    visualizationType: definition.visualizationType || [],
    dataset: definition.dataset,
    link: definition.link,
    fuelType: definition.fuelCode
  };
};

/**
 * Create a response when the bot doesn't understand the query
 */
export const createUnknownResponse = (language = CONFIG.DEFAULT_LANGUAGE) => {
  const messages = unknownResponses[language] || unknownResponses[CONFIG.DEFAULT_LANGUAGE];
  const empathy = empathyPhrases[language] || empathyPhrases[CONFIG.DEFAULT_LANGUAGE];
  
  // Get main energy topics for suggestions
  const dictionary = energyDictionary[language] || energyDictionary[CONFIG.DEFAULT_LANGUAGE];
  const mainTopics = Object.entries(dictionary)
    .filter(([_, def]) => def.isMainFuel)
    .map(([key]) => key)
    .slice(0, 3);

  return {
    sender: 'bot',
    text: getRandomElement(messages),
    language,
    suggestions: mainTopics,
    followUp: `${getRandomElement(empathy)} Would you like to learn about one of these topics instead?`
  };
};