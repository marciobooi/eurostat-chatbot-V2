export const intentPatterns = {
  en: {
    query_production: [
      /\b(produce|production|generate|supply|output|yield|manufacture|extraction)\b/i,
      /\bhow much.*(produce(d|s)?|generate(d|s)?|extract(ed|s)?)\b/i,
      /\bgeneration capacity|installed capacity|power output\b/i,
      /\bwhat.*produc(tion|e|ing)\b/i,
      /\benergy.*(made|created|produced|generated)\b/i,
      /\b(how|where).*energy.*come(s)? from\b/i,
      /\bprimary energy production\b/i,
      /\brenewable energy (production|generation)\b/i,
      /\b(fossil fuel|nuclear|hydro|solar|wind|biomass|geothermal).*output\b/i,
      /\benergy.*by source\b/i
    ],
    query_consumption: [
      /\b(consume|consumption|use|usage|demand|expenditure|utilization)\b/i,
      /\bhow much.*(use(d|s)?|consume(d|s)?|require(d|s)?)\b/i,
      /\benergy needs|energy demand\b/i,
      /\bwhat.*(consume|use|require)(s|d)?\b/i,
      /\benergy.*(spent|used|consumed|required)\b/i,
      /\bhow.*energy.*(needed|required|utilized)\b/i,
      /\bfinal energy consumption\b/i,
      /\bsectoral consumption|by sector|residential|industrial|transport\b/i,
      /\bnon-energy consumption\b/i
    ],
    query_trade: [
      /\b(import|export|trade|trading|ship|transfer|exchange|cross-border)\b/i,
      /\b(buy|sell|purchase|exchange).*energy\b/i,
      /\benergy.*market\b/i,
      /\bhow much.*(import|export)(ed|s)?\b/i,
      /\btrade.*flow(s)?\b/i,
      /\benergy.*across borders|cross-border flows\b/i,
      /\bnet imports?|net exports?\b/i,
      /\benergy.*balance of trade\b/i,
      /\bimport dependency|self-sufficiency\b/i
    ],
    query_comparison: [
      /\b(compare|comparison|versus|vs|difference|contrast|relative)\b/i,
      /\b(more than|less than|greater|smaller|higher|lower|biggest|smallest)\b/i,
      /\bhow.*(compare|stack up)\b/i,
      /\bwhich.*(higher|lower|bigger|smaller|greater|lesser)\b/i,
      /\b(different|similar).*from\b/i,
      /\brelative to|compared to|in comparison with\b/i,
      /\benergy mix comparison\b/i
    ],
    query_trend: [
      /\b(trend|evolution|change|growth|decline|shift|pattern|trajectory|variation)\b/i,
      /\bover time|over the years|year-on-year|historical\b/i,
      /\b(historical|future|forecast|projection|past|outlook)\b/i,
      /\bhow.*(changed|evolved|trended|varied)\b/i,
      /\b(going up|going down|rising|falling|decreasing|increasing)\b/i,
      /\btrend.*since\b/i,
      /\blong-term|short-term|seasonal changes?\b/i
    ],
    request_visualization: [
      /\b(show|display|graph|chart|visualize|plot|draw)\b/i,
      /\bcan.*see.*\b(data|numbers|stats|figures)\b/i,
      /\bvisualization|visual|diagram|infographic\b/i,
      /\bmake.*chart|create.*graph\b/i,
      /\bpicture.*data|data visualization\b/i,
      /\bshow.*(trend|comparison|pattern).*chart\b/i,
      /\binteractive (chart|graph)\b/i
    ],
    general_info: [
      /\b(what is|define|explain|tell me about|describe|overview)\b/i,
      /\binfo(rmation)?\b.*\babout\b/i,
      /\bmeaning of|what does.*mean\b/i,
      /\bgive me.*overview|summary\b/i,
      /\blearn about|background information\b/i,
      /\b(details|facts|data).*on\b/i,
      /\benergy policy|regulation|standards\b/i
    ],
    query_energy_balance: [
      /\b(energy balance|balance sheet|net balance|stock level|opening stock|closing stock)\b/i,
      /\b(stock changes?|level of stocks?|inventory levels?)\b/i,
      /\b(international|maritime|aviation) bunkers?\b/i,
      /\b(statistical differences?|discrepancies?)\b/i,
      /\b(gross inland|domestic) consumption\b/i,
      /\b(final energy|non-energy) consumption\b/i,
      /\btransformation (input|output)\b/i,
      /\b(distribution|transmission|energy) losses\b/i,
      /\bavailable for final consumption\b/i,
      /\benergy sector\b/i,
      /\bhow (much|many) (stocks?|reserves?)\b/i,
      /\bwhat.*stock levels?\b/i,
      /\b(opening|closing) (balance|inventory)\b/i,
      /\bnet energy (balance|flow)\b/i,
      /\benergy (flows?|transfers?|stocks?)\b/i,
      /\benergy dependency rate\b/i
    ]
  },
  
  fr: {
    query_production: [
      /\b(produire|production|générer|fournir|rendement|fabriquer|extraction)\b/i,
      /\bcombien.*(produi(s|t|re)?|génère(e|s)?|extrait(e|s)?)\b/i,
      /\bcapacité de production|capacité installée|puissance produite\b/i,
      /\bquelle.*product(ion|ionne|ionne-t-elle)\b/i,
      /\bénergie.*(produite|créée|générée|fabriquée)\b/i,
      /\b(comment|où).*provient.*l'?énergie\b/i,
      /\bproduction d'énergie primaire\b/i,
      /\b(production|génération) d'énergie renouvelable\b/i,
      /\b(combustible fossile|nucléaire|hydraulique|solaire|éolien|biomasse|géothermique).*produit\b/i,
      /\bénergie.*par source\b/i
    ],
    query_consumption: [
      /\b(consommer|consommation|utiliser|usage|demande|dépense|utilisation)\b/i,
      /\bcombien.*(utili(s|sé|sent)?|consomme(e|s)?)\b/i,
      /\b(besoins|demande) en énergie\b/i,
      /\bquelle.*(consomme|utilise|nécessite)\b/i,
      /\bénergie.*(dépensée|utilisée|consommée|requise)\b/i,
      /\bcombien.*énergie.*(nécessaire|requise|utilisée)\b/i,
      /\bconsommation finale d'énergie\b/i,
      /\bconsommation sectorielle|par secteur|résidentiel|industriel|transport\b/i,
      /\bconsommation non énergétique\b/i
    ],
    query_trade: [
      /\b(importer|exporter|commerce|échanges|livraison|transfert|échange transfrontalier)\b/i,
      /\b(acheter|vendre|acquérir|échanger).*énergie\b/i,
      /\bmarché.*énergie\b/i,
      /\bcombien.*(importé|exporté|échange(é|s)?)\b/i,
      /\bflux.*(commercial|d'échanges)\b/i,
      /\bénergie.*(transfrontalière|across borders)\b/i,
      /\bimportations nettes?|exportations nettes?\b/i,
      /\bbalance commerciale d'énergie\b/i,
      /\b(dépendance aux importations|autosuffisance énergétique)\b/i
    ],
    query_comparison: [
      /\b(comparer|comparaison|contre|vs|différence|contraste|relatif)\b/i,
      /\b(plus que|moins que|supérieur|inférieur|plus grand|plus petit|le plus grand|le plus petit)\b/i,
      /\bcomment.*(se compare|se mesure)\b/i,
      /\b(lequel|laquelle).*est (plus|moins|plus grand|plus petit)\b/i,
      /\b(différent|similaire).*de\b/i,
      /\bpar rapport à|comparé à|en comparaison avec\b/i,
      /\bcomparaison du mix énergétique\b/i
    ],
    query_trend: [
      /\b(tendance|évolution|changement|croissance|déclin|modification|variation)\b/i,
      /\bau fil du temps|au cours des années|d'une année sur l'autre|historique\b/i,
      /\b(historique|futur|prévisions?|projection|passé|perspectives?)\b/i,
      /\bcomment.*(a changé|a évolué|a varié|a suivi la tendance)\b/i,
      /\b(augmentation|diminution|hausse|baisse|montée|chute)\b/i,
      /\btendance depuis\b/i,
      /\b(long terme|court terme|variations saisonnières?)\b/i
    ],
    request_visualization: [
      /\b(afficher|montrer|graphique|diagramme|visualiser|tracer|dessiner)\b/i,
      /\b(puis-je|je peux).*voir.*\b(données|chiffres|statistiques|nombres)\b/i,
      /\bvisualisation|visuel|schéma|infographie\b/i,
      /\b(créer|générer).*graphique\b/i,
      /\bimage.*données|visualisation des données\b/i,
      /\bmontrer.*(tendance|comparaison|modèle).*graphique\b/i,
      /\b(graphique|diagramme) interactif\b/i
    ],
    general_info: [
      /\b(quoi|qu'est-ce que|définir|expliquer|informer|décrire|présentation)\b/i,
      /\binformations?.*\bsur\b/i,
      /\bsignification de|que signifie\b/i,
      /\bdonnez-moi.*aperçu|résumé\b/i,
      /\b(se renseigner sur|informations de base)\b/i,
      /\b(détails|faits|données).*concernant\b/i,
      /\b(politique énergétique|réglementation|normes)\b/i
    ],
    query_energy_balance: [
      /\b(bilan énergétique|bilan comptable|bilan net|niveau de stock|stock initial|stock final)\b/i,
      /\b(variations de stock|niveaux d'inventaire?)\b/i,
      /\b(carburants internationaux|bunkers maritimes|bunkers aériens?)\b/i,
      /\b(différences statistiques?|écarts?)\b/i,
      /\b(consommation (intérieure brute|domestique))\b/i,
      /\b(consommation finale d'énergie|consommation non énergétique)\b/i,
      /\b(entrée|sortie) de transformation\b/i,
      /\b(pertes.*(distribution|transmission|énergie))\b/i,
      /\bdisponible pour la consommation finale\b/i,
      /\bsecteur énergétique\b/i,
      /\bcombien.*(stocks?|réserves?)\b/i,
      /\bquels.*niveaux de stock\b/i,
      /\b(stock initial|stock final|bilan d'ouverture|bilan de clôture)\b/i,
      /\bflux.*énergétique\b/i,
      /\btaux de dépendance énergétique\b/i
    ]
  },
  
  de: {
    query_production: [
      /\b(erzeugen|produktion|herstellen|bereitstellen|ausbeute|förderung|gewinnung)\b/i,
      /\bwieviel.*(erzeugt|produziert|gefördert|gewonnen)\b/i,
      /\berzeugungskapazität|installierte kapazität|stromerzeugung\b/i,
      /\bwas.*(erzeugung|produktion)\b/i,
      /\benergie.*(erzeugt|hergestellt|produziert|gewonnen)\b/i,
      /\b(wie|wo).*kommt.*energie.*her\b/i,
      /\bprimärenergieproduktion\b/i,
      /\berneuerbare energie (erzeugung|produktion)\b/i,
      /\b(fossile brennstoffe|kernenergie|wasserkraft|solar|wind|biomasse|geothermie).*produktion\b/i,
      /\benergie.*nach quelle\b/i
    ],
    query_consumption: [
      /\b(verbrauchen|verbrauch|nutzen|nutzung|bedarf|aufwand|verwendung)\b/i,
      /\bwieviel.*(verbraucht|benötigt|genutzt|verwendet)\b/i,
      /\benergiebedarf|energieanforderung\b/i,
      /\bwas.*(verbraucht|nutzt|benötigt)\b/i,
      /\benergie.*(verbraucht|genutzt|benötigt|aufgewendet)\b/i,
      /\bwieviel.*energie.*(notwendig|benötigt|verwendet)\b/i,
      /\bendenergieverbrauch\b/i,
      /\bverbrauch nach sektor|sektoraler verbrauch|haushalte|industrie|verkehr\b/i,
      /\bnicht-energetischer verbrauch\b/i
    ],
    query_trade: [
      /\b(importieren|exportieren|handel|traden|verschiffen|übertragen|austausch|grenzüberschreitend)\b/i,
      /\b(kaufen|verkaufen|erwerben|austauschen).*energie\b/i,
      /\benergiemarkt\b/i,
      /\bwieviel.*(importiert|exportiert)\b/i,
      /\bhandelsströme?\b/i,
      /\benergie.*über grenzen|grenzüberschreitende ströme\b/i,
      /\bnettoimporte?|nettoexporte?\b/i,
      /\benergie.*handelsbilanz\b/i,
      /\bimportabhängigkeit|energieautarkie\b/i
    ],
    query_comparison: [
      /\b(vergleichen|vergleich|gegenüber|vs|unterschied|kontrast|relativ)\b/i,
      /\b(mehr als|weniger als|größer|kleiner|höher|niedriger|am größten|am kleinsten)\b/i,
      /\bwie.*(vergleicht|abschneidet)\b/i,
      /\bwelche.*(höher|niedriger|größer|kleiner)\b/i,
      /\b(anders|ähnlich).*als\b/i,
      /\bim vergleich zu|verglichen mit|im verhältnis zu\b/i,
      /\bvergleich des energiemixes\b/i
    ],
    query_trend: [
      /\b(trend|entwicklung|veränderung|wachstum|rückgang|verschiebung|muster|verlauf|variation)\b/i,
      /\bim laufe der zeit|über die jahre|jahr für jahr|historisch\b/i,
      /\b(historisch|zukunft|prognose|projektion|vergangenheit|ausblick)\b/i,
      /\bwie.*(verändert|entwickelt|geändert|geschwankt)\b/i,
      /\b(steigt|fällt|wächst|sinkt|zunahme|abnahme)\b/i,
      /\btrend seit\b/i,
      /\b(langfristig|kurzfristig|saisonale änderungen?)\b/i
    ],
    request_visualization: [
      /\b(zeigen|anzeigen|grafik|diagramm|visualisieren|plotten|zeichnen)\b/i,
      /\bkann.*ich.*(daten|zahlen|statistiken|werte) sehen\b/i,
      /\bvisualisierung|visuell|diagramm|infografik\b/i,
      /\berstelle.*(diagramm|grafik)\b/i,
      /\bbild.*daten|datenvisualisierung\b/i,
      /\bzeige.*(trend|vergleich|muster).*in einem diagramm\b/i,
      /\b(interaktives diagramm|grafik)\b/i
    ],
    general_info: [
      /\b(was ist|definiere|erkläre|erzähle mir von|beschreibe|überblick)\b/i,
      /\binformation(en)?.*über\b/i,
      /\bbedeutung von|was bedeutet\b/i,
      /\bgib mir.*überblick|zusammenfassung\b/i,
      /\berfahre mehr über|hintergrundinformationen\b/i,
      /\b(details|fakten|daten).*zu\b/i,
      /\benergiepolitik|vorschriften|standards\b/i
    ],
    query_energy_balance: [
      /\b(energie bilanz|bilanzen|nettobilanz|lagerbestand|anfangsbestand|schlussbestand)\b/i,
      /\b(lagerveränderungen?|bestandshöhen?)\b/i,
      /\b(internationale|maritime|luftfahrt) bunker\b/i,
      /\b(statistische differenzen?|abweichungen?)\b/i,
      /\b(bruttoinlandsverbrauch|inländischer verbrauch)\b/i,
      /\b(endenergieverbrauch|nicht-energetischer verbrauch)\b/i,
      /\b(umwandlungsverluste|umwandlungseingang|umwandlungsausgang)\b/i,
      /\b(verluste bei (verteilung|übertragung|energie))\b/i,
      /\bverfügbar für den endverbrauch\b/i,
      /\benergiesektor\b/i,
      /\bwieviel.*(vorräte?|reserven?)\b/i,
      /\bwelche.*(lagerbestände?)\b/i,
      /\b(anfangsbestand|schlussbestand)\b/i,
      /\bnettobilanz|energieflüsse\b/i,
      /\benergieabhängigkeitsrate\b/i
    ]
  }
  
  };