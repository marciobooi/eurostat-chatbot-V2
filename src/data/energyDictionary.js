export const energyDictionary = {
  en: {
    'fuel': {
      definition: 'Fuel is any material that can be made to react with other substances...',
      keywords: ['fuel', 'combustible', 'energy material'],
      synonyms: ['gasoline', 'diesel', 'petrol', 'energy source', 'power source'],
      relatedTopics: ['oil consumption', 'renewable energy', 'energy production', 'fossil fuels', 'petroleum products', 'energy efficiency'],
      links: 'https://en.wikipedia.org/wiki/Fuel',
    },
    'oil': {
      definition: 'Oil, also known as petroleum or crude oil, is a naturally occurring fossil fuel formed from ancient organic materials. It is a vital energy source used for transportation, heating, and industrial processes. Oil remains one of the world\'s most important energy sources, though its use has environmental implications.',
      keywords: ['oil', 'petroleum', 'crude', 'fossil fuel'],
      synonyms: ['petroleum', 'crude oil', 'black gold', 'fossil fuel'],
      relatedTopics: ['oil production', 'oil consumption', 'oil imports', 'fuel types', 'energy security', 'environmental impact'],
      links: 'https://en.wikipedia.org/wiki/Oil',
    }
  },
  fr: {
    'fuel': {
      definition: 'Le carburant est un matériau qui peut être amené à réagir avec d\'autres substances...',
      keywords: ['carburant', 'combustible', 'matériau énergétique'],
      synonyms: ['essence', 'diesel', 'pétrole', 'source d\'énergie'],
      relatedTopics: ['consommation de pétrole', 'énergie renouvelable', 'production d\'énergie', 'combustibles fossiles', 'produits pétroliers', 'efficacité énergétique'],
      links: 'https://fr.wikipedia.org/wiki/Carburant',
    },
    'oil': {
      definition: 'Le pétrole, également connu sous le nom de pétrole brut, est un combustible fossile naturel formé à partir de matériaux organiques anciens. C\'est une source d\'énergie vitale utilisée pour le transport, le chauffage et les processus industriels. Le pétrole reste l\'une des sources d\'énergie les plus importantes au monde, bien que son utilisation ait des implications environnementales.',
      keywords: ['huile', 'pétrole', 'brut', 'combustible fossile'],
      synonyms: ['pétrole', 'pétrole brut', 'or noir', 'combustible fossile'],
      relatedTopics: ['production de pétrole', 'consommation de pétrole', 'importations de pétrole', 'types de carburants', 'sécurité énergétique', 'impact environnemental'],
      links: 'https://fr.wikipedia.org/wiki/Pétrole',
    }
  },
  de: {
    'fuel': {
      definition: 'Brennstoff ist ein Material, das sich mit anderen Materialien reagieren kann...',
      keywords: ['brennstoff', 'kraftstoff', 'energiematerial'],
      synonyms: ['benzin', 'diesel', 'treibstoff', 'energiequelle'],
      relatedTopics: ['Ölverbrauch', 'erneuerbare Energie', 'Energieproduktion', 'fossile Brennstoffe', 'Erdölprodukte', 'Energieeffizienz'],
      links: 'https://de.wikipedia.org/wiki/Brennstoff',
    },
    'oil': {
      definition: 'Erdöl, auch bekannt als Rohöl, ist ein natürlich vorkommender fossiler Brennstoff, der aus alten organischen Materialien entstanden ist. Es ist eine wichtige Energiequelle, die für Transport, Heizung und industrielle Prozesse verwendet wird. Erdöl bleibt eine der wichtigsten Energiequellen der Welt, obwohl seine Nutzung Auswirkungen auf die Umwelt hat.',
      keywords: ['öl', 'erdöl', 'rohöl', 'fossiler brennstoff'],
      synonyms: ['erdöl', 'rohöl', 'schwarzes gold', 'fossiler brennstoff'],
      relatedTopics: ['Ölproduktion', 'Ölverbrauch', 'Ölimporte', 'Kraftstoffarten', 'Energiesicherheit', 'Umweltauswirkungen'],
      links: 'https://de.wikipedia.org/wiki/Erdöl',
    }
  }
};

// Enhanced helper function with cross-references
export const getRelatedTopics = (topic, language) => {
  if (!topic || !language || !energyDictionary[language]) return [];
  
  const dict = energyDictionary[language];
  const topicData = dict[topic.toLowerCase()];
  if (!topicData) return [];

  // Get direct related topics
  const directTopics = topicData.relatedTopics || [];
  
  // Find cross-referenced topics
  const crossRefs = Object.entries(dict)
    .filter(([key, value]) => 
      key !== topic.toLowerCase() && 
      (value.relatedTopics?.some(rt => 
        rt.toLowerCase().includes(topic.toLowerCase()) ||
        topicData.keywords.some(kw => rt.toLowerCase().includes(kw.toLowerCase()))
      ) || 
      value.keywords.some(kw => 
        topicData.relatedTopics?.some(rt => rt.toLowerCase().includes(kw.toLowerCase()))
      ))
    )
    .map(([key]) => key);

  // Combine and deduplicate
  return Array.from(new Set([...directTopics, ...crossRefs]));
};





