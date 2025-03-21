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
    terms: {
      inclusion: [
        'include', 'includes', 'including',
        'part of', 'contains', 'containing',
        'consists of'
      ],
      derivation: [
        'derive', 'derives', 'derived',
        'originate', 'originates', 'originated'
      ],
      production: [
        'produce', 'produces', 'produced',
        'manufacture', 'manufactures', 'manufactured'
      ],
      processing: [
        'made from', 'processed from',
        'refined from', 'based on',
        'extracted from', 'obtained from',
        'created from'
      ]
    },
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
      ],
      single_term: [
        "I can tell you about {term1}. What would you like to know?",
        "Let me help you learn about {term1}. What specific aspects interest you?",
        "I have information about {term1}. What aspects would you like to explore?",
        "I can provide details about {term1}. What would you like to learn?",
        "I'd be happy to tell you about {term1}. What information are you looking for?"
      ],
      invalid_comparison: [
        "I can only provide information about energy-related terms. Would you like to learn about {term1}?",
        "I specialize in energy topics. I can tell you about {term1} if you're interested.",
        "My knowledge is focused on energy topics. I can explain about {term1} if you'd like.",
        "I'm specialized in energy information. Would you like to learn about {term1}?"
      ],
      suggestion: [
        "While I don't have specific information about that exact term, {term1} includes several related fuels that might interest you. Would you like to learn about any of them?",
        "That specific term is part of the broader category of {term1}. I can tell you about {term1} or its related fuels.",
        "This term is related to {term1}. I can provide information about {term1} or suggest some specific types within this category.",
        "That's connected to {term1}. Would you like to learn about {term1} or explore some of its specific subtypes?",
        "This is related to the {term1} category. I can explain about {term1} or tell you about more specific fuel types in this category."
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
    terms: {
      inclusion: [
        'inclure', 'inclut', 'incluant',
        'fait partie de', 'contient', 'contenant',
        'composé de'
      ],
      derivation: [
        'dériver', 'dérive', 'dérivé',
        'provenir', 'provient', 'provenu'
      ],
      production: [
        'produire', 'produit', 'produite',
        'fabriquer', 'fabrique', 'fabriqué'
      ],
      processing: [
        'fait à partir de', 'traité à partir de',
        'raffiné à partir de', 'basé sur',
        'extrait de', 'obtenu à partir de',
        'créé à partir de'
      ]
    },
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
      ],
      single_term: [
        "Je peux vous parler de {term1}. Que souhaitez-vous savoir ?",
        "Permettez-moi de vous informer sur {term1}. Quels aspects vous intéressent ?",
        "J'ai des informations sur {term1}. Quels aspects souhaitez-vous explorer ?",
        "Je peux vous donner des détails sur {term1}. Qu'aimeriez-vous apprendre ?",
        "Je serai ravi de vous parler de {term1}. Quelles informations recherchez-vous ?"
      ],
      invalid_comparison: [
        "Je ne peux fournir que des informations sur les termes liés à l'énergie. Voulez-vous en savoir plus sur {term1} ?",
        "Je suis spécialisé dans les sujets énergétiques. Je peux vous parler de {term1} si cela vous intéresse.",
        "Mes connaissances sont axées sur l'énergie. Je peux vous expliquer {term1} si vous le souhaitez.",
        "Je suis spécialisé dans l'information énergétique. Souhaitez-vous en savoir plus sur {term1} ?"
      ],
      suggestion: [
        "Bien que je n'aie pas d'informations spécifiques sur ce terme exact, {term1} comprend plusieurs combustibles connexes qui pourraient vous intéresser. Souhaitez-vous en savoir plus sur l'un d'entre eux ?",
        "Ce terme spécifique fait partie de la catégorie plus large de {term1}. Je peux vous parler de {term1} ou de ses combustibles associés.",
        "Ce terme est lié à {term1}. Je peux vous fournir des informations sur {term1} ou vous suggérer des types spécifiques dans cette catégorie.",
        "C'est lié à {term1}. Voulez-vous en savoir plus sur {term1} ou explorer certains de ses sous-types spécifiques ?",
        "Cela est lié à la catégorie {term1}. Je peux vous expliquer {term1} ou vous parler de types de combustibles plus spécifiques dans cette catégorie."
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
    terms: {
      inclusion: [
        'enthalten', 'enthält', 'einschließlich',
        'teil von', 'beinhaltet', 'beinhaltend',
        'besteht aus'
      ],
      derivation: [
        'ableiten', 'leitet ab', 'abgeleitet',
        'stammen', 'stammt', 'gestammt'
      ],
      production: [
        'produzieren', 'produziert', 'hergestellt',
        'herstellen', 'stellt her', 'hergestellt'
      ],
      processing: [
        'hergestellt aus', 'verarbeitet aus',
        'raffiniert aus', 'basierend auf',
        'gewonnen aus', 'erhalten aus',
        'erstellt aus'
      ]
    },
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
      ],
      single_term: [
        "Ich kann Ihnen über {term1} erzählen. Was möchten Sie wissen?",
        "Lassen Sie mich Ihnen etwas über {term1} erklären. Welche Aspekte interessieren Sie?",
        "Ich habe Informationen über {term1}. Welche Aspekte möchten Sie erkunden?",
        "Ich kann Ihnen Details über {term1} geben. Was möchten Sie erfahren?",
        "Ich erzähle Ihnen gerne etwas über {term1}. Welche Informationen suchen Sie?"
      ],
      invalid_comparison: [
        "Ich kann nur Informationen über energiebezogene Begriffe liefern. Möchten Sie mehr über {term1} erfahren?",
        "Ich bin auf Energiethemen spezialisiert. Ich kann Ihnen von {term1} erzählen, wenn Sie interessiert sind.",
        "Mein Wissen konzentriert sich auf Energiethemen. Ich kann Ihnen {term1} erklären, wenn Sie möchten.",
        "Ich bin auf Energieinformationen spezialisiert. Möchten Sie mehr über {term1} erfahren?"
      ],
      suggestion: [
        "Während ich keine spezifischen Informationen zu diesem genauen Begriff habe, umfasst {term1} mehrere verwandte Brennstoffe, die Sie interessieren könnten. Möchten Sie mehr über einen davon erfahren?",
        "Dieser spezifische Begriff ist Teil der übergeordneten Kategorie {term1}. Ich kann Ihnen etwas über {term1} oder seine verwandten Brennstoffe erzählen.",
        "Dieser Begriff ist mit {term1} verwandt. Ich kann Ihnen Informationen über {term1} geben oder einige spezifische Typen in dieser Kategorie vorschlagen.",
        "Das ist mit {term1} verbunden. Möchten Sie mehr über {term1} erfahren oder einige seiner spezifischen Untertypen erkunden?",
        "Dies ist mit der Kategorie {term1} verbunden. Ich kann Ihnen {term1} erklären oder Ihnen von spezifischeren Brennstofftypen in dieser Kategorie erzählen."
      ]
    }
  }
};