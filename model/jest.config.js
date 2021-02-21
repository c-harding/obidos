/* eslint-env node */

module.exports = {
  coverageDirectory: "./.coverage/",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  reporters: [
    "default",
    [
      "jest-junit",
      {
        suiteName: "@obidos/model",
        suiteNameTemplate: "{filepath}",
        classNameTemplate: "{classname}",
        ancestorSeparator: " › ",
        titleTemplate: "{title}",
      },
    ],
  ],
  coverageReporters: ["text", ["lcov", { projectRoot: ".." }]],
  testRegex: "/test/.*\\.spec\\.ts",
  preset: "ts-jest",
  testEnvironment: "node",
};
