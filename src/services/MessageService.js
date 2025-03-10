import { welcomeMessages } from '../dictionaries/welcomeMessages';
import { unknownResponses } from '../dictionaries/unknownResponses';
import { energyDefinitionsEn } from '../dictionaries/energyDefinitionsEn';
import { findEnergyDefinition } from '../utils/energyHandlers';
import { getRandomElement } from '../utils/randomUtils';

export class MessageService {
  static createWelcomeMessage(language) {
    const messages = welcomeMessages[language] || welcomeMessages.en;
    return {
      sender: 'bot',
      text: getRandomElement(messages),
      language
    };
  }

  static createUserMessage(text, language) {
    return {
      sender: 'user',
      text: text.trim(),
      language
    };
  }

  static createBotResponse(definition, language) {
    if (!definition) {
      return {
        sender: 'bot',
        text: this.getRandomUnknownResponse(language),
        language
      };
    }

    const fuelType = Object.entries(energyDefinitionsEn).find(
      ([_, def]) => def.title === definition.title
    )?.[0] || definition.title?.toLowerCase();

    return {
      sender: 'bot',
      title: definition.title,
      text: definition.text,
      language,
      suggestions: definition.subFuels || [],
      hasVisualization: definition.hasVisualization || false,
      visualizationType: definition.visualizationType || [],
      dataset: definition.dataset,
      link: definition.link,
      fuelType
    };
  }

  static createVisualizationMessage(originalMessage, chartType, data, t, language) {
    return {
      sender: 'bot',
      text: t('visualization.description', { dataset: originalMessage.title || originalMessage.text }),
      title: t(`visualization.${chartType.toLowerCase()}.title`),
      chartType,
      chartData: data,
      language,
      isVisualization: true,
      hasVisualization: true,
      visualizationType: originalMessage.visualizationType,
      suggestions: originalMessage.suggestions || [],
      link: originalMessage.link,
      fuelType: originalMessage.fuelType
    };
  }

  static createErrorResponse(errorMessage, language) {
    return {
      sender: 'bot',
      text: errorMessage,
      isError: true,
      language
    };
  }

  static getRandomUnknownResponse(language) {
    const responses = unknownResponses[language] || unknownResponses.en;
    return getRandomElement(responses);
  }

  static async processUserInput(input, language) {
    const definition = await findEnergyDefinition(input.trim(), language);
    return this.createBotResponse(definition, language);
  }
}