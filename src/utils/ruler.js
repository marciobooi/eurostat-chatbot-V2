import { energyDefinitionsEn } from '../data/DefinitionsEn.js';
import { spellingCorrections } from '../data/SpellingCorrections.js';
import { abbreviations } from '../data/Abbreviations.js';
import { synonyms } from '../data/Synonyms.js';
import { stopwords } from '../data/Stopwords.js';
import { suffixes, minWordLength, stemExceptions } from '../data/Suffixes.js';
import Fuse from 'fuse.js';
import { removeStopwords } from 'stopword';
import nlp from 'compromise';
import levenshtein from 'js-levenshtein';
import * as metaphoneLib from 'metaphone';
import stemmer from 'porter-stemmer';




/**
 * Enhanced Term Resolution System with Ruler Pattern
 * 
 * This implements a comprehensive term resolution system that follows
 * a specific order of operations (ruler pattern) to find the best match for user input.
 * 
 * Process Flow (Ruler Pattern):
 * 1. User Input → Trim + Lowercase
 * 2. Check spellingFixes.json
 * 3. Expand abbreviations
 * 4. Check synonymMap
 * 5. Extract nouns (compromise) + remove stopwords
 * 6. Try exact glossary match
 * 7. Fuzzy match (Fuse.js)
 * 8. Levenshtein match
 * 9. Phonetic match
 * 10. Stemming match
 * 11. If no match → Suggest similar terms
 */

// Initialize professional NLP tools
const metaphone = metaphoneLib.default || metaphoneLib;

// Configuration for Fuse.js fuzzy search
const fuseOptions = {
  includeScore: true,
  threshold: 0.4, // Lower = more strict
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: [
    { name: 'title', weight: 0.3 },
    { name: 'fuelCode', weight: 0.2 },
    { name: 'keywords', weight: 0.25 },
    { name: 'description', weight: 0.25 }
  ]
};

// Prepare searchable data structure
const prepareSearchData = () => {
  const searchableItems = [];
  
  // Convert definitions to searchable format
  Object.entries(energyDefinitionsEn).forEach(([key, item]) => {
    if (item && typeof item === 'object') {
      searchableItems.push({
        ...item,
        key,
        searchText: `${item.title || ''} ${item.fuelCode || ''} ${(item.keywords || []).join(' ')} ${item.text || ''}`.toLowerCase()
      });
    }
  });
  
  return searchableItems;
};

const searchData = prepareSearchData();
const fuse = new Fuse(searchData, fuseOptions);

/**
 * Step 1: Normalize input text
 */
const normalizeInput = (input) => {
  return input.trim().toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ');
};

/**
 * Step 2: Spelling corrections using dictionary
 */
const correctSpelling = (term) => {
  return spellingCorrections[term] || term;
};

/**
 * Step 3: Expand abbreviations using comprehensive mapping
 */
/**
 * Step 3: Expand abbreviations using dictionary
 */
const expandAbbreviations = (term) => {
  return abbreviations[term] || term;
};

/**
 * Step 4: Synonym mapping using dictionary
 */
const expandSynonyms = (term) => {
  return synonyms[term] || term;
};

/**
 * Step 5: Extract meaningful terms using NLP and custom stopwords
 */
const extractMeaningfulTerms = (text) => {
  // Use compromise to extract nouns and important terms
  const doc = nlp(text);
  const nouns = doc.nouns().out('array');
  const adjectives = doc.adjectives().out('array');
  const verbs = doc.verbs().out('array');
  
  // Combine and clean terms
  const allTerms = [...nouns, ...adjectives, ...verbs];
  
  // Remove stopwords using both library and custom stopwords
  const libCleanTerms = removeStopwords(allTerms, ['en']);
  const customCleanTerms = libCleanTerms.filter(term => 
    !stopwords.includes(term.toLowerCase())
  );
  
  // Filter out very short terms
  return customCleanTerms.filter(term => term.length > 2);
};

/**
 * Step 6: Exact match search
 */
const findExactMatch = (query) => {
  const normalizedQuery = normalizeInput(query);
  
  return searchData.find(item => {
    const normalizedTitle = normalizeInput(item.title || '');
    const normalizedCode = normalizeInput(item.fuelCode || '');
    const normalizedKeywords = (item.keywords || []).map(k => normalizeInput(k));
    
    return normalizedTitle === normalizedQuery || 
           normalizedCode === normalizedQuery ||
           normalizedKeywords.includes(normalizedQuery);
  });
};

/**
 * Step 7: Fuzzy search using Fuse.js with better threshold
 */
const fuzzySearch = (query) => {
  const results = fuse.search(query);
  // Return the best result if score is reasonable (less than 0.8 = 80% similarity or better)
  return results.length > 0 && results[0].score < 0.8 ? results[0] : null;
};

/**
 * Step 8: Levenshtein distance matching (fixed)
 */
const levenshteinMatch = (query, threshold = 0.6) => {
  let bestMatch = null;
  let bestScore = 0;
  
  searchData.forEach(item => {
    // Check against title, keywords, and fuel code
    const textsToCheck = [
      item.title?.toLowerCase() || '',
      ...(item.keywords || []).map(k => k.toLowerCase()),
      item.fuelCode?.toLowerCase() || ''
    ].filter(text => text.length > 0);
    
    textsToCheck.forEach(searchableText => {
      const distance = levenshtein(query.toLowerCase(), searchableText);
      const maxLength = Math.max(query.length, searchableText.length);
      const similarity = 1 - (distance / maxLength);
      
      if (similarity >= threshold && similarity > bestScore) {
        bestScore = similarity;
        bestMatch = { item, score: similarity };
      }
    });
  });
  
  return bestMatch;
};

/**
 * Step 9: Phonetic matching using simple soundex (improved)
 */
const phoneticMatch = (query) => {
  try {
    // Improved soundex implementation
    const soundex = (str) => {
      if (!str) return '';
      const cleanStr = str.toLowerCase().replace(/[^a-z]/g, '');
      if (cleanStr.length === 0) return '';
      
      let result = cleanStr.charAt(0).toUpperCase();
      let prev = '';
      
      for (let i = 1; i < cleanStr.length && result.length < 4; i++) {
        const char = cleanStr.charAt(i).toUpperCase();
        let code = '';
        
        if ('BFPV'.includes(char)) code = '1';
        else if ('CGJKQSXZ'.includes(char)) code = '2';
        else if ('DT'.includes(char)) code = '3';
        else if ('L'.includes(char)) code = '4';
        else if ('MN'.includes(char)) code = '5';
        else if ('R'.includes(char)) code = '6';
        
        if (code && code !== prev) {
          result += code;
          prev = code;
        }
      }
      
      return result.padEnd(4, '0').substring(0, 4);
    };
    
    const queryWords = query.split(/\s+/);
    const queryPhonetics = queryWords.map(word => soundex(word)).filter(s => s);
    
    let bestMatch = null;
    let maxMatches = 0;
    
    searchData.forEach(item => {
      try {
        let matches = 0;
        
        // Check title words
        if (item.title) {
          const titleWords = item.title.split(/\s+/);
          titleWords.forEach(word => {
            const wordPhonetic = soundex(word);
            if (queryPhonetics.includes(wordPhonetic)) {
              matches += 2;
            }
          });
        }
        
        // Check keywords
        if (item.keywords) {
          item.keywords.forEach(keyword => {
            const keywordWords = keyword.split(/\s+/);
            keywordWords.forEach(word => {
              const wordPhonetic = soundex(word);
              if (queryPhonetics.includes(wordPhonetic)) {
                matches += 1;
              }
            });
          });
        }
        
        if (matches > maxMatches) {
          maxMatches = matches;
          bestMatch = { item, score: matches };
        }
      } catch (e) {
        // Skip items that can't be processed
      }
    });
    
    return bestMatch && maxMatches > 0 ? bestMatch : null;
  } catch (e) {
    console.log('Phonetic matching failed, skipping...');
    return null;
  }
};

/**
 * Hybrid stemming function using Porter stemmer + custom dictionary
 */
const hybridStem = (word) => {
  const lowercaseWord = word.toLowerCase();
  
  // Check for irregular forms first
  if (stemExceptions[lowercaseWord]) {
    return stemExceptions[lowercaseWord];
  }
  
  // Use Porter stemmer for regular words
  try {
    return stemmer(lowercaseWord);
  } catch (e) {
    // Fallback to custom suffix removal if Porter fails
    for (const suffix of suffixes) {
      if (lowercaseWord.endsWith(suffix) && 
          lowercaseWord.length > suffix.length + minWordLength) {
        return lowercaseWord.slice(0, -suffix.length);
      }
    }
    return lowercaseWord;
  }
};

/**
 * Step 10: Stemming-based matching using hybrid Porter stemmer (improved)
 */
const stemmingMatch = (query) => {
  const queryWords = query.split(/\s+/);
  const queryStemmed = queryWords.map(word => hybridStem(word));
  
  let bestMatch = null;
  let bestScore = 0;
  
  searchData.forEach(item => {
    // Create a comprehensive text to stem from multiple fields
    const textFields = [
      item.title || '',
      ...(item.keywords || []),
      item.fuelCode || ''
    ].filter(text => text.length > 0);
    
    textFields.forEach(text => {
      const itemWords = text.toLowerCase().split(/\s+/);
      const itemStemmed = itemWords.map(word => hybridStem(word));
      
      const intersection = queryStemmed.filter(stem => itemStemmed.includes(stem));
      const score = intersection.length / Math.max(queryStemmed.length, itemStemmed.length);
      
      if (score > bestScore && score > 0.2) { // Lower threshold for better coverage
        bestScore = score;
        bestMatch = { item, score };
      }
    });
  });
  
  return bestMatch;
};

/**
 * Main ruler function - ALWAYS performs all 10 steps and chooses the best result
 */
export const findBestMatch = (userQuery) => {
  console.log(`🔍 Ruler System: Processing query "${userQuery}"`);
  
  // Step 1: Normalize input
  let processedQuery = normalizeInput(userQuery);
  console.log(`Step 1 - Normalized: "${processedQuery}"`);
  
  // Step 2: Spelling correction
  const words = processedQuery.split(/\s+/);
  const correctedWords = words.map(correctSpelling);
  processedQuery = correctedWords.join(' ');
  console.log(`Step 2 - Spell corrected: "${processedQuery}"`);
  
  // Step 3: Expand abbreviations
  const expandedWords = correctedWords.map(expandAbbreviations);
  const expandedQuery = expandedWords.join(' ');
  console.log(`Step 3 - Abbreviations expanded: "${expandedQuery}"`);
  
  // Step 4: Expand synonyms
  const synonymWords = expandedWords.map(expandSynonyms);
  const synonymQuery = synonymWords.join(' ');
  console.log(`Step 4 - Synonyms expanded: "${synonymQuery}"`);
  
  // Step 5: Extract meaningful terms
  const meaningfulTerms = extractMeaningfulTerms(synonymQuery);
  console.log(`Step 5 - Meaningful terms: [${meaningfulTerms.join(', ')}]`);
  
  // Initialize candidates array to store ALL matches from all 10 steps
  const candidates = [];
  
  // Step 6: Exact matching (highest priority)
  console.log(`🔍 Step 6 - Exact matching...`);
  const exactMatch = findExactMatch(processedQuery);
  if (exactMatch) {
    candidates.push({
      match: exactMatch,
      confidence: 100,  // Highest score for exact matches
      method: 'exact',
      step: 6,
      query: processedQuery
    });
    console.log(`   ✅ Found: "${exactMatch.title}"`);
  } else {
    console.log(`   ❌ No exact match`);
  }
    // Step 7: Fuzzy search with multiple query variations
  console.log(`🔍 Step 7 - Fuzzy matching...`);
  const fuzzyQueries = [processedQuery, synonymQuery, expandedQuery];
  let bestFuzzyResult = null;
  let bestFuzzyScore = 1; // Lower is better for fuzzy
  
  fuzzyQueries.forEach(query => {
    const result = fuzzySearch(query);
    if (result && result.score < bestFuzzyScore) {
      bestFuzzyScore = result.score;
      bestFuzzyResult = result;
    }
  });
  
  if (bestFuzzyResult) {
    const fuzzyScore = Math.max(0, (1 - bestFuzzyResult.score) * 85); // Max 85 points for fuzzy
    candidates.push({
      match: bestFuzzyResult.item,
      confidence: fuzzyScore,
      method: 'fuzzy',
      step: 7,
      query: 'multiple queries tested',
      rawScore: bestFuzzyResult.score
    });
    console.log(`   ✅ Found: "${bestFuzzyResult.item.title}" (score: ${fuzzyScore.toFixed(1)})`);
  } else {
    console.log(`   ❌ No fuzzy match`);
  }
    // Step 8: Levenshtein matching with multiple query variations
  console.log(`🔍 Step 8 - Levenshtein matching...`);
  const levenshteinQueries = [processedQuery, synonymQuery, expandedQuery];
  let bestLevenshteinResult = null;
  let bestLevenshteinScore = 0;
  
  levenshteinQueries.forEach(query => {
    const result = levenshteinMatch(query);
    if (result && result.score > bestLevenshteinScore) {
      bestLevenshteinScore = result.score;
      bestLevenshteinResult = result;
    }
  });
  
  if (bestLevenshteinResult) {
    const levenshteinScore = Math.max(0, bestLevenshteinResult.score * 70); // Max 70 points
    candidates.push({
      match: bestLevenshteinResult.item,
      confidence: levenshteinScore,
      method: 'levenshtein',
      step: 8,
      query: 'multiple queries tested',
      rawScore: bestLevenshteinResult.score
    });
    console.log(`   ✅ Found: "${bestLevenshteinResult.item.title}" (score: ${levenshteinScore.toFixed(1)})`);
  } else {
    console.log(`   ❌ No Levenshtein match`);
  }
    // Step 9: Phonetic matching with multiple query variations
  console.log(`🔍 Step 9 - Phonetic matching...`);
  const phoneticQueries = [processedQuery, synonymQuery, expandedQuery];
  let bestPhoneticResult = null;
  let bestPhoneticScore = 0;
  
  phoneticQueries.forEach(query => {
    const result = phoneticMatch(query);
    if (result && result.score > bestPhoneticScore) {
      bestPhoneticScore = result.score;
      bestPhoneticResult = result;
    }
  });
  
  if (bestPhoneticResult) {
    const phoneticScore = Math.min(60, bestPhoneticResult.score * 15); // Max 60 points
    candidates.push({
      match: bestPhoneticResult.item,
      confidence: phoneticScore,
      method: 'phonetic',
      step: 9,
      query: 'multiple queries tested',
      rawScore: bestPhoneticResult.score
    });
    console.log(`   ✅ Found: "${bestPhoneticResult.item.title}" (score: ${phoneticScore.toFixed(1)})`);
  } else {
    console.log(`   ❌ No phonetic match`);
  }
    // Step 10: Stemming matching with multiple query variations
  console.log(`🔍 Step 10 - Stemming matching...`);
  const stemmingQueries = [processedQuery, synonymQuery, expandedQuery];
  let bestStemmingResult = null;
  let bestStemmingScore = 0;
  
  stemmingQueries.forEach(query => {
    const result = stemmingMatch(query);
    if (result && result.score > bestStemmingScore) {
      bestStemmingScore = result.score;
      bestStemmingResult = result;
    }
  });
  
  if (bestStemmingResult) {
    const stemmingScore = Math.max(0, bestStemmingResult.score * 50); // Max 50 points
    candidates.push({
      match: bestStemmingResult.item,
      confidence: stemmingScore,
      method: 'stemming',
      step: 10,
      query: 'multiple queries tested',
      rawScore: bestStemmingResult.score
    });
    console.log(`   ✅ Found: "${bestStemmingResult.item.title}" (score: ${stemmingScore.toFixed(1)})`);
  } else {
    console.log(`   ❌ No stemming match`);
  }
  
  // Evaluate all candidates and choose the best one
  if (candidates.length === 0) {
    console.log(`❌ No matches found in any of the 10 steps for: "${userQuery}"`);
    return null;
  }
  
  // Sort candidates by confidence score (highest first)
  candidates.sort((a, b) => b.confidence - a.confidence);
  
  console.log(`\n📊 EVALUATION RESULTS (${candidates.length} candidates found):`);
  candidates.forEach((candidate, index) => {
    console.log(`   ${index + 1}. "${candidate.match.title}" - Step ${candidate.step} (${candidate.method}) - Score: ${candidate.confidence.toFixed(1)}`);
  });
  
  // Choose the best candidate
  const bestCandidate = candidates[0];
  console.log(`\n🏆 BEST MATCH: "${bestCandidate.match.title}" from Step ${bestCandidate.step} (${bestCandidate.method}) with score ${bestCandidate.confidence.toFixed(1)}`);
  
  return {
    match: bestCandidate.match,
    confidence: bestCandidate.confidence / 100, // Convert back to 0-1 scale
    method: bestCandidate.method,
    step: bestCandidate.step,
    allCandidates: candidates // Include all candidates for analysis
  };
};

/**
 * Get suggestions for similar terms when no match is found
 */
export const getSuggestions = (userQuery, limit = 5) => {
  const results = fuse.search(userQuery);
  return results.slice(0, limit).map(result => ({
    title: result.item.title,
    score: result.score,
    fuelCode: result.item.fuelCode,
    key: result.item.key
  }));
};

/**
 * Helper function to demonstrate the ruler in action
 */
export const testRuler = (queries) => {
  console.log('🧪 Testing Professional Ruler System\n' + '='.repeat(50));
  
  queries.forEach((query, index) => {
    console.log(`\n📝 Test ${index + 1}: "${query}"`);
    console.log('-'.repeat(30));
    
    const result = findBestMatch(query);
    
    if (result) {
      console.log(`🎯 Match found!`);
      console.log(`   Title: ${result.match.title}`);
      console.log(`   Method: ${result.method}`);
      console.log(`   Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      if (result.match.fuelCode) {
        console.log(`   Fuel Code: ${result.match.fuelCode}`);
      }
      if (result.match.category) {
        console.log(`   Category: ${result.match.category}`);
      }
    } else {
      console.log(`❌ No match found`);
      const suggestions = getSuggestions(query, 3);
      if (suggestions.length > 0) {
        console.log(`💡 Suggestions:`);
        suggestions.forEach(suggestion => {
          console.log(`   - ${suggestion.title} (${suggestion.category})`);
        });
      }
    }
  });
};

/**
 * Analyze the search data for statistics
 */
export const getSearchDataStats = () => {
  const stats = {
    totalItems: searchData.length,
    itemsWithKeywords: 0,
    itemsWithDescription: 0,
    itemsWithFuelCode: 0,
    itemsWithText: 0
  };
  
  searchData.forEach(item => {
    // Count items with different properties
    if (item.keywords && item.keywords.length > 0) stats.itemsWithKeywords++;
    if (item.text) stats.itemsWithText++;
    if (item.fuelCode) stats.itemsWithFuelCode++;
  });
  
  return stats;
};
