import { findBestMatch } from './ruler.js';

console.log('🔧 Testing Intelligent Spelling Correction with nspell\n');

// Wait a bit for spell checker to initialize
await new Promise(resolve => setTimeout(resolve, 1000));

const testQueries = [
  "blak licor",        // Should correct to "black liquor"
  "electricty",        // Should correct to "electricity"
  "renawable energy",  // Should correct to "renewable energy"
  "fosil fuels",       // Should correct to "fossil fuels"
  "sustanability",     // Should correct to "sustainability"
  "eficiency",         // Should correct to "efficiency"
  "comsumption",       // Should correct to "consumption"
  "transformacion",    // Should correct to "transformation"
];

for (const query of testQueries) {
  console.log(`\n🧪 Testing: "${query}"`);
  console.log('─'.repeat(50));
  
  try {
    const result = findBestMatch(query);
    
    if (result) {
      console.log(`✅ Found: "${result.match.title}" (${result.method}, ${(result.confidence * 100).toFixed(1)}%)`);
      if (result.match.fuelCode) {
        console.log(`   Fuel Code: ${result.match.fuelCode}`);
      }
    } else {
      console.log(`❌ No match found`);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

console.log('\n✅ Intelligent spelling correction test complete!');
