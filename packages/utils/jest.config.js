
module.exports = {
  // Stop running tests after `n` failures
  bail: true,
  verbose: true,
  /* "transform": {
     "\\.[jt]sx?$": "babel-jest",
   },
   */
  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  //testPathIgnorePatterns: ["/node_modules/"],

  // The test environment that will be used for testing
  // testEnvironment: "jest-environment-node",
  // testEnvironment: "jest-environment-jsdom",

  moduleNameMapper: {
    // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
    "uuid": require.resolve('uuid'),
  }

}   