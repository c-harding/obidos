# Óbidos: CLI Player

This package contains a few scripts used in the CI process for Óbidos.
Eventually they will be released as separate GitHub Actions.

## Scripts

`yarn process-eslint-json` processes the output of ESLint, and uploads it to GitHub as a commit check.

`yarn process-jest-json` processes the output of Jest, and uploads it to GitHub as a commit check.

## Development

`yarn` installs packages.

`yarn check` checks the codes for errors, without changing anything.

`yarn lint` reformats the code, and prints any warnings and errors.

When developing, Visual Studio Code is recommended.
Please ensure you typecheck and lint your code before committing.
This happens automatically on save with Visual Studio Code.
