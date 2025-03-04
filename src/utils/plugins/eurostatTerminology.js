/**
 * Custom compromise.js plugin for Eurostat terminology
 * Adds specialized recognition for statistical concepts, country codes, energy terms, and units
 */
import { getCountryCodes } from "../../data/countryCodes";
import { getStatisticalConcepts } from "../../data/statisticalConcepts";
import { getEnergyUnits } from "../../data/energyUnits";
import { getTimePeriods } from "../../data/timePeriods";

/**
 * Eurostat terminology plugin for compromise.js
 * @param {Object} Doc - The compromise Doc class
 * @param {Object} world - The compromise world object
 * @returns {Object} - The plugin object
 */
const eurostatTerminology = function(Doc, world) {
  // Add Eurostat-specific tags
  world.addTags({
    EurostatTerm: {
      isA: 'Noun',
      color: 'blue'
    },
    CountryCode: {
      isA: 'Noun',
      color: 'green'
    },
    EnergyUnit: {
      isA: 'Noun',
      color: 'orange'
    },
    StatisticalConcept: {
      isA: 'Noun',
      color: 'purple'
    },
    TimePeriod: {
      isA: 'Date',
      color: 'teal'
    }
  });

  // Define tag method for custom terms with language support
  Doc.prototype.eurostatTerms = function(language = "en") {
    // Get terms from dictionaries based on language
    const statisticalConcepts = getStatisticalConcepts(language);
    const energyUnits = getEnergyUnits(language);
    const countryCodes = getCountryCodes(language);
    const timePeriods = getTimePeriods(language);

    // Create RegExp patterns for matching - safeguard with empty arrays as fallback
    const conceptsRx = new RegExp('\\b(' + (statisticalConcepts || []).join('|') + ')\\b', 'i');
    const unitsRx = new RegExp('\\b(' + (energyUnits || []).join('|') + ')\\b', 'i');
    const countryRx = new RegExp('\\b(' + (countryCodes || []).join('|') + ')\\b', 'i');
    const periodsRx = new RegExp('\\b(' + (timePeriods || []).join('|') + ')\\b', 'i');

    // Only attempt to match if we have terms to match
    if (statisticalConcepts && statisticalConcepts.length) {
      this.match(conceptsRx).tag('StatisticalConcept');
    }
    if (energyUnits && energyUnits.length) {
      this.match(unitsRx).tag('EnergyUnit');
    }
    if (countryCodes && countryCodes.length) {
      this.match(countryRx).tag('CountryCode');
    }
    if (timePeriods && timePeriods.length) {
      this.match(periodsRx).tag('TimePeriod');
    }

    return this;
  };

  // Add general Eurostat terminology method with language support
  Doc.prototype.eurostat = function(language = "en") {
    return this.eurostatTerms(language);
  };

  // Add method to extract specifically tagged entities
  Doc.prototype.statisticalConcepts = function() {
    return this.match('#StatisticalConcept+');
  };

  Doc.prototype.energyUnits = function() {
    return this.match('#EnergyUnit+');
  };

  Doc.prototype.countryCodes = function() {
    return this.match('#CountryCode+');
  };

  Doc.prototype.eurostatTimePeriods = function() {
    return this.match('#TimePeriod+');
  };

  return Doc;
};

export default eurostatTerminology;