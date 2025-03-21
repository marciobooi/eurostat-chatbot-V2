export const intentPatterns = {
    en: {
      query_production: [
        /\b(produce|production|generate|supply|output|yield)\b/i,
        /\bhow much.*(produce(d|s)?|generate(d|s)?)\b/i,
        /\bgeneration capacity\b/i,
        /\bwhat.*produc(tion|e)\b/i,
        /\benergy.*made\b/i,
        /\b(how|where).*energy.*come(s)? from\b/i
      ],
      query_consumption: [
        /\b(consume|consumption|use|usage|demand|expenditure)\b/i,
        /\bhow much.*(use(d|s)?|consume(d|s)?)\b/i,
        /\benergy needs\b/i,
        /\bwhat.*(consume|use)(s|d)?\b/i,
        /\benergy.*spent\b/i,
        /\bhow.*energy.*required\b/i
      ],
      query_trade: [
        /\b(import|export|trade|trading|ship|transfer)\b/i,
        /\b(buy|sell|purchase|exchange).*energy\b/i,
        /\benergy.*market\b/i,
        /\bhow much.*(import|export)(ed|s)?\b/i,
        /\btrade.*flow(s)?\b/i,
        /\benergy.*across borders\b/i
      ],
      query_comparison: [
        /\b(compare|comparison|versus|vs|difference|contrast)\b/i,
        /\bmore than|less than|greater|smaller\b/i,
        /\bhow.*(compare|stack up)\b/i,
        /\bwhich.*(higher|lower|bigger|smaller)\b/i,
        /\b(different|similar).*from\b/i,
        /\brelative to\b/i
      ],
      query_trend: [
        /\b(trend|evolution|change|growth|decline|shift|pattern)\b/i,
        /\bover time|over the years\b/i,
        /\b(historical|future|forecast|projection|past)\b/i,
        /\bhow.*(changed|evolved|trended)\b/i,
        /\b(going up|going down|rising|falling)\b/i,
        /\btrend.*since\b/i
      ],
      request_visualization: [
        /\b(show|display|graph|chart|visualize|plot|draw)\b/i,
        /\bcan.*see\b.*\b(data|numbers|stats|figures)\b/i,
        /\bvisualization|visual\b/i,
        /\bmake.*chart\b/i,
        /\bpicture.*data\b/i,
        /\bshow.*(trend|comparison)\b.*(chart|graph)\b/i
      ],
      general_info: [
        /\b(what is|define|explain|tell me about|describe)\b/i,
        /\binfo(rmation)?\b.*\babout\b/i,
        /\bmeaning of|what does.*mean\b/i,
        /\bgive me.*overview\b/i,
        /\blearn about\b/i,
        /\b(details|facts).*on\b/i
      ]
    },
    fr: {
      query_production: [
        /\b(produire|production|générer|fournir|approvisionnement|rendement)\b/i,
        /\bcombien.*(produi(t|sent)|génèr(e|ent))\b/i,
        /\bcapacité de production\b/i,
        /\bquoi.*produi(t|re)\b/i,
        /\bénergie.*fabriqué(e)?\b/i,
        /\b(comment|d'où).*énergie.*vient\b/i
      ],
      query_consumption: [
        /\b(consommer|consommation|utiliser|utilisation|demande|dépense)\b/i,
        /\bcombien.*(utilis(é|ent)|consomm(é|ent))\b/i,
        /\bbesoins énergétiques\b/i,
        /\bquoi.*(consomme|utilise)\b/i,
        /\bénergie.*dépensé(e)?\b/i,
        /\bcombien.*énergie.*nécessaire\b/i
      ],
      query_trade: [
        /\b(importer|exporter|commerce|échange|transport|livraison)\b/i,
        /\b(acheter|vendre|acquérir).*énergie\b/i,
        /\bmarché.*énergie\b/i,
        /\bcombien.*(importé|exporté)\b/i,
        /\bflux.*commerciaux\b/i,
        /\bénergie.*(frontières|échanges)\b/i
      ],
      query_comparison: [
        /\b(comparer|comparaison|versus|vs|différence|contraste)\b/i,
        /\bplus que|moins que|supérieur|inférieur\b/i,
        /\bcomment.*(compare|se classe)\b/i,
        /\blequel.*(plus haut|plus bas|plus grand|plus petit)\b/i,
        /\b(différent|semblable).*de\b/i,
        /\bpar rapport à\b/i
      ],
      query_trend: [
        /\b(tendance|évolution|changement|croissance|déclin|mouvement|modèle)\b/i,
        /\bau fil du temps|avec le temps\b/i,
        /\b(historique|futur|prévision|projection|passé)\b/i,
        /\bcomment.*(changé|évolué|tendance)\b/i,
        /\b(augmente|diminue|monte|baisse)\b/i,
        /\btendance.*depuis\b/i
      ],
      request_visualization: [
        /\b(montrer|afficher|graphique|visualiser|tracer|dessiner)\b/i,
        /\bpeut.*voir\b.*\b(données|chiffres|stats)\b/i,
        /\bvisualisation|visuel\b/i,
        /\bfaire.*graphique\b/i,
        /\bimage.*données\b/i,
        /\bmontrer.*(tendance|comparaison)\b.*(graphique|diagramme)\b/i
      ],
      general_info: [
        /\b(qu'est-ce que|définir|expliquer|parle-moi de|décrire)\b/i,
        /\binfo(rmation)?\b.*\bsur\b/i,
        /\bsignification de|que veut dire\b/i,
        /\bdonne-moi.*aperçu\b/i,
        /\bapprendre sur\b/i,
        /\b(détails|faits).*sur\b/i
      ]
    },
    de: {
      query_production: [
        /\b(produzieren|produktion|erzeugen|liefern|versorgung|ausstoß|ertrag)\b/i,
        /\bwie viel.*(produzier(t|en)|erzeug(t|en))\b/i,
        /\bproduktionskapazität\b/i,
        /\bwas.*produzier(t|en)\b/i,
        /\benergie.*hergestellt\b/i,
        /\b(wie|woher).*energie.*kommt\b/i
      ],
      query_consumption: [
        /\b(verbrauchen|verbrauch|nutzen|nutzung|bedarf|aufwand)\b/i,
        /\bwie viel.*(verbrauch(t|en)|nutz(t|en))\b/i,
        /\benergiebedarf\b/i,
        /\bwas.*(verbrauch|nutz)(t|en)\b/i,
        /\benergie.*verwendet\b/i,
        /\bwie viel.*energie.*benötigt\b/i
      ],
      query_trade: [
        /\b(importieren|exportieren|handel|austausch|versand|übertragung)\b/i,
        /\b(kaufen|verkaufen|einkaufen).*energie\b/i,
        /\benergie.*markt\b/i,
        /\bwie viel.*(importier|exportier)(t|en)\b/i,
        /\bhandels.*flüsse\b/i,
        /\benergie.*grenzen\b/i
      ],
      query_comparison: [
        /\b(vergleichen|vergleich|versus|vs|unterschied|kontrast)\b/i,
        /\bmehr als|weniger als|größer|kleiner\b/i,
        /\bwie.*(vergleich|abschneid)\b/i,
        /\bwelche.*(höher|niedriger|größer|kleiner)\b/i,
        /\b(unterschiedlich|ähnlich).*zu\b/i,
        /\bim vergleich zu\b/i
      ],
      query_trend: [
        /\b(trend|entwicklung|veränderung|wachstum|rückgang|verschiebung|muster)\b/i,
        /\bim laufe der zeit|über die jahre\b/i,
        /\b(historisch|zukünftig|prognose|vergangenheit|voraussage)\b/i,
        /\bwie.*(verändert|entwickelt|trend)\b/i,
        /\b(steigt|fällt|ansteigend|abnehmend)\b/i,
        /\btrend.*seit\b/i
      ],
      request_visualization: [
        /\b(zeigen|anzeigen|grafik|diagramm|visualisieren|darstellen)\b/i,
        /\bkann.*sehen\b.*\b(daten|zahlen|statistiken)\b/i,
        /\bvisualisierung|visuell\b/i,
        /\bdiagramm.*erstellen\b/i,
        /\bbild.*daten\b/i,
        /\bzeig.*(trend|vergleich)\b.*(diagramm|grafik)\b/i
      ],
      general_info: [
        /\b(was ist|definieren|erklären|erzähl mir von|beschreiben)\b/i,
        /\binfo(rmation)?\b.*\büber\b/i,
        /\bbedeutung von|was bedeutet\b/i,
        /\bgib mir.*überblick\b/i,
        /\bmehr über.*lernen\b/i,
        /\b(details|fakten).*über\b/i
      ]
    }
  };