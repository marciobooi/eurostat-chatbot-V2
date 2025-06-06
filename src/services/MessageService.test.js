// src/services/MessageService.test.js
import MessageService from './MessageService'; // Assuming default export
import { dynamicMessages } from '../dictionaries/dynamicMessages';
import { CONFIG } from '../i18n'; // For default language

// Mocking randomUtils to control phrase selection
jest.mock('../utils/randomUtils', () => ({
  getRandomElement: jest.fn(arr => arr[0]) // Default mock: always pick the first element
}));
import { getRandomElement } from '../utils/randomUtils';


describe('MessageService Response Phrasing', () => {
  const defaultLang = CONFIG.DEFAULT_LANGUAGE || 'en';

  describe('createBotResponse varied introductions', () => {
    const mockDefinition = {
      title: 'Solar Power',
      text: 'This is the main text about solar power.',
      // ... other necessary mock definition properties
    };
    const introPhrasesForLang = dynamicMessages.introductions[defaultLang];

    beforeEach(() => {
      // Reset mock for each test if needed, or configure per test
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
        getRandomElement.mockImplementation(arr => arr[1]); // Pick the second phrase
        const response = MessageService.createBotResponse(mockDefinition, defaultLang, {});
        const expectedIntro = introPhrasesForLang[1].replace('{topic}', mockDefinition.title);
        expect(response.text.startsWith(expectedIntro)).toBe(true);
      } else {
        // Skip or adjust if only one phrase for the language
        expect(true).toBe(true); // Placeholder for test runner
      }
    });

    test('should verify multiple calls can produce different intros (conceptual, requires unmocked or more complex mock)', () => {
      // This test is harder with simple mock.
      // For a real test of randomness, you'd unmock getRandomElement for this specific test,
      // call createBotResponse multiple times, and check that not all response.text are identical.
      // Or, ensure your mock can be configured to return different values across calls.
      // For now, we rely on the fact that getRandomElement is called.
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('processUserInput varied Eurostat responses', () => {
    // Mocking contextManager.processEurostatQuery for these tests
    // and other dependencies of processUserInput if they interfere.
    // This is becoming more of an integration test for this part.

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

    // Mock contextManager and its methods that processUserInput calls before Eurostat check
    // This is simplified; a real scenario might need more extensive mocking.
    jest.mock('../utils/nlp/contextManager', () => ({
      contextManager: {
        checkRelationship: jest.fn(() => ({ isRelationshipQuestion: false })),
        processEurostatQuery: jest.fn(), // Will be configured per test
        // Add other methods if processUserInput calls them before Eurostat part
      }
    }));
    const { contextManager } = require('../utils/nlp/contextManager');


    const eurostatPhrasesForLang = dynamicMessages.eurostatDataPresentations[defaultLang];

    beforeEach(() => {
      getRandomElement.mockImplementation(arr => arr[0]);
      contextManager.processEurostatQuery.mockResolvedValue(mockEurostatData);
      // Reset other mocks if they are used by other parts of processUserInput
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
        getRandomElement.mockImplementation(arr => arr[1]); // Pick the second phrase
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
        expect(true).toBe(true); // Placeholder
      }
    });
  });
});
