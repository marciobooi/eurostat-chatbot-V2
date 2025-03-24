import chalk from "chalk";
import { MessageService } from "../services/MessageService";

const defaultUserInputs = [
  // testing greetings
    "hello",

    // testing definitions
    "solid fossil fuels",
    "hard coal?",
    "coking coal?",

    // testing questions definitions
    "what is hard coal?",
    "tell me more about coking coal",
    "what is coking coal?",

    // testing comparissons relationships
    "is hard coal a solid fossil fuels?",
    "is Coking Coal a car?",
    "is Coking Coal belongs to car?",
    "Is coke related to coal products?",
    "What’s the connection between solar and wind?",
    "Is anthracite a thing?",
    "is coke related to coal products?",

    // intent detection
    "Show me consumption data for natural gas from 2015 to 2020",
    "What are the carbon emissions for solid fossil fuels in 2019?",
    "Can you show me the latest statistics on coal production in EU?",

    // testing rubish
    "xy z",
    "mars is a great planet",
    
    // testing farewell
    "bye",
];

export const runTests = async (userInputs = defaultUserInputs) => {
  console.log(chalk.bold.green("\n🚀 Starting chatbot tests...\n"));

  // Use static method to send messages
  for (const input of userInputs) {
    try {
      // Process input using static method
      const messages = await MessageService.processUserInput(input, 'en');
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(chalk.bold.green("✅ All tests completed!\n"));
};
