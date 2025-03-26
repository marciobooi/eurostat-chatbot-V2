import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';
import { NLP_CONFIG } from '../../config/nlpConfig';
import { customEntities } from '../../dictionaries/customEntities';
import nlp from 'compromise';
import { energyTermsEn, energyTermsFr, energyTermsDe } from './plugins/energyTerms';
import { getDictionary } from '../energyDictionary';
import { commonQuestionPhrases } from '../../dictionaries/questionPhrases';

class EntityExtractor {
  constructor() {
    this.nlp = winkNLP(model);
    this.cache = new Map();
    this.languagePlugins = {
      en: energyTermsEn,
      fr: energyTermsFr,
      de: energyTermsDe
    };
  }

  getCacheKey(text, language) {
    return `${language}:${text}`;
  }

  processWithLanguage(text, language) {
    const plugin = this.languagePlugins[language] || this.languagePlugins[NLP_CONFIG.languages.default];
    const instance = nlp.extend(plugin);
    return instance(text);
  }

  async extractEntities(text, language = NLP_CONFIG.languages.default, compromiseEntities = null) {
    // Remove question marks and other punctuation, trim whitespace
    const normalizedText = text.toLowerCase().replace(/[?.,!]/g, '').trim();
    const cacheKey = this.getCacheKey(normalizedText, language);
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Get question patterns for language
    const questionPatterns = commonQuestionPhrases[language] || commonQuestionPhrases[NLP_CONFIG.languages.default];
    const questionTerms = [];
    
    // Extract terms using question patterns
    for (const pattern of questionPatterns) {
      if (pattern instanceof RegExp) {
        const match = normalizedText.match(pattern);
        if (match && match[1]) {
          const term = match[1].trim();
          if (term && !questionTerms.includes(term)) {
            questionTerms.push(term);
            break; // Use first matching pattern
          }
        }
      }
    }

    const doc = this.nlp.readDoc(text);
    
    // Extract standard entities
    const standardEntities = this.extractStandardEntities(doc);
    
    // Process with language-specific plugin if no pre-extracted entities
    if (!compromiseEntities) {
      const nlpDoc = this.processWithLanguage(text, language);
      compromiseEntities = {
        types: [...nlpDoc.energyTypes().out('array'), ...questionTerms],
        terms: nlpDoc.energyTerms().out('array'),
        indicators: nlpDoc.energyIndicators().out('array')
      };
    }

    // Extract custom energy domain entities
    const customEntitiesResult = await this.extractCustomEntities(
      normalizedText, 
      language, 
      compromiseEntities
    );

    const result = {
      standardEntities,
      ...customEntitiesResult,
      language,
      confidence: this.calculateConfidence(standardEntities, customEntitiesResult)
    };

    // Cache results
    this.cache.set(cacheKey, result);
    
    // Maintain cache size
    if (this.cache.size > NLP_CONFIG.cache.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    return result;
  }

  extractStandardEntities(doc) {
    try {
      const entities = doc.entities();
      return {
        organizations: Array.from(entities).filter(e => e.entityType() === 'organization').map(e => ({
          text: e.text(),
          type: e.entityType(),
          confidence: 1
        })),
        locations: Array.from(entities).filter(e => e.entityType() === 'location').map(e => ({
          text: e.text(),
          type: e.entityType(),
          confidence: 1
        })),
        numbers: Array.from(entities).filter(e => e.entityType() === 'number').map(e => ({
          text: e.text(),
          type: e.entityType(),
          confidence: 1
        })),
        dates: Array.from(entities).filter(e => e.entityType() === 'date').map(e => ({
          text: e.text(),
          type: e.entityType(),
          confidence: 1
        }))
      };
    } catch (error) {
      console.error('Error extracting standard entities:', error);
      return {
        organizations: [],
        locations: [],
        numbers: [],
        dates: []
      };
    }
  }

  async extractCustomEntities(text, language, compromiseEntities = null) {
    const entityDictionary = customEntities[language] || customEntities[NLP_CONFIG.languages.default];
    const results = {};
    
    // Process pre-extracted Compromise.js entities with canonical forms
    if (compromiseEntities) {
      // Get language-specific dictionary for canonical forms
      const languageDict = getDictionary(language);
      
      results.energyTypes = await Promise.all(compromiseEntities.types.map(async term => ({
        text: term,
        type: 'energyType',
        confidence: 1,
        canonical: await this.findCanonicalForm(term, language, languageDict)
      })));

      results.energyTerms = await Promise.all(compromiseEntities.terms.map(async term => ({
        text: term,
        type: 'energyTerm',
        confidence: 1,
        canonical: await this.findCanonicalForm(term, language, languageDict)
      })));

      results.indicators = await Promise.all(compromiseEntities.indicators.map(async term => ({
        text: term,
        type: 'indicator',
        confidence: 1,
        canonical: await this.findCanonicalForm(term, language, languageDict)
      })));
    }
    
    // Process dictionary-based entities for terms not caught by Compromise
    for (const [category, terms] of Object.entries(entityDictionary)) {
      const found = terms.filter(term => {
        // Skip if already found by Compromise
        if (compromiseEntities?.types.includes(term) || 
            compromiseEntities?.terms.includes(term) ||
            compromiseEntities?.indicators.includes(term)) {
          return false;
        }
        // Create word boundary aware regex
        const regex = new RegExp(`\\b${term.toLowerCase()}\\b`, 'i');
        return regex.test(text);
      });

      if (found.length > 0) {
        // Sort by length (descending) to prefer more specific matches
        const sortedTerms = found.sort((a, b) => b.length - a.length);
        
        // Get language-specific dictionary for canonical forms
        const languageDict = getDictionary(language);
        
        // Use Promise.all to handle multiple async canonical form lookups
        const mappedTerms = await Promise.all(sortedTerms.map(async term => ({
          text: term,
          type: category,
          confidence: 1,
          canonical: await this.findCanonicalForm(term, language, languageDict)
        })));
        
        results[category] = (results[category] || []).concat(mappedTerms);
      }
    }

    return {
      energyDomain: results
    };
  }

  async findCanonicalForm(term, language, languageDict) {
    const entityDictionary = customEntities[language] || customEntities[NLP_CONFIG.languages.default];
    
    // First try language-specific dictionary
    if (languageDict) {
      const dictEntry = Object.entries(languageDict).find(([_, def]) => 
        def.keywords?.some(k => k.toLowerCase() === term.toLowerCase())
      );
      if (dictEntry) {
        return dictEntry[0]; // Return the canonical form from dictionary
      }
    }
    
    // Then try entity dictionary
    for (const [category, terms] of Object.entries(entityDictionary)) {
      const exactMatch = terms.find(t => t.toLowerCase() === term.toLowerCase());
      if (exactMatch) {
        return exactMatch;
      }
    }
    
    // Try partial matches as fallback
    for (const [category, terms] of Object.entries(entityDictionary)) {
      const partialMatch = terms.find(t => 
        t.toLowerCase().includes(term.toLowerCase()) || 
        term.toLowerCase().includes(t.toLowerCase())
      );
      if (partialMatch) {
        return partialMatch;
      }
    }
    
    return term;
  }

  calculateConfidence(standardEntities, customEntities) {
    let totalEntities = 0;
    let validEntities = 0;

    // Count standard entities
    Object.values(standardEntities).forEach(entities => {
      totalEntities += entities.length;
      validEntities += entities.filter(e => e.confidence >= NLP_CONFIG.entityExtraction.confidenceThreshold).length;
    });

    // Count custom entities
    if (customEntities.energyDomain) {
      Object.values(customEntities.energyDomain).forEach(entities => {
        if (Array.isArray(entities)) {
          totalEntities += entities.length;
          validEntities += entities.length; // Custom entities are pre-validated
        }
      });
    }

    return totalEntities > 0 ? validEntities / totalEntities : 0;
  }
}

export const entityExtractor = new EntityExtractor();