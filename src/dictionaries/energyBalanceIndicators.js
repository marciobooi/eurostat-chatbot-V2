export const energyBalanceIndicators = {
  IMP: {
    patterns: [
      // English patterns
      'import', 'imports', 'importing', 'imported',
      'inbound', 'incoming', 'receive', 'receives', 'received', 'receiving',
      'bring in', 'bringing in', 'brought in', 'brings in',
      'purchase from abroad', 'purchased from abroad', 'purchases from abroad',
      'buy from abroad', 'buying from abroad', 'bought from abroad',
      'inward', 'inwards', 'foreign purchase', 'foreign purchases',
      'international purchase', 'international purchases',
      // French patterns
      'importer', 'importation', 'importations', 'importé', 'importés', 'importée', 'importées',
      'entrée', 'entrées', 'reçu', 'reçus', 'reçue', 'reçues',
      'achat international', 'achats internationaux',
      'acquisition internationale', 'acquisitions internationales',
      // German patterns
      'import', 'importe', 'importieren', 'importiert', 'importierte',
      'einfuhr', 'einfuhren', 'einführen', 'eingeführt',
      'bezug', 'bezüge', 'beziehen', 'bezogen',
      'auslandsankauf', 'auslandskauf', 'auslandsbezug'
    ],
    intent: 'query_trade'
  },
  EXP: {
    patterns: [
      // English patterns
      'export', 'exports', 'exporting', 'exported',
      'outbound', 'outgoing', 'send', 'sends', 'sent', 'sending',
      'ship', 'ships', 'shipped', 'shipping',
      'sell abroad', 'selling abroad', 'sold abroad', 'sells abroad',
      'outward', 'outwards', 'foreign sale', 'foreign sales',
      'international sale', 'international sales',
      // French patterns
      'exporter', 'exportation', 'exportations', 'exporté', 'exportés', 'exportée', 'exportées',
      'sortie', 'sorties', 'envoyé', 'envoyés', 'envoyée', 'envoyées',
      'vente internationale', 'ventes internationales',
      'expédition internationale', 'expéditions internationales',
      // German patterns
      'export', 'exporte', 'exportieren', 'exportiert', 'exportierte',
      'ausfuhr', 'ausfuhren', 'ausführen', 'ausgeführt',
      'lieferung', 'lieferungen', 'liefern', 'geliefert',
      'auslandsverkauf', 'auslandslieferung'
    ],
    intent: 'query_trade'
  },
  STK_CHG: {
    patterns: [
      // English patterns
      'stock', 'stocks', 'stock change', 'stock changes',
      'inventory', 'inventories', 'inventory change', 'inventory changes',
      'reserves', 'reserve', 'reserve change', 'reserve changes',
      'storage', 'storages', 'storage change', 'storage changes',
      'stockpile', 'stockpiles', 'stockpiling', 'stockpiled',
      'supply level', 'supply levels', 'stored amount', 'stored amounts',
      // French patterns
      'stock', 'stocks', 'variation de stock', 'variations de stocks',
      'inventaire', 'inventaires', 'variation d\'inventaire', 'variations d\'inventaires',
      'réserve', 'réserves', 'variation de réserve', 'variations de réserves',
      'stockage', 'stockages', 'niveau de stockage', 'niveaux de stockage',
      // German patterns
      'bestand', 'bestände', 'bestandsänderung', 'bestandsänderungen',
      'vorrat', 'vorräte', 'vorratsänderung', 'vorratsänderungen',
      'lager', 'lagerbestand', 'lagerbestände',
      'speicher', 'speicherung', 'speicherstand', 'speicherstände'
    ],
    intent: 'query_production'
  },
  GAE: {
    patterns: [
      // English patterns
      'gross available energy', 'available energy', 'energy availability',
      'available', 'gross availability', 'total available',
      'energy supply', 'gross energy supply', 'total energy supply',
      'energy available', 'total energy available', 'gross energy available',
      'supply availability', 'available supply', 'gross supply',
      // French patterns
      'énergie disponible brute', 'énergie disponible', 'disponibilité énergétique',
      'disponible', 'disponibilité brute', 'total disponible',
      'approvisionnement énergétique', 'approvisionnement total',
      'énergie totale disponible', 'offre énergétique totale',
      // German patterns
      'brutto verfügbare energie', 'verfügbare energie', 'energieverfügbarkeit',
      'verfügbar', 'bruttoverfügbarkeit', 'gesamtverfügbarkeit',
      'energieversorgung', 'bruttoenergie', 'gesamtenergie',
      'energieangebot', 'gesamtangebot', 'bruttoangebot'
    ],
    intent: 'query_production'
  },
  GIC: {
    patterns: [
      // English patterns
      'gross inland consumption', 'inland consumption', 'domestic consumption',
      'internal consumption', 'gross domestic consumption', 'gross internal consumption',
      'national consumption', 'gross national consumption', 'territorial consumption',
      'domestic usage', 'internal usage', 'inland usage',
      'domestic use', 'internal use', 'inland use',
      // French patterns
      'consommation intérieure brute', 'consommation intérieure',
      'consommation nationale brute', 'consommation nationale',
      'consommation domestique', 'consommation territoriale',
      'usage intérieur', 'utilisation intérieure',
      'usage national', 'utilisation nationale',
      // German patterns
      'bruttoinlandsverbrauch', 'inlandsverbrauch', 'inländischer verbrauch',
      'nationaler verbrauch', 'bruttokonsum', 'inlandskonsum',
      'inländische nutzung', 'nationale nutzung',
      'binnenverbrauch', 'inlandsbedarf', 'inländischer bedarf'
    ],
    intent: 'query_consumption'
  },
  FC: {
    patterns: [
      // English patterns
      'final consumption', 'end use', 'end-use consumption',
      'final energy consumption', 'final usage', 'end usage',
      'ultimate consumption', 'ultimate use', 'final use',
      'end consumer usage', 'final consumer usage', 'end-user consumption',
      'consumer consumption', 'consumer usage', 'end-point consumption',
      // French patterns
      'consommation finale', 'utilisation finale',
      'consommation finale d\'énergie', 'usage final',
      'consommation ultime', 'utilisation ultime',
      'consommation du consommateur', 'usage du consommateur',
      'consommation finale d\'utilisateur', 'usage final d\'énergie',
      // German patterns
      'endverbrauch', 'endnutzung', 'endenergieverbrauch',
      'letztverbrauch', 'endgültiger verbrauch', 'finalverbrauch',
      'verbraucherendnutzung', 'endkundenverbrauch',
      'endverwendung', 'letztnutzung', 'endkonsum'
    ],
    intent: 'query_consumption'
  },
  TI: {
    patterns: [
      // English patterns
      'transformation input', 'input for transformation', 'energy transformation input',
      'conversion input', 'input for conversion', 'transformation intake',
      'processing input', 'input for processing', 'transformation feed',
      // French patterns
      'entrée de transformation', 'entrée pour transformation',
      'apport de transformation', 'apport pour transformation',
      'entrée de conversion', 'entrée pour conversion',
      // German patterns
      'umwandlungseinsatz', 'transformationseinsatz', 'umwandlungseingang',
      'verarbeitungseinsatz', 'umwandlungsinput', 'transformationsinput'
    ],
    intent: 'query_production'
  },
  TO: {
    patterns: [
      // English patterns
      'transformation output', 'output from transformation', 'energy transformation output',
      'conversion output', 'output from conversion', 'transformation yield',
      'processing output', 'output from processing', 'transformation product',
      // French patterns
      'sortie de transformation', 'sortie après transformation',
      'production de transformation', 'résultat de transformation',
      'sortie de conversion', 'sortie après conversion',
      // German patterns
      'umwandlungsausstoß', 'transformationsausstoß', 'umwandlungsausgang',
      'verarbeitungsausstoß', 'umwandlungsoutput', 'transformationsoutput'
    ],
    intent: 'query_production'
  },
  NRG_E: {
    patterns: [
      // English patterns
      'energy sector use', 'energy industry use', 'energy sector consumption',
      'energy industry consumption', 'sector energy use', 'industry energy use',
      'energy branch consumption', 'energy branch use',
      // French patterns
      'consommation du secteur énergie', 'utilisation du secteur énergie',
      'consommation de l\'industrie énergétique', 'utilisation de l\'industrie énergétique',
      'consommation de la branche énergie', 'utilisation de la branche énergie',
      // German patterns
      'energiebereichsverbrauch', 'energiesektorverbrauch',
      'energieindustrieverbrauch', 'eigenverbrauch energiesektor',
      'energiezweigverbrauch', 'energiebranchenverbrauch'
    ],
    intent: 'query_consumption'
  }
};