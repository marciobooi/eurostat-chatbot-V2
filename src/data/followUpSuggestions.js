/**
 * Follow-up suggestions to continue the conversation
 * Uses {topic} placeholder that will be replaced with the actual topic
 */

export const followUpSuggestions = {
  en: [
    "Would you like to know more about {topic}?",
    "I can provide more details about {topic} if you're interested.",
    "Should we explore {topic} in more depth?",
    "Would you like me to elaborate on {topic}?",
    "Are you interested in learning more about {topic}?",
    "There's more to discover about {topic} if you're curious.",
    "Do you have any specific questions about {topic}?",
  ],
  fr: [
    "Souhaitez-vous en savoir plus sur {topic} ?",
    "Je peux vous fournir plus de détails sur {topic} si cela vous intéresse.",
    "Devrions-nous explorer {topic} plus en profondeur ?",
    "Voulez-vous que j'approfondisse sur {topic} ?",
    "Êtes-vous intéressé par en apprendre davantage sur {topic} ?",
    "Il y a plus à découvrir sur {topic} si vous êtes curieux.",
    "Avez-vous des questions spécifiques concernant {topic} ?",
  ],
  de: [
    "Möchten Sie mehr über {topic} erfahren?",
    "Ich kann Ihnen weitere Details zu {topic} geben, wenn Sie interessiert sind.",
    "Sollen wir {topic} eingehender betrachten?",
    "Möchten Sie, dass ich auf {topic} näher eingehe?",
    "Sind Sie daran interessiert, mehr über {topic} zu erfahren?",
    "Es gibt noch mehr über {topic} zu entdecken, wenn Sie neugierig sind.",
    "Haben Sie konkrete Fragen zu {topic}?",
  ],
  solidFossilFuels: {
    production: [
      "Show imports of solid fossil fuels",
      "Compare surface mining vs underground mining",
      "View consumption by sector",
      "Show trends over last 5 years"
    ],
    imports: [
      "View main exporting countries",
      "Compare with domestic production",
      "Show monthly import trends",
      "View consumption patterns"
    ],
    exports: [
      "Show main importing countries",
      "Compare with production levels",
      "View export trends",
      "Show trade balance"
    ],
    consumption: [
      "Show breakdown by sector",
      "Compare with imports",
      "View efficiency metrics",
      "Show historical trends"
    ]
  },
  nonFossilHeat: {
    production: [
      "Show breakdown by source",
      "View district heating data",
      "Compare efficiency rates",
      "Show seasonal variations"
    ],
    district: [
      "View network distribution",
      "Show heat losses",
      "Compare urban areas",
      "View capacity trends"
    ],
    efficiency: [
      "Compare different technologies",
      "Show conversion rates",
      "View distribution losses",
      "Compare with fossil heat"
    ]
  },
  renewableEnergy: {
    share: [
      "Show breakdown by source",
      "View progress to targets",
      "Compare between countries",
      "Show trends by sector"
    ],
    transport: [
      "Show biofuel percentage",
      "View electric mobility share",
      "Compare with fossil fuels",
      "Show progress to targets"
    ],
    electricity: [
      "Show source breakdown",
      "View capacity growth",
      "Compare grid integration",
      "Show storage capacity"
    ],
    heating: [
      "Show technology mix",
      "View seasonal patterns",
      "Compare efficiency rates",
      "Show district heating share"
    ]
  },
  energyEfficiency: {
    primary: [
      "Show consumption breakdown",
      "View progress to 2030 target",
      "Compare between sectors",
      "Show savings potential"
    ],
    final: [
      "Show sectoral consumption",
      "View target progress",
      "Compare with primary energy",
      "Show efficiency gains"
    ],
    progress: [
      "View target distance",
      "Show sector improvements",
      "Compare member states",
      "View annual progress"
    ]
  }
};

export default followUpSuggestions;
