const readline = require('readline');
import { processUserMessage, generateBotResponse } from '../src/utils/botResponseHandlers';

// Test cases for relationship patterns and general chat
const userInputs = [
  "hello",
  "is Coking Coal a thing?",
  "what is hard coal?",
  "is hard coal a fossil fuel?",
  "is Coking Coal related to coal products?",
  "What's the connection between solar and wind?",
  "bye"
];

// Setup readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to display each input + response one by one
let currentIndex = 0;
async function showNext() {
  if (currentIndex < userInputs.length) {
    const input = userInputs[currentIndex];
    console.log(`👤 User: ${input}`);
    const processedMessage = await processUserMessage(input);
    const response = await generateBotResponse(processedMessage);
    console.log(`🤖 Bot: ${response.text}`);
    console.log(`──────────────NEXT────────────\n`);

    currentIndex++;
    rl.question("Press Enter to see the next response... ", showNext);
  } else {
    console.log("✅ All tests completed!");
    rl.close();
  }
}

// Start the tests
console.log("🚀 Starting chatbot tests...\n");
showNext();
