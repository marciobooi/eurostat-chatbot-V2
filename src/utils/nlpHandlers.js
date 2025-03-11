import nlp from 'compromise';
import dates from 'compromise-dates';
import numbers from 'compromise-numbers';
import sentences from 'compromise-sentences';
import stringSimilarity from 'string-similarity';
import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';
import multilangSentiment from 'multilang-sentiment';
import Sentiment from 'sentiment';
import { energyDictionary } from './energyDictionary';
import { CONFIG } from '../i18n';

// Initialize NLP libraries
nlp.extend(dates);
nlp.extend(numbers);
nlp.extend(sentences);
const winkNlp = winkNLP(model);
const sentiment = new Sentiment();

/**
 * Process and analyze text input
 */
export const processText = async (text, language = CONFIG.DEFAULT_LANGUAGE) => {
  try {
    // Clean and normalize input
    const cleanedText = text.toLowerCase().trim();
    const words = cleanedText.split(/\s+/);
    
    // Get composite terms (2-word combinations) for better matching
    const compositeTerms = [];
    for (let i = 0; i < words.length - 1; i++) {
      compositeTerms.push(`${words[i]} ${words[i + 1]}`);
    }

    // Get both single words and composite terms
    const allTerms = [...words, ...compositeTerms];
    
    // Get language-specific dictionary
    const dictionary = energyDictionary[language] || energyDictionary[CONFIG.DEFAULT_LANGUAGE];
    
    // Extract topics using language-specific keywords and concepts
    const topics = Object.entries(dictionary).reduce((acc, [topic, def]) => {
      const keywordMatch = def.keywords?.some(kw => 
        allTerms.some(term => term.includes(kw.toLowerCase()))
      );
      const conceptMatch = def.key_concepts?.some(concept =>
        allTerms.some(term => term.includes(concept.toLowerCase()))
      );
      
      if (keywordMatch || conceptMatch) {
        acc.push({
          topic,
          text: def.text,
          title: def.title,
          confidence: (keywordMatch ? 0.6 : 0) + (conceptMatch ? 0.4 : 0)
        });
      }
      return acc;
    }, []);

    return {
      topics: topics.sort((a, b) => b.confidence - a.confidence),
      terms: allTerms,
      language
    };
  } catch (error) {
    console.error('Error processing text:', error);
    return {
      topics: [],
      terms: [],
      language
    };
  }
};

/**
 * Find best match among topics
 */
export const findBestMatch = (input, topics, language = CONFIG.DEFAULT_LANGUAGE) => {
  const cleanInput = input.toLowerCase().trim();
  
  // Get dictionary for current language
  const dictionary = energyDictionary[language] || energyDictionary[CONFIG.DEFAULT_LANGUAGE];
  
  // Calculate match scores
  const matches = topics.map(topic => {
    const def = dictionary[topic];
    if (!def) return { topic, score: 0 };
    
    let score = 0;
    
    // Check direct topic match
    if (cleanInput.includes(topic.toLowerCase())) {
      score += 1;
    }
    
    // Check keyword matches
    if (def.keywords) {
      const keywordMatches = def.keywords.filter(kw => 
        cleanInput.includes(kw.toLowerCase())
      ).length;
      score += keywordMatches * 0.5;
    }
    
    // Check concept matches
    if (def.key_concepts) {
      const conceptMatches = def.key_concepts.filter(concept =>
        cleanInput.includes(concept.toLowerCase())
      ).length;
      score += conceptMatches * 0.3;
    }
    
    return { topic, score };
  });
  
  // Sort by score and get best match
  matches.sort((a, b) => b.score - a.score);
  return matches[0] || { topic: null, score: 0 };
};

/**
 * Extract named entities from text
 */
export const extractEntities = (text) => {
  // For now, just return basic structure
  // Could be enhanced with language-specific NER in future
  return {
    organizations: [],
    locations: [],
    dates: [],
    numbers: []
  };
};

/**
 * Analyze sentiment in multiple languages
 */
export const analyzeSentiment = (text, language = CONFIG.DEFAULT_LANGUAGE) => {
  try {
    // Use appropriate sentiment analyzer based on language
    switch(language) {
      case 'en':
        const englishSentiment = sentiment.analyze(text);
        return {
          score: englishSentiment.score,
          comparative: englishSentiment.comparative,
          language
        };
      case 'fr':
      case 'de':
        const multilingualSentiment = multilangSentiment(text, language);
        return {
          score: multilingualSentiment.score,
          comparative: multilingualSentiment.comparative || (multilingualSentiment.score / text.split(/\s+/).length),
          language
        };
      default:
        // Fallback to English for unsupported languages
        console.warn(`Language ${language} not supported for sentiment analysis, falling back to English`);
        const fallbackSentiment = sentiment.analyze(text);
        return {
          score: fallbackSentiment.score,
          comparative: fallbackSentiment.comparative,
          language: CONFIG.DEFAULT_LANGUAGE
        };
    }
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return {
      score: 0,
      comparative: 0,
      language
    };
  }
};