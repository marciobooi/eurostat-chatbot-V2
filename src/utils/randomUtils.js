/**
 * Utility functions for random selections
 */

/**
 * Get a random element from an array
 * @param {Array} array - The array to select from
 * @returns {*} A random element from the array
 */
export const getRandomElement = (array) => {
  if (!Array.isArray(array) || array.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};