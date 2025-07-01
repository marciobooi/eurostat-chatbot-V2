import i18n from '../i18n/index.js';

const abbreviationsData = {
  en: {
    // Energy units and measurements
    'co2': 'carbon dioxide',
    'co': 'carbon monoxide',
    'ghg': 'greenhouse gas',
    'ghgs': 'greenhouse gases',
    'lng': 'liquefied natural gas',
    'lpg': 'liquefied petroleum gas',
    'cng': 'compressed natural gas',
    'ngl': 'natural gas liquids',
    
    // Power and energy units
    'kwh': 'kilowatt hour',
    'mwh': 'megawatt hour',
    'gwh': 'gigawatt hour',
    'twh': 'terawatt hour',
    'kw': 'kilowatt',
    'mw': 'megawatt',
    'gw': 'gigawatt',
    'tw': 'terawatt',
    
    // Energy content units
    'toe': 'tonne oil equivalent',
    'mtoe': 'million tonnes oil equivalent',
    'ktoe': 'thousand tonnes oil equivalent',
    'gtoe': 'giga tonnes oil equivalent',
    'boe': 'barrel oil equivalent',
    'mboe': 'million barrel oil equivalent',
    
    // Other energy units
    'pj': 'petajoule',
    'tj': 'terajoule',
    'gj': 'gigajoule',
    'mj': 'megajoule',
    'kj': 'kilojoule',
    'btu': 'british thermal unit',
    'mbtu': 'million british thermal unit',
    'cal': 'calorie',
    'kcal': 'kilocalorie',
    'mcal': 'megacalorie',
    
    // Technology abbreviations
    'pv': 'photovoltaic',
    'csp': 'concentrated solar power',
    'ccs': 'carbon capture and storage',
    'ccus': 'carbon capture utilization and storage',
    'res': 'renewable energy sources',
    'hvac': 'heating ventilation and air conditioning',
    'led': 'light emitting diode',
    'cfl': 'compact fluorescent lamp',
    'evs': 'electric vehicles',
    'phev': 'plug-in hybrid electric vehicle',
    'bev': 'battery electric vehicle',
    'fcev': 'fuel cell electric vehicle',
    
    // Organizations and standards
    'oecd': 'organisation for economic cooperation and development',
    'eu': 'european union',
    'eea': 'european economic area',
    'iea': 'international energy agency',
    'ipcc': 'intergovernmental panel on climate change',
    'unfccc': 'united nations framework convention on climate change',
    'iso': 'international organization for standardization',
    
    // Economic indicators
    'gdp': 'gross domestic product',
    'gnp': 'gross national product',
    'ppp': 'purchasing power parity',
    'capex': 'capital expenditure',
    'opex': 'operational expenditure',
    'lcoe': 'levelized cost of energy',
    'irr': 'internal rate of return',
    'npv': 'net present value',
    
    // Fuel types and processes
    'msw': 'municipal solid waste',
    'rdf': 'refuse derived fuel',
    'srf': 'solid recovered fuel',
    'hfo': 'heavy fuel oil',
    'lfo': 'light fuel oil',
    'ago': 'automotive gas oil',
    
    // Grid and infrastructure
    'ac': 'alternating current',
    'dc': 'direct current',
    'hvdc': 'high voltage direct current',
    'dso': 'distribution system operator',
    'tso': 'transmission system operator',
    'der': 'distributed energy resources',
    'vpp': 'virtual power plant',
    'ess': 'energy storage system',
    'bess': 'battery energy storage system',
    
    // Environmental and efficiency
    'epc': 'energy performance certificate',
    'eed': 'energy efficiency directive',
    'epbd': 'energy performance of buildings directive',
    'nzeb': 'nearly zero energy building',
    'zeb': 'zero energy building',
    'lca': 'life cycle assessment',
    'lcc': 'life cycle cost',
    
    // Common technical terms
    'ai': 'artificial intelligence',
    'iot': 'internet of things',
    'api': 'application programming interface',
    'ui': 'user interface',
    'ux': 'user experience',
    'it': 'information technology',
    'ict': 'information and communication technology',
    'scada': 'supervisory control and data acquisition',
    'hmi': 'human machine interface'
  },
  
  fr: {
    // Energy units and measurements
    'co2': 'dioxyde de carbone',
    'co': 'monoxyde de carbone',
    'ghg': 'gaz à effet de serre',
    'ghgs': 'gaz à effet de serre',
    'lng': 'gaz naturel liquéfié',
    'lpg': 'gaz de pétrole liquéfié',
    'cng': 'gaz naturel comprimé',
    'ngl': 'liquides de gaz naturel',
    
    // Power and energy units
    'kwh': 'kilowattheure',
    'mwh': 'mégawattheure',
    'gwh': 'gigawattheure',
    'twh': 'térawattheure',
    'kw': 'kilowatt',
    'mw': 'mégawatt',
    'gw': 'gigawatt',
    'tw': 'térawatt',
    
    // Energy content units
    'toe': 'tonne équivalent pétrole',
    'mtoe': 'million de tonnes équivalent pétrole',
    'ktoe': 'mille tonnes équivalent pétrole',
    'gtoe': 'giga tonnes équivalent pétrole',
    'boe': 'baril équivalent pétrole',
    'mboe': 'million de barils équivalent pétrole',
    
    // Other energy units
    'pj': 'pétajoule',
    'tj': 'térajoule',
    'gj': 'gigajoule',
    'mj': 'mégajoule',
    'kj': 'kilojoule',
    'btu': 'unité thermique britannique',
    'mbtu': 'million unités thermiques britanniques',
    'cal': 'calorie',
    'kcal': 'kilocalorie',
    'mcal': 'mégacalorie',
    
    // Technology abbreviations
    'pv': 'photovoltaïque',
    'csp': 'énergie solaire concentrée',
    'ccs': 'captage et stockage du carbone',
    'ccus': 'captage utilisation et stockage du carbone',
    'res': 'sources d\'énergie renouvelables',
    'hvac': 'chauffage ventilation et climatisation',
    'led': 'diode électroluminescente',
    'cfl': 'lampe fluorescente compacte',
    'evs': 'véhicules électriques',
    'phev': 'véhicule électrique hybride rechargeable',
    'bev': 'véhicule électrique à batterie',
    'fcev': 'véhicule électrique à pile à combustible',
    
    // Organizations and standards
    'oecd': 'organisation de coopération et de développement économiques',
    'eu': 'union européenne',
    'eea': 'espace économique européen',
    'iea': 'agence internationale de l\'énergie',
    'ipcc': 'groupe d\'experts intergouvernemental sur l\'évolution du climat',
    'unfccc': 'convention-cadre des nations unies sur les changements climatiques',
    'iso': 'organisation internationale de normalisation',
    
    // Economic indicators
    'gdp': 'produit intérieur brut',
    'gnp': 'produit national brut',
    'ppp': 'parité de pouvoir d\'achat',
    'capex': 'dépenses d\'investissement',
    'opex': 'dépenses opérationnelles',
    'lcoe': 'coût actualisé de l\'énergie',
    'irr': 'taux de rentabilité interne',
    'npv': 'valeur actualisée nette',
    
    // Fuel types and processes
    'msw': 'déchets solides municipaux',
    'rdf': 'combustible dérivé de déchets',
    'srf': 'combustible solide de récupération',
    'hfo': 'fioul lourd',
    'lfo': 'fioul léger',
    'ago': 'gazole automobile',
    
    // Grid and infrastructure
    'ac': 'courant alternatif',
    'dc': 'courant continu',
    'hvdc': 'courant continu haute tension',
    'dso': 'gestionnaire de réseau de distribution',
    'tso': 'gestionnaire de réseau de transport',
    'der': 'ressources énergétiques distribuées',
    'vpp': 'centrale électrique virtuelle',
    'ess': 'système de stockage d\'énergie',
    'bess': 'système de stockage d\'énergie par batterie',
    
    // Environmental and efficiency
    'epc': 'certificat de performance énergétique',
    'eed': 'directive efficacité énergétique',
    'epbd': 'directive performance énergétique des bâtiments',
    'nzeb': 'bâtiment à énergie quasi nulle',
    'zeb': 'bâtiment à énergie zéro',
    'lca': 'analyse du cycle de vie',
    'lcc': 'coût du cycle de vie',
    
    // Common technical terms
    'ai': 'intelligence artificielle',
    'iot': 'internet des objets',
    'api': 'interface de programmation d\'application',
    'ui': 'interface utilisateur',
    'ux': 'expérience utilisateur',
    'it': 'technologie de l\'information',
    'ict': 'technologie de l\'information et de la communication',
    'scada': 'système de contrôle et d\'acquisition de données',
    'hmi': 'interface homme-machine'
  },
  
  de: {
    // Energy units and measurements
    'co2': 'kohlendioxid',
    'co': 'kohlenmonoxid',
    'ghg': 'treibhausgas',
    'ghgs': 'treibhausgase',
    'lng': 'verflüssigtes erdgas',
    'lpg': 'flüssiggas',
    'cng': 'erdgas',
    'ngl': 'erdgasflüssigkeiten',
    
    // Power and energy units
    'kwh': 'kilowattstunde',
    'mwh': 'megawattstunde',
    'gwh': 'gigawattstunde',
    'twh': 'terawattstunde',
    'kw': 'kilowatt',
    'mw': 'megawatt',
    'gw': 'gigawatt',
    'tw': 'terawatt',
    
    // Energy content units
    'toe': 'tonne öläquivalent',
    'mtoe': 'millionen tonnen öläquivalent',
    'ktoe': 'tausend tonnen öläquivalent',
    'gtoe': 'giga tonnen öläquivalent',
    'boe': 'barrel ölä quivalent',
    'mboe': 'millionen barrel ölä quivalent',
    
    // Other energy units
    'pj': 'petajoule',
    'tj': 'terajoule',
    'gj': 'gigajoule',
    'mj': 'megajoule',
    'kj': 'kilojoule',
    'btu': 'britische wärmeeinheit',
    'mbtu': 'millionen britische wärmeeinheiten',
    'cal': 'kalorie',
    'kcal': 'kilokalorie',
    'mcal': 'megakalorie',
    
    // Technology abbreviations
    'pv': 'photovoltaik',
    'csp': 'konzentrierte solarenergie',
    'ccs': 'kohlenstoffabscheidung und -speicherung',
    'ccus': 'kohlenstoffabscheidung nutzung und speicherung',
    'res': 'erneuerbare energiequellen',
    'hvac': 'heizung lüftung und klimatechnik',
    'led': 'lichtemittierende diode',
    'cfl': 'kompaktleuchtstofflampe',
    'evs': 'elektrofahrzeuge',
    'phev': 'plug-in-hybrid-elektrofahrzeug',
    'bev': 'batterieelektrofahrzeug',
    'fcev': 'brennstoffzellen-elektrofahrzeug',
    
    // Organizations and standards
    'oecd': 'organisation für wirtschaftliche zusammenarbeit und entwicklung',
    'eu': 'europäische union',
    'eea': 'europäischer wirtschaftsraum',
    'iea': 'internationale energieagentur',
    'ipcc': 'zwischenstaatlicher ausschuss für klimaänderungen',
    'unfccc': 'rahmenübereinkommen der vereinten nationen über klimaänderungen',
    'iso': 'internationale organisation für normung',
    
    // Economic indicators
    'gdp': 'bruttoinlandsprodukt',
    'gnp': 'bruttosozialprodukt',
    'ppp': 'kaufkraftparität',
    'capex': 'investitionsausgaben',
    'opex': 'betriebsausgaben',
    'lcoe': 'stromgestehungskosten',
    'irr': 'interner zinsfuß',
    'npv': 'kapitalwert',
    
    // Fuel types and processes
    'msw': 'siedlungsabfälle',
    'rdf': 'ersatzbrennstoff',
    'srf': 'fester ersatzbrennstoff',
    'hfo': 'schweres heizöl',
    'lfo': 'leichtes heizöl',
    'ago': 'dieselkraftstoff',
    
    // Grid and infrastructure
    'ac': 'wechselstrom',
    'dc': 'gleichstrom',
    'hvdc': 'hochspannungs-gleichstrom-übertragung',
    'dso': 'verteilnetzbetreiber',
    'tso': 'übertragungsnetzbetreiber',
    'der': 'dezentrale energieressourcen',
    'vpp': 'virtuelles kraftwerk',
    'ess': 'energiespeichersystem',
    'bess': 'batteriespeichersystem',
    
    // Environmental and efficiency
    'epc': 'energieausweis',
    'eed': 'energieeffizienzrichtlinie',
    'epbd': 'richtlinie über die gesamtenergieeffizienz von gebäuden',
    'nzeb': 'niedrigstenergiegebäude',
    'zeb': 'nullenergiegebäude',
    'lca': 'lebenszyklusanalyse',
    'lcc': 'lebenszykluskosten',
    
    // Common technical terms
    'ai': 'künstliche intelligenz',
    'iot': 'internet der dinge',
    'api': 'anwendungsprogrammierschnittstelle',
    'ui': 'benutzeroberfläche',
    'ux': 'benutzererfahrung',
    'it': 'informationstechnologie',
    'ict': 'informations- und kommunikationstechnologie',
    'scada': 'prozessleitsystem',
    'hmi': 'mensch-maschine-schnittstelle'
  }
};

// Function to get abbreviations for current language
export const getAbbreviations = () => {
  const currentLanguage = i18n.language || 'en';
  return abbreviationsData[currentLanguage] || abbreviationsData.en;
};

// Legacy export for backward compatibility
export const abbreviations = getAbbreviations();
