export const energyDictionary = {
  en: {
    'fuel': {
      definition: 'Fuel is any material that can be made to react with other substances...',
      keywords: ['fuel', 'combustible', 'energy material'],
      synonyms: ['gasoline', 'diesel', 'petrol', 'energy source', 'power source'],
      relatedTopics: ['oil consumption', 'renewable energy', 'energy production'],
      links: 'https://en.wikipedia.org/wiki/Fuel',
    },
    'oil': {
      definition: 'Oil is any material that can be made to react with other substances...',
      keywords: ['oil', 'petroleum', 'crude'],
      synonyms: ['petroleum', 'crude oil', 'black gold'],
      relatedTopics: ['oil production', 'oil consumption', 'oil imports'],
      links: 'https://en.wikipedia.org/wiki/Oil',
    }
  },
  fr: {
    'fuel': {
      definition: 'Le carburant est un matériau qui peut être amené à réagir avec d\'autres substances...',
      keywords: ['carburant', 'combustible', 'matériau énergétique'],
      synonyms: ['essence', 'diesel', 'pétrole', 'source d\'énergie'],
      relatedTopics: ['consommation de pétrole', 'énergie renouvelable', 'production d\'énergie'],
      links: 'https://fr.wikipedia.org/wiki/Carburant',
    },
    'oil': {
      definition: '...',
      keywords: ['huile', 'pétrole', 'brut'],
      synonyms: ['pétrole', 'pétrole brut', 'or noir'],
      relatedTopics: ['production de pétrole', 'consommation de pétrole', 'importations de pétrole'],
      links: 'https://fr.wikipedia.org/wiki/Pétrole',
    }
  },
  de: {
    'fuel': {
      definition: 'Brennstoff ist ein Material, das sich mit anderen Materialien reagieren kann...',
      keywords: ['brennstoff', 'kraftstoff', 'energiematerial'],
      synonyms: ['benzin', 'diesel', 'treibstoff', 'energiequelle'],
      relatedTopics: ['Ölverbrauch', 'erneuerbare Energie', 'Energieproduktion'],
      links: 'https://de.wikipedia.org/wiki/Brennstoff',
    },
    'oil': {
      definition: '...',
      keywords: ['öl', 'erdöl', 'rohöl'],
      synonyms: ['erdöl', 'rohöl', 'schwarzes Gold'],
      relatedTopics: ['Ölproduktion', 'Ölverbrauch', 'Ölimporte'],
      links: 'https://de.wikipedia.org/wiki/Öl',
    }
  }
};

// Helper function to get related topics
export const getRelatedTopics = (topic, language) => {
  if (!topic || !language || !energyDictionary[language]) return [];
  
  const topicData = energyDictionary[language][topic.toLowerCase()];
  return topicData?.relatedTopics || [];
};

// Example usage in ChatBot.jsx would be:
// const relatedTopics = getRelatedTopics(topic, language);





