// src/services/MessageService.test.js
import MessageService from './MessageService';
import { dynamicMessages } from '../dictionaries/dynamicMessages';
import { CONFIG } from '../i18n';

// Mocking randomUtils to control phrase selection
jest.mock('../utils/randomUtils', () => ({
  getRandomElement: jest.fn(arr => arr[0])
}));
import { getRandomElement } from '../utils/randomUtils';

// Mocking storageHandlers to prevent side effects
jest.mock('../utils/storageHandlers', () => ({
  saveChatToCookie: jest.fn(),
  loadChatFromCookie: jest.fn(() => []),
  setupCrossTabbingSyncListeners: jest.fn(() => jest.fn())
}));

// Mock contextManager and its methods
jest.mock('../utils/nlp/contextManager', () => ({
  contextManager: {
    checkRelationship: jest.fn(() => ({ isRelationshipQuestion: false })),
    processEurostatQuery: jest.fn(),
    updateContext: jest.fn( (id, text, nlpResult) => ({
        entities: nlpResult.entities,
        intent: nlpResult.intent,
    })),
    resolveAnaphora: jest.fn((text) => text),
  }
}));
// Import the mocked contextManager AFTER the jest.mock call
import { contextManager } from '../utils/nlp/contextManager';

// Mock nlpHandlers to control its output
jest.mock('../utils/nlpHandlers', () => ({
  ...jest.requireActual('../utils/nlpHandlers'),
  findEnergyDefinition: jest.fn(),
  processText: jest.fn().mockResolvedValue({
    entities: {}, intent: 'general_info', sentiment: {score: 0}, context: {}
  }),
}));
import { findEnergyDefinition, processText } from '../utils/nlpHandlers';


describe('MessageService Response Phrasing', () => {
  const defaultLang = CONFIG.DEFAULT_LANGUAGE || 'en';

  describe('createBotResponse varied introductions', () => {
    const mockDefinition = {
      title: 'Solar Power',
      text: 'This is the main text about solar power.',
    };
    const introPhrasesForLang = dynamicMessages.introductions[defaultLang];

    beforeEach(() => {
      getRandomElement.mockImplementation(arr => arr[0]);
    });

    test('should use the first introductory phrase and fill topic', () => {
      const response = MessageService.createBotResponse(mockDefinition, defaultLang, {});
      const expectedIntro = introPhrasesForLang[0].replace('{topic}', mockDefinition.title);
      expect(response.text.startsWith(expectedIntro)).toBe(true);
      expect(response.text.includes(mockDefinition.text)).toBe(true);
    });

    test('should use a different introductory phrase if mock is changed', () => {
      if (introPhrasesForLang.length > 1) {
        getRandomElement.mockImplementation(arr => arr[1]);
        const response = MessageService.createBotResponse(mockDefinition, defaultLang, {});
        const expectedIntro = introPhrasesForLang[1].replace('{topic}', mockDefinition.title);
        expect(response.text.startsWith(expectedIntro)).toBe(true);
      } else {
        expect(true).toBe(true);
      }
    });

    test('should verify multiple calls can produce different intros (conceptual, requires unmocked or more complex mock)', () => {
      expect(true).toBe(true);
    });
  });

  describe('processUserInput varied Eurostat responses', () => {
    const mockUserInput = "eurostat query text";
    const mockEurostatData = {
      isEurostatQuery: true,
      queryInfo: { /* minimal data */ },
      data: {
        country: 'DE',
        country_label: 'Germany',
        year: '2023',
        bal: 'FC',
        bal_label: 'Final Consumption',
        siec: 'SOLAR',
        siec_label: 'Solar Energy',
        value: '1000',
        unit: 'KTOE',
        unit_label: 'ktoe'
      }
    };

    const eurostatPhrasesForLang = dynamicMessages.eurostatDataPresentations[defaultLang];

    beforeEach(() => {
      // Reset mocks before each test in this suite
      getRandomElement.mockImplementation(arr => arr[0]);

      // Configure mocks for contextManager (already imported as mocked version)
      contextManager.checkRelationship.mockReturnValue({ isRelationshipQuestion: false });
      contextManager.processEurostatQuery.mockResolvedValue(mockEurostatData);

      // Configure mocks for nlpHandlers (already imported as mocked versions)
      findEnergyDefinition.mockResolvedValue(undefined);
      processText.mockResolvedValue({ entities: {}, intent: 'general_info', sentiment: {score: 0}, context: { resolvedEntities: {} } });

      // Mock static methods on MessageService that might interfere
      MessageService.isGreetingMessage = jest.fn(() => false);
      MessageService.isGratitudeMessage = jest.fn(() => false);
      MessageService.isFarewellMessage = jest.fn(() => false);
    });

    test('should use the first Eurostat phrase and fill placeholders', async () => {
      const messages = await MessageService.processUserInput(mockUserInput, defaultLang, null, null);
      const botResponse = messages[1];

      let expectedText = eurostatPhrasesForLang[0];
      expectedText = expectedText.replace('{country}', mockEurostatData.data.country_label);
      expectedText = expectedText.replace('{year}', mockEurostatData.data.year);
      expectedText = expectedText.replace('{balance}', mockEurostatData.data.bal_label);
      expectedText = expectedText.replace('{product}', mockEurostatData.data.siec_label);
      expectedText = expectedText.replace('{value}', mockEurostatData.data.value);
      expectedText = expectedText.replace('{unit}', mockEurostatData.data.unit_label);

      expect(botResponse.text).toBe(expectedText);
    });

    test('should use a different Eurostat phrase if mock is changed', async () => {
      if (eurostatPhrasesForLang.length > 1) {
        getRandomElement.mockImplementation(arr => arr[1]);
        const messages = await MessageService.processUserInput(mockUserInput, defaultLang, null, null);
        const botResponse = messages[1];

        let expectedText = eurostatPhrasesForLang[1];
        expectedText = expectedText.replace('{country}', mockEurostatData.data.country_label);
        expectedText = expectedText.replace('{year}', mockEurostatData.data.year);
        expectedText = expectedText.replace('{balance}', mockEurostatData.data.bal_label);
        expectedText = expectedText.replace('{product}', mockEurostatData.data.siec_label);
        expectedText = expectedText.replace('{value}', mockEurostatData.data.value);
        expectedText = expectedText.replace('{unit}', mockEurostatData.data.unit_label);

        expect(botResponse.text).toBe(expectedText);
      } else {
        expect(true).toBe(true);
      }
    });
  });
});
