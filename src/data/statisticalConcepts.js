/**
 * Comprehensive dictionary of energy-related statistical concepts and terms in multiple languages
 * Used for entity extraction and NLP processing in Eurostat energy statistics context
 */

export const statisticalConceptsDictionary = {
  en: [
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
    
    // Energy infrastructure
    'power plant', 'power station', 'grid', 'electricity grid',
    'transmission', 'distribution', 'pipeline', 'storage', 'energy storage',
    'interconnector', 'refinery', 'terminal', 'lng terminal',
    
    // Energy indicators and metrics
    'energy dependence', 'import dependency', 'self-sufficiency',
    'carbon intensity', 'emission intensity', 'renewable share',
    'energy mix', 'fuel mix', 'capacity factor', 'load factor',
    'conversion efficiency', 'transformation efficiency', 'distribution loss',
    'transmission loss', 'energy return', 'energy payback',
    
    // Energy markets and economics
    'energy price', 'electricity price', 'gas price', 'oil price',
    'spot price', 'futures price', 'tariff', 'subsidy', 'tax', 'energy tax',
    'carbon tax', 'energy market', 'electricity market', 'gas market',
    'oil market', 'energy trading', 'energy exchange',
    
    // Energy policy and regulation
    'energy security', 'energy transition', 'energy policy',
    'decarbonization', 'carbon neutrality', 'net zero', 'climate target',
    'emission target', 'renewable target', 'energy directive',
    'energy regulation', 'cap and trade', 'emission trading', 'carbon market',
    'energy union', 'clean energy package', 'energy strategy'
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
    'marché du carbone', 'union de l\'énergie', 'paquet énergie propre', 'stratégie énergétique'
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
    'energieunion', 'saubere-energie-paket', 'energiestrategie'
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