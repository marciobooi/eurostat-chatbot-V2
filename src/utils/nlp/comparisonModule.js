import { relationshipPatterns } from '../../dictionaries/relationshipPatterns';
import { energyDictionary } from '../energyDictionary';
import { CONFIG } from '../../i18n';
import { getRandomElement } from '../randomUtils';

class ComparisonModule {
  // Extract terms by first performing an exact match search and then a partial match search
  extractTermsFromMessage(input, dictionary) {
    const words = input.toLowerCase().split(/\s+/);
    const terms = new Set();
    const partialMatches = new Set();
    const chunks = this.generateChunks(words);
    const usedWordIndices = new Set();

    // First pass: exact matches
    chunks.forEach(chunk => {
      if (this.chunkOverlapsUsed(chunk, usedWordIndices)) return;

      Object.entries(dictionary).forEach(([term, def]) => {
        const termLower = term.toLowerCase();
        const title = def.title?.toLowerCase() || '';
        if (termLower === chunk.text || title === chunk.text) {
          terms.add(term);
          this.markChunkUsed(chunk, usedWordIndices);
        }
      });
    });

    // Second pass: partial matches (only if no exact match)
    if (terms.size === 0) {
      chunks.forEach(chunk => {
        if (this.chunkOverlapsUsed(chunk, usedWordIndices)) return;
        Object.entries(dictionary).forEach(([term, def]) => {
          const termLower = term.toLowerCase();
          const title = def.title?.toLowerCase() || '';
          if (
            (termLower.includes(chunk.text) || title.includes(chunk.text)) &&
            chunk.text.length >= 4 &&
            (chunk.text.length >= termLower.length * 0.6 ||
              termLower.startsWith(chunk.text) ||
              termLower.endsWith(chunk.text))
          ) {
            partialMatches.add(term);
            this.markChunkUsed(chunk, usedWordIndices);
          }
        });
      });
    }

    return {
      exactMatches: Array.from(terms),
      partialMatches: Array.from(partialMatches).filter(match => !terms.has(match))
                                   .sort((a, b) => a.length - b.length)
    };
  }

  // Helper to generate 1-3 word chunks with indices
  generateChunks(words) {
    const chunks = [];
    for (let i = 0; i < words.length; i++) {
      chunks.push({ text: words[i], startIndex: i, endIndex: i });
      if (i < words.length - 1) {
        chunks.push({ text: `${words[i]} ${words[i + 1]}`, startIndex: i, endIndex: i + 1 });
      }
      if (i < words.length - 2) {
        chunks.push({ text: `${words[i]} ${words[i + 1]} ${words[i + 2]}`, startIndex: i, endIndex: i + 2 });
      }
    }
    // Prefer longer chunks first
    return chunks.sort((a, b) => b.text.length - a.text.length);
  }

  chunkOverlapsUsed(chunk, usedIndices) {
    for (let i = chunk.startIndex; i <= chunk.endIndex; i++) {
      if (usedIndices.has(i)) return true;
    }
    return false;
  }

  markChunkUsed(chunk, usedIndices) {
    for (let i = chunk.startIndex; i <= chunk.endIndex; i++) {
      usedIndices.add(i);
    }
  }

  // Relationship checks remain similar but could include enhanced logging or symmetry checks
  checkTermRelationship(def1, def2, term1, term2) {
    const direct = this.hasDirectRelationship(def1, def2, term1, term2);
    const hierarchical = this.hasHierarchicalRelationship(def1, def2, term1, term2);
    const category = this.hasCategoryRelationship(def1, def2);
    const textual = this.hasTextualRelationship(def1, def2);
    return direct || hierarchical || category || textual;
  }

  hasDirectRelationship(def1, def2, term1, term2) {
    return def1.related?.includes(term2) || def2.related?.includes(term1);
  }

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

  hasCategoryRelationship(def1, def2) {
    return def1.category === def2.category ||
           def1.family === def2.family ||
           def1.subFamily === def2.subFamily;
  }

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
      return (matchedText.includes(title1) && text2.includes(title2)) ||
             (matchedText.includes(title2) && text1.includes(title1));
    });
  }

  determineRelationshipType(def1, def2, term1, term2) {
    const relationshipDict = relationshipPatterns[CONFIG.DEFAULT_LANGUAGE];
    for (const [type, termList] of Object.entries(relationshipDict.terms)) {
      const matches = termList.some(relTerm => {
        const pattern = new RegExp(relTerm, 'i');
        return (def1.text && pattern.test(def1.text) && def1.text.includes(term2)) ||
               (def2.text && pattern.test(def2.text) && def2.text.includes(term1)) ||
               (def1.subFuels?.includes(term2) && type === 'inclusion') ||
               (def2.subFuels?.includes(term1) && type === 'inclusion') ||
               (def1.derivedFrom?.includes(term2) && type === 'derivation') ||
               (def2.derivedFrom?.includes(term1) && type === 'derivation') ||
               (def1.parentFuel === term2 && type === 'production') ||
               (def2.parentFuel === term1 && type === 'production');
      });
      if (matches) return type;
    }
    if (def1.family === def2.family) return 'same_family';
    if (def1.category === def2.category) return 'same_category';
    if (def1.subFamily === def2.subFamily) return 'same_subfamily';
    return 'related';
  }

  createRelationshipResponse(isRelated, relationshipType, def1, def2, term1, term2, language) {
    const responses = relationshipPatterns[language]?.responses ||
                      relationshipPatterns[CONFIG.DEFAULT_LANGUAGE].responses;
    const responseList = isRelated ? responses.positive : responses.negative;
    const response = getRandomElement(responseList)
      .replace('{term1}', def1.title || term1)
      .replace('{term2}', def2.title || term2);

    return {
      isRelated,
      relationshipType,
      terms: [
        { term: term1, definition: def1 },
        { term: term2, definition: def2 }
      ],
      response,
      isRelationshipQuestion: true
    };
  }

  checkRelationship(message, language = CONFIG.DEFAULT_LANGUAGE) {
    if (!message) return null;
    const lowercaseInput = message.toLowerCase();
    const dictionary = energyDictionary[language] || energyDictionary[CONFIG.DEFAULT_LANGUAGE];
    const relationshipDict = relationshipPatterns[language] || relationshipPatterns[CONFIG.DEFAULT_LANGUAGE];
    
    const matchedPattern = relationshipDict.patterns.find(pattern => pattern.test(lowercaseInput));
    if (!matchedPattern) return null;

    const matches = lowercaseInput.match(matchedPattern);
    if (!matches) return null;

    // Extract text before and after the matched pattern
    const before = lowercaseInput.substring(0, matches.index).trim();
    const after = lowercaseInput.substring(matches.index + matches[0].length).trim();

    const beforeTerms = this.extractTermsFromMessage(before || matches[0], dictionary);
    const afterTerms = this.extractTermsFromMessage(after.replace(/\?$/, ''), dictionary);

    // If no exact matches, try using partial matches for suggestion responses
    if (beforeTerms.exactMatches.length === 0 && afterTerms.exactMatches.length === 0) {
      const allPartials = [...beforeTerms.partialMatches, ...afterTerms.partialMatches];
      if (allPartials.length > 0) {
        const suggestedTerm = allPartials[0];
        const def = dictionary[suggestedTerm];
        if (!def) return null;
        const suggestions = [
          ...(def.subFuels || []),
          ...(def.related || [])
        ].filter(term => term !== suggestedTerm);
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

    const term1 = beforeTerms.exactMatches[0] || afterTerms.exactMatches[0];
    const def1 = term1 ? dictionary[term1] : null;
    if (!def1) return null;

    const term2 = afterTerms.exactMatches[0] || beforeTerms.exactMatches[1];
    const def2 = term2 ? dictionary[term2] : null;

    if (def1 && def2) {
      const isRelated = this.checkTermRelationship(def1, def2, term1, term2);
      const relationshipType = this.determineRelationshipType(def1, def2, term1, term2);
      return {
        isRelationshipQuestion: true,
        isRelated,
        relationshipType,
        terms: [
          { term: term1, definition: def1 },
          { term: term2, definition: def2 }
        ],
        response: getRandomElement(isRelated ? relationshipDict.responses.positive : relationshipDict.responses.negative)
                    .replace('{term1}', def1.title || term1)
                    .replace('{term2}', def2.title || term2)
      };
    }

    // If only one term is found, or if there's extra unknown text, handle accordingly
    let remainingText = lowercaseInput.replace(matches[0], ' ').replace(term1.toLowerCase(), ' ');
    Object.values(relationshipDict.terms).flat().forEach(relTerm => {
      remainingText = remainingText.replace(new RegExp(relTerm, 'gi'), ' ');
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
