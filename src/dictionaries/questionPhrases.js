export const commonQuestionPhrases = {
  en: [
    // Basic question starters (energy context)
    /^(?:what|how|why|where|when|which|who|whom|whose)\s/i,
    /^(?:can|could|should|would|will|do|does|did|is|are|was|were|have|has|had|am|may|might|must|shall|ought)\s/i,
    
    // Production-related queries
    /\b(how much|what amount|how many)\s+(?:energy|electricity|fuel|power|heat)\s+(?:is|was|has been|will be|can be)\s+(?:produced|generated|supplied|manufactured|extracted)\b/i,
    /\b(energy|electricity|fuel|heat)\s+(?:output|production|generation|extraction)\b/i,
    /\b(?:renewable|fossil|nuclear|hydro|solar|wind|biomass|geothermal)\s+(?:energy|power)\s+(?:production|output|generation)\b/i,
    /\binstalled capacity|generation capacity|power output\b/i,
    /\b(primary|final) energy production\b/i,
    /\b(?:where|how)\s+does\s+energy\s+come\s+from\b/i,
  
    // Consumption-related queries
    /\b(how much|what amount|how many)\s+(?:energy|electricity|fuel|power|heat)\s+(?:is|was|has been|will be|can be)\s+(?:consumed|used|required|demanded|expended|utilized)\b/i,
    /\b(energy|electricity|fuel|heat)\s+(?:consumption|demand|usage|expenditure|utilization)\b/i,
    /\benergy\s+(?:needs|demand|requirements)\b/i,
    /\bfinal energy consumption\b/i,
    /\bconsumption by sector|sectoral consumption\b/i,
    /\b(residential|industrial|transport|services)\s+energy\s+(?:use|consumption|demand)\b/i,
    /\bnon-energy consumption\b/i,
  
    // Trade and cross-border flows
    /\b(how much|what amount|how many)\s+(?:energy|electricity|fuel|power|heat)\s+(?:is|was|has been|will be|can be)\s+(?:imported|exported|traded|shipped|exchanged)\b/i,
    /\b(import|export|trade|cross-border)\s+(?:flows?|exchanges?|shipments?)\b/i,
    /\benergy market|cross-border energy flows\b/i,
    /\bnet imports?|net exports?\b/i,
    /\bimport dependency|self-sufficiency\b/i,
    /\benergy balance of trade\b/i,
  
    // Energy balance and stock levels
    /\b(energy balance|balance sheet|net balance|stock level|inventory levels?)\b/i,
    /\b(opening|closing)\s+(?:stock|balance|inventory)\b/i,
    /\b(gross inland|domestic)\s+consumption\b/i,
    /\btransformation\s+(input|output)\b/i,
    /\b(distribution|transmission|energy)\s+losses\b/i,
    /\bavailable for final consumption\b/i,
    /\b(statistical differences?|discrepancies?)\b/i,
    /\benergy dependency rate\b/i,
    
    // Trends and historical data
    /\b(trend|evolution|change|growth|decline|trajectory|pattern|variation)\b/i,
    /\b(historical|future|forecast|projection|past|outlook)\b/i,
    /\bhow\s+(?:has|did|does|will)\s+(?:energy|consumption|production|imports?|exports?)\s+(?:change|evolve|trend)\b/i,
    /\bover time|year-on-year|since\b/i,
    /\bshort-term|long-term|seasonal changes?\b/i,
  
    // Comparisons and differences
    /\b(compare|comparison|versus|vs|difference|contrast|relative)\b/i,
    /\b(how does|how do|how did)\s+(?:this|that|they|it)\s+compare\s+(?:to|with)\b/i,
    /\bwhat\s+is\s+the\s+difference\s+between\b/i,
    /\b(less than|more than|higher|lower|greater|smaller)\b/i,
    /\benergy mix comparison\b/i,
    
    // Visualizations and data requests
    /\b(show|display|graph|chart|visualize|plot|draw)\b/i,
    /\bcan\s+you\s+(?:show|display|visualize)\s+(?:the|this|that)\s+(?:data|numbers|figures|statistics)\b/i,
    /\b(visualization|infographic|interactive chart)\b/i,
    /\b(make|create|generate)\s+(?:a|an)\s+(?:chart|graph|plot|diagram)\b/i,
    /\benergy flow chart\b/i,
  
    // Definitions and clarifications
    /\b(what is|define|explain|describe|overview|meaning of)\b/i,
    /\b(give me|show me|provide)\s+(?:an|a)\s+(overview|summary|explanation)\b/i,
    /\benergy policy|regulation|standards\b/i,
    /\bbackground information\b/i,
    
    // Policy, regulations, and scenarios
    /\b(energy policy|regulation|standards)\b/i,
    /\b(renewable energy targets|emissions reduction|net zero goals?)\b/i,
    /\bwhat\s+are\s+(?:EU|European|national)\s+energy\s+(?:policies|goals|standards)\b/i,
    /\b(impact of|effects of)\s+(?:policy|regulation)\b/i,
    /\benergy transition\b/i,
  
    // Hypothetical and feasibility questions
    /\bwhat\s+if\b/i,
    /\bsuppose\s+that\b/i,
    /\bhow likely\s+is\s+it\b/i,
    /\bcould\s+it\s+(?:happen|be done|work)\b/i,
    /\bis\s+it\s+(?:possible|feasible)\b/i,
  
    // Other auxiliary question forms
    /\b(could|can|should|would|will|do|does|did|is|are|was|were|have|has|had|am|may|might|must|shall|ought)\s/i,
    /\b(help me understand|explain why|tell me more|how come)\b/i
  ],
  
  fr: [
    // Déclencheurs de questions de base (contexte énergétique)
    /^(?:quoi|comment|pourquoi|où|quand|lequel|laquelle|lesquels|lesquelles|qui|à qui|de qui)\s/i,
    /^(?:peux|pouvons|pouvez|devons|dois|doit|faut-il|est-ce que|est|sont|était|étaient|avoir|a|as|avez|avaient|sera|seront|serait|seraient)\s/i,
  
    // Questions sur la production d'énergie
    /\b(combien\s+(?:d'énergie|d'électricité|de carburant|de chaleur)\s+(?:est|a été|sera|peut être)\s+(?:produit|généré|extrait|fabriqué|fournit))\b/i,
    /\b(?:production|génération|extraction)\s+(?:d'énergie|d'électricité|de chaleur|de carburant)\b/i,
    /\b(?:énergies renouvelables|fossiles|nucléaire|hydroélectricité|solaire|éolien|biomasse|géothermie)\s+(?:produites|générées)\b/i,
    /\bcapacité installée|capacité de production|puissance produite\b/i,
    /\bproduction d'énergie primaire|production d'énergie finale\b/i,
    /\boù\s+provient\s+l'énergie\b/i,
  
    // Questions sur la consommation d'énergie
    /\b(combien\s+(?:d'énergie|d'électricité|de carburant|de chaleur)\s+(?:est|a été|sera|peut être)\s+(?:consommé|utilisé|demandé|exigé))\b/i,
    /\b(?:consommation|utilisation|demande)\s+(?:d'énergie|d'électricité|de carburant|de chaleur)\b/i,
    /\bbesoins énergétiques|demande d'énergie\b/i,
    /\bconsommation finale d'énergie\b/i,
    /\bconsommation par secteur|consommation sectorielle\b/i,
    /\b(consommation résidentielle|industrielle|transport|services)\b/i,
    /\bconsommation non énergétique\b/i,
  
    // Questions sur le commerce et les flux transfrontaliers
    /\b(combien\s+d'(?:énergie|électricité|carburant|chaleur)\s+(?:est|a été|sera)\s+(?:importé|exporté|échangé))\b/i,
    /\bflux\s+(?:d'importation|d'exportation|transfrontaliers)\b/i,
    /\bmarché de l'énergie\b/i,
    /\bimportations nettes|exportations nettes\b/i,
    /\bdépendance énergétique|autosuffisance énergétique\b/i,
  
    // Questions sur le bilan énergétique et les niveaux de stocks
    /\b(bilan énergétique|feuille de bilan|niveau de stock|inventaire)\b/i,
    /\b(stock\s+(?:initial|final)|bilan\s+(?:ouverture|clôture))\b/i,
    /\bconsommation intérieure brute\b/i,
    /\bpertes\s+(?:de distribution|de transmission|d'énergie)\b/i,
    /\bdisponible pour la consommation finale\b/i,
  
    // Questions sur les tendances et données historiques
    /\b(tendance|évolution|changement|croissance|déclin|trajectoire|variation)\b/i,
    /\b(historique|prévision|projection|avenir|perspectives)\b/i,
    /\bcomment\s+(?:l'énergie|la consommation|la production)\s+(?:a changé|évolue|varie)\b/i,
    /\bau fil du temps|depuis\b/i,
  
    // Comparaisons et différences
    /\b(comparer|comparaison|différence|contraste|relatif)\b/i,
    /\bcomment\s+(?:cela|ça|il|elle)\s+se\s+compare\b/i,
    /\bquelle\s+est\s+la\s+différence\s+entre\b/i,
    /\bplus grand|plus petit|supérieur|inférieur\b/i,
  
    // Visualisations et demandes de données
    /\b(afficher|montrer|graphiquer|visualiser|tracer)\b/i,
    /\b(pouvez-vous\s+montrer|afficher)\s+(?:les\s+données|les chiffres)\b/i,
    /\bvisualisation|infographie|graphique interactif\b/i,
  
    // Définition et clarification
    /\b(qu'est-ce que|définir|expliquer|décrire|signifie)\b/i,
    /\bdonnez-moi\s+(?:un résumé|une explication)\b/i,
    /\bpolitique énergétique|réglementation|normes\b/i,
  
    // Politique, réglementation et scénarios
    /\b(objectifs d'énergie renouvelable|réduction des émissions|neutralité carbone)\b/i,
    /\bimpact de la politique énergétique\b/i,
  
    // Hypothèses et faisabilité
    /\b(et si|supposons que|est-il possible|peut-on)\b/i
  ],
  de: [
    // Grundlegende Frageanfänge (Energiekontext)
    /^(?:was|wie|warum|wo|wann|welche|wer|wem|wessen)\s/i,
    /^(?:kann|könnte|soll|sollte|würde|wird|ist|sind|war|waren|hat|haben|hätte|dürfte|muss|müssen)\s/i,
  
    // Fragen zur Energieerzeugung
    /\b(wie viel|wie hoch|welche Menge)\s+(?:Energie|Strom|Wärme|Kraftstoff)\s+(?:wird|wurde|kann)\s+(?:erzeugt|produziert|gewonnen)\b/i,
    /\b(Energie|Strom|Kraftstoff)\s+(?:Produktion|Erzeugung|Gewinnung)\b/i,
    /\b(erneuerbare|fossile|nukleare|hydro|solar|wind|biomasse|geothermische)\s+(Energieerzeugung|Kapazität)\b/i,
    /\binstallierte Kapazität|Erzeugungskapazität\b/i,
  
    // Fragen zum Energieverbrauch
    /\b(wie viel|wie hoch|welche Menge)\s+(?:Energie|Strom|Wärme|Kraftstoff)\s+(?:wird|wurde|kann)\s+(?:verbraucht|genutzt|benötigt)\b/i,
    /\bEnergiebedarf|Energienachfrage\b/i,
    /\bEndenergieverbrauch\b/i,
  
    // Fragen zum Handel und grenzüberschreitenden Flüssen
    /\b(wie viel|welche Menge)\s+(?:Energie|Strom)\s+(?:wird|wurde)\s+(?:importiert|exportiert|gehandelt)\b/i,
    /\bEnergiehandel|grenzüberschreitender Fluss\b/i,
    /\bImportabhängigkeit|Selbstversorgung\b/i,
  
    // Energiebilanz und Lagerbestände
    /\b(Energiebilanz|Bestandsniveau|Inventar)\b/i,
  
    // Trends und historische Daten
    /\b(Trend|Entwicklung|Veränderung|Wachstum|Rückgang)\b/i,
  
    // Vergleiche und Unterschiede
    /\b(vergleichen|Vergleich|Unterschied|größer|kleiner)\b/i,
  
    // Visualisierungen und Datenanforderungen
    /\b(zeigen|darstellen|grafisch|visualisieren)\b/i,
  
    // Definition und Klärung
    /\b(was ist|definieren|erklären|bedeutet)\b/i
  ]
  
};

export default commonQuestionPhrases;
