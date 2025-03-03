/**
 * Pure utility functions for randomization
 * No hardcoded responses - only utility functions
 */

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

/**
 * Get a random boolean with specified probability
 * @param {number} probability - Probability of true (0-1)
 * @returns {boolean} Random boolean
 */
export const getRandomBoolean = (probability = 0.5) => {
  return Math.random() < probability;
};

/**
 * Pick a random key from an object
 * @param {Object} obj - Object to pick a key from
 * @returns {string|null} Random key or null if object is empty
 */
export const getRandomKey = (obj) => {
  if (!obj || typeof obj !== "object") return null;
  const keys = Object.keys(obj);
  return keys.length > 0 ? keys[Math.floor(Math.random() * keys.length)] : null;
};
