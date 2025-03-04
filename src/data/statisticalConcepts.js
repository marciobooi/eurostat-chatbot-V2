/**
 * Comprehensive dictionary of energy-related statistical concepts and terms
 */

export const statisticalConceptsDictionary = {
  en: [
    // Geographical notes
    'external territories', 'overseas departments', 'member states', 'national territory',
    'political boundaries', 'customs clearance', 'domestic navigation', 'international navigation',
    'international aviation', 'domestic aviation', 'bonded areas',

    // Transformation sector
    'main activity producer', 'autoproducer', 'electricity only', 'combined heat and power',
    'CHP units', 'heat only', 'patent fuel', 'coke ovens', 'BKB plants', 'PB plants',
    'gas works', 'blast furnace', 'coal liquefaction', 'gas-to-liquid', 'charcoal production',
    'petroleum refineries', 'natural gas blending', 'motor gasoline blending', 'diesel blending',
    'kerosene blending', 'hydrogen blending', 'hydrogen production',

    // Statistical Reporting
    'reported period', 'calendar year', 'reference year', 'reporting frequency',
    'transmission deadline', 'transmission format', 'transmission method',
    'electronic submission', 'single entry point', 'data declaration',
    'interchange standard', 'reported quantities', 'calorific values',

    // Supply Categories
    'underground production', 'surface production', 'receipts from other sources',
    'recovered slurries', 'middlings', 'low-grade coal', 'imports', 'exports',
    'international marine bunkers', 'stock changes', 'country of origin',
    'country of destination',

    // Transformation Sector Categories
    'main activity producer electricity', 'combined heat and power', 'CHP units',
    'heat only plants', 'autoproducer electricity', 'autoproducer heat',
    'patent fuel plants', 'coke ovens', 'BKB plants', 'PB plants',
    'gas works', 'blast furnaces', 'coal liquefaction', 'blended natural gas',
    'hydrogen production', 'transformation sector',

    // Energy Sector Categories
    'electricity plants', 'coal mines', 'patent fuel plants', 'coke ovens',
    'gas works', 'blast furnaces', 'petroleum refineries', 'coal liquefaction',
    'hydrogen production', 'hydrogen liquefaction', 'hydrogen gasification',

    // Final Consumption Categories - Industry
    'iron and steel', 'chemical and petrochemical', 'non-ferrous metals',
    'non-metallic minerals', 'transport equipment', 'machinery',
    'mining and quarrying', 'food and beverages', 'pulp and paper',
    'wood products', 'construction', 'textile and leather',

    // Final Consumption Categories - Transport
    'rail transport', 'domestic navigation', 'transport sector',

    // Final Consumption Categories - Other Sectors
    'commercial services', 'public services', 'households', 'agriculture',
    'forestry', 'fishing', 'other sectors',

    // Measurement Units
    'kt', 'kilo-tonnes', 'TJ GCV', 'tera-joules', 'gross calorific value',
    'MJ/t', 'mega-joules per tonne', 'net calorific value',

    // Coal Products
    'hard coal', 'anthracite', 'coking coal', 'bituminous coal', 'brown coal', 
    'sub-bituminous coal', 'lignite', 'patent fuel', 'coke oven coke', 'gas coke',
    'coal tar', 'BKB', 'brown coal briquettes', 'manufactured gases', 'gas works gas',
    'coke oven gas', 'blast furnace gas', 'other recovered gases', 'peat', 'peat products',
    'oil shale', 'oil sands',

    // Natural Gas
    'natural gas', 'non-associated gas', 'associated gas', 'colliery gas', 'coal seam gas',
    'liquefied natural gas', 'compressed natural gas', 'LNG', 'CNG',

    // Natural Gas Supply Categories
    'indigenous production', 'associated gas', 'non-associated gas', 'colliery gas',
    'offshore production', 'gas venting', 'gas flaring', 'recoverable gas',
    'cushion gas', 'stock level', 'working capacity', 'peak output',
    'gas storage capacity', 'LNG terminal', 'regasifying capacity', 'liquefying capacity',

    // Natural Gas Storage Types
    'depleted gas field', 'aquifer storage', 'salt cavern storage',
    'underground storage', 'LNG storage', 'LNG import terminal',
    'LNG export terminal', 'storage facility',

    // Gas Industry Operations
    'gas processing', 'gas liquefaction', 'gas regasification',
    'pipeline transport', 'gas distribution', 'gas transmission',
    'reference gas conditions', 'gas equivalent',

    // Measurement and Reporting
    'gross calorific value', 'net calorific value', 'energy content',
    'physical quantities', 'reference conditions', 'working inventory',
    'permanent inventory', 'withdrawal capacity', 'delivery rate',
    'output cycle', 'peak rate', 'storage pressure',

    // Supply Chain Components
    'production site', 'processing plant', 'storage site',
    'transmission pipeline', 'distribution network', 'import terminal',
    'export terminal', 'regasification plant', 'liquefaction plant',

    // Electricity and Heat
    'off-grid electricity', 'self-consumed electricity', 'derived heat',
    'heat production', 'autoproducer heat', 'district heating',

    // Oil and Petroleum Products
    'crude oil', 'natural gas liquids', 'NGL', 'refinery feedstocks', 'additives',
    'oxygenates', 'biofuels', 'other hydrocarbons', 'petroleum products', 'refinery gas',
    'ethane', 'liquefied petroleum gases', 'LPG', 'naphtha', 'motor gasoline',
    'aviation gasoline', 'gasoline type jet fuel', 'kerosene type jet fuel', 
    'other kerosene', 'gas/diesel oil', 'fuel oil', 'white spirit', 'lubricants',
    'bitumen', 'paraffin waxes', 'petroleum coke', 'other petroleum products',
    'low sulphur fuel oil', 'high sulphur fuel oil',

    // Renewables
    'pure hydro plants', 'mixed hydro plants', 'pumped storage', 'geothermal',
    'solar photovoltaic', 'solar thermal', 'rooftop solar', 'off-grid solar',
    'tide energy', 'wave energy', 'ocean energy', 'onshore wind', 'offshore wind',
    'industrial waste', 'municipal waste', 'renewable municipal waste',
    'non-renewable municipal waste', 'solid biofuels', 'biogas', 'liquid biofuels',
    'charcoal', 'fuelwood', 'wood pellets', 'black liquor', 'bagasse',
    'animal waste', 'vegetal materials', 'landfill gas', 'sewage sludge gas',
    'thermal biogas', 'biogasoline', 'bioethanol', 'biodiesels', 'bio jet kerosene',
    'ambient heat', 'heat pump',

    // Renewable Electricity Categories
    'pure hydro plants', 'mixed hydro plants', 'pumping hydro',
    'pure pumped storage', 'solar PV < 30 kW', 'solar PV 30-1000 kW',
    'solar PV > 1000 kW', 'rooftop solar', 'off-grid solar',
    'solar thermal', 'tide wave ocean', 'onshore wind',
    'offshore wind', 'renewable municipal waste',
    'non-renewable municipal waste', 'net maximum capacity',

    // Heat Pump Categories
    'aerothermal heat pump', 'geothermal heat pump',
    'hydrothermal heat pump', 'air-air system',
    'air-water system', 'ground-air system',
    'ground-water system', 'water-air system',
    'water-water system', 'reversible system',
    'exhaust air system', 'SPF threshold',

    // Biofuel Categories
    'solid biofuels', 'biogases', 'biodiesels',
    'biogasolines', 'bio jet kerosene', 'other liquid biofuels',
    'wood pellets', 'fuelwood', 'wood residues',
    'black liquor', 'bagasse', 'animal waste',
    'vegetal materials', 'landfill gas', 'sewage sludge gas',
    'thermal biogas', 'anaerobic fermentation',

    // Solar Collector Types
    'glazed collectors', 'unglazed collectors',
    'flat-plate collectors', 'vacuum tube collectors',
    'liquid carrier', 'air carrier',
    'solar surface area', 'collector efficiency',

    // Reporting Requirements
    'main activity producer', 'autoproducer',
    'electricity-only plants', 'CHP units',
    'heat-only plants', 'energy purposes',
    'non-energy purposes', 'passive thermal',
    'energy recovery', 'heat sold',

    // Hydrogen
    'hydrogen feedstock', 'hydrogen fuel', 'hydrogen carrier', 'hydrogen storage',
    'hydrogen extraction', 'hydrogen separation',

    // Energy production and consumption
    'energy production', 'energy consumption', 'final energy consumption',
    'primary energy', 'primary energy consumption', 'gross inland consumption',
    'gross available energy', 'energy intensity', 'energy efficiency',
    'energy saving', 'energy conservation', 'energy balance', 'energy flow',
    'energy supply', 'energy demand', 'energy use', 'energy input', 'energy output',
    
    // Energy sources and types
    'fossil fuel', 'renewable energy', 'nuclear energy', 'hydropower',
    'wind energy', 'solar energy', 'geothermal energy', 'biomass energy',
    'biofuel', 'natural gas', 'crude oil', 'petroleum', 'coal',
    'lignite', 'hard coal', 'electricity', 'heat', 'waste', 'tidal energy',
    'ocean energy', 'hydrogen', 'solar photovoltaic', 'solar thermal',
    'onshore wind', 'offshore wind',

    // Transmission and distribution
    'transmission losses', 'distribution losses', 'technical losses', 'non-technical losses',
    'venting', 'flaring', 'system operator', 'transmission system', 'distribution system',

    // Final consumption sectors
    'final non-energy consumption', 'final energy consumption', 'industry sector',
    'transport sector', 'commercial sector', 'public services', 'household sector',
    'agriculture sector', 'forestry sector', 'fishing sector',

    // Oil Supply Categories
    'indigenous production', 'receipts from other sources', 'backflows',
    'products transferred', 'direct use', 'refinery intake',
    'refinery losses', 'primary product receipts', 'recycled products',
    'refinery fuel', 'interproduct transfers', 'international marine bunkers',
    'gross refinery output', 'observed refinery intake',

    // Petrochemical Sector
    'gross deliveries', 'petrochemical energy use', 'petrochemical non-energy use',
    'petrochemical backflows', 'steam cracking', 'aromatics plants',
    'steam reforming', 'ethylene production', 'propylene production',
    'butylene production', 'synthesis gas', 'aromatics',

    // Refinery Processes
    'atmospheric distillation', 'vacuum distillation', 'thermal cracking',
    'visbreaking', 'coking', 'catalytic cracking', 'fluid catalytic cracking',
    'hydro-cracking', 'reforming', 'desulphurisation', 'alkylation',
    'polymerisation', 'isomerisation', 'etherification',

    // Stock Categories
    'opening stocks', 'closing stocks', 'stock changes',
    'stocks on national territory', 'stocks held abroad',
    'main activity producer stocks', 'stock build', 'stock draw',

    // Processing and Trade
    'processing agreements', 'refining on account', 'bonded areas',
    'country of origin', 'country of consignment', 'ultimate origin',
    'final destination', 'processing country', 're-exports',

    // Usage Categories
    'energy use', 'non-energy use', 'fuel use', 
    'petrochemical feedstock', 'raw materials',
    'transport fuels', 'international aviation', 'domestic aviation',
    'road transport', 'rail transport', 'domestic navigation',
    'pipeline transport',

    // Nuclear Energy
    'enrichment capacity', 'separative work capacity', 'isotopic separation',
    'uranium enrichment', 'fresh fuel elements', 'MOX fuel elements',
    'mixed oxide fuel', 'fuel fabrication', 'nuclear heat production',
    'nuclear reactor', 'fuel burnup', 'discharged fuel', 'irradiated fuel',
    'reprocessing plants', 'uranium production', 'plutonium production',
    'heavy metal', 'nuclear waste', 'fuel rods', 'partial products',
    'definitively discharged', 'temporarily discharged', 'reloaded fuel',

    // Nuclear Measurements
    'separative work units', 'tonnes heavy metal', 'nuclear heat',
    'average burnup', 'reprocessing capacity', 'annual capacity',
    'tSWU', 'tHM', 'tHM/year', 'GWd/tHM',

    // Hydrogen Production
    'indigenous hydrogen', 'hydrogen from gas', 'hydrogen from oil',
    'hydrogen from coal', 'renewable hydrogen', 'waste hydrogen',
    'electrolysis hydrogen', 'direct transmission', 'renewable electricity',
    'nuclear electricity', 'fossil electricity', 'other hydrogen sources',
    'hydrogen imports', 'hydrogen exports', 'hydrogen bunkers', 'hydrogen aviation',

    // Hydrogen Applications
    'hydrogen blending', 'gas blending', 'motor fuel blending',
    'renewable blending', 'hydrogen transformation', 'hydrogen energy sector',
    'hydrogen transport', 'hydrogen industry', 'hydrogen services',
    'hydrogen consumption', 'hydrogen capacity', 'production capacity',

    // Hydrogen Measurements
    'TJ NCV', 'terajoules net calorific value',
    'annual hydrogen capacity', 'hydrogen energy content',
    'hydrogen conversion rate', 'hydrogen efficiency'
  ],
  fr: [
    // Energy production and consumption
    'production d\'énergie', 'consommation d\'énergie', 'consommation finale d\'énergie',
    'énergie primaire', 'consommation d\'énergie primaire', 'consommation intérieure brute',
    'énergie brute disponible', 'intensité énergétique', 'efficacité énergétique',
    'économie d\'énergie', 'conservation d\'énergie', 'bilan énergétique', 'flux énergétique',
    'approvisionnement énergétique', 'demande d\'énergie', 'utilisation d\'énergie', 
    'entrée d\'énergie', 'sortie d\'énergie',
    
    // Energy sources and types
    'combustible fossile', 'énergie renouvelable', 'énergie nucléaire', 'hydroélectricité',
    'énergie éolienne', 'énergie solaire', 'énergie géothermique', 'biomasse',
    'biocarburant', 'gaz naturel', 'pétrole brut', 'pétrole', 'charbon',
    'lignite', 'houille', 'électricité', 'chaleur', 'déchets', 'énergie marémotrice',
    'énergie océanique', 'hydrogène', 'solaire photovoltaïque', 'solaire thermique',
    'éolien terrestre', 'éolien offshore',
    
    // Energy infrastructure
    'centrale électrique', 'centrale', 'réseau', 'réseau électrique',
    'transmission', 'distribution', 'pipeline', 'stockage', 'stockage d\'énergie',
    'interconnexion', 'raffinerie', 'terminal', 'terminal gnl',
    
    // Energy indicators and metrics
    'dépendance énergétique', 'dépendance aux importations', 'autosuffisance',
    'intensité carbone', 'intensité d\'émission', 'part des renouvelables',
    'mix énergétique', 'mix de combustibles', 'facteur de capacité', 'facteur de charge',
    'rendement de conversion', 'rendement de transformation', 'perte de distribution',
    'perte de transmission', 'retour énergétique', 'temps de retour énergétique',
    
    // Energy markets and economics
    'prix de l\'énergie', 'prix de l\'électricité', 'prix du gaz', 'prix du pétrole',
    'prix spot', 'prix à terme', 'tarif', 'subvention', 'taxe', 'taxe énergétique',
    'taxe carbone', 'marché de l\'énergie', 'marché de l\'électricité', 'marché du gaz',
    'marché du pétrole', 'commerce de l\'énergie', 'bourse de l\'énergie',
    
    // Energy policy and regulation
    'sécurité énergétique', 'transition énergétique', 'politique énergétique',
    'décarbonisation', 'neutralité carbone', 'zéro net', 'objectif climatique',
    'objectif d\'émission', 'objectif renouvelable', 'directive énergétique',
    'réglementation énergétique', 'plafonnement et échange', 'échange de quotas d\'émission', 
    'marché du carbone', 'union de l\'énergie', 'paquet énergie propre', 'stratégie énergétique',

    // Statistical Reporting
    'période de référence', 'année calendaire', 'année de référence',
    'fréquence de déclaration', 'délai de transmission', 'format de transmission',
    'méthode de transmission', 'soumission électronique', 'point d\'entrée unique',
    'déclaration de données', 'norme d\'échange', 'quantités déclarées',
    'valeurs calorifiques',

    // Supply and Transformation
    'production souterraine', 'production de surface', 'réceptions d\'autres sources',
    'boues récupérées', 'mixtes', 'charbon de basse qualité', 'importations',
    'exportations', 'soutes maritimes internationales', 'variations de stocks',
    'pays d\'origine', 'pays de destination',

    // Natural Gas Categories in French
    'production nationale', 'gaz associé', 'gaz non associé', 'gaz de mine',
    'production offshore', 'ventilation de gaz', 'brûlage de gaz', 'gaz récupérable',
    'gaz coussin', 'niveau de stock', 'capacité utile', 'débit maximal',
    'capacité de stockage', 'terminal GNL', 'capacité de regazéification',
    'capacité de liquéfaction',

    // Oil Supply Categories in French
    'production nationale', 'réceptions d\'autres sources', 'retours',
    'produits transférés', 'utilisation directe', 'entrées en raffinerie',
    'pertes de raffinage', 'réceptions de produits primaires', 'produits recyclés',
    'combustible de raffinerie', 'transferts interproducts', 'soutes maritimes internationales',
    'production brute de raffinerie', 'entrée observée en raffinerie',

    // Refinery Processes in French
    'distillation atmosphérique', 'distillation sous vide', 'craquage thermique',
    'viscoréduction', 'cokéfaction', 'craquage catalytique', 'craquage catalytique fluide',
    'hydrocraquage', 'reformage', 'désulfuration', 'alkylation',
    'polymérisation', 'isomérisation', 'éthérification',

    // Renewable Electricity Categories in French
    'centrales hydrauliques pures', 'centrales hydrauliques mixtes',
    'centrales de pompage-turbinage', 'stockage par pompage pur',
    'solaire PV < 30 kW', 'solaire PV 30-1000 kW',
    'solaire PV > 1000 kW', 'solaire en toiture', 'solaire hors réseau',
    'solaire thermique', 'énergies marines', 'éolien terrestre',
    'éolien en mer', 'déchets municipaux renouvelables',
    'déchets municipaux non renouvelables', 'puissance maximale nette',

    // Heat Pump Categories in French
    'pompe à chaleur aérothermique', 'pompe à chaleur géothermique',
    'pompe à chaleur hydrothermique', 'système air-air',
    'système air-eau', 'système sol-air',
    'système sol-eau', 'système eau-air',
    'système eau-eau', 'système réversible',
    'système sur air extrait', 'seuil COP',

    // Nuclear Energy in French
    'capacité d\'enrichissement', 'unité de travail de séparation', 'séparation isotopique',
    'enrichissement d\'uranium', 'éléments combustibles neufs', 'éléments MOX',
    'combustible mixte', 'fabrication de combustible', 'production de chaleur nucléaire',
    'réacteur nucléaire', 'taux de combustion', 'combustible déchargé',
    'combustible irradié', 'usines de retraitement', 'production d\'uranium',
    'production de plutonium', 'métal lourd', 'déchets nucléaires',

    // Hydrogen Categories in French
    'hydrogène indigène', 'hydrogène du gaz', 'hydrogène du pétrole',
    'hydrogène du charbon', 'hydrogène renouvelable', 'hydrogène des déchets',
    'hydrogène par électrolyse', 'transmission directe', 'électricité renouvelable',
    'électricité nucléaire', 'électricité fossile', 'autres sources d\'hydrogène'
  ],
  de: [
    // Energy production and consumption
    'energieerzeugung', 'energieverbrauch', 'endenergieverbrauch',
    'primärenergie', 'primärenergieverbrauch', 'bruttoinlandsverbrauch',
    'bruttoverfügbare energie', 'energieintensität', 'energieeffizienz',
    'energieeinsparung', 'energieeinsparung', 'energiebilanz', 'energiefluss',
    'energieversorgung', 'energiebedarf', 'energienutzung', 'energieeintrag', 'energieausgabe',
    
    // Energy sources and types
    'fossiler brennstoff', 'erneuerbare energie', 'kernenergie', 'wasserkraft',
    'windenergie', 'solarenergie', 'geothermische energie', 'biomasseenergie',
    'biokraftstoff', 'erdgas', 'rohöl', 'erdöl', 'kohle',
    'braunkohle', 'steinkohle', 'elektrizität', 'wärme', 'abfall', 'gezeitenenergie',
    'meeresenergie', 'wasserstoff', 'photovoltaik', 'solarthermie',
    'onshore-wind', 'offshore-wind',
    
    // Energy infrastructure
    'kraftwerk', 'kraftwerksanlage', 'netz', 'stromnetz',
    'übertragung', 'verteilung', 'pipeline', 'speicherung', 'energiespeicherung',
    'verbindungsleitung', 'raffinerie', 'terminal', 'lng-terminal',
    
    // Energy indicators and metrics
    'energieabhängigkeit', 'importabhängigkeit', 'selbstversorgung',
    'kohlenstoffintensität', 'emissionsintensität', 'erneuerbarer anteil',
    'energiemix', 'brennstoffmix', 'kapazitätsfaktor', 'lastfaktor',
    'umwandlungswirkungsgrad', 'transformationseffizienz', 'verteilungsverlust',
    'übertragungsverlust', 'energierückgewinnung', 'energieamortisation',
    
    // Energy markets and economics
    'energiepreis', 'strompreis', 'gaspreis', 'ölpreis',
    'spotpreis', 'terminpreis', 'tarif', 'subvention', 'steuer', 'energiesteuer',
    'kohlenstoffsteuer', 'energiemarkt', 'strommarkt', 'gasmarkt',
    'ölmarkt', 'energiehandel', 'energiebörse',
    
    // Energy policy and regulation
    'energiesicherheit', 'energiewende', 'energiepolitik',
    'dekarbonisierung', 'klimaneutralität', 'netto-null', 'klimaziel',
    'emissionsziel', 'erneuerbare-ziel', 'energierichtlinie',
    'energieregulierung', 'cap-and-trade', 'emissionshandel', 'kohlenstoffmarkt',
    'energieunion', 'saubere-energie-paket', 'energiestrategie',

    // Statistical Reporting
    'berichtszeitraum', 'kalenderjahr', 'referenzjahr', 'meldefrequenz',
    'übermittlungsfrist', 'übermittlungsformat', 'übermittlungsmethode',
    'elektronische einreichung', 'zentrale anlaufstelle', 'datenmeldung',
    'austauschstandard', 'gemeldete mengen', 'heizwerte',

    // Supply and Transformation
    'untertageproduktion', 'übertageproduktion', 'bezüge aus anderen quellen',
    'rückgewonnene schlämme', 'mittelgut', 'minderwertiger kohle', 'einfuhren',
    'ausfuhren', 'internationale marine bunker', 'bestandsveränderungen',
    'ursprungsland', 'bestimmungsland',

    // Natural Gas Categories in German
    'inländische produktion', 'assoziiertes gas', 'nicht-assoziiertes gas', 'grubengas',
    'offshore-produktion', 'gasablassung', 'gasfackelung', 'förderbares gas',
    'kissengas', 'lagerbestand', 'arbeitsgasvolumen', 'spitzenleistung',
    'gasspeicherkapazität', 'LNG-terminal', 'regasifizierungskapazität',
    'verflüssigungskapazität',

    // Oil Supply Categories in German
    'inländische produktion', 'bezüge aus anderen quellen', 'rückflüsse',
    'produktübertragungen', 'direkteinsatz', 'raffinerieeinsatz',
    'raffinerieverlusten', 'primärproduktbezüge', 'recycelte produkte',
    'raffineriebrennstoffe', 'produktübertragungen', 'internationale marine bunker',
    'bruttoraffinerieproduktion', 'beobachteter raffinerieeinsatz',

    // Refinery Processes in German
    'atmosphärische destillation', 'vakuumdestillation', 'thermisches cracken',
    'visbreaking', 'verkokung', 'katalytisches cracken', 'fluid katalytisches cracken',
    'hydrocracken', 'reformieren', 'entschwefelung', 'alkylierung',
    'polymerisation', 'isomerisierung', 'veretherung',

    // Renewable Electricity Categories in German
    'reine wasserkraftwerke', 'gemischte wasserkraftwerke',
    'pumpspeicherkraftwerke', 'reines pumpspeicherwerk',
    'photovoltaik < 30 kW', 'photovoltaik 30-1000 kW',
    'photovoltaik > 1000 kW', 'dach-photovoltaik', 'inselphotovoltaik',
    'solarthermie', 'meeresenergie', 'onshore-windkraft',
    'offshore-windkraft', 'erneuerbare siedlungsabfälle',
    'nicht-erneuerbare siedlungsabfälle', 'maximale nettokapazität',

    // Heat Pump Categories in German
    'aerothermische wärmepumpe', 'geothermische wärmepumpe',
    'hydrothermische wärmepumpe', 'luft-luft-system',
    'luft-wasser-system', 'erdreich-luft-system',
    'erdreich-wasser-system', 'wasser-luft-system',
    'wasser-wasser-system', 'reversibles system',
    'abluftsystem', 'JAZ-schwellenwert',

    // Nuclear Energy in German
    'anreicherungskapazität', 'trennarbeit', 'isotopentrennung',
    'urananreicherung', 'frische brennelemente', 'MOX-brennelemente',
    'mischoxidbrennstoff', 'brennstofffertigung', 'kernwärmeerzeugung',
    'kernreaktor', 'abbrand', 'entladener brennstoff',
    'bestrahlter brennstoff', 'wiederaufarbeitungsanlagen', 'uranproduktion',
    'plutoniumproduktion', 'schwermetall', 'nuklearabfälle',

    // Hydrogen Categories in German
    'inländischer wasserstoff', 'wasserstoff aus gas', 'wasserstoff aus öl',
    'wasserstoff aus kohle', 'erneuerbarer wasserstoff', 'wasserstoff aus abfall',
    'elektrolyse-wasserstoff', 'direktübertragung', 'erneuerbare elektrizität',
    'kernenergie', 'fossile elektrizität', 'andere wasserstoffquellen'
  ]
};

/**
 * Gets energy-related statistical concepts and terms in the specified language
 * @param {string} language - Language code (en, fr, de)
 * @returns {string[]} Array of energy-related statistical concepts and terms
 */
export const getStatisticalConcepts = (language = "en") => {
  return statisticalConceptsDictionary[language] || statisticalConceptsDictionary.en;
};

export default {
  statisticalConceptsDictionary,
  getStatisticalConcepts
};