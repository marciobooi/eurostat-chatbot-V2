import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';
import { NLP_CONFIG } from '../../config/nlpConfig';
import { customEntities } from '../../dictionaries/customEntities';
import nlp from 'compromise';

class EntityExtractor {
  constructor() {
    this.nlp = winkNLP(model);
    this.cache = new Map();
  }

  getCacheKey(text, language) {
    return `${language}:${text}`;
  }

  async extractEntities(text, language = NLP_CONFIG.languages.default, compromiseEntities = null) {
    const cacheKey = this.getCacheKey(text, language);
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const doc = this.nlp.readDoc(text);
    
    // Extract standard entities
    const standardEntities = this.extractStandardEntities(doc);
    
    // Extract custom energy domain entities, now enhanced with Compromise results
    const customEntitiesResult = await this.extractCustomEntities(text.toLowerCase(), language, compromiseEntities);

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
    
    // First, process any pre-extracted Compromise.js entities
    if (compromiseEntities) {
      results.energyTypes = await Promise.all(compromiseEntities.types.map(async term => ({
        text: term,
        type: 'energyType',
        confidence: 1,
        canonical: await this.findCanonicalForm(term, language)
      })));

      results.energyTerms = await Promise.all(compromiseEntities.terms.map(async term => ({
        text: term,
        type: 'energyTerm',
        confidence: 1,
        canonical: await this.findCanonicalForm(term, language)
      })));

      results.indicators = await Promise.all(compromiseEntities.indicators.map(async term => ({
        text: term,
        type: 'indicator',
        confidence: 1,
        canonical: await this.findCanonicalForm(term, language)
      })));
    }
    
    // Then process dictionary-based entities for any terms not caught by Compromise
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
        
        // Use Promise.all to handle multiple async canonical form lookups
        const mappedTerms = await Promise.all(sortedTerms.map(async term => ({
          text: term,
          type: category,
          confidence: 1,
          canonical: await this.findCanonicalForm(term, language)
        })));
        
        results[category] = (results[category] || []).concat(mappedTerms);
      }
    }

    return {
      energyDomain: results
    };
  }

  async findCanonicalForm(term, language) {
    const entityDictionary = customEntities[language] || customEntities[NLP_CONFIG.languages.default];
    
    // Look for exact matches first
    for (const [category, terms] of Object.entries(entityDictionary)) {
      const exactMatch = terms.find(t => t.toLowerCase() === term.toLowerCase());
      if (exactMatch) {
        return exactMatch;
      }
    }
    
    // If no exact match, try partial matches
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