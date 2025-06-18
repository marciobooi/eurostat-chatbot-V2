/**
 * Welcome Messages for Eurostat Energy Chatbot
 * A collection of friendly, informative welcome messages to greet users
 */

export const WELCOME_MESSAGES = [
  {
    id: 'welcome_basic',
    content: 'Hello! I\'m the Eurostat Energy Chatbot. Ask me about energy definitions, fuel codes, or any energy-related terms.',
    timestamp: new Date(),
    tags: ['basic', 'general']
  },
  {
    id: 'welcome_enthusiastic',
    content: 'Welcome to the Eurostat Energy Assistant! 🔋 I\'m here to help you navigate the world of energy statistics and definitions. What would you like to know?',
    timestamp: new Date(),
    tags: ['enthusiastic', 'emoji']
  },
  {
    id: 'welcome_professional',
    content: 'Greetings! I\'m your Eurostat Energy Data Assistant. I can provide information about energy classifications, fuel codes, methodology, and statistical definitions. How may I assist you today?',
    timestamp: new Date(),
    tags: ['professional', 'formal']
  },
  {
    id: 'welcome_helpful',
    content: 'Hi there! I\'m here to help you understand Eurostat\'s energy data and terminology. Whether you need fuel code definitions, energy balance explanations, or statistical clarifications, just ask!',
    timestamp: new Date(),
    tags: ['helpful', 'friendly']
  },
  {
    id: 'welcome_specific',
    content: 'Welcome! I specialize in Eurostat energy statistics and can help with fuel classifications, energy balance methodology, and official energy definitions used in EU reporting.',
    timestamp: new Date(),
    tags: ['specific', 'technical']
  },
  {
    id: 'welcome_interactive',
    content: 'Hello! Ready to explore energy data? I can explain fuel codes, energy definitions, statistical methods, and much more. What energy topic interests you?',
    timestamp: new Date(),
    tags: ['interactive', 'engaging']
  },
  {
    id: 'welcome_comprehensive',
    content: 'Welcome to your Eurostat Energy Knowledge Hub! I\'m equipped to answer questions about energy balances, fuel classifications, renewable energy definitions, and EU energy statistical standards.',
    timestamp: new Date(),
    tags: ['comprehensive', 'detailed']
  },
  {
    id: 'welcome_casual',
    content: 'Hey! I\'m your go-to assistant for all things related to Eurostat energy data. Got questions about fuel codes, energy terms, or statistical definitions? Fire away!',
    timestamp: new Date(),
    tags: ['casual', 'informal']
  },
  {
    id: 'welcome_educational',
    content: 'Hello and welcome! I\'m here to make Eurostat energy statistics accessible and understandable. Ask me about energy definitions, classification systems, or methodological questions.',
    timestamp: new Date(),
    tags: ['educational', 'learning']
  },
  {
    id: 'welcome_efficient',
    content: 'Hi! I\'m your Eurostat Energy Assistant. Quick questions about fuel codes, energy definitions, or statistical methodology? I\'ve got answers!',
    timestamp: new Date(),
    tags: ['efficient', 'concise']
  },
  {
    id: 'welcome_morning',
    content: 'Good morning! Starting your day with energy data questions? Perfect! I\'m here to help with Eurostat energy definitions, fuel codes, and statistical clarifications.',
    timestamp: new Date(),
    tags: ['time-specific', 'morning']
  },
  {
    id: 'welcome_afternoon',
    content: 'Good afternoon! Need some energy data insights? I\'m your Eurostat assistant for fuel classifications, energy balance questions, and statistical definitions.',
    timestamp: new Date(),
    tags: ['time-specific', 'afternoon']
  },
  {
    id: 'welcome_returning',
    content: 'Welcome back! Ready for more energy data exploration? I\'m here to continue helping with Eurostat definitions, fuel codes, and statistical questions.',
    timestamp: new Date(),
    tags: ['returning-user', 'continuity']
  },
    {
    id: 'welcome_inquisitive',
    content: 'Curious about energy data? So am I! Let’s explore Eurostat’s energy statistics together—just ask your question.',
    timestamp: new Date(),
    tags: ['curious', 'engaging']
  },
  {
    id: 'welcome_youthful',
    content: 'Yo! Ready to dive into the world of energy stats? I’ve got the fuel codes and energy facts you need—let’s go!',
    timestamp: new Date(),
    tags: ['youthful', 'fun']
  },
  {
    id: 'welcome_minimalist',
    content: 'Hi. Energy data? I can help. Ask away.',
    timestamp: new Date(),
    tags: ['minimalist', 'concise']
  },
  {
    id: 'welcome_reassuring',
    content: 'No worries if energy stats seem complex—I’m here to make it simple. Ask me anything about Eurostat energy data.',
    timestamp: new Date(),
    tags: ['reassuring', 'supportive']
  },
  {
    id: 'welcome_expert',
    content: 'Welcome! With deep knowledge of Eurostat’s energy classifications and methodologies, I’m ready to assist with your advanced queries.',
    timestamp: new Date(),
    tags: ['expert', 'technical']
  },
  {
    id: 'welcome_evening',
    content: 'Good evening! Looking into energy data tonight? I’m here to help with Eurostat definitions, fuel codes, and more.',
    timestamp: new Date(),
    tags: ['time-specific', 'evening']
  }

];



/**
 * Get a random welcome message
 * @param {string[]} preferredTags - Optional tags to filter messages
 * @returns {Object} Random welcome message object
 */
export const getRandomWelcomeMessage = (preferredTags = []) => {
  let filteredMessages = WELCOME_MESSAGES;
  
  // Filter by tags if provided
  if (preferredTags.length > 0) {
    filteredMessages = WELCOME_MESSAGES.filter(message => 
      message.tags.some(tag => preferredTags.includes(tag))
    );
    
    // Fallback to all messages if no matches found
    if (filteredMessages.length === 0) {
      filteredMessages = WELCOME_MESSAGES;
    }
  }
  
  // Get random message
  const randomIndex = Math.floor(Math.random() * filteredMessages.length);
  const selectedMessage = { ...filteredMessages[randomIndex] };
  
  // Update timestamp to current time
  selectedMessage.timestamp = new Date();
  
  return selectedMessage;
};

/**
 * Get welcome message based on time of day
 * @returns {Object} Time-appropriate welcome message
 */
export const getTimeBasedWelcomeMessage = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    // Morning (5 AM - 12 PM)
    return getRandomWelcomeMessage(['morning', 'energetic', 'professional']);
  } else if (hour >= 12 && hour < 17) {
    // Afternoon (12 PM - 5 PM)
    return getRandomWelcomeMessage(['afternoon', 'helpful', 'efficient']);
  } else if (hour >= 17 && hour < 22) {
    // Evening (5 PM - 10 PM)
    return getRandomWelcomeMessage(['friendly', 'casual', 'helpful']);
  } else {
    // Night/Late (10 PM - 5 AM)
    return getRandomWelcomeMessage(['basic', 'professional', 'concise']);
  }
};

/**
 * Get welcome message for returning users
 * @returns {Object} Welcome message for returning users
 */
export const getReturningUserWelcome = () => {
  return getRandomWelcomeMessage(['returning-user', 'friendly', 'continuity']);
};

/**
 * Get welcome message by user preference
 * @param {string} style - 'formal', 'casual', 'friendly', 'professional', 'enthusiastic'
 * @returns {Object} Welcome message matching the style
 */
export const getStyledWelcomeMessage = (style = 'friendly') => {
  const styleMap = {
    formal: ['professional', 'formal', 'technical'],
    casual: ['casual', 'informal', 'friendly'],
    friendly: ['friendly', 'helpful', 'engaging'],
    professional: ['professional', 'specific', 'detailed'],
    enthusiastic: ['enthusiastic', 'interactive', 'engaging'],
    educational: ['educational', 'learning', 'comprehensive'],
    efficient: ['efficient', 'concise', 'direct']
  };
  
  const tags = styleMap[style] || styleMap.friendly;
  return getRandomWelcomeMessage(tags);
};

/**
 * Message categories for easy filtering
 */
export const MESSAGE_CATEGORIES = {
  TONE: {
    FORMAL: ['professional', 'formal', 'technical'],
    CASUAL: ['casual', 'informal', 'friendly'],
    ENTHUSIASTIC: ['enthusiastic', 'engaging', 'interactive'],
    HELPFUL: ['helpful', 'educational', 'supportive']
  },
  TIME: {
    MORNING: ['morning'],
    AFTERNOON: ['afternoon'],
    EVENING: ['evening'],
    NIGHT: ['night']
  },
  USER_TYPE: {
    NEW: ['basic', 'general', 'introductory'],
    RETURNING: ['returning-user', 'continuity'],
    TECHNICAL: ['technical', 'detailed', 'specific'],
    CASUAL: ['casual', 'simple', 'friendly']
  }
};

/**
 * Get all available tags
 * @returns {string[]} Array of all unique tags
 */
export const getAllTags = () => {
  const allTags = WELCOME_MESSAGES.flatMap(message => message.tags);
  return [...new Set(allTags)].sort();
};

/**
 * Get messages by specific tag
 * @param {string} tag - Tag to filter by
 * @returns {Object[]} Array of messages with the specified tag
 */
export const getMessagesByTag = (tag) => {
  return WELCOME_MESSAGES.filter(message => 
    message.tags.includes(tag)
  );
};
