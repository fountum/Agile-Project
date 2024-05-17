module.exports = {
    verbose: true,
    collectCoverage: true,
    coverageReporters: ["text", "lcov"],
     coverageThreshold: {
        "./controller/reminder_controller.js": {
            statements: 95,
            branches: 95,
            functions: 95,
            lines: 95
          },
          "./models/userModel.js": {
            statements: 95,
            branches: 95,
            functions: 95,
            lines: 95
          }
        }
      };

  