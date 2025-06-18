import chalk from "chalk";
import { findBestMatch } from './ruler.js';

const chatInputs = [
  // testing definitions
  // "solid fossil fuels",
  // "black liquor",
  "blak licor"
  // "solid fosil fuels",
  // "fosil fuels",  
];

export const runTests = async (testInputs = chatInputs) => {
  console.log(chalk.bold.green("\n🚀 Starting chatbot tests...\n"));

  for (const input of testInputs) {
    try {
      console.log(chalk.cyan(`👤 User: ${chalk.bold(input)}`));
      
      const result = findBestMatch(input);
      
      if (result) {
        console.log(chalk.yellow(`🤖 Bot: Found "${result.match.title}" (${result.method}, ${(result.confidence * 100).toFixed(1)}%)`));
        if (result.match.text) {
          console.log(chalk.white(`� ${result.match.text.substring(0, 150)}...`));
        }
      } else {
        console.log(chalk.red(`🤖 Bot: No match found for "${input}"`));
      }
      
      console.log(chalk.gray("──────────────NEXT────────────\n"));
    } catch (error) {
      console.error(chalk.red(`❌ Error handling input: "${input}"`));
      console.error(chalk.red(`   ${error.message}`));
      console.log(chalk.gray("──────────────NEXT────────────\n"));
    }

    // Add a small delay between tests
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log(chalk.bold.green("✅ All tests completed!\n"));
};
