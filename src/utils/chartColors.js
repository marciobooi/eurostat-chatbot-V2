export const chartColors = {
  primary: '#0E47CB',
  secondary: '#FFA629',
  tertiary: '#24B9B9',
  quaternary: '#FF6B6B',
  grid: '#E9ECEF',
  text: '#495057',
  textSecondary: '#6B7280',
  
  // Gradient palettes
  blues: ['#0E47CB', '#1E56D6', '#2E66E1', '#3E75EC', '#4E85F7'],
  bluesHover: ['#1651D4', '#2860DE', '#3870E9', '#487FF3', '#588FFF'],
  
  // Utility function to get color with opacity
  withOpacity: (color, opacity) => {
    return `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
  }
};