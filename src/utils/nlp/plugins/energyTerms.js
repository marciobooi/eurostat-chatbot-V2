import { customEntities } from '../../../dictionaries/customEntities';
import { energyDefinitionsEn } from '../../../dictionaries/energyDefinitionsEn';
import { energyBalanceIndicators } from '../../../dictionaries/energyBalanceIndicators';
import { NLP_CONFIG } from '../../../config/nlpConfig';

const buildLanguageSpecificLexicon = (language) => {
  const lexicon = {};
  const langEntities = customEntities[language] || customEntities[NLP_CONFIG.languages.default];
  
  // Add language-specific energy types
  if (langEntities.energyTypes) {
    langEntities.energyTypes.forEach(term => {
      lexicon[term.toLowerCase()] = 'EnergyType';
    });
  }
  
  // Add language-specific terms from energy definitions
  const energyDefs = energyDefinitionsEn; // TODO: Add language-specific definitions when available
  Object.entries(energyDefs).forEach(([key, def]) => {
    // Add main term
    lexicon[key.toLowerCase()] = 'EnergyType';
    
    // Add keywords
    if (def.keywords) {
      def.keywords.forEach(keyword => {
        lexicon[keyword.toLowerCase()] = 'EnergyTerm';
      });
    }

    // Add title as term
    if (def.title) {
      lexicon[def.title.toLowerCase()] = 'EnergyType';
    }

    // Add subfuels as terms
    if (def.subFuels) {
      def.subFuels.forEach(fuel => {
        lexicon[fuel.toLowerCase()] = 'EnergyTerm';
      });
    }
  });

  // Add language-specific indicators
  Object.values(energyBalanceIndicators).forEach(indicator => {
    indicator.patterns.forEach(pattern => {
      lexicon[pattern.toLowerCase()] = 'EnergyIndicator';
    });
  });

  return lexicon;
};

const languages = {
  en: buildLanguageSpecificLexicon('en'),
  fr: buildLanguageSpecificLexicon('fr'),
  de: buildLanguageSpecificLexicon('de')
};

const getLanguagePlugin = (language) => ({
  tags: {
    EnergyType: {
      isA: 'Noun',
    },
    EnergyTerm: {
      isA: 'Noun',
    },
    EnergyIndicator: {
      isA: 'Metric',
    },
  },
  words: languages[language] || languages[NLP_CONFIG.languages.default],
  api: (Doc) => {
    Doc.prototype.energyTypes = function() {
      // Match both single terms and multi-word phrases
      const matches = this.match('#EnergyType+');
      const terms = [];
      
      // Get regular matches
      if (matches.found) {
        matches.forEach(m => {
          terms.push(m.text().toLowerCase());
        });
      }
      
      // Handle question patterns
      const questions = this.match('(what|tell me|describe|explain) (is|about|are) [#EnergyType+]');
      if (questions.found) {
        questions.forEach(q => {
          const term = q.text()
            .replace(/^(what|tell me|describe|explain) (is|about|are) /i, '')
            .toLowerCase();
          terms.push(term);
        });
      }

      return {
        out: (format) => format === 'array' ? terms : terms.join(' ')
      };
    };

    Doc.prototype.energyTerms = function() {
      const matches = this.match('#EnergyTerm+');
      const terms = [];
      
      // Get regular matches
      if (matches.found) {
        matches.forEach(m => {
          terms.push(m.text().toLowerCase());
        });
      }
      
      // Handle question patterns
      const questions = this.match('(what|tell me|describe|explain) (is|about|are) [#EnergyTerm+]');
      if (questions.found) {
        questions.forEach(q => {
          const term = q.text()
            .replace(/^(what|tell me|describe|explain) (is|about|are) /i, '')
            .toLowerCase();
          terms.push(term);
        });
      }

      return {
        out: (format) => format === 'array' ? terms : terms.join(' ')
      };
    };

    Doc.prototype.energyIndicators = function() {
      const matches = this.match('#EnergyIndicator+');
      const terms = [];
      
      if (matches.found) {
        matches.forEach(m => {
          terms.push(m.text().toLowerCase());
        });
      }

      return {
        out: (format) => format === 'array' ? terms : terms.join(' ')
      };
    };

    return Doc;
  }
});

export const energyTermsEn = getLanguagePlugin('en');
export const energyTermsFr = getLanguagePlugin('fr');
export const energyTermsDe = getLanguagePlugin('de');

export default energyTermsEn; // Default to English plugin