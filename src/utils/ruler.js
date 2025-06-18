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
 * Step 7: Fuzzy search using Fuse.js
 */
const fuzzySearch = (query) => {
  const results = fuse.search(query);
  return results.length > 0 ? results[0] : null;
};

/**
 * Step 8: Levenshtein distance matching
 */
const levenshteinMatch = (query, threshold = 0.7) => {
  let bestMatch = null;
  let bestScore = 0;
  
  searchData.forEach(item => {
    const searchableText = item.searchText;
    const distance = levenshtein(query.toLowerCase(), searchableText);
    const maxLength = Math.max(query.length, searchableText.length);
    const similarity = 1 - (distance / maxLength);
    
    if (similarity > threshold && similarity > bestScore) {
      bestScore = similarity;
      bestMatch = { item, score: similarity };
    }
  });
  
  return bestMatch;
};

/**
 * Step 9: Phonetic matching using Metaphone
 */
const phoneticMatch = (query) => {
  try {
    const queryPhonetic = metaphone(query);
    let bestMatch = null;
    let maxMatches = 0;
    
    searchData.forEach(item => {
      try {
        const titlePhonetic = metaphone(item.title || '');
        const keywordPhonetics = (item.keywords || []).map(k => {
          try {
            return metaphone(k);
          } catch (e) {
            return '';
          }
        });
        
        let matches = 0;
        if (titlePhonetic === queryPhonetic) matches += 3;
        keywordPhonetics.forEach(kp => {
          if (kp === queryPhonetic) matches += 1;
        });
        
        if (matches > maxMatches) {
          maxMatches = matches;
          bestMatch = { item, score: matches };
        }
      } catch (e) {
        // Skip items that can't be processed
      }
    });
    
    return bestMatch;
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
 * Step 10: Stemming-based matching using hybrid Porter stemmer
 */
const stemmingMatch = (query) => {
  const queryWords = query.split(/\s+/);
  const queryStemmed = queryWords.map(word => hybridStem(word));
  
  let bestMatch = null;
  let bestScore = 0;
  
  searchData.forEach(item => {
    const itemWords = (item.searchText || '').split(/\s+/);
    const itemStemmed = itemWords.map(word => hybridStem(word));
    
    const intersection = queryStemmed.filter(stem => itemStemmed.includes(stem));
    const score = intersection.length / Math.max(queryStemmed.length, itemStemmed.length);
    
    if (score > bestScore && score > 0.3) {
      bestScore = score;
      bestMatch = { item, score };
    }
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
  
  // Step 7: Fuzzy search
  console.log(`🔍 Step 7 - Fuzzy matching...`);
  const fuzzyResult = fuzzySearch(synonymQuery);
  if (fuzzyResult) {
    const fuzzyScore = Math.max(0, (1 - fuzzyResult.score) * 85); // Max 85 points for fuzzy
    candidates.push({
      match: fuzzyResult.item,
      confidence: fuzzyScore,
      method: 'fuzzy',
      step: 7,
      query: synonymQuery,
      rawScore: fuzzyResult.score
    });
    console.log(`   ✅ Found: "${fuzzyResult.item.title}" (score: ${fuzzyScore.toFixed(1)})`);
  } else {
    console.log(`   ❌ No fuzzy match`);
  }
  
  // Step 8: Levenshtein matching
  console.log(`🔍 Step 8 - Levenshtein matching...`);
  const levenshteinResult = levenshteinMatch(processedQuery);
  if (levenshteinResult) {
    const levenshteinScore = Math.max(0, levenshteinResult.score * 70); // Max 70 points
    candidates.push({
      match: levenshteinResult.item,
      confidence: levenshteinScore,
      method: 'levenshtein',
      step: 8,
      query: processedQuery,
      rawScore: levenshteinResult.score
    });
    console.log(`   ✅ Found: "${levenshteinResult.item.title}" (score: ${levenshteinScore.toFixed(1)})`);
  } else {
    console.log(`   ❌ No Levenshtein match`);
  }
  
  // Step 9: Phonetic matching
  console.log(`🔍 Step 9 - Phonetic matching...`);
  const phoneticResult = phoneticMatch(processedQuery);
  if (phoneticResult) {
    const phoneticScore = Math.min(60, phoneticResult.score * 15); // Max 60 points
    candidates.push({
      match: phoneticResult.item,
      confidence: phoneticScore,
      method: 'phonetic',
      step: 9,
      query: processedQuery,
      rawScore: phoneticResult.score
    });
    console.log(`   ✅ Found: "${phoneticResult.item.title}" (score: ${phoneticScore.toFixed(1)})`);
  } else {
    console.log(`   ❌ No phonetic match`);
  }
  
  // Step 10: Stemming matching
  console.log(`🔍 Step 10 - Stemming matching...`);
  const stemmingResult = stemmingMatch(synonymQuery);
  if (stemmingResult) {
    const stemmingScore = Math.max(0, stemmingResult.score * 50); // Max 50 points
    candidates.push({
      match: stemmingResult.item,
      confidence: stemmingScore,
      method: 'stemming',
      step: 10,
      query: synonymQuery,
      rawScore: stemmingResult.score
    });
    console.log(`   ✅ Found: "${stemmingResult.item.title}" (score: ${stemmingScore.toFixed(1)})`);
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
