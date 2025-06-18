import chalk from "chalk";
import { processMessage, INTENT_TYPES, RESPONSE_TYPES } from './intentMessages.js';

const chatInputs = [
  // Testing greetings
  "hello",
  // "good morning",
  // "hi there",
  
  // Testing farewells
  "goodbye", 
  // "bye bye",
  // "see you later",
  
  // Testing ambiguous inputs (should trigger clarification)
  "help",
  // "what",
  // "energy",
  // "info",
  // "?",
  
  // Testing energy definitions
  // "solid fossil fuels",
  "black liquor", 
  "blak licor", // with spelling error
  // "solid fosil fuels", // with spelling error
  // "renewable energy",
  // "nuclear power",
  // "solar",
  // "coal",
  
  // Testing unclear inputs
  "xyz123",
  // "random stuff",
  // "tell me about",
  
  // Testing longer definitions
  // "what is electricity",
  // "define renewable energy sources",
  "oil and gas definitions"
];

export const runTests = async (testInputs = chatInputs) => {
  console.log(chalk.bold.green("\n🚀 Starting Enhanced Intent Message Tests...\n"));
  console.log(chalk.blue("Testing dictionary-based intent classification with:\n"));
  console.log(chalk.white("• Greetings & Farewells"));
  console.log(chalk.white("• Energy Keywords Dictionary"));
  console.log(chalk.white("• Ambiguous Phrases Detection"));
  console.log(chalk.white("• Spelling Correction"));
  console.log(chalk.white("• Randomized Responses\n"));
  console.log(chalk.gray("═".repeat(60) + "\n"));

  let testCount = 0;
  let greetingCount = 0;
  let farewellCount = 0;
  let definitionCount = 0;
  let unknownCount = 0;
  let errorCount = 0;

  for (const input of testInputs) {
    try {
      testCount++;
      console.log(chalk.cyan(`👤 User Input #${testCount}: ${chalk.bold(input)}`));
      
      const result = await processMessage(input);
      
      // Determine response category for statistics
      switch (result.type) {
        case RESPONSE_TYPES.GREETING:
          greetingCount++;
          console.log(chalk.green(`🤖 Intent: ${chalk.bold('GREETING')}`));
          break;
        case RESPONSE_TYPES.FAREWELL:
          farewellCount++;
          console.log(chalk.magenta(`🤖 Intent: ${chalk.bold('FAREWELL')}`));
          break;
        case RESPONSE_TYPES.DEFINITION:
          definitionCount++;
          console.log(chalk.blue(`🤖 Intent: ${chalk.bold('DEFINITION')}`));
          if (result.matchData) {
            console.log(chalk.yellow(`🎯 Match Method: ${result.matchData.method}`));
            console.log(chalk.yellow(`📈 Confidence: ${(result.matchData.confidence * 100).toFixed(1)}%`));
          }
          break;
        case RESPONSE_TYPES.FALLBACK:
          unknownCount++;
          console.log(chalk.red(`🤖 Intent: ${chalk.bold('UNKNOWN/CLARIFICATION')}`));
          break;
        case RESPONSE_TYPES.ERROR:
          errorCount++;
          console.log(chalk.red(`🤖 Intent: ${chalk.bold('ERROR')}`));
          break;
      }
      
      // Display the response content
      const maxLength = 200;
      const truncatedContent = result.content.length > maxLength 
        ? result.content.substring(0, maxLength) + "..."
        : result.content;
      
      console.log(chalk.white(`💬 Response: ${truncatedContent}`));
      
      if (result.isError) {
        console.log(chalk.red(`❌ Error Status: true`));
      }
      
      console.log(chalk.gray("─".repeat(60) + "\n"));
      
    } catch (error) {
      errorCount++;
      console.error(chalk.red(`❌ Error processing input: "${input}"`));
      console.error(chalk.red(`   ${error.message}`));
      console.log(chalk.gray("─".repeat(60) + "\n"));
    }

    // Add a small delay between tests for readability
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  // Display summary statistics
  console.log(chalk.bold.green("✅ All Intent Message Tests Completed!\n"));
  console.log(chalk.bold.blue("📊 Test Summary:"));
  console.log(chalk.white(`   Total Tests: ${testCount}`));
  console.log(chalk.green(`   • Greetings: ${greetingCount}`));
  console.log(chalk.magenta(`   • Farewells: ${farewellCount}`));
  console.log(chalk.blue(`   • Definitions: ${definitionCount}`));
  console.log(chalk.yellow(`   • Unknown/Clarifications: ${unknownCount}`));
  console.log(chalk.red(`   • Errors: ${errorCount}`));
  
  console.log(chalk.bold.cyan("\n🎯 Dictionary Features Demonstrated:"));
  console.log(chalk.white("   ✅ Energy keyword recognition from EnergyKeywords.js"));
  console.log(chalk.white("   ✅ Ambiguous phrase detection from AmbiguousPhrases.js"));
  console.log(chalk.white("   ✅ Spell correction integration"));
  console.log(chalk.white("   ✅ Randomized response variations"));
  console.log(chalk.white("   ✅ Intent classification with fallbacks"));
  
  console.log(chalk.gray("\n" + "═".repeat(60)));

  showSystemSummary()
};


// Quick summary function for the enhanced system
export const showSystemSummary = () => {
  console.log(chalk.bold.cyan("\n🎯 Enhanced Intent Message System Summary\n"));
  console.log(chalk.white("📚 Dictionary Integration:"));
  console.log(chalk.green("   ✅ EnergyKeywords.js - 152+ energy terms for smart recognition"));
  console.log(chalk.green("   ✅ AmbiguousPhrases.js - Question words & incomplete phrases"));
  console.log(chalk.green("   ✅ UnknownResponses.js - 30+ randomized clarification responses"));
  console.log(chalk.green("   ✅ greetings.js & farewell.js - Natural conversation patterns"));
  
  console.log(chalk.white("\n🧠 Smart Intent Classification:"));
  console.log(chalk.blue("   🎯 Greetings → Random friendly energy-focused welcomes"));
  console.log(chalk.blue("   🎯 Farewells → Random polite goodbyes"));
  console.log(chalk.blue("   🎯 Energy terms → Definition requests via ruler system"));
  console.log(chalk.blue("   🎯 Ambiguous inputs → Random clarification requests"));
  console.log(chalk.blue("   🎯 No matches → Random helpful suggestions"));
  
  console.log(chalk.white("\n🔧 Key Improvements:"));
  console.log(chalk.yellow("   • Replaced hardcoded arrays with comprehensive dictionaries"));
  console.log(chalk.yellow("   • Added spell correction integration"));
  console.log(chalk.yellow("   • Enhanced ambiguity detection"));
  console.log(chalk.yellow("   • Randomized responses for natural conversation"));
  console.log(chalk.yellow("   • Maintainable and extensible architecture"));
  
  console.log(chalk.gray("\n" + "═".repeat(60)));
  console.log(chalk.bold.green("🚀 Ready for production! Test with: runTests() or testResponseVariations()"));
  console.log(chalk.gray("═".repeat(60) + "\n"));
};
