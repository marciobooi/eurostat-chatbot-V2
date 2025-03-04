# Visualization System Documentation

## Overview

The visualization system in the Eurostat Energy Chatbot provides interactive data visualizations using Chart.js with a consistent Eurostat design language and smooth user experience.

## Components

### 1. Chart Components
Located in `src/components/charts/`:
- `PieChart.jsx`: Doughnut-style chart for distribution data
- `LineChart.jsx`: Time series visualization
- `BarChart.jsx`: Comparative data visualization
- `AreaChart.jsx`: Stacked area chart for cumulative data

### 2. Features Common to All Charts
- Interactive tooltips with custom styling
- Side legend with hover effects
- Smooth animations and transitions
- Responsive design
- Accessibility support with ARIA labels
- i18n support for all text elements
- Eurostat source attribution

### 3. Chart Types

#### Pie/Doughnut Chart
- Use case: Distribution data
- Features:
  - 75% cutout ratio for modern doughnut style
  - Interactive segment hover effects
  - Custom tooltips with percentage values
  - Side legend with value indicators
  - Color gradient scale based on Eurostat blue

#### Line Chart
- Use case: Time series data
- Features:
  - Smooth curved lines with tension
  - Interactive data points
  - Area fill with transparency
  - Year-based x-axis
  - Responsive grid lines
  - Hover effects on points

#### Bar Chart
- Use case: Comparative data
- Features:
  - Rounded corners on bars
  - Color gradient for multiple bars
  - Custom hover effects
  - Value tooltips
  - Categorical x-axis
  - Side legend with bar indicators

#### Area Chart
- Use case: Cumulative or stacked data
- Features:
  - Stacked area display
  - Dual color scheme for pipeline/LNG
  - Combined value tooltips
  - Year-based x-axis
  - Interactive hover effects
  - Dual legend indicators

## Styling

### Color Palette
```css
/* Primary Colors */
--eurostat-blue: #0E47CB;
--eurostat-orange: #FFA629;

/* Color Variations */
--blue-hover: #1651D4;
--blue-gradient: ['#0E47CB', '#1E56D6', '#2E66E1', '#3E75EC', '#4E85F7'];

/* UI Colors */
--background: #F8F9FA;
--grid: #E9ECEF;
--text: #495057;
--text-secondary: #6B7280;
```

### Typography
- Font Stack: Inter, system-ui, sans-serif
- Font Sizes:
  - Labels: 0.875rem (14px)
  - Values: 0.75rem (12px)
  - Tooltips: 13px
  - Chart text: 12px

### Layout
- Chart Container:
  - Padding: 1.5rem
  - Border Radius: 12px
  - Background: White
  - Shadow: 0 4px 6px rgba(14, 71, 203, 0.05)

- Legend:
  - Width: 200px
  - Gap: 0.75rem
  - Item Padding: 0.5rem
  - Border Radius: 6px

### Animations
- Chart Entry: 1000ms easeOutQuart
- Hover Effects: 200ms ease
- Progressive Loading: 200ms stagger
- Tooltip: 200ms fade

### Responsive Design
- Breakpoints:
  - Mobile: 640px
  - Tablet: 768px
  - Desktop: > 768px

- Mobile Adaptations:
  - Stacked layout (chart above legend)
  - Reduced padding: 1rem
  - Adjusted chart height: 250px
  - Centered legends
  - Optimized touch targets

## Usage Example

```jsx
<Visualization
  type="pie"
  data={[
    { name: "Germany", value: 25.4 },
    { name: "France", value: 19.2 },
    { name: "Italy", value: 17.8 }
  ]}
  description="Distribution of energy consumption across major European countries"
/>
```

## Best Practices

### 1. Chart Selection
- Pie/Doughnut: Use for parts of a whole (≤6 segments)
- Line: Use for trends and time series data
- Bar: Use for comparisons across categories
- Area: Use for stacked/cumulative data over time

### 2. Data Presentation
- Round numerical values for cleaner display
- Use consistent units within each chart
- Provide clear, concise descriptions
- Include data source attribution

### 3. Accessibility
- Include ARIA labels for charts
- Provide text alternatives
- Ensure sufficient color contrast
- Support keyboard navigation

### 4. Performance
- Lazy load chart components
- Use CSS transforms for animations
- Implement responsive images
- Optimize render performance

### 5. Internationalization
- Use translation keys for all text
- Support RTL layouts
- Format numbers according to locale
- Use locale-specific date formats