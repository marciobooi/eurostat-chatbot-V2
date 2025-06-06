// src/utils/nlp/contextManager.test.js
import { contextManager } from './contextManager'; // Assuming test file is in the same directory

describe('ContextManager.resolveAnaphora', () => {
  // Test suite for energy type pronoun resolution
  describe('Energy Type Pronoun Resolution', () => {
    const lastMentionedEnergyType = 'Solar Energy';
    const lastMentionedCountry = null;

    test('should replace "it" when referring to energy type in production queries', () => {
      const text = "what is its production?";
      const expected = "what is Solar Energy production?";
      expect(contextManager.resolveAnaphora(text, lastMentionedCountry, lastMentionedEnergyType)).toBe(expected);
    });

    test('should replace "its" near energy keywords like "data"', () => {
      const text = "tell me about its data";
      const expected = "tell me about Solar Energy data";
      expect(contextManager.resolveAnaphora(text, lastMentionedCountry, lastMentionedEnergyType)).toBe(expected);
    });

    test('should replace "it" in "what about it" if energy type is in context', () => {
      const text = "what about it";
      const expected = "what about Solar Energy";
      expect(contextManager.resolveAnaphora(text, lastMentionedCountry, lastMentionedEnergyType)).toBe(expected);
    });

    test('should not replace "it" if not clearly referring to energy type context', () => {
      const text = "is it available?"; // "it" is ambiguous here without more keyword context
      expect(contextManager.resolveAnaphora(text, lastMentionedCountry, lastMentionedEnergyType)).toBe(text);
    });
  });

  // Test suite for country pronoun resolution
  describe('Country Pronoun Resolution', () => {
    const lastMentionedEnergyType = null;
    const lastMentionedCountry = 'Germany';

    test('should replace "they" when referring to country in production queries', () => {
      const text = "what is their total production?";
      const expected = "what is Germany total production?";
      expect(contextManager.resolveAnaphora(text, lastMentionedCountry, lastMentionedEnergyType)).toBe(expected);
    });

    test('should replace "them" near country keywords like "data for them"', () => {
      const text = "show me data for them";
      const expected = "show me data for Germany";
      expect(contextManager.resolveAnaphora(text, lastMentionedCountry, lastMentionedEnergyType)).toBe(expected);
    });

    test('should replace "it" in "about it" if country is in context and no energyType', () => {
      const text = "tell me more about it";
      // This test might be tricky as "it" could also be energy. The current heuristic might replace with country.
      // The heuristic in resolveAnaphora for country is broad for "it".
      const expected = "tell me more about Germany";
      expect(contextManager.resolveAnaphora(text, lastMentionedCountry, lastMentionedEnergyType)).toBe(expected);
    });

    test('should not replace "they" if not clearly referring to country context', () => {
      const text = "are they producing it?"; // "they" is ambiguous
      expect(contextManager.resolveAnaphora(text, lastMentionedCountry, lastMentionedEnergyType)).toBe(text);
    });
  });

  // Test suite for no context or no anaphora
  describe('No Context or No Anaphora', () => {
    test('should return text unchanged if no lastMentioned entities', () => {
      const text = "what is its production?";
      expect(contextManager.resolveAnaphora(text, null, null)).toBe(text);
    });

    test('should return text unchanged if no pronouns are present', () => {
      const text = "what is solar energy production?";
      const lastMentionedEnergyType = 'Wind Energy';
      expect(contextManager.resolveAnaphora(text, null, lastMentionedEnergyType)).toBe(text);
    });

    test('should handle empty string input', () => {
      const text = "";
      expect(contextManager.resolveAnaphora(text, 'Germany', 'Solar')).toBe("");
    });
  });

  // Test suite for overlapping pronoun resolution (prefer energy type for "it/its" if both contexts exist)
  describe('Overlapping Pronoun Resolution (it/its)', () => {
    const lastMentionedEnergyType = 'Solar Energy';
    const lastMentionedCountry = 'Germany';

    test('should prefer energy type for "its production" when both contexts exist', () => {
      const text = "what about its production?";
      const expected = "what about Solar Energy production?";
      expect(contextManager.resolveAnaphora(text, lastMentionedCountry, lastMentionedEnergyType)).toBe(expected);
    });

    test('should replace country for "their data" when both contexts exist', () => {
      const text = "show me their data";
      const expected = "show me Germany data";
      expect(contextManager.resolveAnaphora(text, lastMentionedCountry, lastMentionedEnergyType)).toBe(expected);
    });
  });
});
