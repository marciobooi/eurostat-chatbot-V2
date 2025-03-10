/**
 * Chart color configuration and utility functions
 */

// Main chart colors
export const chartColors = {
    // Primary color and variations
    primary: '#0E47CB',
    primaryLight: '#4B7BE5',
    primaryDark: '#0A329E',

    // Blues array for multi-color charts (pie, bar)
    blues: [
        '#0E47CB',
        '#4B7BE5',
        '#7596E8',
        '#9FB5F0',
        '#C8D4F7',
        '#E1E8FB'
    ],

    // Hover colors for interactive elements
    bluesHover: [
        '#0A329E',
        '#3B62B8',
        '#5D78BA',
        '#8191C0',
        '#A0AFC7',
        '#B4BFD9'
    ],

    // Layout colors
    background: '#FFFFFF',
    grid: '#E5E7EB',
    text: '#374151',

    // Utility function to add opacity to any color
    withOpacity: (color, opacity) => {
        // If color is in hex format, convert to rgba
        if (color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        // If color is already in rgb/rgba format
        if (color.startsWith('rgb')) {
            return color.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
        }
        return color;
    }
};

export default chartColors;