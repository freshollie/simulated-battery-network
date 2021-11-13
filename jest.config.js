const {config} = require('./jest.base');

module.exports = {
  projects: ['<rootDir>/services/*/jest.config.js'],
  ...config,
};
