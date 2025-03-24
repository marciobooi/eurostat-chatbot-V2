import { relationshipPatterns } from '../../dictionaries/relationshipPatterns';
import { energyDictionary } from '../energyDictionary';
import { CONFIG } from '../../i18n';
import { getRandomElement } from '../randomUtils';

class ComparisonModule {
  extractTermsFromMessage(input, dictionary) {
    const words = input.toLowerCase().split(/\s+/);
    const terms = new Set();
    const partialMatches = new Set();

    // First pass: try to find exact energy terms
    Object.entries(dictionary).forEach(([term, def]) => {
      const termLower = term.toLowerCase();
      if (words.includes(termLower) || input.includes(termLower)) {
        terms.add(term);
      }
    });

    // Second pass: try alternative names and partial matches
    if (terms.size === 0) {
      Object.entries(dictionary).forEach(([term, def]) => {
        const termLower = term.toLowerCase();
        const title = def.title?.toLowerCase() || '';
        
        if (words.some(word => {
          const isPartialMatch = termLower.includes(word) || title.includes(word);
          if (isPartialMatch) partialMatches.add(term);
          return isPartialMatch;
        })) {
          terms.add(term);
        }
        
        if (def.text?.toLowerCase().includes(input)) {
          terms.add(term);
          if (def.subFuels) partialMatches.add(...def.subFuels);
          if (def.related) partialMatches.add(...def.related);
        }
      });
    }

    const result = Array.from(terms);
    return {
      exactMatches: result,
      partialMatches: Array.from(partialMatches).filter(match => !result.includes(match))
    };
  }

  checkTermRelationship(def1, def2, term1, term2) {
    return (
      this.hasDirectRelationship(def1, def2, term1, term2) ||
      this.hasHierarchicalRelationship(def1, def2, term1, term2) ||
      this.hasCategoryRelationship(def1, def2) ||
      this.hasTextualRelationship(def1, def2)
    );
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
    return (
      def1.category === def2.category ||
      def1.family === def2.family ||
      def1.subFamily === def2.subFamily
    );
  }

  hasTextualRelationship(def1, def2) {
    const text1 = def1.text?.toLowerCase() || '';
    const text2 = def2.text?.toLowerCase() || '';
    const title1 = def1.title?.toLowerCase() || '';
    const title2 = def2.title?.toLowerCase() || '';

    const allTerms = Object.values(relationshipPatterns[CONFIG.DEFAULT_LANGUAGE].terms).flat();

    const hasDirectMention = text1.includes(title2) || text2.includes(title1);

    const hasTermRelation = allTerms.some(term => 
      (text1.includes(term) && text1.includes(title2)) ||
      (text2.includes(term) && text2.includes(title1))
    );

    const sentences1 = text1.split(/[.!?]+/);
    const sentences2 = text2.split(/[.!?]+/);

    const hasSentenceRelation = sentences1.some(sentence => 
      sentence.includes(title2) && allTerms.some(term => sentence.includes(term))
    ) || sentences2.some(sentence => 
      sentence.includes(title1) && allTerms.some(term => sentence.includes(term))
    );

    return hasDirectMention || hasTermRelation || hasSentenceRelation;
  }

  determineRelationshipType(def1, def2, term1, term2) {
    if (def1.subFuels?.includes(term2) || def2.parentFuel === term1) {
      return 'parent-child';
    } else if (def2.subFuels?.includes(term1) || def1.parentFuel === term2) {
      return 'child-parent';
    } else if (def1.family === def2.family) {
      return 'same-family';
    } else if (def1.category === def2.category) {
      return 'same-category';
    } else if (def1.derivedFrom?.includes(term2) || def2.derivedFrom?.includes(term1)) {
      return 'derived';
    } else if (this.hasTextualRelationship(def1, def2)) {
      return 'textual';
    }
    return '';
  }

  createRelationshipResponse(isRelated, relationshipType, def1, def2, term1, term2, language) {
    const responses = relationshipPatterns[language]?.responses || relationshipPatterns[CONFIG.DEFAULT_LANGUAGE].responses;
    const responseList = isRelated ? responses.positive : responses.negative;
    
    const response = getRandomElement(responseList)
      .replace('{term1}', def1.title || term1)
      .replace('{term2}', def2.title || term2);

    return {
      isRelated,
      relationshipType,
      terms: [
        {term: term1, definition: def1},
        {term: term2, definition: def2}
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
    
    const { exactMatches: terms, partialMatches } = this.extractTermsFromMessage(lowercaseInput, dictionary);
    
    // Use relationship terms dictionary to identify category patterns
    const isCategoryPattern = (patternSource) => {
      const lowercasePattern = patternSource.toLowerCase();
      return Object.values(relationshipDict.terms).some(termGroup => 
        termGroup.some(term => 
          lowercasePattern.includes(term.toLowerCase())
        )
      );
    };

    const categoryPatterns = relationshipDict.patterns.filter(pattern => 
      isCategoryPattern(pattern.source)
    );

    const isRelationshipQuestion = relationshipDict.patterns.some(pattern => pattern.test(lowercaseInput));
    if (!isRelationshipQuestion) return null;

    if (terms.length === 1) {
      const term = terms[0];
      const def = dictionary[term];
      
      if (!def) return null;

      // Check if this is a category question using our filtered patterns
      const matchedPattern = categoryPatterns.find(pattern => pattern.test(lowercaseInput));

      if (matchedPattern) {
        // Extract category using matched pattern
        const matches = lowercaseInput.match(matchedPattern);
        if (!matches) return null;

        // Get the part after the pattern that represents the category
        const categoryPart = lowercaseInput
          .substring(matches.index + matches[0].length)
          .replace(/\?+$/, '')
          .trim()
          .toLowerCase();

        // Rest of the category comparison logic remains the same
        const defCategory = def.category?.toLowerCase() || '';
        const defFamily = def.family?.toLowerCase() || '';
        const defSubFamily = def.subFamily?.toLowerCase() || '';
        
        if ((categoryPart.includes('fossil') && categoryPart.includes('fuel')) ||
            defCategory.includes(categoryPart) || 
            categoryPart.includes(defCategory) ||
            defFamily.includes(categoryPart) ||
            categoryPart.includes(defFamily) ||
            defSubFamily.includes(categoryPart) ||
            categoryPart.includes(defSubFamily)) {
          
          return {
            isRelationshipQuestion: true,
            isRelated: true,
            relationshipType: 'category-match',
            terms: [{
              term,
              definition: def
            }],
            response: getRandomElement(relationshipDict.responses.positive)
              .replace('{term1}', def.title || term)
              .replace('{term2}', categoryPart)
          };
        }

        const categoryTerms = this.extractTermsFromMessage(categoryPart, dictionary);
        if (categoryTerms.exactMatches.length === 0) {
          return {
            isRelationshipQuestion: true,
            isRelated: false,
            relationshipType: 'invalid_comparison',
            terms: [{
              term,
              definition: def
            }],
            response: getRandomElement(relationshipDict.responses.invalid_comparison)
              .replace('{term1}', def.title || term)
          };
        }
      }
    }

    if (terms.length === 0 && partialMatches.length > 0) {
      const mainTerm = partialMatches[0];
      const def = dictionary[mainTerm];
      
      if (!def) return null;

      const suggestions = [
        ...(def.subFuels || []),
        ...(def.related || [])
      ].filter(term => term !== mainTerm);

      return {
        isRelationshipQuestion: true,
        isRelated: false,
        relationshipType: 'suggestion',
        terms: [{
          term: mainTerm,
          definition: def
        }],
        suggestions,
        response: getRandomElement(relationshipDict.responses.suggestion || relationshipDict.responses.single_term)
          .replace('{term1}', def.title || mainTerm)
      };
    }

    if (terms.length === 0) return null;

    const [term1, term2] = terms;
    const def1 = dictionary[term1];
    const def2 = terms.length > 1 ? dictionary[term2] : null;

    if (!def1 || (terms.length > 1 && !def2)) {
      const validTerm = def1 ? term1 : null;
      if (validTerm) {
        const def = dictionary[validTerm];
        return {
          isRelationshipQuestion: true,
          isRelated: false,
          relationshipType: 'single_term',
          terms: [{
            term: validTerm,
            definition: def
          }],
          response: getRandomElement(relationshipDict.responses.single_term)
            .replace('{term1}', def.title || validTerm)
        };
      }
      return null;
    }

    if (def1 && def2) {
      const isRelated = this.checkTermRelationship(def1, def2, term1, term2);
      const relationshipType = this.determineRelationshipType(def1, def2, term1, term2);
      
      return this.createRelationshipResponse(isRelated, relationshipType, def1, def2, term1, term2, language);
    }

    return {
      isRelationshipQuestion: true,
      isRelated: false,
      relationshipType: 'single_term',
      terms: [{
        term: term1,
        definition: def1
      }],
      response: getRandomElement(relationshipDict.responses.single_term)
        .replace('{term1}', def1.title || term1)
    };
  }
}

export const comparisonModule = new ComparisonModule();