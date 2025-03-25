import { customEntities } from '../../../dictionaries/customEntities';
import { energyDefinitionsEn } from '../../../dictionaries/energyDefinitionsEn';
import { energyBalanceIndicators } from '../../../dictionaries/energyBalanceIndicators';

const buildLexicon = () => {
  const lexicon = {};
  
  // Add energy types from customEntities
  Object.values(customEntities).forEach(langEntities => {
    if (langEntities.energyTypes) {
      langEntities.energyTypes.forEach(term => {
        lexicon[term.toLowerCase()] = 'EnergyType';
      });
    }
  });

  // Add terms from energyDefinitionsEn
  Object.entries(energyDefinitionsEn).forEach(([key, def]) => {
    if (def.keywords) {
      def.keywords.forEach(keyword => {
        lexicon[keyword.toLowerCase()] = 'EnergyTerm';
      });
    }
  });

  // Add indicators from energyBalanceIndicators
  Object.values(energyBalanceIndicators).forEach(indicator => {
    indicator.patterns.forEach(pattern => {
      lexicon[pattern.toLowerCase()] = 'EnergyIndicator';
    });
  });

  return lexicon;
};

const plugin = {
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
  words: buildLexicon(),
  api: (Doc, world) => {
    // Extend the compromise Document prototype correctly
    Doc.prototype.energyTypes = function() {
      let matches = this.match('#EnergyType+');
      return matches;
    };

    Doc.prototype.energyTerms = function() {
      let matches = this.match('#EnergyTerm+');
      return matches;
    };

    Doc.prototype.energyIndicators = function() {
      let matches = this.match('#EnergyIndicator+');
      return matches;
    };

    return Doc;
  }
};

export default plugin;