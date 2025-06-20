/**
 * Date patterns and relative date terms for data query detection
 */

export const DATE_PATTERNS = {
  // Regex patterns for absolute dates
  regex: [
    // Years (1990-2030)
    /\b(19[9]\d|20[0-3]\d)\b/,
    // Date formats (MM/YYYY, YYYY-MM, etc.)
    /\b\d{1,2}\/\d{4}\b/,
    /\b\d{4}-\d{1,2}\b/,
    /\b\d{1,2}-\d{4}\b/,
    // Quarter formats (Q1 2023, 2023 Q1, etc.)
    /\b(q[1-4]\s+\d{4}|\d{4}\s+q[1-4])\b/i
  ],
  
  // Month names (full and abbreviated)
  months: {
    full: [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ],
    abbreviated: [
      'jan', 'feb', 'mar', 'apr', 'may', 'jun',
      'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
    ]
  },
  
  // Relative date terms
  relative: {
    current: [
      'current year', 'this year', 'present year', 'now', 'today',
      'current quarter', 'this quarter', 'present quarter'
    ],
    past: [
      'last year', 'previous year', 'past year', 'year ago',
      'last quarter', 'previous quarter', 'past quarter', 'quarter ago',
      'last month', 'previous month', 'past month', 'month ago',
      'yesterday', 'last week', 'previous week'
    ],
    future: [
      'next year', 'following year', 'upcoming year',
      'next quarter', 'following quarter', 'upcoming quarter',
      'next month', 'following month', 'upcoming month',
      'tomorrow', 'next week', 'following week'
    ]
  },
  
  // Period indicators
  periods: [
    'annual', 'yearly', 'monthly', 'quarterly', 'weekly', 'daily',
    'semester', 'half-year', 'biannual', 'decade'
  ]
};

/**
 * Get current year for relative date calculations
 */
const getCurrentYear = () => new Date().getFullYear();

/**
 * Convert relative date terms to actual years
 */
export const resolveRelativeDate = (term) => {
  const currentYear = getCurrentYear();
  const lowerTerm = term.toLowerCase();
  
  // Current year references
  if (DATE_PATTERNS.relative.current.some(current => lowerTerm.includes(current))) {
    return currentYear.toString();
  }
  
  // Past year references
  if (DATE_PATTERNS.relative.past.some(past => lowerTerm.includes(past))) {
    if (lowerTerm.includes('year')) {
      return (currentYear - 1).toString();
    }
    // For other past terms, assume last year for simplicity
    return (currentYear - 1).toString();
  }
  
  // Future year references
  if (DATE_PATTERNS.relative.future.some(future => lowerTerm.includes(future))) {
    if (lowerTerm.includes('year')) {
      return (currentYear + 1).toString();
    }
    // For other future terms, assume next year for simplicity
    return (currentYear + 1).toString();
  }
  
  return null;
};

/**
 * Check if text contains date references
 */
export const containsDate = (text) => {
  const lowerText = text.toLowerCase();
  
  // Check regex patterns
  const hasRegexMatch = DATE_PATTERNS.regex.some(pattern => pattern.test(lowerText));
  if (hasRegexMatch) return true;
  
  // Check month names
  const hasMonth = [
    ...DATE_PATTERNS.months.full,
    ...DATE_PATTERNS.months.abbreviated
  ].some(month => lowerText.includes(month));
  if (hasMonth) return true;
  
  // Check relative dates
  const hasRelativeDate = [
    ...DATE_PATTERNS.relative.current,
    ...DATE_PATTERNS.relative.past,
    ...DATE_PATTERNS.relative.future
  ].some(relative => lowerText.includes(relative));
  if (hasRelativeDate) return true;
  
  // Check period indicators
  const hasPeriod = DATE_PATTERNS.periods.some(period => lowerText.includes(period));
  if (hasPeriod) return true;
  
  return false;
};

/**
 * Extract date from text
 */
export const extractDate = (text, tokens) => {
  const lowerText = text.toLowerCase();
  
  // First check for relative dates
  const relativeDate = resolveRelativeDate(lowerText);
  if (relativeDate) {
    return relativeDate;
  }
  
  // Check regex patterns
  for (const pattern of DATE_PATTERNS.regex) {
    const match = lowerText.match(pattern);
    if (match) {
      return match[0];
    }
  }
  
  // Check for year tokens (4-digit numbers that could be years)
  const yearToken = tokens.find(token => {
    const num = parseInt(token);
    return !isNaN(num) && num >= 1990 && num <= 2030;
  });
  
  if (yearToken) {
    return yearToken;
  }
  
  // Check for month names with possible years
  for (const month of [...DATE_PATTERNS.months.full, ...DATE_PATTERNS.months.abbreviated]) {
    if (lowerText.includes(month)) {
      // Try to find a year near the month
      const yearMatch = lowerText.match(new RegExp(`${month}\\s+(\\d{4})|(\\d{4})\\s+${month}`));
      if (yearMatch) {
        return yearMatch[1] || yearMatch[2];
      }
      return month; // Return month name if no year found
    }
  }
  
  return null;
};
