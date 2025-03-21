export const relationshipPatterns = {
  en: {
    patterns: [
      // Basic relationships
      /related to/i,
      /part of/i,
      /included in/i,
      /belongs to/i,
      /connected with/i,
      /associated with/i,
      /linked to/i,
      /subset of/i,
      /type of/i,
      /kind of/i,
      // Family and hierarchical relationships
      /family of/i,
      /sub-family of/i,
      /sub-type of/i,
      /sub-fuel of/i,
      /derived from/i,
      /produced from/i,
      /parent (fuel|type|category)/i,
      /child (fuel|type|category)/i,
      /branch of/i,
      /category of/i,
      /classification of/i,
      // Question patterns
      /relationship between/i,
      /how.*related/i,
      /connection between/i,
      /are.*and.*related/i,
      /is.*related.*to/i,
      /do.*belong.*same/i,
      /falls under/i,
      /comes from/i,
      /derived product/i,
      /by-product/i,
      /same (family|category|type|group)/i,
      // Simple patterns for implicit questions
      /^is\s+\w+.*(?:to|with|from)\s+\w+/i,  // Catches "is coke related to coal products?"
      /^(?:how|what).*(?:relation|connection)/i,
      /(?:include|contain|made from|derived from)/i,
      /(?:belong|part|component|element) of/i,
      /(?:used|processed|refined|produced) (?:in|from|by|with)/i
    ],
    responses: {
      positive: [
        "Yes, they are related. {term1} and {term2} belong to the same energy family. Would you like to learn more about either of them?",
        "Yes, they are connected. {term1} is actually derived from {term2}. I can tell you more about either one.",
        "Indeed, they are related. {term1} and {term2} share the same energy classification. Would you like to explore either in detail?",
        "Yes, there is a hierarchical relationship. {term1} is a sub-type of {term2}. I can explain more about either one.",
        "They are definitely related within the energy classification system. Would you like to know more about {term1} or {term2}?"
      ],
      negative: [
        "No, they are not directly related. {term1} and {term2} belong to different energy classifications. However, I can tell you about either one.",
        "While both are energy sources, {term1} and {term2} are not directly related. Would you like to learn about one of them?",
        "They belong to separate energy categories. I can explain more about {term1} or {term2} separately.",
        "There is no direct relationship between them in the energy classification system. Would you like to explore {term1} or {term2}?",
        "They are separate categories in the energy family. Would you like to know more about {term1} or {term2}?"
      ]
    }
  },
  fr: {
    patterns: [
      // Basic relationships
      /lié[e]? [àa]/i,
      /fait partie de/i,
      /inclus[e]? dans/i,
      /appartient [àa]/i,
      /en relation avec/i,
      /associé[e]? [àa]/i,
      /connecté[e]? [àa]/i,
      // Family and hierarchical relationships
      /famille de/i,
      /sous-famille de/i,
      /sous-type de/i,
      /sous-carburant de/i,
      /dérivé[e]? de/i,
      /produit[e]? [àa] partir de/i,
      /catégorie parente/i,
      /catégorie enfant/i,
      /branche de/i,
      /catégorie de/i,
      /classification de/i,
      // Question patterns
      /relation entre/i,
      /comment.*lié/i,
      /connection entre/i,
      /sont.*et.*liés/i,
      /est.*lié.*[àa]/i,
      /appartiennent.*même/i,
      /provient de/i,
      /issu[e]? de/i,
      /produit dérivé/i,
      /sous-produit/i,
      /même (famille|catégorie|type|groupe)/i,
      // Add new French patterns
      /^est\s+\w+.*(?:à|avec|de)\s+\w+/i,
      /(?:inclut|contient|fait de|dérivé de)/i,
      /(?:appartient|partie|composant|élément) de/i,
      /(?:utilisé|transformé|raffiné|produit) (?:dans|de|par|avec)/i
    ],
    responses: {
      positive: [
        "Oui, ils sont liés. {term1} et {term2} appartiennent à la même famille d'énergie. Souhaitez-vous en savoir plus sur l'un d'eux ?",
        "Oui, ils sont connectés. {term1} est en fait dérivé de {term2}. Je peux vous parler de l'un ou l'autre.",
        "En effet, ils sont liés. {term1} et {term2} partagent la même classification énergétique. Voulez-vous explorer l'un des deux en détail ?",
        "Oui, il existe une relation hiérarchique. {term1} est un sous-type de {term2}. Je peux vous expliquer l'un ou l'autre.",
        "Ils sont définitivement liés dans le système de classification énergétique. Voulez-vous en savoir plus sur {term1} ou {term2} ?"
      ],
      negative: [
        "Non, ils ne sont pas directement liés. {term1} et {term2} appartiennent à des classifications énergétiques différentes. Cependant, je peux vous parler de l'un ou l'autre.",
        "Bien que ce soient des sources d'énergie, {term1} et {term2} ne sont pas directement liés. Souhaitez-vous en savoir plus sur l'un d'eux ?",
        "Ils appartiennent à des catégories énergétiques distinctes. Je peux vous expliquer {term1} ou {term2} séparément.",
        "Il n'y a pas de relation directe entre eux dans le système de classification énergétique. Voulez-vous explorer {term1} ou {term2} ?",
        "Ce sont des catégories distinctes dans la famille énergétique. Voulez-vous en savoir plus sur {term1} ou {term2} ?"
      ]
    }
  },
  de: {
    patterns: [
      // Basic relationships
      /verwandt mit/i,
      /teil von/i,
      /enthalten in/i,
      /gehört zu/i,
      /verbunden mit/i,
      /assoziiert mit/i,
      /verknüpft mit/i,
      // Family and hierarchical relationships
      /familie von/i,
      /unterfamilie von/i,
      /unterart von/i,
      /unterbrennstoff von/i,
      /abgeleitet von/i,
      /hergestellt aus/i,
      /übergeordnete kategorie/i,
      /unterkategorie/i,
      /zweig von/i,
      /kategorie von/i,
      /klassifikation von/i,
      // Question patterns
      /beziehung zwischen/i,
      /wie.*verwandt/i,
      /verbindung zwischen/i,
      /sind.*und.*verwandt/i,
      /ist.*verwandt.*mit/i,
      /gehören.*gleichen/i,
      /stammt von/i,
      /kommt von/i,
      /nebenprodukt/i,
      /derivat/i,
      /gleiche (familie|kategorie|typ|gruppe)/i,
      // Add new German patterns
      /^ist\s+\w+.*(?:zu|mit|von)\s+\w+/i,
      /(?:enthält|beinhaltet|hergestellt aus|abgeleitet von)/i,
      /(?:gehört|teil|komponente|element) von/i,
      /(?:verwendet|verarbeitet|raffiniert|produziert) (?:in|aus|von|mit)/i
    ],
    responses: {
      positive: [
        "Ja, sie sind verwandt. {term1} und {term2} gehören zur selben Energiefamilie. Möchten Sie mehr über eines davon erfahren?",
        "Ja, sie sind verbunden. {term1} ist tatsächlich von {term2} abgeleitet. Ich kann Ihnen mehr über beides erzählen.",
        "In der Tat, sie sind verwandt. {term1} und {term2} teilen die gleiche Energieklassifikation. Möchten Sie eines davon näher kennenlernen?",
        "Ja, es besteht eine hierarchische Beziehung. {term1} ist eine Unterart von {term2}. Ich kann Ihnen beides erklären.",
        "Sie sind definitiv im Energieklassifikationssystem verwandt. Möchten Sie mehr über {term1} oder {term2} wissen?"
      ],
      negative: [
        "Nein, sie sind nicht direkt verwandt. {term1} und {term2} gehören zu verschiedenen Energieklassifikationen. Ich kann Ihnen aber über beides erzählen.",
        "Obwohl beides Energiequellen sind, sind {term1} und {term2} nicht direkt verwandt. Möchten Sie mehr über eines davon erfahren?",
        "Sie gehören zu unterschiedlichen Energiekategorien. Ich kann Ihnen {term1} oder {term2} separat erklären.",
        "Es gibt keine direkte Beziehung zwischen ihnen im Energieklassifikationssystem. Möchten Sie {term1} oder {term2} erkunden?",
        "Es sind separate Kategorien in der Energiefamilie. Möchten Sie mehr über {term1} oder {term2} wissen?"
      ]
    }
  }
};