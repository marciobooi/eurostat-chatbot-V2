import { energyDictionary } from './energyDictionary';

export const findEnergyDefinition = (query, language = 'en') => {
  const dict = energyDictionary[language] || energyDictionary.en;
  const searchQuery = query.toLowerCase();
  
  for (const [key, value] of Object.entries(dict)) {
    if (key.toLowerCase().includes(searchQuery) || 
        value.keywords?.some(k => k.toLowerCase().includes(searchQuery)) ) {
      return {
        title: value.title,
        text: value.text,
        relatedTopics: value.related || []
      };
    }
  }
  return null;
};

export const createBotResponse = (definition, language) => ({
  sender: 'bot',
  text: definition.text,
  title: definition.title,
  language,
  suggestions: definition.relatedTopics
});