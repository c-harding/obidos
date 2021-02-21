/* eslint-env node */

module.exports = {
  coverageDirectory: "./.coverage/",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  reporters: ["default", "jest-junit"],
  coverageReporters: ["text", ["lcov", { projectRoot: ".." }]],
  testRegex: "/test/.*\\.spec\\.ts",
  preset: "ts-jest",
  testEnvironment: "node",
};
