const readline = require('readline');
import { processUserMessage, generateBotResponse } from '../src/utils/botResponseHandlers';

// Hardcoded user inputs
const userInputs = [
  "hello",
  "solid fossil fuels",
  "what is hard coal?",
  "is hard coal a fossil fuel?",
  "is Coking Coal family of a car?",
  "mars is a great planet",
  "bye"
];

// Setup a readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to display each input + response one by one
let currentIndex = 0;
async function showNext() {
  if (currentIndex < userInputs.length) {
    const input = userInputs[currentIndex];
    const processedMessage = await processUserMessage(input);
    const response = await generateBotResponse(processedMessage);

    console.log(`User: ${input}`);
    console.log(`Bot: ${response.text}`);
    console.log("-------------------");

    currentIndex++;
    rl.question("Press Enter to see the next response... ", showNext);
  } else {
    console.log("✅ All inputs processed.");
    rl.close();
  }
}

// Start the conversation
console.log("Starting chatbot tests...\n");
showNext();
