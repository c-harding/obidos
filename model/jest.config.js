/* eslint-env node */
module.exports = {
  coverageDirectory: "./.coverage/",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  testRegex: "/test/.*\\.spec\\.ts",
  preset: "ts-jest",
  testEnvironment: "node",
};
