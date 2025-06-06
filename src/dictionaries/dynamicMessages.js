// src/dictionaries/dynamicMessages.js
export const dynamicMessages = {
  introductions: {
    en: [
      "Certainly! Here's what I found about {topic}:",
      "Okay, regarding {topic}, here's the information:",
      "Here's some information on {topic}:",
      "I found this about {topic}:",
      "Here are the details for {topic}:"
    ],
    fr: [
      "Certainement ! Voici ce que j'ai trouvé sur {topic} :",
      "D'accord, concernant {topic}, voici les informations :",
      "Voici quelques informations sur {topic} :",
      "J'ai trouvé ceci à propos de {topic} :",
      "Voici les détails pour {topic} :"
    ],
    de: [
      "Sicher! Hier ist, was ich über {topic} gefunden habe:",
      "Okay, bezüglich {topic}, hier sind die Informationen:",
      "Hier sind einige Informationen zu {topic}:",
      "Ich habe das über {topic} gefunden:",
      "Hier sind die Details für {topic}:"
    ]
    // Add other languages if supported and translations are available
  },
  eurostatDataPresentations: {
    en: [
      "Alright, I found the Eurostat data: For {country} in {year}, the {balance} of {product} was {value} {unit}. [Source: Eurostat]",
      "Here's the Eurostat data for {product} in {country} ({year}): {balance} was {value} {unit}. [Source: Eurostat]",
      "According to Eurostat, the {balance} for {product} in {country} during {year} stood at {value} {unit}. [Source: Eurostat]",
      "Got it! For {country} ({year}), data on {product} ({balance}): {value} {unit}. [Source: Eurostat]"
    ],
    fr: [
      "Très bien, j'ai trouvé les données Eurostat : Pour {country} en {year}, le {balance} de {product} était de {value} {unit}. [Source : Eurostat]",
      "Voici les données Eurostat pour {product} en {country} ({year}) : le {balance} était de {value} {unit}. [Source : Eurostat]",
      "Selon Eurostat, le {balance} pour {product} en {country} durant {year} s'élevait à {value} {unit}. [Source : Eurostat]",
      "Compris ! Pour {country} ({year}), données sur {product} ({balance}) : {value} {unit}. [Source : Eurostat]"
    ],
    de: [
      "Alles klar, ich habe die Eurostat-Daten gefunden: Für {country} im Jahr {year} betrug die {balance} von {product} {value} {unit}. [Quelle: Eurostat]",
      "Hier sind die Eurostat-Daten für {product} in {country} ({year}): Die {balance} betrug {value} {unit}. [Quelle: Eurostat]",
      "Laut Eurostat lag die {balance} für {product} in {country} im Jahr {year} bei {value} {unit}. [Quelle: Eurostat]",
      "Verstanden! Für {country} ({year}), Daten zu {product} ({balance}): {value} {unit}. [Quelle: Eurostat]"
    ]
    // Add other languages if supported
  }
};
