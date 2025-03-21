import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';
import { NLP_CONFIG } from '../../config/nlpConfig';
import { customEntities } from '../../dictionaries/customEntities';

class EntityExtractor {
  constructor() {
    this.nlp = winkNLP(model);
    this.cache = new Map();
  }

  getCacheKey(text, language) {
    return `${language}:${text}`;
  }

  async extractEntities(text, language = NLP_CONFIG.languages.default) {
    const cacheKey = this.getCacheKey(text, language);
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const doc = this.nlp.readDoc(text);
    
    // Extract standard entities
    const standardEntities = this.extractStandardEntities(doc);
    
    // Extract custom energy domain entities
    const customEntitiesResult = this.extractCustomEntities(text.toLowerCase(), language);

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

  extractCustomEntities(text, language) {
    const entityDictionary = customEntities[language] || customEntities[NLP_CONFIG.languages.default];
    const results = {};
    
    for (const [category, terms] of Object.entries(entityDictionary)) {
      const found = terms.filter(term => text.includes(term.toLowerCase()));
      if (found.length > 0) {
        results[category] = found.map(term => ({
          text: term,
          type: category,
          confidence: 1
        }));
      }
    }

    return {
      energyDomain: results
    };
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
        totalEntities += entities.length;
        validEntities += entities.length; // Custom entities are pre-validated
      });
    }

    return totalEntities > 0 ? validEntities / totalEntities : 0;
  }
}

export const entityExtractor = new EntityExtractor();