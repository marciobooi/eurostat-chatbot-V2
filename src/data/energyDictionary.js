/**
 * Energy dictionary with multilingual support
 * Contains information about energy topics across multiple languages
 */

export const energyDictionary = {
  en: {
    oil: {
      title: "Oil",
      text: "Oil is a fossil fuel formed from organic materials over millions of years. It's a major energy source worldwide, used primarily for transportation, heating, and electricity generation. According to Eurostat, the EU imports about 90% of its crude oil. The energy sector is working to reduce oil dependence through renewable alternatives and improved efficiency.",
      keywords: ["petroleum", "crude oil", "fossil fuel", "gasoline", "diesel"],
      synonyms: ["petroleum", "crude", "fossil fuel", "black gold"],
      related: [
        "natural gas",
        "fossil fuels",
        "energy consumption",
        "renewable energy",
      ],
    },
    "natural gas": {
      title: "Natural Gas",
      text: "Natural gas is a fossil fuel composed primarily of methane. It's widely used for heating, cooking, electricity generation, and as an industrial feedstock. Compared to other fossil fuels, it produces fewer greenhouse gas emissions. The EU imports approximately 80% of its natural gas, with Russia having been a major supplier before the 2022 energy crisis.",
      keywords: ["gas", "methane", "LNG", "fossil fuel"],
      synonyms: ["gas", "methane"],
      related: ["oil", "fossil fuels", "energy consumption", "LNG"],
    },
    "renewable energy": {
      title: "Renewable Energy",
      text: "Renewable energy comes from naturally replenishing sources like sunlight, wind, water, and geothermal heat. The EU has set a target of at least 32% renewable energy by 2030. As of 2020, renewables accounted for about 22% of the EU's energy mix, with considerable variation between member states. Wind, solar, and hydropower are the fastest-growing renewable sources in Europe.",
      keywords: [
        "renewables",
        "clean energy",
        "sustainable energy",
        "green energy",
      ],
      synonyms: ["clean energy", "green energy", "sustainable energy"],
      related: [
        "solar energy",
        "wind power",
        "hydropower",
        "bioenergy",
        "energy transition",
      ],
    },
    "solar energy": {
      title: "Solar Energy",
      text: "Solar energy harnesses sunlight to generate electricity through photovoltaic panels or concentrated solar power systems. It's one of the fastest-growing renewable energy sources in the EU. In 2020, solar provided approximately 5% of the EU's electricity. Southern European countries like Spain, Italy, and Greece have the highest solar potential, but Germany remains the largest installer of solar capacity.",
      keywords: ["solar power", "photovoltaic", "PV", "solar panels"],
      synonyms: ["solar power", "photovoltaic energy", "solar electricity"],
      related: [
        "renewable energy",
        "energy transition",
        "electricity production",
      ],
    },
    "wind power": {
      title: "Wind Power",
      text: "Wind power converts wind energy into electricity using turbines. It's the largest source of renewable electricity in the EU, accounting for about 16% of total electricity generation as of 2020. The EU leads globally in offshore wind deployment. Denmark, Ireland, and Germany have the highest share of wind in their electricity mix. The EU aims to expand offshore wind capacity to at least 60 GW by 2030.",
      keywords: ["wind energy", "wind farms", "wind turbines", "offshore wind"],
      synonyms: ["wind energy", "wind generation", "wind electricity"],
      related: [
        "renewable energy",
        "energy transition",
        "electricity production",
      ],
    },
    "energy consumption": {
      title: "Energy Consumption",
      text: "Energy consumption measures the total energy used across all sectors. In the EU, the largest energy-consuming sectors are transport (31%), households (27%), and industry (25%). Final energy consumption in the EU reached approximately 940 million tonnes of oil equivalent in 2019. The EU aims to improve energy efficiency by 32.5% by 2030, reducing overall consumption. Since 2000, energy consumption per capita has decreased by about 12% across the EU.",
      keywords: [
        "energy use",
        "energy demand",
        "final energy",
        "energy efficiency",
      ],
      synonyms: ["energy use", "energy demand", "energy usage"],
      related: [
        "energy efficiency",
        "household energy",
        "industrial energy",
        "transport energy",
      ],
    },
    "energy efficiency": {
      title: "Energy Efficiency",
      text: "Energy efficiency means using less energy to perform the same task. The EU has set a target to improve energy efficiency by at least 32.5% by 2030. Buildings account for about 40% of energy consumption in the EU, making them a key focus for efficiency improvements. The Energy Performance of Buildings Directive requires all new buildings to be nearly zero-energy from 2021. Energy efficiency labels on appliances have helped consumers reduce household energy use across Europe.",
      keywords: [
        "energy saving",
        "energy conservation",
        "efficient energy use",
      ],
      synonyms: [
        "energy conservation",
        "energy savings",
        "energy optimization",
      ],
      related: [
        "energy consumption",
        "building efficiency",
        "appliance efficiency",
      ],
    },
    "fossil fuels": {
      title: "Fossil Fuels",
      text: "Fossil fuels include coal, oil, and natural gas formed from prehistoric organic matter. They currently account for about 70% of the EU's energy mix. The EU aims to reduce fossil fuel dependency for climate goals and energy security. Fossil fuel combustion is responsible for approximately 75% of EU greenhouse gas emissions. Under the European Green Deal, the EU plans to be climate-neutral by 2050, which will require significantly reducing fossil fuel use.",
      keywords: ["coal", "oil", "natural gas", "non-renewable energy"],
      synonyms: ["conventional fuels", "carbon fuels", "hydrocarbons"],
      related: ["oil", "natural gas", "coal", "emissions", "climate change"],
    },
    "energy mix": {
      title: "Energy Mix",
      text: "The energy mix refers to the combination of different energy sources used in a region. The EU's energy mix in 2020 consisted of petroleum products (35%), natural gas (24%), renewables (17%), nuclear energy (13%), and solid fossil fuels (11%). Each EU member state has a different energy mix based on available resources and policy choices. The European Green Deal aims to transform the EU's energy mix toward more renewable sources and less fossil fuels by 2050.",
      keywords: [
        "energy sources",
        "energy portfolio",
        "energy balance",
        "fuel mix",
      ],
      synonyms: ["energy portfolio", "energy balance", "fuel mix"],
      related: ["renewable energy", "fossil fuels", "nuclear energy"],
    },
    "energy transition": {
      title: "Energy Transition",
      text: "Energy transition is the shift from fossil-based to zero-carbon energy sources. The EU is committed to becoming climate-neutral by 2050 as part of the European Green Deal. This transition involves expanding renewable energy, improving energy efficiency, and developing clean technologies. The EU has allocated over €1 trillion for sustainable investments over the next decade. The transition also focuses on ensuring fairness through the Just Transition Mechanism, which supports regions heavily dependent on fossil fuels.",
      keywords: [
        "energy transformation",
        "clean energy transition",
        "low-carbon transition",
      ],
      synonyms: ["energy transformation", "sustainable energy shift"],
      related: [
        "renewable energy",
        "European Green Deal",
        "climate neutrality",
      ],
    },
    "electricity production": {
      title: "Electricity Production",
      text: "Electricity production in the EU comes from various sources including fossil fuels, nuclear, and renewables. As of 2020, renewables accounted for approximately 38% of electricity generation, fossil fuels for 37%, and nuclear for 25%. Wind and hydropower are the largest renewable electricity sources in the EU. The EU aims to increase the share of renewable electricity to over 65% by 2030. Coal power has been declining rapidly, with many member states planning complete phase-outs by 2030.",
      keywords: ["power generation", "electricity supply", "power production"],
      synonyms: [
        "power generation",
        "electricity generation",
        "power production",
      ],
      related: [
        "renewable energy",
        "nuclear energy",
        "fossil fuels",
        "energy mix",
      ],
    },
  },
  fr: {
    pétrole: {
      title: "Pétrole",
      text: "Le pétrole est un combustible fossile formé à partir de matières organiques sur des millions d'années. C'est une source d'énergie majeure dans le monde, utilisée principalement pour les transports, le chauffage et la production d'électricité. Selon Eurostat, l'UE importe environ 90% de son pétrole brut. Le secteur énergétique s'efforce de réduire la dépendance au pétrole grâce aux alternatives renouvelables et à l'amélioration de l'efficacité.",
      keywords: [
        "huile",
        "pétrole brut",
        "combustible fossile",
        "essence",
        "diesel",
      ],
      synonyms: ["or noir", "combustible fossile", "hydrocarbure"],
      related: [
        "gaz naturel",
        "combustibles fossiles",
        "consommation d'énergie",
        "énergie renouvelable",
      ],
    },
    // Add more French entries as needed
  },
  de: {
    öl: {
      title: "Öl",
      text: "Öl ist ein fossiler Brennstoff, der über Millionen von Jahren aus organischen Materialien entstanden ist. Es ist weltweit eine wichtige Energiequelle, die hauptsächlich für Transport, Heizung und Stromerzeugung verwendet wird. Laut Eurostat importiert die EU etwa 90% ihres Rohöls. Der Energiesektor arbeitet daran, die Ölabhängigkeit durch erneuerbare Alternativen und verbesserte Effizienz zu reduzieren.",
      keywords: [
        "petroleum",
        "rohöl",
        "fossiler brennstoff",
        "benzin",
        "diesel",
      ],
      synonyms: ["petroleum", "rohöl", "fossiler brennstoff", "schwarzes gold"],
      related: [
        "erdgas",
        "fossile brennstoffe",
        "energieverbrauch",
        "erneuerbare energie",
      ],
    },
    // Add more German entries as needed
  },
};

/**
 * Get related topics for a specific topic
 * @param {string} topic - The topic to find related topics for
 * @param {string} language - Language code (en, fr, de)
 * @returns {Array} Array of related topics
 */
export const getRelatedTopics = (topic, language = "en") => {
  // Find the topic in the dictionary
  const dictionary = energyDictionary[language] || energyDictionary.en;

  // Check if topic exists in the dictionary
  if (dictionary[topic] && dictionary[topic].related) {
    return dictionary[topic].related;
  }

  // Try case-insensitive search
  const normalizedTopic = topic.toLowerCase();

  for (const [key, entry] of Object.entries(dictionary)) {
    if (key.toLowerCase() === normalizedTopic && entry.related) {
      return entry.related;
    }
  }

  return [];
};

export default energyDictionary;
