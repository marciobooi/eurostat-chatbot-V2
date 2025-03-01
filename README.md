# Eurostat Energy Chatbot

A React-based multilingual chatbot designed to provide information about energy-related topics using Eurostat data. Built with React and Vite.

## Technical Overview

### Core Features
- Multilingual support (English, French, German)
- Natural language processing for query understanding
- Context-aware conversations
- Smart suggestions system
- Chat history management
- Typing indicators and AI-like behavior simulation
- Responsive design with accessibility features

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
   - Handles scrolling behavior and message visibility

2. **Natural Language Processing (utils/)**
   - `nlpHelper.js`: Topic extraction from user queries
   - `tokenMatcher.js`: Calculates match scores for topic identification
   - `contextManager.js`: Maintains conversation context
   - `analyticsManager.js`: Tracks user interactions and topic popularity

3. **Data Management**
   - `energyDictionary.js`: Multilingual knowledge base with:
     - Topic definitions
     - Keywords and synonyms
     - Related topics
     - External reference links
   - `chatHistory.js`: Persistent chat storage
   - `cookies.js`: Language preference management

4. **UI Components**
   - ChatMessage: Individual message rendering
   - TypingIndicator: Simulates bot typing
   - SmartSuggestions: Related topic suggestions
   - ScrollButton: Navigation aid
   - ShowMoreHistory: Chat history loading

### Intelligent Features

1. **Smart Response System**
   - Minimum match score threshold (20%)
   - Keyword and synonym matching
   - Base topic extraction
   - Related topics suggestions

2. **User Experience**
   - Dynamic typing simulation based on message length
   - Thinking time simulation for natural interactions
   - Persistent chat history
   - Progressive message loading
   - Smooth scrolling behavior

3. **Internationalization**
   - i18next integration
   - Automatic language detection
   - Language-specific responses
   - Multilingual topic matching

### Project Structure
```
src/
├── components/     # React UI components
├── data/          # Knowledge base and responses
├── utils/         # Helper functions and managers
├── locales/       # Translation files
└── hooks/         # Custom React hooks
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
