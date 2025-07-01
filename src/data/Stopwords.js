// Multilingual stopwords plus domain-specific stopwords for energy sector
import i18n from '../i18n/index.js';

export const stopwords = {
  en: [
    // Basic English stopwords
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'been', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'were', 'will', 'with', 'would', 'could', 'should', 'may',
    'might', 'must', 'can', 'shall', 'do', 'does', 'did', 'have', 'had',
    'this', 'these', 'those', 'they', 'them', 'their', 'there', 'where',
    'when', 'what', 'which', 'who', 'whom', 'whose', 'why', 'how',
    'but', 'or', 'so', 'if', 'then', 'than', 'also', 'very', 'more',
    'most', 'other', 'some', 'any', 'each', 'every', 'all', 'both',
    'either', 'neither', 'not', 'no', 'yes', 'only', 'just', 'even',
    'still', 'yet', 'already', 'again', 'once', 'twice', 'now', 'here',
    'about', 'above', 'across', 'after', 'against', 'along', 'among',
    'around', 'before', 'behind', 'below', 'beneath', 'beside', 'between',
    'beyond', 'during', 'except', 'inside', 'into', 'near', 'outside',
    'over', 'through', 'throughout', 'under', 'until', 'up', 'upon',
    'within', 'without',
    
    // Domain-specific stopwords for energy sector
    'definition', 'code', 'covers', 'expressed', 'units', 'includes',
    'refers', 'means', 'indicates', 'represents', 'comprises', 'contains',
    'consists', 'used', 'use', 'using', 'applied', 'application', 'applies',
    'related', 'regarding', 'concerning', 'about', 'pertaining', 'involving',
    'associated', 'connected', 'linked', 'corresponding', 'respective',
    'particular', 'specific', 'certain', 'given', 'following', 'above',
    'mentioned', 'described', 'stated', 'specified', 'defined', 'termed',
    'called', 'known', 'referred', 'classified', 'categorized', 'grouped',
    'type', 'kind', 'form', 'category', 'class', 'group', 'sector',
    'part', 'portion', 'section', 'component', 'element', 'aspect',
    'factor', 'item', 'unit', 'measure', 'value', 'amount', 'quantity',
    'level', 'degree', 'extent', 'range', 'scope', 'scale', 'size',
    'basis', 'ground', 'foundation', 'principle', 'standard',
    'criteria', 'requirement', 'condition', 'situation', 'case', 'instance',
    'example', 'sample', 'illustration', 'demonstration', 'indication',
    'sign', 'signal', 'evidence', 'proof', 'data', 'information',
    'detail', 'fact', 'figure', 'number', 'statistic', 'record',
    'report', 'study', 'analysis', 'research', 'investigation', 'survey',
    'assessment', 'evaluation', 'examination', 'review', 'overview',
    'summary', 'conclusion', 'result', 'outcome', 'finding', 'discovery',
    'observation', 'note', 'comment', 'remark', 'statement', 'declaration',
    'announcement', 'notification', 'communication', 'message', 'notice',
    
    // Common measurement and qualifier words
    'total', 'overall', 'general', 'main', 'primary', 'secondary', 'major',
    'minor', 'key', 'important', 'significant', 'relevant', 'necessary',
    'essential', 'basic', 'fundamental', 'core', 'central', 'critical',
    'vital', 'crucial', 'substantial', 'considerable', 'notable', 'remarkable',
    'outstanding', 'exceptional', 'special', 'unique', 'distinct', 'different',
    'similar', 'same', 'equal', 'equivalent', 'comparable', 'relative',
    'absolute', 'complete', 'full', 'entire', 'whole', 'partial', 'limited',
    'restricted', 'controlled', 'regulated', 'managed', 'operated', 'maintained',
    
    // Time-related stopwords
    'annual', 'yearly', 'monthly', 'daily', 'weekly', 'quarterly', 'seasonal',
    'current', 'present', 'future', 'past', 'previous', 'former', 'recent',
    'latest', 'new', 'old', 'existing', 'available', 'potential', 'possible',
    'actual', 'real', 'true', 'false', 'correct', 'accurate', 'precise',
    'exact', 'approximate', 'estimated', 'projected', 'forecasted', 'predicted',
    
    // Common connecting words in technical definitions
    'such', 'including', 'like', 'namely', 'especially', 'particularly',
    'specifically', 'generally', 'typically', 'usually', 'normally', 'commonly',
    'frequently', 'often', 'sometimes', 'occasionally', 'rarely', 'seldom',
    'never', 'always', 'constantly', 'continuously', 'regularly', 'consistently',
    
    // Eurostat-specific terms that are too generic
    'eurostat', 'european', 'union', 'member', 'state', 'states', 'country',
    'countries', 'nation', 'national', 'international', 'global', 'worldwide',
    'regional', 'local', 'domestic', 'foreign', 'external', 'internal',
    'public', 'private', 'commercial', 'industrial', 'residential', 'household',
    'consumer', 'producer', 'supplier', 'provider', 'operator', 'company',
    'organization', 'institution', 'agency', 'authority', 'government',
    'administration', 'ministry', 'department', 'office', 'bureau', 'service'
  ],
  
  fr: [
    // Mots vides français de base
    'le', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir', 'que', 'pour',
    'dans', 'ce', 'son', 'une', 'sur', 'avec', 'ne', 'se', 'pas', 'tout', 'plus',
    'pouvoir', 'par', 'grand', 'faire', 'premier', 'mais', 'du', 'bien', 'autre',
    'temps', 'très', 'où', 'sans', 'peu', 'dont', 'si', 'comme', 'même', 'encore',
    'lui', 'nous', 'vous', 'ils', 'elle', 'leur', 'mes', 'tes', 'ses', 'nos', 'vos',
    'ces', 'cette', 'celui', 'celle', 'ceux', 'celles', 'qui', 'quoi', 'dont',
    'où', 'quand', 'comment', 'pourquoi', 'combien', 'quel', 'quelle', 'quels',
    'quelles', 'depuis', 'pendant', 'avant', 'après', 'sous', 'dessus', 'dessous',
    'devant', 'derrière', 'entre', 'parmi', 'contre', 'vers', 'chez', 'selon',
    'malgré', 'grace', 'grâce', 'afin', 'alors', 'donc', 'car', 'sinon', 'ainsi',
    
    // Mots vides spécifiques au domaine énergétique
    'définition', 'code', 'couvre', 'exprimé', 'unités', 'inclut', 'comprend',
    'se réfère', 'signifie', 'indique', 'représente', 'compose', 'contient',
    'consiste', 'utilisé', 'utilise', 'utilisant', 'appliqué', 'application',
    'lié', 'concernant', 'au sujet', 'relatif', 'impliquant', 'associé',
    'connecté', 'correspondant', 'respectif', 'particulier', 'spécifique',
    'certain', 'donné', 'suivant', 'mentionné', 'décrit', 'énoncé', 'défini',
    'appelé', 'connu', 'référé', 'classifié', 'catégorisé', 'groupé',
    'type', 'genre', 'forme', 'catégorie', 'classe', 'groupe', 'secteur',
    'partie', 'portion', 'section', 'composant', 'élément', 'aspect',
    'facteur', 'article', 'unité', 'mesure', 'valeur', 'montant', 'quantité',
    'niveau', 'degré', 'étendue', 'gamme', 'portée', 'échelle', 'taille',
    'base', 'fondement', 'principe', 'standard', 'critère', 'exigence',
    'condition', 'situation', 'cas', 'instance', 'exemple', 'échantillon',
    'illustration', 'démonstration', 'indication', 'signe', 'signal',
    'preuve', 'données', 'information', 'détail', 'fait', 'figure',
    'numéro', 'statistique', 'enregistrement', 'rapport', 'étude',
    'analyse', 'recherche', 'investigation', 'enquête', 'évaluation',
    'examen', 'révision', 'aperçu', 'résumé', 'conclusion', 'résultat',
    'observation', 'note', 'commentaire', 'remarque', 'déclaration',
    
    // Mots de mesure et qualificatifs communs
    'total', 'global', 'général', 'principal', 'primaire', 'secondaire',
    'majeur', 'mineur', 'clé', 'important', 'significatif', 'pertinent',
    'nécessaire', 'essentiel', 'fondamental', 'central', 'critique',
    'vital', 'crucial', 'substantiel', 'considérable', 'notable',
    'remarquable', 'exceptionnel', 'spécial', 'unique', 'distinct',
    'différent', 'similaire', 'même', 'égal', 'équivalent', 'comparable',
    'relatif', 'absolu', 'complet', 'entier', 'partiel', 'limité',
    'restreint', 'contrôlé', 'réglementé', 'géré', 'opéré', 'maintenu',
    
    // Mots temporels
    'annuel', 'mensuel', 'quotidien', 'hebdomadaire', 'trimestriel',
    'actuel', 'présent', 'futur', 'passé', 'précédent', 'ancien', 'récent',
    'dernier', 'nouveau', 'vieux', 'existant', 'disponible', 'potentiel',
    'possible', 'réel', 'vrai', 'faux', 'correct', 'précis', 'exact',
    'approximatif', 'estimé', 'projeté', 'prévu', 'prédit',
    
    // Mots de liaison dans les définitions techniques
    'tel', 'incluant', 'comme', 'notamment', 'spécialement', 'particulièrement',
    'spécifiquement', 'généralement', 'typiquement', 'habituellement',
    'normalement', 'communément', 'fréquemment', 'souvent', 'parfois',
    'occasionnellement', 'rarement', 'jamais', 'toujours', 'constamment',
    'continuellement', 'régulièrement', 'systématiquement'
  ],
  
  de: [
    // Deutsche Grundstoppwörter
    'der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'sich', 'des',
    'auf', 'für', 'ist', 'im', 'dem', 'nicht', 'ein', 'eine', 'als', 'auch',
    'es', 'an', 'werden', 'aus', 'er', 'hat', 'dass', 'sie', 'nach', 'wird',
    'bei', 'einer', 'um', 'am', 'sind', 'noch', 'wie', 'einem', 'über',
    'einen', 'so', 'zum', 'war', 'haben', 'nur', 'oder', 'aber', 'vor',
    'zur', 'bis', 'mehr', 'durch', 'man', 'sein', 'wurde', 'sei', 'in',
    'ich', 'du', 'wir', 'ihr', 'mein', 'dein', 'sein', 'ihr', 'unser',
    'euer', 'dieser', 'diese', 'dieses', 'jener', 'jene', 'jenes',
    'welcher', 'welche', 'welches', 'wer', 'was', 'wo', 'wann', 'wie',
    'warum', 'weshalb', 'wieso', 'wieviel', 'seit', 'während', 'bevor',
    'nachdem', 'unter', 'über', 'neben', 'zwischen', 'gegen', 'ohne',
    'trotz', 'wegen', 'laut', 'gemäß', 'entsprechend', 'bezüglich',
    
    // Energiebereich-spezifische Stoppwörter
    'definition', 'code', 'umfasst', 'ausgedrückt', 'einheiten', 'beinhaltet',
    'bezieht', 'bedeutet', 'zeigt', 'stellt', 'enthält', 'besteht',
    'verwendet', 'angewendet', 'anwendung', 'bezogen', 'betreffend',
    'bezüglich', 'verbunden', 'verknüpft', 'entsprechend', 'jeweilig',
    'besonders', 'spezifisch', 'bestimmt', 'gegeben', 'folgend',
    'erwähnt', 'beschrieben', 'angegeben', 'definiert', 'genannt',
    'bekannt', 'bezeichnet', 'klassifiziert', 'kategorisiert', 'gruppiert',
    'typ', 'art', 'form', 'kategorie', 'klasse', 'gruppe', 'sektor',
    'teil', 'anteil', 'abschnitt', 'komponente', 'element', 'aspekt',
    'faktor', 'artikel', 'einheit', 'maß', 'wert', 'betrag', 'menge',
    'niveau', 'grad', 'umfang', 'bereich', 'skala', 'größe',
    'basis', 'grundlage', 'prinzip', 'standard', 'kriterium',
    'anforderung', 'bedingung', 'situation', 'fall', 'beispiel',
    'probe', 'illustration', 'demonstration', 'hinweis', 'zeichen',
    'signal', 'beweis', 'daten', 'information', 'detail', 'tatsache',
    'zahl', 'statistik', 'aufzeichnung', 'bericht', 'studie',
    'analyse', 'forschung', 'untersuchung', 'umfrage', 'bewertung',
    'prüfung', 'überprüfung', 'übersicht', 'zusammenfassung',
    'schlussfolgerung', 'ergebnis', 'beobachtung', 'notiz',
    'kommentar', 'bemerkung', 'aussage', 'erklärung',
    
    // Mess- und Qualifikationswörter
    'gesamt', 'allgemein', 'haupt', 'primär', 'sekundär', 'groß',
    'klein', 'schlüssel', 'wichtig', 'bedeutend', 'relevant',
    'notwendig', 'wesentlich', 'grundlegend', 'zentral', 'kritisch',
    'vital', 'entscheidend', 'erheblich', 'beträchtlich', 'bemerkenswert',
    'außergewöhnlich', 'besonders', 'einzigartig', 'unterschiedlich',
    'ähnlich', 'gleich', 'gleichwertig', 'vergleichbar', 'relativ',
    'absolut', 'vollständig', 'ganz', 'teilweise', 'begrenzt',
    'beschränkt', 'kontrolliert', 'reguliert', 'verwaltet', 'betrieben',
    
    // Zeitbezogene Wörter
    'jährlich', 'monatlich', 'täglich', 'wöchentlich', 'vierteljährlich',
    'aktuell', 'gegenwärtig', 'zukünftig', 'vergangen', 'vorherig',
    'früher', 'kürzlich', 'neueste', 'neu', 'alt', 'vorhanden',
    'verfügbar', 'möglich', 'tatsächlich', 'wahr', 'falsch',
    'korrekt', 'genau', 'exakt', 'ungefähr', 'geschätzt',
    'projiziert', 'vorhergesagt',
    
    // Verbindungswörter in technischen Definitionen
    'solche', 'einschließlich', 'wie', 'nämlich', 'besonders',
    'speziell', 'spezifisch', 'allgemein', 'typisch', 'gewöhnlich',
    'normalerweise', 'häufig', 'oft', 'manchmal', 'gelegentlich',
    'selten', 'niemals', 'immer', 'ständig', 'kontinuierlich',
    'regelmäßig', 'systematisch'
  ]
};

/**
 * Get stopwords for the current language
 */
export const getStopwords = () => {
  const currentLanguage = i18n.language || 'en';
  return stopwords[currentLanguage] || stopwords.en;
};
