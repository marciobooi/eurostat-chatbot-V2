import { commonQuestionPhrases } from '../data/questionPhrases';

export const cleanQuery = (query) => {
  return query
    .toLowerCase()
    .replace(/[.,?!]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const extractTopicFromQuery = (query, language) => {
  const cleanedQuery = cleanQuery(query);
  const phrases = commonQuestionPhrases[language] || commonQuestionPhrases.en;

  let topic = cleanedQuery;
  phrases.forEach(phrase => {
    topic = topic.replace(new RegExp(`^${phrase}\\s+`, 'i'), '');
  });

  return topic;
};
