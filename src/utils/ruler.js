
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
 * 
 * For each field (title, score, keywords, etc.) we run through this entire ruler
 */

// so first we search in all titles of all objects and perform this 10 rulers the file is in the data/DefinitionsEn.js then if 
// we dont find any match we search in fuelCode and we perform then 10 processes here
// if we dont find any match we go to keywords and so on
