/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

/**
 * Set a cookie with the given name and value
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Number of days until cookie expires
 */
export const setCookie = (name, value, days = 30) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
};

/**
 * Delete a cookie by setting its expiration to the past
 * @param {string} name - Cookie name to delete
 */
export const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
};

/**
 * Check if cookies are enabled in the browser
 * @returns {boolean} True if cookies are enabled
 */
export const areCookiesEnabled = () => {
  try {
    // Create a test cookie
    setCookie("test_cookie", "test", 1);
    // Check if the cookie exists
    const cookieEnabled = getCookie("test_cookie") === "test";
    // Delete the test cookie
    deleteCookie("test_cookie");
    return cookieEnabled;
  } catch (e) {
    return false;
  }
};
