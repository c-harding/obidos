/* eslint-env node */

module.exports = {
  coverageDirectory: "./.coverage/",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  testLocationInResults: true,
  coverageReporters: ["text", ["lcov", { projectRoot: ".." }]],
  testRegex: "/test/.*\\.spec\\.ts",
  preset: "ts-jest",
  testEnvironment: "node",
};
