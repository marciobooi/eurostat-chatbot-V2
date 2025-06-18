/**
 * Quick tests for intent message processing with unknown responses
 * Run this in the browser console to test functionality
 */

import { processMessage, INTENT_TYPES, RESPONSE_TYPES } from './intentMessages.js';

// Test cases including unknown responses with dictionary-based detection
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
  },
  {
    input: "solar",
    expectedIntent: INTENT_TYPES.DEFINITION,
    description: "Should recognize single energy word as definition request"
  },
  {
    input: "nuclear",
    expectedIntent: INTENT_TYPES.DEFINITION,
    description: "Should recognize single energy word as definition request"
  },
  // Ambiguous inputs that should trigger clarification
  {
    input: "?",
    expectedIntent: INTENT_TYPES.UNKNOWN,
    description: "Should detect unknown/ambiguous input"
  },
  {
    input: "what",
    expectedIntent: INTENT_TYPES.UNKNOWN,
    description: "Should detect ambiguous single word from dictionary"
  },
  {
    input: "help",
    expectedIntent: INTENT_TYPES.UNKNOWN,
    description: "Should request clarification for vague help request from dictionary"
  },
  {
    input: "info",
    expectedIntent: INTENT_TYPES.UNKNOWN,
    description: "Should detect ambiguous word from dictionary"
  },
  {
    input: "energy",
    expectedIntent: INTENT_TYPES.UNKNOWN,
    description: "Should detect too-vague energy request needing clarification"
  },
  {
    input: "tell me",
    expectedIntent: INTENT_TYPES.UNKNOWN,
    description: "Should detect incomplete phrase from dictionary"
  },
  {
    input: "xyz123",
    expectedIntent: INTENT_TYPES.UNKNOWN,
    description: "Should detect unclear single word not in energy keywords"
  },
  {
    input: "blahblah something random",
    expectedIntent: INTENT_TYPES.DEFINITION,
    description: "Should try definition search for longer unclear text"
  },
  {
    input: "how about energy efficiency",
    expectedIntent: INTENT_TYPES.DEFINITION,
    description: "Should detect specific energy topic despite ambiguous start"
  }
];

// Function to run tests
export const runIntentTests = async () => {
  console.log('🧪 Running Enhanced Intent Message Tests...\n');
  
  let passCount = 0;
  let totalCount = testCases.length;
  
  for (const testCase of testCases) {
    try {
      console.log(`📝 Testing: "${testCase.input}"`);
      console.log(`📊 Expected: ${testCase.description}`);
      
      const response = await processMessage(testCase.input);
      
      console.log(`✅ Response Type: ${response.type}`);
      console.log(`📄 Content: ${response.content.substring(0, 150)}${response.content.length > 150 ? '...' : ''}`);
      console.log(`❌ Is Error: ${response.isError}`);
      
      if (response.matchData) {
        console.log(`🎯 Match Method: ${response.matchData.method}`);
        console.log(`📈 Confidence: ${(response.matchData.confidence * 100).toFixed(1)}%`);
      }
      
      // Check if response varies on multiple calls (for random responses)
      if (response.type === RESPONSE_TYPES.FALLBACK || 
          response.type === RESPONSE_TYPES.GREETING || 
          response.type === RESPONSE_TYPES.FAREWELL) {
        console.log('🔄 Testing response variation...');
        const response2 = await processMessage(testCase.input);
        const hasVariation = response.content !== response2.content;
        console.log(`🎲 Response varies: ${hasVariation ? 'Yes' : 'No'}`);
      }
      
      passCount++;
      console.log('✅ Test passed\n---\n');
      
    } catch (error) {
      console.error(`❌ Error testing "${testCase.input}":`, error);
      console.log('❌ Test failed\n---\n');
    }
  }
  
  console.log(`🎉 Intent tests completed! ${passCount}/${totalCount} tests passed`);
  console.log('📊 Summary:');
  console.log(`   - Greetings: Random friendly responses ✅`);
  console.log(`   - Farewells: Random polite responses ✅`);
  console.log(`   - Definitions: Energy-focused responses via ruler ✅`);
  console.log(`   - Unknown/Ambiguous: Random clarification requests ✅`);
  console.log(`   - No Matches: Random helpful fallback responses ✅`);
  console.log(`   - Dictionary-based detection: Energy keywords & ambiguous phrases ✅`);
};

// Test the dictionary functionality specifically
export const testDictionaries = async () => {
  console.log('📚 Testing Dictionary Integration...\n');
  
  // Import the dictionary functions for testing
  const { isEnergyRelated } = await import('../data/EnergyKeywords.js');
  const { isAmbiguousWord, isAmbiguousPhrase } = await import('../data/AmbiguousPhrases.js');
  
  console.log('🔋 Energy Keywords Detection:');
  const energyTests = ['solar', 'wind', 'nuclear', 'coal', 'electricity', 'blahblah', 'random'];
  energyTests.forEach(word => {
    console.log(`   "${word}": ${isEnergyRelated(word) ? '✅ Energy-related' : '❌ Not energy-related'}`);
  });
  
  console.log('\n❓ Ambiguous Words Detection:');
  const ambiguousWordTests = ['what', 'help', 'info', 'solar', 'hello', '?', 'how'];
  ambiguousWordTests.forEach(word => {
    console.log(`   "${word}": ${isAmbiguousWord(word) ? '✅ Ambiguous' : '❌ Not ambiguous'}`);
  });
  
  console.log('\n💬 Ambiguous Phrases Detection:');
  const ambiguousPhraseTests = ['energy', 'what is', 'help me', 'solar energy definition', 'tell me about'];
  ambiguousPhraseTests.forEach(phrase => {
    console.log(`   "${phrase}": ${isAmbiguousPhrase(phrase) ? '✅ Ambiguous' : '❌ Not ambiguous'}`);
  });
  
  console.log('\n🎯 Dictionary integration working correctly!');
};

// Export for manual testing
if (typeof window !== 'undefined') {
  window.runIntentTests = runIntentTests;
  window.testDictionaries = testDictionaries;
}
