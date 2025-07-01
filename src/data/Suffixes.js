// Multilingual word suffixes for stemming - ordered by priority (longer suffixes first)
import i18n from '../i18n/index.js';

export const suffixes = {
  en: [
    // Verb suffixes
    'ification', 'ification', 'ization', 'isation', 'iveness', 'fulness',
    'ousness', 'ational', 'tional', 'encial', 'ancing', 'encing',
    'ication', 'ication', 'atively', 'ibility', 'icalism', 'ization',
    'isation', 'entness', 'fulness', 'iveness', 'ousness', 'ational',
    'tional', 'encial', 'ancing', 'encing', 'ication', 'atively',
    'ibility', 'icalism',
    
    // Noun suffixes
    'ations', 'itions', 'encies', 'ancies', 'nesses', 'ments', 'ships',
    'hoods', 'ances', 'ences', 'ities', 'ings', 'ers', 'ors', 'ies',
    'tion', 'sion', 'ness', 'ment', 'ship', 'hood', 'ance', 'ence',
    'ity', 'ism', 'ist', 'ing', 'ed', 'er', 'or', 'ly', 'al', 'ic',
    'ous', 'ful', 'ive', 'able', 'ible', 'ant', 'ent', 'ary', 'ory',
    'eal', 'ial', 'ual', 'ate', 'ize', 'ise', 'fy', 'en',
    
    // Adjective suffixes
    'ational', 'tional', 'encial', 'ative', 'itive', 'ical', 'ful',
    'less', 'ous', 'ive', 'able', 'ible', 'ant', 'ent', 'ary', 'ory',
    'ic', 'al', 'ly', 'ed', 'ing', 'er', 'est',
    
    // Common word endings
    'es', 's', 'ed', 'er', 'ly', 'ing', 'ion', 'tion', 'sion', 'ness',
    'ment', 'ful', 'less', 'able', 'ible', 'ous', 'ive', 'ary', 'ory',
    'ic', 'al', 'ant', 'ent', 'ism', 'ist', 'ize', 'ise', 'fy', 'ate',
    'en', 'ify', 'age', 'dom', 'ship', 'hood', 'ward', 'wise', 'like',
    'some', 'ward', 'ways', 'fold', 'most', 'teen', 'ty', 'th',
    
    // Energy-specific suffixes
    'electric', 'thermal', 'nuclear', 'solar', 'hydro', 'wind', 'bio',
    'geo', 'power', 'energy', 'fuel', 'gas', 'oil', 'coal', 'plant',
    'station', 'grid', 'system', 'network', 'source', 'supply', 'demand',
    'consumption', 'production', 'generation', 'transmission', 'distribution',
    'storage', 'efficiency', 'conservation', 'emission', 'pollution',
    'renewable', 'sustainable', 'alternative', 'conventional', 'traditional',
    'fossil', 'carbon', 'dioxide', 'monoxide', 'greenhouse', 'climate',
    'environment', 'waste', 'recycling', 'processing', 'refining',
    'transformation', 'conversion', 'technology', 'infrastructure',
    'equipment', 'machinery', 'device', 'apparatus', 'installation',
    'facility', 'building', 'structure', 'pipeline', 'cable', 'line',
    'meter', 'monitor', 'sensor', 'control', 'automation', 'smart',
    'digital', 'electronic', 'mechanical', 'chemical', 'physical',
    'thermal', 'electrical', 'magnetic', 'optical', 'acoustic'
  ],
  
  fr: [
    // Suffixes de verbes français
    'ification', 'isation', 'ement', 'issement', 'ation', 'ition',
    'ution', 'tion', 'sion', 'xion', 'ance', 'ence', 'ure', 'age',
    'ment', 'ité', 'isme', 'iste', 'able', 'ible', 'eux', 'euse',
    'ique', 'eux', 'oire', 'aire', 'ante', 'ente', 'er', 'ir', 're',
    
    // Suffixes de noms français
    'ements', 'ations', 'itions', 'utions', 'tions', 'sions', 'xions',
    'ances', 'ences', 'ures', 'ages', 'ments', 'ités', 'ismes',
    'istes', 'eurs', 'euses', 'iques', 'eux', 'oires', 'aires',
    'antes', 'entes', 'ement', 'ation', 'ition', 'ution', 'tion',
    'sion', 'xion', 'ance', 'ence', 'ure', 'age', 'ment', 'ité',
    'isme', 'iste', 'eur', 'euse', 'ique', 'eux', 'oire', 'aire',
    'ante', 'ente', 'er', 'ir', 're', 'é', 'ée', 'és', 'ées',
    'ant', 'ent', 'ait', 'aient', 'ais', 'ait', 'ons', 'ez',
    
    // Suffixes d'adjectifs français
    'ables', 'ibles', 'euses', 'iques', 'aires', 'antes', 'entes',
    'able', 'ible', 'euse', 'ique', 'aire', 'ante', 'ente',
    'eux', 'euse', 'if', 'ive', 'al', 'ale', 'el', 'elle',
    'ique', 'oir', 'oire', 'ain', 'aine', 'en', 'enne',
    
    // Terminaisons communes
    'es', 's', 'ée', 'és', 'ées', 'ent', 'ant', 'ait', 'ais',
    'ont', 'ons', 'ez', 'ère', 'ère', 'ème', 'ier', 'ière',
    
    // Suffixes spécifiques à l'énergie
    'électrique', 'thermique', 'nucléaire', 'solaire', 'hydro', 'éolien',
    'bio', 'géo', 'puissance', 'énergie', 'combustible', 'gaz', 'pétrole',
    'charbon', 'centrale', 'station', 'réseau', 'système', 'source',
    'approvisionnement', 'demande', 'consommation', 'production',
    'génération', 'transmission', 'distribution', 'stockage', 'efficacité',
    'conservation', 'émission', 'pollution', 'renouvelable', 'durable',
    'alternatif', 'conventionnel', 'traditionnel', 'fossile', 'carbone',
    'environnement', 'déchet', 'recyclage', 'traitement', 'raffinage',
    'transformation', 'conversion', 'technologie', 'infrastructure',
    'équipement', 'machinerie', 'dispositif', 'appareil', 'installation',
    'installation', 'bâtiment', 'structure', 'pipeline', 'câble', 'ligne',
    'compteur', 'moniteur', 'capteur', 'contrôle', 'automatisation',
    'intelligent', 'numérique', 'électronique', 'mécanique', 'chimique',
    'physique', 'thermique', 'électrique', 'magnétique', 'optique', 'acoustique'
  ],
  
  de: [
    // Deutsche Verbsuffixe
    'ierung', 'isierung', 'ifizierung', 'ierung', 'ung', 'tion', 'sion',
    'heit', 'keit', 'schaft', 'tum', 'nis', 'sal', 'sel', 'ung',
    'bar', 'lich', 'ig', 'isch', 'haft', 'sam', 'los', 'voll',
    'mäßig', 'artig', 'förmig', 'reich', 'arm', 'frei', 'leer',
    
    // Deutsche Substantivsuffixe
    'ierungen', 'isierungen', 'ifizierungen', 'ungen', 'tionen', 'sionen',
    'heiten', 'keiten', 'schaften', 'tümer', 'nisse', 'sale', 'sele',
    'ierung', 'isierung', 'ifizierung', 'ung', 'tion', 'sion',
    'heit', 'keit', 'schaft', 'tum', 'nis', 'sal', 'sel',
    'er', 'in', 'chen', 'lein', 'ling', 'bold', 'ard',
    'ist', 'ant', 'ent', 'eur', 'ör', 'iker', 'aner',
    
    // Deutsche Adjektivsuffixe
    'bare', 'liche', 'ige', 'ische', 'hafte', 'same', 'lose', 'volle',
    'mäßige', 'artige', 'förmige', 'reiche', 'arme', 'freie', 'leere',
    'bar', 'lich', 'ig', 'isch', 'haft', 'sam', 'los', 'voll',
    'mäßig', 'artig', 'förmig', 'reich', 'arm', 'frei', 'leer',
    'end', 'ern', 'en', 'er', 'es', 'em', 'est', 'ste',
    
    // Gemeinsame Endungen
    'en', 'er', 'es', 'e', 'n', 't', 'st', 'te', 'ten',
    'der', 'den', 'des', 'dem', 'die', 'das', 'ein', 'eine',
    
    // Energiespezifische Suffixe
    'elektrisch', 'thermisch', 'nuklear', 'solar', 'hydro', 'wind',
    'bio', 'geo', 'kraft', 'energie', 'brennstoff', 'gas', 'öl',
    'kohle', 'kraftwerk', 'station', 'netz', 'system', 'quelle',
    'versorgung', 'nachfrage', 'verbrauch', 'produktion', 'erzeugung',
    'übertragung', 'verteilung', 'speicherung', 'effizienz',
    'erhaltung', 'emission', 'verschmutzung', 'erneuerbar',
    'nachhaltig', 'alternativ', 'konventionell', 'traditionell',
    'fossil', 'kohlenstoff', 'umwelt', 'abfall', 'recycling',
    'verarbeitung', 'raffination', 'umwandlung', 'konversion',
    'technologie', 'infrastruktur', 'ausrüstung', 'maschinerie',
    'gerät', 'apparat', 'anlage', 'einrichtung', 'gebäude',
    'struktur', 'pipeline', 'kabel', 'leitung', 'zähler',
    'monitor', 'sensor', 'kontrolle', 'automatisierung', 'intelligent',
    'digital', 'elektronisch', 'mechanisch', 'chemisch', 'physikalisch',
    'thermisch', 'elektrisch', 'magnetisch', 'optisch', 'akustisch'
  ]
};

// Minimum word length after suffix removal
export const minWordLength = 3;

// Words that should not be stemmed (irregular forms) - multilingual
export const stemExceptions = {
  en: {
    'going': 'go',
    'gone': 'go',
    'went': 'go',
    'being': 'be',
    'been': 'be',
    'was': 'be',
    'were': 'be',
    'am': 'be',
    'is': 'be',
    'are': 'be',
    'having': 'have',
    'had': 'have',
    'has': 'have',
    'doing': 'do',
    'done': 'do',
    'did': 'do',
    'does': 'do',
    'saying': 'say',
    'said': 'say',
    'says': 'say',
    'getting': 'get',
    'got': 'get',
    'gotten': 'get',
    'gets': 'get',
    'making': 'make',
    'made': 'make',
    'makes': 'make',
    'taking': 'take',
    'took': 'take',
    'taken': 'take',
    'takes': 'take',
    'coming': 'come',
    'came': 'come',
    'comes': 'come',
    'seeing': 'see',
    'saw': 'see',
    'seen': 'see',
    'sees': 'see',
    'knowing': 'know',
    'knew': 'know',
    'known': 'know',
    'knows': 'know',
    'thinking': 'think',
    'thought': 'think',
    'thinks': 'think',
    'looking': 'look',
    'looked': 'look',
    'looks': 'look',
    'finding': 'find',
    'found': 'find',
    'finds': 'find',
    'giving': 'give',
    'gave': 'give',
    'given': 'give',
    'gives': 'give',
    'working': 'work',
    'worked': 'work',
    'works': 'work',
    'using': 'use',
    'used': 'use',
    'uses': 'use',
    'trying': 'try',
    'tried': 'try',
    'tries': 'try',
    
    // Energy-specific irregular forms
    'electricity': 'electric',
    'electrical': 'electric',
    'renewable': 'renew',
    'sustainability': 'sustain',
    'sustainable': 'sustain',
    'efficiency': 'efficient',
    'consumption': 'consume',
    'production': 'produce',
    'generation': 'generate',
    'transmission': 'transmit',
    'distribution': 'distribute',
    'transformation': 'transform',
    'conservation': 'conserve',
    'pollution': 'pollute',
    'emission': 'emit',
    'emissions': 'emit'
  },
  
  fr: {
    'allant': 'aller',
    'allé': 'aller',
    'allée': 'aller',
    'allés': 'aller',
    'allées': 'aller',
    'était': 'être',
    'étaient': 'être',
    'été': 'être',
    'ayant': 'avoir',
    'eu': 'avoir',
    'eue': 'avoir',
    'eus': 'avoir',
    'eues': 'avoir',
    'faisant': 'faire',
    'fait': 'faire',
    'faite': 'faire',
    'faits': 'faire',
    'faites': 'faire',
    'disant': 'dire',
    'dit': 'dire',
    'dite': 'dire',
    'dits': 'dire',
    'dites': 'dire',
    'venant': 'venir',
    'venu': 'venir',
    'venue': 'venir',
    'venus': 'venir',
    'venues': 'venir',
    'voyant': 'voir',
    'vu': 'voir',
    'vue': 'voir',
    'vus': 'voir',
    'vues': 'voir',
    'sachant': 'savoir',
    'su': 'savoir',
    'sue': 'savoir',
    'sus': 'savoir',
    'sues': 'savoir',
    
    // Formes irrégulières spécifiques à l'énergie
    'électricité': 'électrique',
    'électrique': 'électrique',
    'renouvelable': 'renouveler',
    'durabilité': 'durable',
    'durable': 'durable',
    'efficacité': 'efficace',
    'consommation': 'consommer',
    'production': 'produire',
    'génération': 'générer',
    'transmission': 'transmettre',
    'distribution': 'distribuer',
    'transformation': 'transformer',
    'conservation': 'conserver',
    'pollution': 'polluer',
    'émission': 'émettre',
    'émissions': 'émettre'
  },
  
  de: {
    'gehend': 'gehen',
    'gegangen': 'gehen',
    'ging': 'gehen',
    'gingen': 'gehen',
    'seiend': 'sein',
    'gewesen': 'sein',
    'war': 'sein',
    'waren': 'sein',
    'habend': 'haben',
    'gehabt': 'haben',
    'hatte': 'haben',
    'hatten': 'haben',
    'tuend': 'tun',
    'getan': 'tun',
    'tat': 'tun',
    'taten': 'tun',
    'sagend': 'sagen',
    'gesagt': 'sagen',
    'sagte': 'sagen',
    'sagten': 'sagen',
    'kommend': 'kommen',
    'gekommen': 'kommen',
    'kam': 'kommen',
    'kamen': 'kommen',
    'sehend': 'sehen',
    'gesehen': 'sehen',
    'sah': 'sehen',
    'sahen': 'sehen',
    'wissend': 'wissen',
    'gewusst': 'wissen',
    'wusste': 'wissen',
    'wussten': 'wissen',
    'denkend': 'denken',
    'gedacht': 'denken',
    'dachte': 'denken',
    'dachten': 'denken',
    
    // Energiespezifische unregelmäßige Formen
    'elektrizität': 'elektrisch',
    'elektrisch': 'elektrisch',
    'erneuerbar': 'erneuern',
    'nachhaltigkeit': 'nachhaltig',
    'nachhaltig': 'nachhaltig',
    'effizienz': 'effizient',
    'verbrauch': 'verbrauchen',
    'produktion': 'produzieren',
    'erzeugung': 'erzeugen',
    'übertragung': 'übertragen',
    'verteilung': 'verteilen',
    'umwandlung': 'umwandeln',
    'erhaltung': 'erhalten',
    'verschmutzung': 'verschmutzen',
    'emission': 'emittieren',
    'emissionen': 'emittieren'
  }
};

/**
 * Get suffixes for the current language
 */
export const getSuffixes = () => {
  const currentLanguage = i18n.language || 'en';
  return suffixes[currentLanguage] || suffixes.en;
};

/**
 * Get stem exceptions for the current language
 */
export const getStemExceptions = () => {
  const currentLanguage = i18n.language || 'en';
  return stemExceptions[currentLanguage] || stemExceptions.en;
};
