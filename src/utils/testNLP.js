/**
 * Test utility for Eurostat NLP optimizations
 * Enables testing entity extraction with visual feedback in the chat interface
 */
import {
  extractEntities,
  extractEnergyEntities,
  extractStatisticalConcepts,
  extractTimeInformation,
  extractCountries
} from './entityExtractor';

/**
 * Debug function to visualize what entities are recognized in a message
 * @param {string} message - The user message to analyze
 * @param {string} language - Language code (en, fr, de)
 * @returns {string} Formatted debug information
 */
export const showRecognizedEntities = (message, language = "en") => {
  if (!message) return "No message to analyze";
  
  try {
    // Extract all entities
    const entities = extractEntities(message, language);
    
    // Prepare debug report
    let report = "🧠 NLP Analysis:\n\n";
    
    // Statistical concepts
    if (entities.statisticalConcepts.length > 0) {
      report += "📊 Statistical Concepts: " + entities.statisticalConcepts.join(", ") + "\n";
    }
    
    // Countries
    if (entities.countries.length > 0) {
      report += "🌍 Countries: " + entities.countries.join(", ") + "\n";
    }
    
    // Energy units
    if (entities.energyUnits.length > 0) {
      report += "⚡ Energy Units: " + entities.energyUnits.join(", ") + "\n";
    }
    
    // Time periods
    if (entities.timePeriods.length > 0) {
      report += "⏱️ Time Periods: " + entities.timePeriods.join(", ") + "\n";
    }
    
    // Dates
    if (entities.dates.length > 0) {
      report += "📅 Dates: " + entities.dates.join(", ") + "\n";
    }
    
    // Numbers
    if (entities.numbers.length > 0) {
      report += "🔢 Numbers: " + entities.numbers.join(", ") + "\n";
    }
    
    if (report === "🧠 NLP Analysis:\n\n") {
      report += "No entities recognized in this message.";
    }
    
    return report;
  } catch (error) {
    console.error("Error in showRecognizedEntities:", error);
    return "Error analyzing message: " + error.message;
  }
};

/**
 * Test method to demonstrate NLP capabilities with a specific example
 * @param {string} language - Language code (en, fr, de)
 * @returns {string} Sample analysis result
 */
export const showSampleAnalysis = (language = "en") => {
  const samples = {
    en: "What is the GDP of Germany in 2022?",
    fr: "Quel est le PIB de l'Allemagne en 2022?",
    de: "Was ist das BIP von Deutschland im Jahr 2022?"
  };
  
  const sample = samples[language] || samples.en;
  return `Sample: "${sample}"\n\n` + showRecognizedEntities(sample, language);
};

export default {
  showRecognizedEntities,
  showSampleAnalysis
};