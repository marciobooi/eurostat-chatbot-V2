# Visualization System Documentation

## Overview

The visualization system in the Eurostat Energy Chatbot provides interactive data visualizations with a consistent design language and smooth user experience.

## Components

### 1. Visualization Component
`src/components/Visualization.jsx`
- Renders different chart types using Recharts
- Handles responsive layouts
- Manages animations and transitions
- Provides interactive tooltips

### 2. Message Flow
The visualization system follows a natural conversation flow:
1. Initial topic response
2. Delayed visualization options (2s delay)
3. Interactive visualization selection
4. Progressive disclosure of remaining options
5. Topic transition suggestions

### 3. Chart Types

#### Pie Chart
- Use case: Distribution data
- Features:
  - Percentage labels
  - Custom tooltips
  - Eurostat color scheme
  - Animated segments

#### Line Chart
- Use case: Time series data
- Features:
  - Smooth curves
  - Interactive data points
  - Grid lines
  - Y-axis auto-scaling

#### Bar Chart
- Use case: Comparative data
- Features:
  - Rounded corners
  - Category labels
  - Value tooltips
  - Color gradients

#### Area Chart
- Use case: Cumulative or stacked data
- Features:
  - Stacked areas
  - Gradient fills
  - Interactive regions
  - Legend support

## Styling

### Color Palette
```css
--eurostat-blue: #0E47CB;
--eurostat-orange: #FFA629;
--eurostat-teal: #24B9B9;
--eurostat-coral: #FF6B6B;
--background: #F8F9FA;
--grid: #E9ECEF;
--text: #495057;
```

### Animations
- Chart entry: 0.5s ease-out
- Button animations: 0.3s ease
- Progressive loading: 0.2s delay between items
- Tooltip: 0.2s fade

### Responsive Behavior
- Desktop: Full-width charts with padding
- Tablet: Adjusted padding and font sizes
- Mobile: Stacked layout with optimized touch targets

## Usage Example

```jsx
<Visualization
  type="pie"
  data={[
    { name: "Germany", value: 112.5 },
    { name: "France", value: 78.9 }
  ]}
  description="Distribution of oil consumption across top European countries"
/>
```

## Localization

Visualization texts are managed through i18next with support for:
- English (en)
- French (fr)
- German (de)

Keys are organized under the "visualization" namespace in locale files.

## Best Practices

1. Chart Selection
   - Use pie charts for parts of a whole
   - Use line charts for trends over time
   - Use bar charts for comparisons
   - Use area charts for cumulative data

2. Data Presentation
   - Limit pie charts to 4-6 segments
   - Use consistent units
   - Provide clear descriptions
   - Include data source references

3. Accessibility
   - Maintain color contrast
   - Provide text alternatives
   - Support keyboard navigation
   - Include ARIA labels

4. Performance
   - Lazy load visualizations
   - Optimize data structures
   - Cache chart configurations
   - Use memoization for complex calculations