import nlp from 'compromise';
import dates from 'compromise-dates';
import numbers from 'compromise-numbers';
import sentences from 'compromise-sentences';
import stringSimilarity from 'string-similarity';
import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';
import multilangSentiment from 'multilang-sentiment';
import Sentiment from 'sentiment';

// Initialize NLP libraries
nlp.extend(dates);
nlp.extend(numbers);
nlp.extend(sentences);
const winkNlp = winkNLP(model);
const sentiment = new Sentiment();

/**
 * Process text using compromise for basic NLP tasks
 */
export const processText = (text, language = 'en') => {
  const doc = nlp(text);

  // Handle composite words better (e.g., "hard coal", "brown coal")
  const words = text.toLowerCase().split(' ');
  const compositeTerms = [];
  for (let i = 0; i < words.length - 1; i++) {
    compositeTerms.push(`${words[i]} ${words[i + 1]}`);
  }

  // Get both single words and composite terms
  const allTerms = [...words, ...compositeTerms];
  
  // Extract topics and ensure text values are strings
  const topics = doc.topics().json().map(topic => ({
    ...topic,
    text: typeof topic.text === 'object' ? JSON.stringify(topic.text) : topic.text,
    terms: allTerms
  }));
  
  return {
    dates: doc.dates().json(),
    numbers: doc.numbers().json(),
    topics,
    sentences: doc.sentences().json(),
    questions: doc.questions().json(),
    terms: allTerms
  };
};

/**
 * Analyze sentiment in multiple languages
 */
export const analyzeSentiment = (text, language = 'en') => {
  try {
    if (language === 'en') {
      return sentiment.analyze(text);
    }
    return multilangSentiment(text, language);
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return { score: 0, comparative: 0 }; // Neutral sentiment as fallback
  }
};

/**
 * Find best matching topic from dictionaries
 */
export const findBestMatch = (query, topics) => {
  if (!topics || topics.length === 0) return { rating: 0, target: '' };
  
  // Handle both single word and composite word matching
  const queryTerms = query.toLowerCase().split(' ');
  const compositeQuery = queryTerms.join(' ');
  
  // Try exact match first
  const exactMatch = topics.find(t => t.toLowerCase() === compositeQuery);
  if (exactMatch) {
    return { rating: 1, target: exactMatch, bestMatchIndex: topics.indexOf(exactMatch) };
  }
  
  // Then try string similarity
  const matches = stringSimilarity.findBestMatch(compositeQuery, topics.map(t => t.toLowerCase()));
  return matches.bestMatch;
};

/**
 * Extract entities and keywords using WinkNLP
 */
export const extractEntities = (text) => {
  const doc = winkNlp.readDoc(text);
  return {
    entities: doc.entities().out(),
    keywords: doc.tokens().out(),
  };
};

/**
 * Process questions for enhanced understanding
 */
export const processQuestion = (text, language = 'en') => {
  try {
    const doc = nlp(text);
    const questionType = doc.questions().json()[0]?.type || 'statement';
    const topics = doc.topics().json().map(topic => ({
      ...topic,
      text: typeof topic.text === 'object' ? JSON.stringify(topic.text) : topic.text
    }));
    const dates = doc.dates().json();
    const sentimentResult = analyzeSentiment(text, language);
    
    return {
      questionType,
      topics,
      dates,
      sentiment: sentimentResult
    };
  } catch (error) {
    console.error('Error processing question:', error);
    return {
      questionType: 'statement',
      topics: [],
      dates: [],
      sentiment: { score: 0, comparative: 0 }
    };
  }
};