const {defaults} = require('jest-config');
module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: [...defaults.testPathIgnorePatterns, '/testUtils/']
};