export const intentPatterns = {
  en: {
    query_production: [
      /\b(?:how much|what|tell me|show).*(?:produce[ds]?|production|generate[ds]?|generation|extract(?:ed|ion)?|output|yield)\b/i,
      /\b(?:production|generation|extraction|output).*(?:data|statistics|figures|numbers)\b/i,
      /\b(?:where|how).*(?:come|comes) from\b/i,
      /\b(?:source|origin|produced|generated|extracted)\b.*(?:where|location|country|region)\b/i
    ],
    query_consumption: [
      /\b(?:how much|what|tell me|show).*(?:consume[ds]?|consumption|use[ds]?|usage|demand|needs?)\b/i,
      /\b(?:consumption|usage|demand).*(?:data|statistics|figures|numbers)\b/i,
      /\b(?:who|where|how).*(?:use[ds]?|consume[ds]?)\b/i,
      /\b(?:end-use|final use|user|consumer).*(?:sector|industry|residential|transport)\b/i
    ],
    query_trade: [
      /\b(?:how much|what|tell me|show).*(?:import(?:ed|s)?|export(?:ed|s)?|trade[ds]?|trading|exchange[ds]?)\b/i,
      /\b(?:imports?|exports?|trade).*(?:data|statistics|figures|numbers)\b/i,
      /\b(?:where|which country|countries).*(?:from|to|with)\b/i,
      /\b(?:international|cross-border|foreign).*(?:trade|exchange|flow|market)\b/i
    ],
    query_comparison: [
      /\b(?:compare|comparison|versus|vs|difference|differences|distinguish|between)\b/i,
      /\b(?:more|less|higher|lower|greater|smaller|better|worse) than\b/i,
      /\b(?:which|what).*(?:better|worse|preferred|alternative)\b/i,
      /\bhow.*(?:compare|differ|relate).*(?:to|with|from)\b/i
    ],
    query_trend: [
      /\b(?:trend|evolution|change|development|progress|growth|decline|pattern)\b/i,
      /\b(?:over time|historical|history|past|future|forecast|projection|outlook)\b/i,
      /\b(?:increase|decrease|grew|fallen|rose|dropped).*(?:since|from|between|during)\b/i,
      /\b(?:annual|yearly|monthly|seasonal).*(?:variation|fluctuation|pattern)\b/i
    ],
    request_visualization: [
      /\b(?:show|display|visualize|draw|plot|graph|chart).*(?:data|trend|comparison|numbers)\b/i,
      /\b(?:graph|chart|plot|diagram|visualization).*(?:of|for|showing)\b/i,
      /\b(?:can|could).*(?:see|view|look).*(?:visually|graphically)\b/i,
      /\b(?:visual|graphic|graphical).*(?:representation|display|format)\b/i
    ]
  },
  fr: {
    query_production: [
      /\b(?:combien|que|quel|quelle|quels|quelles).*(?:produit|production|génère|génération|extrait|extraction|rendement)\b/i,
      /\b(?:production|génération|extraction).*(?:données|statistiques|chiffres)\b/i,
      /\b(?:d'où|comment).*(?:vient|provient|origine)\b/i,
      /\b(?:source|origine|produit|généré|extrait)\b.*(?:où|localisation|pays|région)\b/i
    ],
    query_consumption: [
      /\b(?:combien|que|quel|quelle|quels|quelles).*(?:consomme[rz]?|consommation|utilise[rz]?|utilisation|demande|besoin)\b/i,
      /\b(?:consommation|utilisation|demande).*(?:données|statistiques|chiffres)\b/i,
      /\b(?:qui|où|comment).*(?:utilise[rz]?|consomme[rz]?)\b/i,
      /\b(?:utilisation finale|utilisateur|consommateur).*(?:secteur|industrie|résidentiel|transport)\b/i
    ],
    query_trade: [
      /\b(?:combien|que|quel|quelle|quels|quelles).*(?:importe[rz]?|exporte[rz]?|échange[rz]?)\b/i,
      /\b(?:importation|exportation|échange).*(?:données|statistiques|chiffres)\b/i,
      /\b(?:où|quel pays|quels pays).*(?:depuis|vers|avec)\b/i,
      /\b(?:international|transfrontalier|étranger).*(?:commerce|échange|flux|marché)\b/i
    ],
    query_comparison: [
      /\b(?:compare[rz]?|comparaison|versus|contre|différence|différences|distingue[rz]?|entre)\b/i,
      /\b(?:plus|moins|supérieur|inférieur|meilleur|pire) que\b/i,
      /\b(?:lequel|laquelle|lesquels|lesquelles).*(?:meilleur|pire|préféré|alternative)\b/i,
      /\bcomment.*(?:compare[rz]?|diffère[rz]?|rapporte[rz]?).*(?:à|avec|de)\b/i
    ],
    query_trend: [
      /\b(?:tendance|évolution|changement|développement|progrès|croissance|déclin|pattern)\b/i,
      /\b(?:au fil du temps|historique|histoire|passé|futur|prévision|projection|perspective)\b/i,
      /\b(?:augmente|diminue|augmenté|diminué).*(?:depuis|de|entre|pendant)\b/i,
      /\b(?:annuel|mensuel|saisonnier).*(?:variation|fluctuation|pattern)\b/i
    ],
    request_visualization: [
      /\b(?:montre[rz]?|affiche[rz]?|visualise[rz]?|dessine[rz]?|trace[rz]?|graphique).*(?:données|tendance|comparaison|chiffres)\b/i,
      /\b(?:graphique|diagramme|tracé|visualisation).*(?:de|pour|montrant)\b/i,
      /\b(?:peux|pouvez|peut|peuvent).*(?:voir|regarder).*(?:visuellement|graphiquement)\b/i,
      /\b(?:visuel|graphique|graphiquement).*(?:représentation|affichage|format)\b/i
    ]
  },
  de: {
    query_production: [
      /\b(?:wieviel|was|welche[rs]?).*(?:produziert|produktion|erzeugt|erzeugung|gewinnt|gewinnung|ausbeute)\b/i,
      /\b(?:produktion|erzeugung|gewinnung).*(?:daten|statistiken|zahlen)\b/i,
      /\b(?:woher|wie).*(?:kommt|stammt|herkunft)\b/i,
      /\b(?:quelle|herkunft|produziert|erzeugt|gewonnen)\b.*(?:wo|standort|land|region)\b/i
    ],
    query_consumption: [
      /\b(?:wieviel|was|welche[rs]?).*(?:verbraucht|verbrauch|nutzt|nutzung|bedarf|bedürfnis)\b/i,
      /\b(?:verbrauch|nutzung|bedarf).*(?:daten|statistiken|zahlen)\b/i,
      /\b(?:wer|wo|wie).*(?:nutzt|verbraucht)\b/i,
      /\b(?:endnutzung|endverbrauch|verbraucher).*(?:sektor|industrie|haushalt|transport)\b/i
    ],
    query_trade: [
      /\b(?:wieviel|was|welche[rs]?).*(?:importiert|exportiert|handelt|austauscht)\b/i,
      /\b(?:import|export|handel).*(?:daten|statistiken|zahlen)\b/i,
      /\b(?:wo|welches land|welche länder).*(?:von|nach|mit)\b/i,
      /\b(?:international|grenzüberschreitend|ausländisch).*(?:handel|austausch|fluss|markt)\b/i
    ],
    query_comparison: [
      /\b(?:vergleich|versus|gegen|unterschied|unterschiede|unterscheiden|zwischen)\b/i,
      /\b(?:mehr|weniger|höher|niedriger|besser|schlechter) als\b/i,
      /\b(?:welche[rs]?).*(?:besser|schlechter|bevorzugt|alternative)\b/i,
      /\bwie.*(?:vergleicht|unterscheidet|verhält).*(?:zu|mit|von)\b/i
    ],
    query_trend: [
      /\b(?:trend|entwicklung|änderung|fortschritt|wachstum|rückgang|muster)\b/i,
      /\b(?:über zeit|historisch|geschichte|vergangenheit|zukunft|prognose|projektion|ausblick)\b/i,
      /\b(?:steigt|sinkt|gestiegen|gefallen).*(?:seit|von|zwischen|während)\b/i,
      /\b(?:jährlich|monatlich|saisonal).*(?:variation|schwankung|muster)\b/i
    ],
    request_visualization: [
      /\b(?:zeige|anzeigen|visualisieren|zeichnen|darstellen|grafik).*(?:daten|trend|vergleich|zahlen)\b/i,
      /\b(?:grafik|diagramm|plot|visualisierung).*(?:von|für|zeigt)\b/i,
      /\b(?:kann|könnten).*(?:sehen|ansehen).*(?:visuell|grafisch)\b/i,
      /\b(?:visuell|grafisch).*(?:darstellung|anzeige|format)\b/i
    ]
  }
};