import { energyDefinitionsEn } from '../data/DefinitionsEn.js';
import { spellingCorrections } from '../data/SpellingCorrections.js';
import { abbreviations } from '../data/Abbreviations.js';
import { synonyms } from '../data/Synonyms.js';
import { stopwords } from '../data/Stopwords.js';
import { suffixes, minWordLength, stemExceptions } from '../data/Suffixes.js';
import Fuse from 'fuse.js';
import natural from 'natural';
import { removeStopwords } from 'stopword';
import nlp from 'compromise';

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

// Initialize NLP tools
const { PorterStemmer, JaroWinklerDistance, LevenshteinDistance } = natural;

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
    const distance = LevenshteinDistance(query.toLowerCase(), searchableText);
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
    const queryPhonetic = natural.Metaphone.process(query);
    let bestMatch = null;
    let maxMatches = 0;
    
    searchData.forEach(item => {
      try {
        const titlePhonetic = natural.Metaphone.process(item.title || '');
        const keywordPhonetics = (item.keywords || []).map(k => {
          try {
            return natural.Metaphone.process(k);
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
 * Custom stemming function using suffix dictionary
 */
const customStem = (word) => {
  const lowercaseWord = word.toLowerCase();
  
  // Check for irregular forms first
  if (stemExceptions[lowercaseWord]) {
    return stemExceptions[lowercaseWord];
  }
  
  // Try to remove suffixes (longest first)
  for (const suffix of suffixes) {
    if (lowercaseWord.endsWith(suffix) && 
        lowercaseWord.length > suffix.length + minWordLength) {
      return lowercaseWord.slice(0, -suffix.length);
    }
  }
  
  // If no suffix found, return original word
  return lowercaseWord;
};

/**
 * Step 10: Stemming-based matching using custom stemmer
 */
const stemmingMatch = (query) => {
  const queryWords = query.split(/\s+/);
  const queryStemmed = queryWords.map(word => customStem(word));
  
  let bestMatch = null;
  let bestScore = 0;
  
  searchData.forEach(item => {
    const itemWords = (item.searchText || '').split(/\s+/);
    const itemStemmed = itemWords.map(word => customStem(word));
    
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
 * Main ruler function - implements the 10-step process
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
  
  // Step 6: Try exact match first
  let result = findExactMatch(processedQuery);
  if (result) {
    console.log(`✅ Step 6 - Exact match found: "${result.title}"`);
    return { match: result, confidence: 1.0, method: 'exact' };
  }
  
  // Step 7: Fuzzy search
  result = fuzzySearch(synonymQuery);
  if (result && result.score < 0.3) { // Good fuzzy match
    console.log(`✅ Step 7 - Fuzzy match found: "${result.item.title}" (score: ${result.score})`);
    return { match: result.item, confidence: 1 - result.score, method: 'fuzzy' };
  }
  
  // Step 8: Levenshtein matching
  result = levenshteinMatch(processedQuery);
  if (result) {
    console.log(`✅ Step 8 - Levenshtein match found: "${result.item.title}" (score: ${result.score})`);
    return { match: result.item, confidence: result.score, method: 'levenshtein' };
  }
  
  // Step 9: Phonetic matching
  result = phoneticMatch(processedQuery);
  if (result) {
    console.log(`✅ Step 9 - Phonetic match found: "${result.item.title}" (score: ${result.score})`);
    return { match: result.item, confidence: result.score / 5, method: 'phonetic' };
  }
  
  // Step 10: Stemming match
  result = stemmingMatch(synonymQuery);
  if (result) {
    console.log(`✅ Step 10 - Stemming match found: "${result.item.title}" (score: ${result.score})`);
    return { match: result.item, confidence: result.score, method: 'stemming' };
  }
  
  console.log(`❌ No match found for: "${userQuery}"`);
  return null;
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
