module.exports = {
  /* setupFilesAfterEnv: ['./test-setup.js'], */

  

  coverageReporters: ["lcov", "html"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "dist",
    "build",
    ".storybook",
    ".stories",
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },

  setupFiles: ["dotenv/config"],
};
