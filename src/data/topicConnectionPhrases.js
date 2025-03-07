/**
 * Phrases for connecting topics in conversation
 * These add natural transitions between related energy topics
 */

export const topicConnectionPhrases = {
  en: [
    "Speaking of {topic}, did you know...",
    "Related to {topic}, I can also tell you about...",
    "While we're discussing {topic}, you might also be interested in...",
    "{topic} is closely connected to...",
    "Another aspect of {topic} worth mentioning is...",
    "If you're interested in {topic}, you might also want to learn about...",
    "Many people who ask about {topic} also want to know about...",
    "{topic} is often discussed alongside topics like...",
  ],
  fr: [
    "En parlant de {topic}, saviez-vous que...",
    "En lien avec {topic}, je peux aussi vous parler de...",
    "Alors que nous discutons de {topic}, vous pourriez également être intéressé par...",
    "{topic} est étroitement lié à...",
    "Un autre aspect de {topic} qui mérite d'être mentionné est...",
    "Si vous vous intéressez à {topic}, vous pourriez également vouloir en savoir plus sur...",
    "Beaucoup de personnes qui se renseignent sur {topic} veulent aussi savoir...",
    "{topic} est souvent discuté en même temps que des sujets comme...",
  ],
  de: [
    "Apropos {topic}, wussten Sie schon...",
    "Im Zusammenhang mit {topic} kann ich Ihnen auch etwas über... erzählen",
    "Während wir über {topic} sprechen, könnten Sie sich auch für... interessieren",
    "{topic} ist eng verbunden mit...",
    "Ein weiterer erwähnenswerter Aspekt von {topic} ist...",
    "Wenn Sie an {topic} interessiert sind, möchten Sie vielleicht auch etwas über... erfahren",
    "Viele Menschen, die nach {topic} fragen, möchten auch wissen...",
    "{topic} wird oft zusammen mit Themen wie... diskutiert",
  ],
  "solid fossil fuels -> solid fossil fuels trade": {
    en: [
      "Would you like to see international trade data for solid fossil fuels?",
      "I can show you import and export statistics for coal and lignite.",
      "Would you like to explore trading patterns with partner countries?"
    ],
    fr: [
      "Voulez-vous voir les données du commerce international des combustibles fossiles solides ?",
      "Je peux vous montrer les statistiques d'importation et d'exportation du charbon et du lignite.",
      "Souhaitez-vous explorer les modèles d'échanges avec les pays partenaires ?"
    ],
    de: [
      "Möchten Sie die internationalen Handelsdaten für feste fossile Brennstoffe sehen?",
      "Ich kann Ihnen Import- und Exportstatistiken für Kohle und Braunkohle zeigen.",
      "Möchten Sie die Handelsmuster mit Partnerländern erkunden?"
    ]
  },
  "nuclear fuel -> nuclear infrastructure": {
    en: [
      "Would you like to see data about nuclear facilities and capacity?",
      "I can show you information about enrichment and fuel production facilities.",
      "Would you like to explore nuclear infrastructure statistics?"
    ],
    fr: [
      "Voulez-vous voir les données sur les installations et capacités nucléaires ?",
      "Je peux vous montrer des informations sur les installations d'enrichissement et de production de combustible.",
      "Souhaitez-vous explorer les statistiques sur l'infrastructure nucléaire ?"
    ],
    de: [
      "Möchten Sie Daten über nukleare Anlagen und Kapazitäten sehen?",
      "Ich kann Ihnen Informationen über Anreicherungs- und Brennstoffproduktionsanlagen zeigen.",
      "Möchten Sie Statistiken zur nuklearen Infrastruktur erkunden?"
    ]
  },
  "nuclear infrastructure -> electricity production": {
    en: [
      "Would you like to see how nuclear infrastructure contributes to electricity production?",
      "I can show you data about electricity generation from nuclear sources.",
      "Would you like to explore nuclear power generation statistics?"
    ],
    fr: [
      "Voulez-vous voir comment l'infrastructure nucléaire contribue à la production d'électricité ?",
      "Je peux vous montrer les données sur la production d'électricité d'origine nucléaire.",
      "Souhaitez-vous explorer les statistiques de production d'énergie nucléaire ?"
    ],
    de: [
      "Möchten Sie sehen, wie die nukleare Infrastruktur zur Stromerzeugung beiträgt?",
      "Ich kann Ihnen Daten zur Stromerzeugung aus Kernkraft zeigen.",
      "Möchten Sie Statistiken zur Kernkrafterzeugung erkunden?"
    ]
  },
  "solid fossil fuels trade -> energy efficiency": {
    en: [
      "Would you like to see how fossil fuel trade relates to energy efficiency targets?",
      "I can show you the impact of solid fuel imports on energy consumption.",
      "Would you like to explore the relationship between fuel trade and efficiency?"
    ],
    fr: [
      "Voulez-vous voir comment le commerce des combustibles fossiles est lié aux objectifs d'efficacité énergétique ?",
      "Je peux vous montrer l'impact des importations de combustibles solides sur la consommation d'énergie.",
      "Souhaitez-vous explorer la relation entre le commerce de combustibles et l'efficacité ?"
    ],
    de: [
      "Möchten Sie sehen, wie der fossile Brennstoffhandel mit den Energieeffizienzzielen zusammenhängt?",
      "Ich kann Ihnen die Auswirkungen von Festbrennstoffimporten auf den Energieverbrauch zeigen.",
      "Möchten Sie die Beziehung zwischen Brennstoffhandel und Effizienz erkunden?"
    ]
  }
};

export default topicConnectionPhrases;
