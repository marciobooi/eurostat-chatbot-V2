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
