/**
 * Multilingual synonyms for energy-related terms
 * Supports English, French, and German
 */

import i18n from '../i18n/index.js';

const synonymsData = {
  en: {
    // Energy source synonyms
    'petroleum': 'oil',
    'crude': 'oil',
    'crude oil': 'oil',
    'petrol': 'oil',
    'gasoline': 'oil',
    'diesel': 'oil',
    'fuel oil': 'oil',
    
    'electricity': 'electric energy',
    'electric': 'electric energy',
    'electrical': 'electric energy',
    'power': 'energy',
    'electrical power': 'electric energy',
    'electric power': 'electric energy',
    
    'fuel': 'energy source',
    'fuels': 'energy sources',
    'energy carrier': 'energy source',
    'energy carriers': 'energy sources',
    
    'gas': 'natural gas',
    'methane': 'natural gas',
    'natural gas': 'natural gas',
    
    // Renewable energy synonyms
    'wind': 'wind energy',
    'wind power': 'wind energy',
    'windmill': 'wind energy',
    'wind turbine': 'wind energy',
    'wind farm': 'wind energy',
    
    'solar': 'solar energy',
    'solar power': 'solar energy',
    'photovoltaic': 'solar energy',
    'pv': 'solar energy',
    'solar panel': 'solar energy',
    'solar cell': 'solar energy',
    
    'hydro': 'hydroelectric',
    'hydroelectric': 'hydroelectric',
    'hydropower': 'hydroelectric',
    'water power': 'hydroelectric',
    'dam': 'hydroelectric',
    
    'nuclear': 'nuclear energy',
    'atomic': 'nuclear energy',
    'nuclear power': 'nuclear energy',
    'uranium': 'nuclear energy',
    'plutonium': 'nuclear energy',
    
    'biomass': 'bioenergy',
    'biofuel': 'bioenergy',
    'biofuels': 'bioenergy',
    'biogas': 'bioenergy',
    'biodiesel': 'bioenergy',
    'ethanol': 'bioenergy',
    'wood': 'bioenergy',
    'charcoal': 'bioenergy',
    'pellets': 'bioenergy',
    'organic waste': 'bioenergy',
    
    'geothermal': 'geothermal energy',
    'geothermal power': 'geothermal energy',
    'earth heat': 'geothermal energy',
    'ground source': 'geothermal energy',
    
    'waste': 'waste energy',
    'municipal waste': 'waste energy',
    'garbage': 'waste energy',
    'refuse': 'waste energy',
    'landfill gas': 'waste energy',
    
    // Fossil fuel synonyms
    'coal': 'solid fuels',
    'anthracite': 'solid fuels',
    'bituminous': 'solid fuels',
    'lignite': 'solid fuels',
    'brown coal': 'solid fuels',
    'hard coal': 'solid fuels',
    'coke': 'solid fuels',
    
    // Energy processes
    'generation': 'production',
    'generate': 'produce',
    'producing': 'production',
    'manufactured': 'production',
    'manufacturing': 'production',
    
    'consumption': 'use',
    'consume': 'use',
    'using': 'use',
    'usage': 'use',
    'demand': 'use',
    'requirement': 'use',
    
    'transformation': 'conversion',
    'convert': 'conversion',
    'converting': 'conversion',
    'transform': 'conversion',
    'transforming': 'conversion',
    'processing': 'conversion',
    'refining': 'conversion',
    
    'transmission': 'transport',
    'transport': 'transport',
    'transportation': 'transport',
    'distribution': 'transport',
    'delivery': 'transport',
    'supply': 'transport',
    
    // Environmental terms
    'emissions': 'pollution',
    'emission': 'pollution',
    'pollutants': 'pollution',
    'pollutant': 'pollution',
    'carbon footprint': 'pollution',
    'greenhouse gases': 'pollution',
    
    'efficiency': 'performance',
    'efficient': 'performance',
    'optimization': 'performance',
    'optimize': 'performance',
    'improvement': 'performance',
    'saving': 'performance',
    'savings': 'performance',
    
    // Technology terms
    'renewable': 'sustainable',
    'clean': 'sustainable',
    'green': 'sustainable',
    'alternative': 'sustainable',
    'eco-friendly': 'sustainable',
    'carbon-free': 'sustainable',
    'zero-emission': 'sustainable',
    
    'conventional': 'traditional',
    'fossil': 'traditional',
    'non-renewable': 'traditional',
    'carbon-based': 'traditional',
    
    // Economic terms
    'cost': 'price',
    'expense': 'price',
    'expenditure': 'price',
    'investment': 'price',
    'budget': 'price',
    'tariff': 'price',
    'rate': 'price',
    
    'market': 'trade',
    'trading': 'trade',
    'commerce': 'trade',
    'business': 'trade',
    'industry': 'trade',
    'sector': 'trade',
    
    // Infrastructure terms
    'grid': 'network',
    'infrastructure': 'network',
    'system': 'network',
    'facility': 'network',
    'plant': 'network',
    'station': 'network',
    'terminal': 'network',
    
    'storage': 'reserve',
    'reservoir': 'reserve',
    'stockpile': 'reserve',
    'inventory': 'reserve',
    'buffer': 'reserve'
  },
  
  fr: {
    // Sources d'énergie synonymes
    'pétrole': 'pétrole',
    'brut': 'pétrole',
    'pétrole brut': 'pétrole',
    'essence': 'pétrole',
    'gazole': 'pétrole',
    'diesel': 'pétrole',
    'fuel': 'pétrole',
    'fioul': 'pétrole',
    
    'électricité': 'énergie électrique',
    'électrique': 'énergie électrique',
    'puissance': 'énergie',
    'courant': 'énergie électrique',
    
    'carburant': 'source d\'énergie',
    'carburants': 'sources d\'énergie',
    'combustible': 'source d\'énergie',
    'combustibles': 'sources d\'énergie',
    
    'gaz': 'gaz naturel',
    'méthane': 'gaz naturel',
    'gaz naturel': 'gaz naturel',
    
    // Énergies renouvelables
    'vent': 'énergie éolienne',
    'éolien': 'énergie éolienne',
    'éolienne': 'énergie éolienne',
    'moulin à vent': 'énergie éolienne',
    'parc éolien': 'énergie éolienne',
    
    'solaire': 'énergie solaire',
    'photovoltaïque': 'énergie solaire',
    'panneau solaire': 'énergie solaire',
    'cellule solaire': 'énergie solaire',
    
    'hydro': 'hydroélectrique',
    'hydroélectrique': 'hydroélectrique',
    'barrage': 'hydroélectrique',
    'hydraulique': 'hydroélectrique',
    
    'nucléaire': 'énergie nucléaire',
    'atomique': 'énergie nucléaire',
    'uranium': 'énergie nucléaire',
    'plutonium': 'énergie nucléaire',
    
    'biomasse': 'bioénergie',
    'biocarburant': 'bioénergie',
    'biogaz': 'bioénergie',
    'biodiesel': 'bioénergie',
    'éthanol': 'bioénergie',
    'bois': 'bioénergie',
    'charbon de bois': 'bioénergie',
    'granulés': 'bioénergie',
    'déchets organiques': 'bioénergie',
    
    'géothermique': 'énergie géothermique',
    'géothermie': 'énergie géothermique',
    'chaleur terrestre': 'énergie géothermique',
    
    'déchets': 'énergie des déchets',
    'déchets municipaux': 'énergie des déchets',
    'ordures': 'énergie des déchets',
    
    // Combustibles fossiles
    'charbon': 'combustibles solides',
    'anthracite': 'combustibles solides',
    'lignite': 'combustibles solides',
    'houille': 'combustibles solides',
    'coke': 'combustibles solides',
    
    // Processus énergétiques
    'génération': 'production',
    'générer': 'produire',
    'fabrication': 'production',
    
    'consommation': 'utilisation',
    'consommer': 'utiliser',
    'usage': 'utilisation',
    'demande': 'utilisation',
    'besoin': 'utilisation',
    
    'transformation': 'conversion',
    'convertir': 'conversion',
    'traitement': 'conversion',
    'raffinage': 'conversion',
    
    'transmission': 'transport',
    'distribution': 'transport',
    'livraison': 'transport',
    'approvisionnement': 'transport',
    
    // Termes environnementaux
    'émissions': 'pollution',
    'émission': 'pollution',
    'polluants': 'pollution',
    'polluant': 'pollution',
    'empreinte carbone': 'pollution',
    'gaz à effet de serre': 'pollution',
    
    'efficacité': 'performance',
    'efficace': 'performance',
    'optimisation': 'performance',
    'optimiser': 'performance',
    'amélioration': 'performance',
    'économie': 'performance',
    'économies': 'performance',
    
    // Termes technologiques
    'renouvelable': 'durable',
    'propre': 'durable',
    'vert': 'durable',
    'alternatif': 'durable',
    'écologique': 'durable',
    'sans carbone': 'durable',
    'zéro émission': 'durable',
    
    'conventionnel': 'traditionnel',
    'fossile': 'traditionnel',
    'non renouvelable': 'traditionnel',
    
    // Termes économiques
    'coût': 'prix',
    'dépense': 'prix',
    'investissement': 'prix',
    'budget': 'prix',
    'tarif': 'prix',
    'taux': 'prix',
    
    'marché': 'commerce',
    'négoce': 'commerce',
    'industrie': 'commerce',
    'secteur': 'commerce',
    
    // Termes d'infrastructure
    'réseau': 'réseau',
    'infrastructure': 'réseau',
    'système': 'réseau',
    'installation': 'réseau',
    'centrale': 'réseau',
    'station': 'réseau',
    
    'stockage': 'réserve',
    'réservoir': 'réserve',
    'stock': 'réserve',
    'inventaire': 'réserve'
  },
  
  de: {
    // Energiequellen Synonyme
    'erdöl': 'öl',
    'rohöl': 'öl',
    'benzin': 'öl',
    'diesel': 'öl',
    'heizöl': 'öl',
    'kraftstoff': 'öl',
    
    'elektrizität': 'elektrische energie',
    'elektrisch': 'elektrische energie',
    'strom': 'elektrische energie',
    'kraft': 'energie',
    'leistung': 'energie',
    
    'brennstoff': 'energiequelle',
    'brennstoffe': 'energiequellen',
    'energieträger': 'energiequelle',
    
    'gas': 'erdgas',
    'methan': 'erdgas',
    'erdgas': 'erdgas',
    
    // Erneuerbare Energien
    'wind': 'windenergie',
    'windkraft': 'windenergie',
    'windmühle': 'windenergie',
    'windturbine': 'windenergie',
    'windpark': 'windenergie',
    
    'solar': 'solarenergie',
    'sonne': 'solarenergie',
    'sonnenenergie': 'solarenergie',
    'photovoltaik': 'solarenergie',
    'solarpanel': 'solarenergie',
    'solarzelle': 'solarenergie',
    
    'wasser': 'wasserkraft',
    'wasserkraft': 'wasserkraft',
    'hydroelektrisch': 'wasserkraft',
    'damm': 'wasserkraft',
    'staudamm': 'wasserkraft',
    
    'nuklear': 'kernenergie',
    'atom': 'kernenergie',
    'kernenergie': 'kernenergie',
    'atomkraft': 'kernenergie',
    'uran': 'kernenergie',
    'plutonium': 'kernenergie',
    
    'biomasse': 'bioenergie',
    'biokraftstoff': 'bioenergie',
    'biogas': 'bioenergie',
    'biodiesel': 'bioenergie',
    'ethanol': 'bioenergie',
    'holz': 'bioenergie',
    'holzkohle': 'bioenergie',
    'pellets': 'bioenergie',
    'organischer abfall': 'bioenergie',
    
    'geothermisch': 'geothermische energie',
    'geothermie': 'geothermische energie',
    'erdwärme': 'geothermische energie',
    
    'abfall': 'abfallenergie',
    'müll': 'abfallenergie',
    'hausmüll': 'abfallenergie',
    
    // Fossile Brennstoffe
    'kohle': 'feste brennstoffe',
    'anthrazit': 'feste brennstoffe',
    'braunkohle': 'feste brennstoffe',
    'steinkohle': 'feste brennstoffe',
    'koks': 'feste brennstoffe',
    
    // Energieprozesse
    'erzeugung': 'produktion',
    'erzeugen': 'produzieren',
    'herstellung': 'produktion',
    
    'verbrauch': 'nutzung',
    'verbrauchen': 'nutzen',
    'verwendung': 'nutzung',
    'bedarf': 'nutzung',
    'nachfrage': 'nutzung',
    
    'umwandlung': 'konversion',
    'konvertieren': 'konversion',
    'verarbeitung': 'konversion',
    'raffination': 'konversion',
    
    'übertragung': 'transport',
    'verteilung': 'transport',
    'lieferung': 'transport',
    'versorgung': 'transport',
    
    // Umweltbegriffe
    'emissionen': 'verschmutzung',
    'emission': 'verschmutzung',
    'schadstoffe': 'verschmutzung',
    'schadstoff': 'verschmutzung',
    'kohlenstoff-fußabdruck': 'verschmutzung',
    'treibhausgase': 'verschmutzung',
    
    'effizienz': 'leistung',
    'effizient': 'leistung',
    'optimierung': 'leistung',
    'optimieren': 'leistung',
    'verbesserung': 'leistung',
    'einsparung': 'leistung',
    'einsparungen': 'leistung',
    
    // Technologiebegriffe
    'erneuerbar': 'nachhaltig',
    'sauber': 'nachhaltig',
    'grün': 'nachhaltig',
    'alternativ': 'nachhaltig',
    'umweltfreundlich': 'nachhaltig',
    'kohlenstofffrei': 'nachhaltig',
    'emissionsfrei': 'nachhaltig',
    
    'konventionell': 'traditionell',
    'fossil': 'traditionell',
    'nicht erneuerbar': 'traditionell',
    
    // Wirtschaftsbegriffe
    'kosten': 'preis',
    'ausgaben': 'preis',
    'investition': 'preis',
    'budget': 'preis',
    'tarif': 'preis',
    'rate': 'preis',
    
    'markt': 'handel',
    'handeln': 'handel',
    'geschäft': 'handel',
    'industrie': 'handel',
    'sektor': 'handel',
    
    // Infrastrukturbegriffe
    'netz': 'netzwerk',
    'infrastruktur': 'netzwerk',
    'system': 'netzwerk',
    'anlage': 'netzwerk',
    'kraftwerk': 'netzwerk',
    'station': 'netzwerk',
    
    'speicherung': 'reserve',
    'reservoir': 'reserve',
    'lager': 'reserve',
    'inventar': 'reserve',
    'vorrat': 'reserve'
  }
};

// Function to get synonyms for current language
export const getSynonyms = () => {
  const currentLanguage = i18n.language || 'en';
  return synonymsData[currentLanguage] || synonymsData.en;
};

// Legacy export for backward compatibility
export const synonyms = getSynonyms();
