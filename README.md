# Eurostat Energy Chatbot V2

An intelligent chatbot interface for exploring European energy statistics and trends with interactive visualizations.

## Features

### Core Features
- Multilingual support (English, French, German)
- Natural language processing for query understanding
- Context-aware conversations
- Smart suggestions system
- Chat history management
- Typing indicators and AI-like behavior simulation
- Responsive design with accessibility features

### Interactive Visualizations

The chatbot now includes enhanced visualization capabilities with:

- Sleek, Eurostat-themed charts and graphs
- Animated entry and transitions
- Responsive design for all screen sizes
- Interactive tooltips with detailed information
- Multiple visualization types:
  - Pie charts for distribution data
  - Line charts for temporal trends
  - Bar charts for comparisons
  - Area charts for cumulative data

### Visualization Flow

1. Topic Introduction:
   - Initial response with topic overview
   - Visualization options presented in a delayed, natural flow

2. Visualization Interaction:
   - Click-through interface for exploring different charts
   - Progressive disclosure of additional visualization options
   - Smart suggestions for related topics

3. User Experience:
   - Smooth animations and transitions
   - Clear visual hierarchy
   - Intuitive navigation between topics

### Styling Guidelines

#### Colors
- Primary Blue: #0E47CB (Eurostat Blue)
- Secondary Orange: #FFA629 (Eurostat Orange)
- Tertiary Teal: #24B9B9
- Quaternary Coral: #FF6B6B
- Background: #F8F9FA
- Grid: #E9ECEF
- Text: #495057

#### Typography
- Font Family: Inter, system-ui, sans-serif
- Base Font Size: 12px for charts
- Description Text: 0.9rem
- Tooltip Text: 0.85rem

#### Layout
- Chart Container Padding: 1.5rem
- Border Radius: 12px (container), 8px (charts)
- Responsive Breakpoints: 768px for mobile adaptation

### Multilingual Support

Visualization labels and descriptions are available in:
- English (en)
- French (fr)
- German (de)

### Architecture

#### Frontend Framework
- React 19.0.0
- Vite 6.2.0 for build tooling
- SWC for Fast Refresh

#### Key Components

1. **ChatBot (ChatBot.jsx)**
   - Main component handling conversation flow
   - Manages message history and user interactions
   - Implements typing indicators and thinking states
   - Handles dynamic scrolling and message visibility
   - Smart scrolling behavior for new messages, suggestions, and visualizations
   - Context-aware message positioning

2. **Natural Language Processing (utils/)**
   - `nlpHandler.js`: Topic extraction and sentiment analysis
   - `energyHandlers.js`: Energy topic matching and processing
   - `botResponseHandlers.js`: Response generation and formatting
   - `chatHandlers.js`: Chat interaction management
   - `storageHandlers.js`: Chat history persistence

3. **Data Management**
   - `energyDictionary.js`: Multilingual knowledge base with:
     - Topic definitions and hierarchies
     - Keywords and synonyms mapping
     - Related topics and suggestions
     - Visualization type mappings
     - Dataset connections
   - `MessageService.js`: Centralized message processing
   - `ChatContext.jsx`: State management and chat synchronization

4. **UI Components**
   - ChatMessage: Smart message rendering with animations
   - TypingIndicator: Natural typing simulation
   - SmartSuggestions: Context-aware topic suggestions
   - ScrollButton: Intelligent scroll management
   - MessagesContainer: Optimized message rendering

### Intelligent Features

1. **Smart Response System**
   - Advanced language detection and fallback
   - Multi-language topic matching
   - Cross-reference suggestion system
   - Progressive visualization options
   - Contextual follow-up handling

2. **User Experience**
   - Automatic scrolling for new messages
   - Smart suggestion positioning
   - Dynamic visualization loading
   - Cross-tab synchronization
   - Persistent language preferences
   - Smooth animations and transitions

3. **Internationalization**
   - Comprehensive i18n integration
   - Language-specific energy definitions
   - Automatic fallback handling
   - Smart language detection
   - Cookie-based preferences

### Project Structure
```
src/
├── components/     # React UI components
├── contexts/      # React context providers
├── dictionaries/  # dictionaries models
├── hooks/         # Custom React hooks
├── locales/       # i18n translation files
├── services/      # Core services
├── styles/        # CSS modules and themes
├── types/         # TypeScript definitions
└── utils/         # Helper functions and utilities
```

## Setup and Development

### Prerequisites
- Node.js (version 16 or higher recommended)
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will start at `http://localhost:5173` by default.

### Production Build
```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## Future Improvement Opportunities

1. **Knowledge Base**
   - Expand energy-related topics
   - Add more languages
   - Include statistical data integration

2. **Features**
   - Real-time data updates
   - Advanced analytics dashboard
   - Voice interaction support
   - Graph and chart visualization
   - API integration for live data

3. **Technical**
   - Unit test implementation
   - Performance optimization
   - Enhanced error handling
   - Documentation expansion

## Configuration

### Visualization Config Structure
```javascript
{
  [fuelType]: {
    visualizations: [
      {
        type: 'pie|line|bar|area',
        label: 'Visualization Label',
        description: 'Detailed description',
        data: [] // Chart-specific data structure
      }
    ],
    nextTopics: ['topic1', 'topic2'] // Related topics for suggestions
  }
}
```

### Visualization System

#### Framework & Libraries
- Chart.js for core charting functionality
- react-chartjs-2 for React integration
- Custom styled components for layout and legends
- i18next for multilingual support

#### Chart Types
Each chart type is implemented as a standalone component with dedicated styling:
- **Doughnut/Pie Charts**: Distribution data with 75% cutout and gradient coloring
- **Line Charts**: Time series with smooth curves and area fills
- **Bar Charts**: Comparative data with rounded corners and gradient bars
- **Area Charts**: Stacked data visualization with dual color schemes

#### Technical Features
- **Modular Architecture**: Separate components for each chart type
- **Shared Styling**: Common design tokens and responsive layouts
- **Smart Data Handling**: Automatic data processing and formatting
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: Optimized rendering and animations
- **i18n**: Full translation support for all chart elements


all models that we are going to use are inside dictionaries folde
including the energy dictionary

all translations used in the tool is stored in the locales


NLP Processing Pipeline:

The system first processes raw text through nlpHandlers.js
Entity extraction is performed using entityExtractor.js, which identifies both standard entities (like dates, organizations) and custom domain-specific entities (energy types)
Intent classification occurs in intentClassifier.js using pattern matching against predefined intent patterns
Sentiment analysis is performed by sentimentAnalyzer.js using a combination of sentiment libraries
Context management in contextManager.js tracks conversation history and analyzes context
Intent Classification:

The system uses pattern matching for intent recognition
It has a special direct topic matcher for short queries about energy types
Intents are ranked by confidence scores and priority calculations
Context from previous interactions influences intent classification
Context Management:

Maintains conversation history for each user
Tracks entities, intents, and sentiment across the conversation
Identifies follow-up questions based on time proximity, shared entities, and related intents
Builds topic chains to understand how the conversation evolves
Tracks sentiment trends throughout the conversation
Sentiment Analysis:

Uses multiple sentiment libraries including sentiment.js and multilang-sentiment
Performs fuzzy pattern matching for sentiment words
Caches results for performance optimization
Classifies sentiment as positive, negative, or neutral based on configurable thresholds
This sophisticated NLP pipeline allows the chatbot to:

Understand user intents related to energy data
Track conversation context for coherent multi-turn interactions
Extract relevant entities for data retrieval
Gauge user sentiment to adjust responses accordingly



bot knows:
greetings 
definitions
relationships
farewells
death ends
fetch data to anwser users with stats

Bot Capabilities:

1. Conversation Skills:
   - Greetings and farewells
   - Gratitude recognition
   - Question understanding
   - Follow-up questions
   - Empathy and reassurance phrases
   - Contextual responses
   - Multi-turn conversations

2. Knowledge Base:
   - Energy definitions and terminology
   - Relationships between energy types
   - Energy production and consumption data
   - Trade-related information (imports/exports)
   - Historical trends and patterns
   - Country-specific energy data
   - Dataset mappings and units

3. Language Processing:
   - Intent recognition
   - Entity extraction
   - Sentiment analysis
   - Context management
   - Multi-language support (en, fr, de)
   - Affirmative/negative response detection
   - Question pattern recognition

4. Data Analysis:
   - Energy type classification
   - Unit conversions (KTOE, THS_T)
   - Trend analysis
   - Comparative analysis
   - Visualization suggestions
   - Dataset information retrieval

5. Response Generation:
   - Dynamic message formatting
   - Smart suggestions
   - Progressive information disclosure
   - Error handling and recovery
   - Unknown topic handling
   - Welcome messages
   - Prompt suggestions

6. Visualization Capabilities:
   - Chart type selection
   - Data transformation
   - Multi-format visualization
   - Interactive elements
   - Responsive layouts
