/**
 * Get a random item from an array
 * @param {Array} array - The array to get a random item from
 * @returns {*} A random item from the array
 */
export const getRandomFromArray = (array) => {
  if (!Array.isArray(array) || array.length === 0) return null;
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

/**
 * Get a random number between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number between min and max
 */
export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Randomly shuffle an array
 * @param {Array} array - The array to shuffle
 * @returns {Array} New shuffled array
 */
export const shuffleArray = (array) => {
  if (!Array.isArray(array)) return [];
  return [...array].sort(() => Math.random() - 0.5);
};
