/**
 * Utility functions for randomization and selections
 */

/**
 * Get a random item from an array
 * @param {Array} array - The array to select from
 * @param {Object} options - Options for selection
 * @param {boolean} options.removeItem - Whether to remove the selected item from the array
 * @returns {*} A random item from the array
 */
export const getRandomFromArray = (array, options = {}) => {
  if (!array || !Array.isArray(array) || array.length === 0) {
    console.warn("getRandomFromArray called with invalid or empty array");
    return null;
  }

  const index = Math.floor(Math.random() * array.length);
  const item = array[index];

  if (options.removeItem) {
    array.splice(index, 1);
  }

  return item;
};

/**
 * Get a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} A new shuffled array
 */
export const shuffleArray = (array) => {
  if (!array || !Array.isArray(array)) {
    return [];
  }

  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

export default {
  getRandomFromArray,
  getRandomInt,
  shuffleArray,
};
