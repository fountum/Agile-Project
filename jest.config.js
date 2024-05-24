module.exports = {
  verbose: true,
  collectCoverage: true,
  coverageReporters: ["text", "lcov"],
  coverageThreshold: {
    "./models/userModel.js": {
      statements: 75,
      branches: 75,
      functions: 75,
      lines: 75
    },
    "./models/reminderModel.js": {
      statements: 75,
      branches: 75,
      functions: 75,
      lines: 75
    }
  }
};