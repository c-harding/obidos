import { resolve } from "path";

import type { ESLintFileReport } from "@obidos/actions/eslint-json-format";
import type { Annotation, KeysOfType } from "@obidos/actions/read-config-file";
import { count, readJsonFile, withGitHub } from "@obidos/actions/read-config-file";

function getAnnotations(fileReports: ESLintFileReport[], cwd: string): Annotation[] {
  return fileReports.flatMap((fileReport) =>
    fileReport.messages.map<Annotation>((lintError) => ({
      path: fileReport.filePath.replace(cwd, ""),
      start_line: lintError.line,
      end_line: lintError.endLine,
      annotation_level: lintError.severity === 2 ? "failure" : "warning",
      title: lintError.ruleId,
      message: lintError.message,
    })),
  );
}

async function combineAnnotations(
  eslintFilePromises: Promise<ESLintFileReport[]>[],
  root: string,
): Promise<Annotation[]> {
  return (
    await Promise.all(
      eslintFilePromises.map(async (eslintFilePromise) =>
        getAnnotations(await eslintFilePromise, root),
      ),
    )
  ).flat();
}

const errorsAndWarnings = (errors: number, warnings: number) =>
  `${count(errors, "error")} and ${count(warnings, "warning")}`;

const capitalize = (word: string) => word.charAt(0).toUpperCase + word.slice(1);

const buildSentence = (...clauses: (string | false | undefined)[]) =>
  capitalize(clauses.filter(Boolean).join(", ") + ".");

const main = ([, , ...paths]: string[]) =>
  withGitHub(async () => {
    const root = resolve(__dirname, "..");

    const eslintFilePromises = paths.map((path) =>
      readJsonFile<ESLintFileReport[]>(resolve(root, path)),
    );

    const annotationsPromise = combineAnnotations(eslintFilePromises, root);

    const eslintFiles = (await Promise.all(eslintFilePromises)).flat();

    const success = eslintFiles.length === 0;
    if (!success) console.log(eslintFiles);

    type SummaryKey = KeysOfType<ESLintFileReport, number>;
    const summaryKeys: SummaryKey[] = [
      "errorCount",
      "warningCount",
      "fixableErrorCount",
      "fixableWarningCount",
    ];
    const summary = Object.fromEntries(
      summaryKeys.map((summaryKey) => [
        summaryKey,
        eslintFiles
          .map((eslintFileReport) => eslintFileReport[summaryKey])
          .reduce((a, b) => a + b, 0),
      ]),
    ) as Record<SummaryKey, number>;

    const summaryText = success
      ? `No lint errors found.`
      : buildSentence(
          `${errorsAndWarnings(summary.errorCount, summary.warningCount)} found`,
          summary.fixableWarningCount === 0 &&
            `of which ${errorsAndWarnings(
              summary.fixableErrorCount,
              summary.fixableWarningCount,
            )} are fixable.`,
        );

    return {
      name: "Lint results",
      status: "completed",
      conclusion: success ? "success" : "failure",
      output: {
        title: success ? "ESLint passed" : "ESLint failed",
        summary: summaryText,
        annotations: await annotationsPromise,
      },
    };
  });

if (require.main === module) {
  main(process.argv).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
