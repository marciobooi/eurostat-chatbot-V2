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
    const customEntitiesResult = await this.extractCustomEntities(text.toLowerCase(), language);

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

  async extractCustomEntities(text, language) {
    const entityDictionary = customEntities[language] || customEntities[NLP_CONFIG.languages.default];
    const results = {};
    
    for (const [category, terms] of Object.entries(entityDictionary)) {
      const found = terms.filter(term => {
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
        
        results[category] = mappedTerms;
      }
    }

    return {
      energyDomain: results
    };
  }

  async findCanonicalForm(term, language) {
    try {
      // Get the energy definitions for the specified language
      let energyDefs;
      try {
        const module = await import(`../../dictionaries/energyDefinitions/${language}.js`);
        energyDefs = module.energyDefinitionsEn;
      } catch {
        // Fallback to English if language-specific file doesn't exist
        const module = await import('../../dictionaries/energyDefinitions/en.js');
        energyDefs = module.energyDefinitionsEn;
      }

      // Convert term to lowercase for comparison
      const normalizedTerm = term.toLowerCase();

      // First check if the term is an exact match with a main term
      if (energyDefs[normalizedTerm]) {
        return normalizedTerm;
      }

      let bestMatch = null;
      let bestScore = 0;

      // Look through all energy definitions
      for (const [mainTerm, definition] of Object.entries(energyDefs)) {
        let score = 0;

        // Exact keyword match gets highest priority
        if (definition.keywords?.includes(normalizedTerm)) {
          score = 1.0;
        }
        // Related term match gets next priority
        else if (definition.related?.includes(normalizedTerm)) {
          score = 0.9;
        }
        // SubFuel match gets lowest priority
        else if (definition.subFuels?.map(f => f.toLowerCase()).includes(normalizedTerm)) {
          score = 0.8;
        }

        // Prefer main fuels over derivatives
        if (definition.isMainFuel) {
          score *= 1.2;
        }

        // Update best match if this score is higher
        if (score > bestScore) {
          bestScore = score;
          bestMatch = mainTerm;
        }
      }

      // Return the best match if found, otherwise return original term
      return bestMatch || term;
    } catch (error) {
      console.error('Error in findCanonicalForm:', error);
      return term;
    }
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