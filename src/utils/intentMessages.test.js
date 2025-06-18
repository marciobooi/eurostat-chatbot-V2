/**
 * Quick tests for intent message processing
 * Run this in the browser console to test functionality
 */

import { processMessage, INTENT_TYPES, RESPONSE_TYPES } from './intentMessages.js';

// Test cases
const testCases = [
  {
    input: "hello",
    expectedIntent: INTENT_TYPES.GREETING,
    description: "Should detect greeting"
  },
  {
    input: "hi there",
    expectedIntent: INTENT_TYPES.GREETING,
    description: "Should detect greeting with multiple words"
  },
  {
    input: "goodbye",
    expectedIntent: INTENT_TYPES.FAREWELL,
    description: "Should detect farewell"
  },
  {
    input: "bye bye",
    expectedIntent: INTENT_TYPES.FAREWELL,
    description: "Should detect farewell with multiple words"
  },
  {
    input: "what is coal",
    expectedIntent: INTENT_TYPES.DEFINITION,
    description: "Should detect definition request"
  },
  {
    input: "electricity definition",
    expectedIntent: INTENT_TYPES.DEFINITION,
    description: "Should detect definition request"
  },
  {
    input: "renewable energy",
    expectedIntent: INTENT_TYPES.DEFINITION,
    description: "Should detect definition request for energy term"
  }
];

// Function to run tests
export const runIntentTests = async () => {
  console.log('🧪 Running Intent Message Tests...\n');
  
  for (const testCase of testCases) {
    try {
      console.log(`📝 Testing: "${testCase.input}"`);
      console.log(`📊 Expected: ${testCase.description}`);
      
      const result = await processMessage(testCase.input);
      
      console.log(`✅ Response Type: ${result.type}`);
      console.log(`📄 Content: ${result.content.substring(0, 100)}${result.content.length > 100 ? '...' : ''}`);
      console.log(`❌ Is Error: ${result.isError}`);
      
      if (result.matchData) {
        console.log(`🎯 Match Method: ${result.matchData.method}`);
        console.log(`📈 Confidence: ${(result.matchData.confidence * 100).toFixed(1)}%`);
      }
      
      console.log('---\n');
      
    } catch (error) {
      console.error(`❌ Error testing "${testCase.input}":`, error);
    }
  }
  
  console.log('🎉 Intent tests completed!');
};

// Export for manual testing
window.runIntentTests = runIntentTests;
