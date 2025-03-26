import { relationshipPatterns } from '../../dictionaries/relationshipPatterns';
import { energyDictionary } from '../energyDictionary';
import { CONFIG } from '../../i18n';
import { getRandomElement } from '../randomUtils';

class ComparisonModule {
  /**
   * Extracts terms from a message, supporting exact matches (including aliases) and partial matches.
   * @param {string} input - The user input message.
   * @param {Object} dictionary - The energy dictionary with term definitions.
   * @returns {Object} - Contains exactMatches (array) and partialMatches (array).
   */
  extractTermsFromMessage(input, dictionary) {
    const words = input.toLowerCase().split(/\s+/);
    const terms = new Set();
    const partialMatches = new Set();

    // Generate all possible chunks (1-3 words) from the input
    const chunks = [];
    for (let i = 0; i < words.length; i++) {
      chunks.push({ text: words[i], startIndex: i, endIndex: i });
      if (i < words.length - 1) {
        chunks.push({ text: words[i] + ' ' + words[i + 1], startIndex: i, endIndex: i + 1 });
      }
      if (i < words.length - 2) {
        chunks.push({ text: words[i] + ' ' + words[i + 1] + ' ' + words[i + 2], startIndex: i, endIndex: i + 2 });
      }
    }

    // Sort chunks by length (longer matches preferred)
    chunks.sort((a, b) => b.text.length - a.text.length);

    // Track used word indices to avoid overlap
    const usedWordIndices = new Set();

    // First pass: Exact matches (including aliases)
    chunks.forEach(chunk => {
      if ([...Array(chunk.endIndex - chunk.startIndex + 1)].some((_, i) => usedWordIndices.has(chunk.startIndex + i))) {
        return;
      }

      const chunkLower = chunk.text.toLowerCase();
      Object.entries(dictionary).forEach(([term, def]) => {
        const termLower = term.toLowerCase();
        const title = def.title?.toLowerCase() || '';
        const aliases = (def.aliases || []).map(a => a.toLowerCase());

        if (termLower === chunkLower || title === chunkLower || aliases.includes(chunkLower)) {
          terms.add(term);
          for (let i = chunk.startIndex; i <= chunk.endIndex; i++) {
            usedWordIndices.add(i);
          }
        }
      });
    });

    // Second pass: Partial matches (only if no exact matches)
    if (terms.size === 0) {
      chunks.forEach(chunk => {
        if ([...Array(chunk.endIndex - chunk.startIndex + 1)].some((_, i) => usedWordIndices.has(chunk.startIndex + i))) {
          return;
        }

        const chunkLower = chunk.text.toLowerCase();
        Object.entries(dictionary).forEach(([term, def]) => {
          const termLower = term.toLowerCase();
          const title = def.title?.toLowerCase() || '';

          // Stricter partial match criteria
          if ((termLower.includes(chunkLower) || title.includes(chunkLower)) &&
              chunkLower.length >= 4 && // Minimum length
              (chunkLower.length >= termLower.length * 0.75 || termLower.startsWith(chunkLower) || termLower.endsWith(chunkLower))) {
            partialMatches.add(term);
            for (let i = chunk.startIndex; i <= chunk.endIndex; i++) {
              usedWordIndices.add(i);
            }
          }
        });
      });
    }

    const result = Array.from(terms);
    return {
      exactMatches: result,
      partialMatches: Array.from(partialMatches)
        .filter(match => !result.includes(match))
        .sort((a, b) => a.length - b.length) // Sort by length for relevance
    };
  }

  /**
   * Checks if two terms have any defined relationship.
   * @param {Object} def1 - Definition of the first term.
   * @param {Object} def2 - Definition of the second term.
   * @param {string} term1 - First term.
   * @param {string} term2 - Second term.
   * @returns {boolean} - True if related, false otherwise.
   */
  checkTermRelationship(def1, def2, term1, term2) {
    return (
      this.hasDirectRelationship(def1, def2, term1, term2) ||
      this.hasHierarchicalRelationship(def1, def2, term1, term2) ||
      this.hasCategoryRelationship(def1, def2) ||
      this.hasTextualRelationship(def1, def2)
    );
  }

  /** Checks for direct relationships (e.g., listed in related terms). */
  hasDirectRelationship(def1, def2, term1, term2) {
    return def1.related?.includes(term2) || def2.related?.includes(term1);
  }

  /** Checks for hierarchical relationships (e.g., subFuels, parentFuel). */
  hasHierarchicalRelationship(def1, def2, term1, term2) {
    return (
      def1.subFuels?.includes(term2) ||
      def2.subFuels?.includes(term1) ||
      def1.parentFuel === term2 ||
      def2.parentFuel === term1 ||
      def1.derivedFrom?.includes(term2) ||
      def2.derivedFrom?.includes(term1)
    );
  }

  /** Checks for shared category/family relationships. */
  hasCategoryRelationship(def1, def2) {
    return (
      def1.category === def2.category ||
      def1.family === def2.family ||
      def1.subFamily === def2.subFamily
    );
  }

  /** Checks for textual relationships based on patterns. */
  hasTextualRelationship(def1, def2) {
    const text1 = def1.text?.toLowerCase() || '';
    const text2 = def2.text?.toLowerCase() || '';
    const title1 = def1.title?.toLowerCase() || '';
    const title2 = def2.title?.toLowerCase() || '';
    const relationshipDict = relationshipPatterns[CONFIG.DEFAULT_LANGUAGE];

    return relationshipDict.patterns.some(pattern => {
      const match = text1.match(pattern) || text2.match(pattern);
      if (!match) return false;
      const matchedText = match[0].toLowerCase();
      return (
        (matchedText.includes(title1) && text2.includes(title2)) ||
        (matchedText.includes(title2) && text1.includes(title1))
      );
    });
  }

  /**
   * Determines the specific type of relationship between two terms.
   * @param {Object} def1 - Definition of the first term.
   * @param {Object} def2 - Definition of the second term.
   * @param {string} term1 - First term.
   * @param {string} term2 - Second term.
   * @returns {string} - The relationship type (e.g., 'inclusion', 'derivation').
   */
  determineRelationshipType(def1, def2, term1, term2) {
    const relationshipDict = relationshipPatterns[CONFIG.DEFAULT_LANGUAGE];
    for (const [type, terms] of Object.entries(relationshipDict.terms)) {
      const matches = terms.some(term => {
        const pattern = new RegExp(term, 'i');
        return (
          (def1.text && pattern.test(def1.text) && def1.text.includes(term2)) ||
          (def2.text && pattern.test(def2.text) && def2.text.includes(term1)) ||
          (def1.subFuels?.includes(term2) && type === 'inclusion') ||
          (def2.subFuels?.includes(term1) && type === 'inclusion') ||
          (def1.derivedFrom?.includes(term2) && type === 'derivation') ||
          (def2.derivedFrom?.includes(term1) && type === 'derivation') ||
          (def1.parentFuel === term2 && type === 'production') ||
          (def2.parentFuel === term1 && type === 'production')
        );
      });
      if (matches) return type;
    }

    if (def1.family === def2.family) return 'same_family';
    if (def1.category === def2.category) return 'same_category';
    if (def1.subFamily === def2.subFamily) return 'same_subfamily';
    return 'related';
  }

  /**
   * Creates a response based on the relationship between terms.
   * @param {boolean} isRelated - Whether the terms are related.
   * @param {string} relationshipType - Type of relationship.
   * @param {Object} def1 - Definition of the first term.
   * @param {Object} def2 - Definition of the second term.
   * @param {string} term1 - First term.
   * @param {string} term2 - Second term.
   * @param {string} language - Language code for responses.
   * @returns {Object} - Response object with relationship details.
   */
  createRelationshipResponse(isRelated, relationshipType, def1, def2, term1, term2, language) {
    const responses = relationshipPatterns[language]?.responses || 
                     relationshipPatterns[CONFIG.DEFAULT_LANGUAGE].responses;
    const responseList = isRelated ? responses.positive : responses.negative;
    const response = getRandomElement(responseList)
      .replace('{term1}', def1.title || term1)
      .replace('{term2}', def2?.title || term2 || '');

    return {
      isRelated,
      relationshipType,
      terms: def2 ? [
        { term: term1, definition: def1 },
        { term: term2, definition: def2 }
      ] : [{ term: term1, definition: def1 }],
      response,
      isRelationshipQuestion: true
    };
  }

  /**
   * Main method to process a relationship query.
   * @param {string} message - The user input message.
   * @param {string} [language=CONFIG.DEFAULT_LANGUAGE] - Language code.
   * @returns {Object|null} - Response object or null if no relationship query detected.
   */
  checkRelationship(message, language = CONFIG.DEFAULT_LANGUAGE) {
    if (!message) return null;

    const lowercaseInput = message.toLowerCase();
    const dictionary = energyDictionary[language] || energyDictionary[CONFIG.DEFAULT_LANGUAGE];
    const relationshipDict = relationshipPatterns[language] || relationshipPatterns[CONFIG.DEFAULT_LANGUAGE];

    // Match relationship pattern
    const matchedPattern = relationshipDict.patterns.find(pattern => pattern.test(lowercaseInput));
    if (!matchedPattern) return null;

    const matches = lowercaseInput.match(matchedPattern);
    if (!matches) return null;

    // Special handling for "is X a thing" type patterns
    const isExistenceQuestion = /is.*a thing\??|does.*exist\??|is.*real\??|is there such.*thing as/.test(lowercaseInput);

    // Extract terms before and after the pattern
    const before = lowercaseInput.substring(0, matches.index).trim();
    const after = lowercaseInput.substring(matches.index + matches[0].length).trim();
    const beforeTerms = this.extractTermsFromMessage(before || matches[0], dictionary);
    const afterTerms = this.extractTermsFromMessage(after.replace(/\?$/, ''), dictionary);

    // Handle no exact matches but partial matches available
    if (beforeTerms.exactMatches.length === 0 && afterTerms.exactMatches.length === 0) {
      const allPartials = [...beforeTerms.partialMatches, ...afterTerms.partialMatches];
      if (allPartials.length > 0) {
        const suggestedTerm = allPartials[0];
        const def = dictionary[suggestedTerm];
        if (!def) return null;

        const suggestions = [...(def.subFuels || []), ...(def.related || [])]
          .filter(term => term !== suggestedTerm);

        return {
          isRelationshipQuestion: true,
          isRelated: false,
          relationshipType: 'suggestion',
          terms: [{ term: suggestedTerm, definition: def }],
          suggestions,
          response: getRandomElement(relationshipDict.responses.suggestion)
            .replace('{term1}', def.title || suggestedTerm)
        };
      }
      return null;
    }

    // Get first term
    const term1 = beforeTerms.exactMatches[0] || afterTerms.exactMatches[0];
    const def1 = term1 ? dictionary[term1] : null;
    if (!def1) return null;

    // Get second term
    const term2 = afterTerms.exactMatches[0] || beforeTerms.exactMatches[1];
    const def2 = term2 ? dictionary[term2] : null;

    // Handle existence questions as single term requests
    if (isExistenceQuestion) {
      return {
        isRelationshipQuestion: true,
        isRelated: true,
        relationshipType: 'single_term',
        terms: [{ term: term1, definition: def1 }],
        response: getRandomElement(relationshipDict.responses.single_term)
          .replace('{term1}', def1.title || term1)
      };
    }

    // Two terms: Check relationship
    if (def1 && def2) {
      const isRelated = this.checkTermRelationship(def1, def2, term1, term2);
      const relationshipType = this.determineRelationshipType(def1, def2, term1, term2);
      return this.createRelationshipResponse(isRelated, relationshipType, def1, def2, term1, term2, language);
    }

    // Single term: Check remaining text
    let remainingText = lowercaseInput
      .replace(matches[0], ' ')
      .replace(term1.toLowerCase(), ' ');
    Object.values(relationshipDict.terms).flat().forEach(term => {
      remainingText = remainingText.replace(new RegExp(term, 'gi'), ' ');
    });
    remainingText = remainingText.replace(/\?/g, '').trim();

    if (remainingText.length > 0) {
      return {
        isRelationshipQuestion: true,
        isRelated: false,
        relationshipType: 'invalid_comparison',
        terms: [{ term: term1, definition: def1 }],
        response: getRandomElement(relationshipDict.responses.invalid_comparison)
          .replace('{term1}', def1.title || term1)
      };
    }

    // Single term response
    return {
      isRelationshipQuestion: true,
      isRelated: false,
      relationshipType: 'single_term',
      terms: [{ term: term1, definition: def1 }],
      response: getRandomElement(relationshipDict.responses.single_term)
        .replace('{term1}', def1.title || term1)
    };
  }
}

export const comparisonModule = new ComparisonModule();