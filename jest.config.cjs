// jest.config.js
module.exports = {
  testEnvironment: 'jsdom', // Good default for React apps
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Transpile .js and .jsx files using babel-jest
  },
  moduleNameMapper: {
    // Handle CSS Modules or other static assets if they cause import errors in tests
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  // Paths to ignore when running tests
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/utils/test.js' // Ignore the custom test runner script
  ],
};
