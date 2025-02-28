// Tokenize and clean text
export const tokenize = (text) => {
  return text
    .toLowerCase()
    .replace(/[.,?!;:]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !['the', 'and', 'but', 'this', 'that', 'what', 'does', 'term', 'refer', 'to'].includes(word));
};

// Calculate similarity score between two sets of tokens
export const calculateSimilarity = (tokens1, tokens2) => {
  if (!tokens1.length || !tokens2.length) return 0;
  
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / Math.min(set1.size, set2.size); // Changed to use minimum set size
};

// Calculate weighted score based on different match types
export const calculateMatchScore = (query, entry, language) => {
  const queryTokens = tokenize(query);
  const keyTokens = tokenize(entry.key);
  const keywordTokens = entry.keywords.flatMap(kw => tokenize(kw));
  const synonymTokens = entry.synonyms.flatMap(syn => tokenize(syn));

  // If query is empty after filtering stop words, return 0
  if (queryTokens.length === 0) return 0;

  const scores = {
    keyMatch: calculateSimilarity(queryTokens, keyTokens) * 1.0,
    keywordMatch: calculateSimilarity(queryTokens, keywordTokens) * 0.8,
    synonymMatch: calculateSimilarity(queryTokens, synonymTokens) * 0.6,
  };

  // Log scores for debugging
  console.log('Match scores:', {
    query: queryTokens,
    key: keyTokens,
    keywords: keywordTokens,
    synonyms: synonymTokens,
    scores
  });

  return Math.max(
    scores.keyMatch,
    scores.keywordMatch,
    scores.synonymMatch
  );
};
