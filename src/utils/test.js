import chalk from "chalk";

const defaultUserInputs = [
  // testing definitions
  "solid fossil fuels",
  "solid fosil fuels",
  "hard coal?",
  "coking coal?",
];

export const runTests = async (userInputs = defaultUserInputs) => {
  console.log(chalk.bold.green("\n🚀 Starting chatbot tests...\n"));

  // Use static method to send messages
  for (const input of userInputs) {
    try {
      // Process input using static method
      const messages = await MessageService.processUserInput(input, "en");
      const botResponse = messages[1]; // Get bot response from returned messages

      console.log(chalk.cyan(`👤 User: ${chalk.bold(input)}`));
      console.log(chalk.yellow(`🤖 Bot: ${chalk.bold(botResponse.text)}`));
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
