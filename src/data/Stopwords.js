// Common English stopwords plus domain-specific stopwords for energy sector
export const stopwords = [
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
  'basis', 'basis', 'ground', 'foundation', 'principle', 'standard',
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
];
