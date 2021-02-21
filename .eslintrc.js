module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "unused-imports",
    "simple-import-sort",
    "import",
    "import-alias",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/no-namespace": "off",
    curly: ["error", "multi-line"],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
      },
    ],
    "import-alias/import-alias": [
      "error",
      {
        rootDir: __dirname,
        aliases: [
          {
            alias: "@obidos/",
            matcher: "^",
          },
        ],
      },
    ],
    "simple-import-sort/imports": [
      "warn",
      {
        groups: [["^\\u0000"], ["^"], ["^@?(?!obidos)\\w"], ["^@obidos", "^\\."]],
      },
    ],
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-unnecessary-condition": "warn",
    "unused-imports/no-unused-imports-ts": "warn",
    "import/no-duplicates": "warn",
    "import/newline-after-import": "warn",
  },
};
