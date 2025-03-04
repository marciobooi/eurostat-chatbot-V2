/**
 * Comprehensive dictionary of energy units and related terms 
 */

export const energyUnitsDictionary = {
  en: [
    // Common energy units
    'kilowatt', 'kw', 'kilowatt hour', 'kwh', 'megawatt', 'mw',
    'megawatt hour', 'mwh', 'gigawatt', 'gw', 'gigawatt hour', 'gwh',
    'terawatt', 'tw', 'terawatt hour', 'twh', 'petajoule', 'pj',
    'toe', 'tonne of oil equivalent', 'ktoe', 'mtoe',
    'btu', 'british thermal unit', 'therms', 'barrel of oil equivalent', 'boe',
    
    // Coal and Gas Measurements
    'kilojoule per kilogram', 'kJ/kg', 'gross calorific value', 'net calorific value',
    'volatile matter', 'fixed carbon', 'ash content', 'moisture content',
    'gas pressure', 'kPa', 'vapor pressure', 'distillation range',
    'celsius', '°C', 'kinematic viscosity', 'cSt',
    'density', 'kg/l', 'sulphur content', 'aromatic content',
    'octane number', 'cetane number', 'flash point',
    
    // Liquid Fuel Properties
    'viscosity at 80°C', 'freezing point', 'melting point',
    'distillation temperature', 'flash point above 50°C',
    'density above 0.90 kg/l', 'sulphur content 0.5%',
    
    // Solid Fuel Properties
    'dry mineral matter', 'ash-free but moist basis',
    'carbonisation temperature', 'agglomeration properties',
    
    // Process Parameters
    'conversion rate', 'recovery rate', 'production yield',
    'plant capacity', 'storage capacity', 'processing capacity',
    
    // Additional transformation and efficiency units
    'capacity factor', 'load factor', 'thermal efficiency', 'conversion efficiency',
    'energy intensity', 'specific consumption', 'heat rate', 'power-to-heat ratio',
    'net calorific value', 'gross calorific value', 'primary energy equivalent',
    
    // Consumption and production metrics
    'utilization rate', 'availability factor', 'self-consumption rate',
    'production efficiency', 'transmission loss rate', 'distribution loss rate',
    'plant efficiency', 'net generation', 'gross generation',
    
    // Statistical and reporting units
    'annual average', 'monthly total', 'quarterly aggregate',
    'seasonal adjustment', 'working-day adjustment', 'base year',
    'reference period', 'reporting period', 'statistical period',
    
    // General energy-related terms
    'joule', 'kilojoule', 'megajoule', 'gigajoule',
    'calorie', 'kilocalorie', 'therm', 'quad',
    'watt', 'kilowatt-peak', 'kWp', 'volt', 'ampere',
    'renewable energy', 'fossil fuel', 'carbon intensity',
    'primary energy', 'final energy consumption',
    'energy efficiency', 'energy intensity',

    // Statistical Reporting Units
    'kt', 'kilo-tonnes', 'TJ', 'tera-joules',
    'TJ GCV', 'tera-joules gross calorific value',
    'MJ/t', 'mega-joules per tonne',
    'GCV', 'gross calorific value',
    'NCV', 'net calorific value',
    'cSt', 'centistokes', 'kinematic viscosity',
    'kg/l', 'kilograms per litre', 'density',

    // Temperature and Pressure
    '°C', 'celsius', 'temperature',
    'kPa', 'kilopascal', 'pressure',
    'bar', 'atmospheric pressure',
    'mmHg', 'millimeters of mercury',

    // Volume and Flow
    'm³', 'cubic meters',
    'bcm', 'billion cubic meters',
    'mcm', 'million cubic meters',
    'm³/day', 'cubic meters per day',
    'l/s', 'liters per second',

    // Energy Content
    'toe', 'tonne of oil equivalent',
    'ktoe', 'kilo-tonne of oil equivalent',
    'mtoe', 'million tonnes of oil equivalent',
    'boe', 'barrel of oil equivalent',
    'MWh', 'megawatt hours',
    'GWh', 'gigawatt hours',
    'TWh', 'terawatt hours',
    'kcal', 'kilocalories',
    
    // Composition and Quality
    'ppm', 'parts per million',
    'mg/kg', 'milligrams per kilogram',
    'vol%', 'volume percentage',
    'wt%', 'weight percentage',
    'ash%', 'ash percentage',
    'sulphur%', 'sulphur content percentage',
    'moisture%', 'moisture content percentage',

    // Reporting Periods
    'calendar year', 'reporting year',
    'reference year', 'annual basis',
    'monthly period', 'quarterly period',
    'heating season', 'cooling season',
    'peak period', 'off-peak period',

    // Natural Gas Measurement Units
    'TJ GCV', 'terajoules gross calorific value',
    '10⁶ m³', 'million cubic meters',
    'kJ/m³', 'kilojoules per cubic meter',
    '10⁶ m³/day', 'million cubic meters per day',
    'Pa', 'pascal', '101325 Pa', 'standard pressure',
    '15°C', 'reference temperature',
    'GCV', 'gross calorific value',
    'NCV', 'net calorific value',

    // Gas Storage and Capacity
    'working capacity', 'cushion gas volume',
    'peak withdrawal rate', 'injection rate',
    'storage pressure', 'working gas volume',
    'regasification rate', 'liquefaction rate',
    'send-out capacity', 'storage inventory',

    // Reference Conditions
    'standard temperature and pressure', 'STP',
    'normal temperature and pressure', 'NTP',
    'reference gas conditions', '15°C, 101325 Pa',
    'ambient conditions', 'operating conditions',

    // Flow and Volume Measurements
    'volumetric flow rate', 'mass flow rate',
    'standard cubic meter', 'normal cubic meter',
    'actual cubic meter', 'reference cubic meter',
    'daily capacity', 'annual throughput',

    // Oil and Petroleum Measurement
    'kt', 'kilo-tonnes',
    'MJ/t', 'mega-joules per tonne',
    'thousand metric tons/year', 'kt/year',
    'thousand tons', 'refining capacity',
    'kinematic viscosity', 'cSt at 80°C',
    'density', 'kg/l above 0.90',
    'flash point', '°C above 50',
    'sulphur content', 'wt% below 0.5',
    'aromatics content', 'volume %',
    'octane number', 'octane rating',
    'cetane number', 'cetane rating',
    'viscosity range', 'distillation range',
    
    // Refinery Process Parameters
    'atmospheric distillation', 'vacuum distillation',
    'thermal cracking', 'catalytic cracking',
    'fluid catalytic cracking', 'hydrocracking',
    'reforming capacity', 'desulphurisation capacity',
    'alkylation capacity', 'polymerisation capacity',
    'isomerisation capacity', 'etherification capacity',
    
    // Stock and Storage Units
    'opening stock level', 'closing stock level',
    'stock change', 'stock build',
    'stock draw', 'working inventory',
    'permanent inventory', 'bonded storage',
    'national territory stocks', 'stocks abroad',

    // Heat Pump Measurements
    'aerothermal heat pump', 'air-air heat pump',
    'air-water heat pump', 'reversible air-air',
    'reversible air-water', 'exhaust air-air',
    'exhaust air-water', 'ground-air heat pump',
    'ground-water heat pump', 'water-air heat pump',
    'water-water heat pump', 'SPF threshold',
    'thermal capacity', 'heating output',
    'heat extraction rate', 'coefficient of performance',
    'seasonal performance factor', 'thermal output',

    // Solar Thermal Measurements
    'solar collector surface', '1000 m²',
    'glazed collectors', 'unglazed collectors',
    'flat-plate collectors', 'vacuum tube collectors',
    'liquid carrier', 'air carrier',
    'collector efficiency', 'thermal conversion',

    // Renewable Energy Units
    'GWh', 'gigawatt hours', 'electrical output',
    'TJ', 'terajoules', 'heat output',
    'MW', 'megawatts', 'electrical capacity',
    'TJ NCV', 'net calorific value',
    'capacity factor', 'peak capacity',
    'installed capacity', 'working capacity',

    // Renewable Energy Specific Units
    'GWh', 'gigawatt hours', 'electrical generation',
    'TJ', 'terajoules', 'heat output',
    'kt/year', 'thousand tonnes per year', 'production capacity',
    'TJ NCV', 'net calorific value base', 'energy content',
    '1000 m²', 'thousand square meters', 'collector surface',
    'SPF', 'seasonal performance factor', 'heat pump efficiency',
    'kW thermal', 'kilowatt thermal', 'heating capacity',
    'kW electric', 'kilowatt electric', 'generation capacity',

    // Capacity Size Categories
    '< 30 kW', 'small scale installation',
    '30-1000 kW', 'medium scale installation',
    '> 1000 kW', 'large scale installation',
    'rooftop capacity', 'off-grid capacity',

    // Biomass and Waste Units
    'renewable fraction', 'non-renewable fraction',
    'dry matter content', 'moisture content',
    'ash content', 'volatile matter',
    'fermentation rate', 'methane yield',
    'biogas composition', 'heating value',

    // Nuclear Energy Units
    'tSWU', 'tonnes of separative work units', 'enrichment capacity',
    'tHM', 'tonnes of heavy metal', 'fuel content',
    'tHM/year', 'tonnes heavy metal per year', 'annual capacity',
    'GWd/tHM', 'gigawatt-days per tonne heavy metal', 'burnup rate',
    'isotopic concentration', 'enrichment level', 'uranium-235',
    'MOX ratio', 'plutonium content', 'fissile material',
    'separative work', 'enrichment factor', 'depletion level',

    // Nuclear Heat and Power
    'TJ nuclear', 'terajoules nuclear heat',
    'MWth', 'megawatts thermal',
    'thermal capacity', 'reactor output',
    'thermal efficiency', 'conversion ratio',
    'capacity factor', 'availability factor',
    'burnup level', 'discharge burnup',

    // Nuclear Fuel and Material
    'fuel element', 'fuel assembly',
    'fuel rod', 'control rod',
    'uranium oxide', 'mixed oxide',
    'heavy metal', 'fissile content',
    'enriched uranium', 'depleted uranium',
    'reprocessed material', 'nuclear waste',

    // Hydrogen Units and Measures
    'TJ NCV/year', 'terajoules net calorific value per year',
    'hydrogen purity', 'volumetric content',
    'blending ratio', 'injection rate',
    'electrolysis capacity', 'production rate',
    'storage pressure', 'compression level',
    'liquefaction capacity', 'regasification rate'
  ],
  fr: [
    // Common energy units (technical units same in French)
    'kilowatt', 'kw', 'kilowattheure', 'kwh', 'mégawatt', 'mw',
    'mégawattheure', 'mwh', 'gigawatt', 'gw', 'gigawattheure', 'gwh',
    'térawatt', 'tw', 'térawattheure', 'twh', 'pétajoule', 'pj',
    'tep', 'tonne d\'équivalent pétrole', 'ktep', 'mtep',
    'btu', 'unité thermique britannique', 'thermies', 'baril équivalent pétrole', 'bep',
    
    // Additional technical measurements in French
    'pouvoir calorifique', 'matière volatile', 'teneur en carbone',
    'teneur en cendres', 'teneur en humidité', 'pression de gaz',
    'pression de vapeur', 'plage de distillation', 'viscosité cinématique',
    'densité', 'teneur en soufre', 'teneur en aromatiques',
    'indice d\'octane', 'indice de cétane', 'point d\'éclair',
    'point de fusion', 'température de distillation',
    'taux de conversion', 'taux de récupération', 'rendement de production',

    // Additional energy-related terms in French
    'joule', 'kilojoule', 'mégajoule', 'gigajoule',
    'calorie', 'kilocalorie', 'thermie', 'quad',
    'watt', 'kilowatt-crête', 'kWc', 'volt', 'ampère',
    'énergie renouvelable', 'combustible fossile', 'intensité carbone',
    'énergie primaire', 'consommation finale d\'énergie',
    'efficacité énergétique', 'intensité énergétique',

    // Transformation and efficiency terms in French
    'facteur de capacité', 'facteur de charge', 'rendement thermique',
    'rendement de conversion', 'intensité énergétique', 'consommation spécifique',
    'taux de chaleur', 'rapport électricité-chaleur', 'pouvoir calorifique net',
    'pouvoir calorifique brut', 'équivalent énergie primaire',

    // Statistical Reporting Units
    'kt', 'kilo-tonnes', 'TJ', 'téra-joules',
    'TJ PCS', 'téra-joules pouvoir calorifique supérieur',
    'MJ/t', 'méga-joules par tonne',
    'PCS', 'pouvoir calorifique supérieur',
    'PCI', 'pouvoir calorifique inférieur',
    'cSt', 'centistokes', 'viscosité cinématique',
    'kg/l', 'kilogrammes par litre', 'densité',

    // Reporting Periods
    'année calendaire', 'année de référence',
    'base annuelle', 'période mensuelle',
    'période trimestrielle', 'saison de chauffage',
    'saison de refroidissement', 'période de pointe',
    'période creuse',

    // Natural Gas Measurement Units in French
    'TJ PCS', 'térajoules pouvoir calorifique supérieur',
    '10⁶ m³', 'million de mètres cubes',
    'kJ/m³', 'kilojoules par mètre cube',
    '10⁶ m³/jour', 'million de mètres cubes par jour',
    'Pa', 'pascal', '101325 Pa', 'pression standard',
    '15°C', 'température de référence',
    'PCS', 'pouvoir calorifique supérieur',
    'PCI', 'pouvoir calorifique inférieur',

    // Gas Storage and Capacity in French
    'capacité utile', 'volume de gaz coussin',
    'débit de soutirage maximal', 'débit d\'injection',
    'pression de stockage', 'volume de gaz utile',
    'débit de regazéification', 'débit de liquéfaction',
    'capacité d\'émission', 'stock en réservoir',

    // Oil Measurement in French
    'kt', 'kilo-tonnes',
    'MJ/t', 'méga-joules par tonne',
    'milliers de tonnes métriques/an', 'kt/an',
    'milliers de tonnes', 'capacité de raffinage',
    'viscosité cinématique', 'cSt à 80°C',
    'densité', 'kg/l supérieur à 0,90',
    'point d\'éclair', '°C supérieur à 50',
    'teneur en soufre', '% masse inférieur à 0,5',
    'teneur en aromatiques', '% volume',

    // Heat Pump Measurements in French
    'pompe à chaleur aérothermique', 'pompe air-air',
    'pompe air-eau', 'air-air réversible',
    'air-eau réversible', 'air extrait-air',
    'air extrait-eau', 'pompe géothermique air',
    'pompe géothermique eau', 'pompe hydrothermique air',
    'pompe hydrothermique eau', 'seuil COP',
    'capacité thermique', 'puissance calorifique',
    'taux d\'extraction de chaleur', 'coefficient de performance',
    'facteur de performance saisonnier', 'puissance thermique',

    // Renewable Energy Units in French
    'GWh', 'gigawattheures', 'production électrique',
    'TJ', 'térajoules', 'production de chaleur',
    'kt/an', 'milliers de tonnes par an', 'capacité de production',
    'TJ PCI', 'pouvoir calorifique inférieur', 'contenu énergétique',
    '1000 m²', 'milliers de mètres carrés', 'surface de capteurs',
    'COP', 'coefficient de performance', 'efficacité pompe à chaleur',

    // Nuclear Energy Units in French
    'tSWU', 'tonnes d\'unités de travail de séparation', 'capacité d\'enrichissement',
    'tHM', 'tonnes de métal lourd', 'contenu combustible',
    'tHM/an', 'tonnes de métal lourd par an', 'capacité annuelle',
    'GWj/tHM', 'gigawatts-jours par tonne de métal lourd', 'taux de combustion',
    'concentration isotopique', 'niveau d\'enrichissement', 'uranium-235',
    'rapport MOX', 'teneur en plutonium', 'matière fissile'
  ],
  de: [
    // Common energy units (technical units same in German)
    'kilowatt', 'kw', 'kilowattstunde', 'kwh', 'megawatt', 'mw',
    'megawattstunde', 'mwh', 'gigawatt', 'gw', 'gigawattstunde', 'gwh',
    'terawatt', 'tw', 'terawattstunde', 'twh', 'petajoule', 'pj',
    'toe', 'tonne öleinheit', 'ktoe', 'mtoe',
    'btu', 'british thermal unit', 'therm', 'barrel öläquivalent', 'boe',
    
    // Additional technical measurements in German
    'heizwert', 'flüchtige bestandteile', 'kohlenstoffgehalt',
    'aschegehalt', 'feuchtigkeitsgehalt', 'gasdruck',
    'dampfdruck', 'destillationsbereich', 'kinematische viskosität',
    'dichte', 'schwefelgehalt', 'aromatengehalt',
    'oktanzahl', 'cetanzahl', 'flammpunkt',
    'schmelzpunkt', 'destillationstemperatur',
    'umwandlungsrate', 'rückgewinnungsrate', 'produktionsausbeute',

    // Additional energy-related terms in German
    'joule', 'kilojoule', 'megajoule', 'gigajoule',
    'kalorie', 'kilokalorie', 'therm', 'quad',
    'watt', 'kilowatt-peak', 'kWp', 'volt', 'ampere',
    'erneuerbare energie', 'fossiler brennstoff', 'kohlenstoffintensität',
    'primärenergie', 'endenergieverbrauch',
    'energieeffizienz', 'energieintensität',

    // Transformation and efficiency terms in German
    'kapazitätsfaktor', 'lastfaktor', 'thermischer wirkungsgrad',
    'umwandlungseffizienz', 'energieintensität', 'spezifischer verbrauch',
    'wärmerate', 'strom-wärme-verhältnis', 'heizwert netto',
    'heizwert brutto', 'primärenergieäquivalent',

    // Statistical Reporting Units
    'kt', 'kilo-tonnen', 'TJ', 'tera-joule',
    'TJ Ho', 'tera-joule oberer heizwert',
    'MJ/t', 'mega-joule pro tonne',
    'Ho', 'oberer heizwert',
    'Hu', 'unterer heizwert',
    'cSt', 'centistokes', 'kinematische viskosität',
    'kg/l', 'kilogramm pro liter', 'dichte',

    // Reporting Periods
    'kalenderjahr', 'berichtsjahr',
    'referenzjahr', 'jährliche basis',
    'monatsperiode', 'quartalsperiode',
    'heizperiode', 'kühlperiode',
    'spitzenzeit', 'nebenzeit',

    // Natural Gas Measurement Units in German
    'TJ Ho', 'terajoule oberer heizwert',
    '10⁶ m³', 'millionen kubikmeter',
    'kJ/m³', 'kilojoule pro kubikmeter',
    '10⁶ m³/tag', 'millionen kubikmeter pro tag',
    'Pa', 'pascal', '101325 Pa', 'standarddruck',
    '15°C', 'referenztemperatur',
    'Ho', 'oberer heizwert',
    'Hu', 'unterer heizwert',

    // Gas Storage and Capacity in German
    'arbeitsgasvolumen', 'kissengasvolumen',
    'maximale entnahmerate', 'einspeiserate',
    'speicherdruck', 'arbeitsgasmenge',
    'regasifizierungsrate', 'verflüssigungsrate',
    'ausspeicherleistung', 'speicherbestand',

    // Oil Measurement in German
    'kt', 'kilo-tonnen',
    'MJ/t', 'mega-joule pro tonne',
    'tausend metrische tonnen/jahr', 'kt/jahr',
    'tausend tonnen', 'raffineriekapazität',
    'kinematische viskosität', 'cSt bei 80°C',
    'dichte', 'kg/l über 0,90',
    'flammpunkt', '°C über 50',
    'schwefelgehalt', 'gew.% unter 0,5',
    'aromatengehalt', 'volumen %',

    // Heat Pump Measurements in German
    'aerothermische wärmepumpe', 'luft-luft-wärmepumpe',
    'luft-wasser-wärmepumpe', 'reversible luft-luft',
    'reversible luft-wasser', 'abluft-luft',
    'abluft-wasser', 'erdreich-luft-wärmepumpe',
    'erdreich-wasser-wärmepumpe', 'wasser-luft-wärmepumpe',
    'wasser-wasser-wärmepumpe', 'JAZ-schwelle',
    'thermische leistung', 'heizleistung',
    'wärmeentnahmeleistung', 'leistungszahl',
    'jahresarbeitszahl', 'thermische ausgangsleistung',

    // Renewable Energy Units in German
    'GWh', 'gigawattstunden', 'stromerzeugung',
    'TJ', 'terajoule', 'wärmeproduktion',
    'kt/jahr', 'tausend tonnen pro jahr', 'produktionskapazität',
    'TJ Hu', 'heizwert basis', 'energiegehalt',
    '1000 m²', 'tausend quadratmeter', 'kollektorfläche',
    'JAZ', 'jahresarbeitszahl', 'wärmepumpeneffizienz',

    // Nuclear Energy Units in German
    'tSWU', 'Tonnen Trennarbeit', 'Anreicherungskapazitaet',
    'tHM', 'Tonnen Schwermetall', 'Brennstoffgehalt',
    'tHM/Jahr', 'Tonnen Schwermetall pro Jahr', 'Jahreskapazitaet',
    'GWd/tHM', 'Gigawatt-Tage pro Tonne Schwermetall', 'Abbrandrate',
    'Isotopenkonzentration', 'Anreicherungsgrad', 'Uran-235',
    'MOX-Verhaeltnis', 'Plutoniumgehalt', 'Spaltmaterial'
  ]
};

/**
 * Gets energy units and related terms in the specified language
 * @param {string} language - Language code (en, fr, de)
 * @returns {string[]} Array of energy units and terms
 */
export const getEnergyUnits = (language = "en") => {
  return energyUnitsDictionary[language] || energyUnitsDictionary.en;
};

export default {
  energyUnitsDictionary,
  getEnergyUnits
};