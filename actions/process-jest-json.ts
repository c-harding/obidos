import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import type { FormattedTestResults } from "@jest/test-result/build/types";
import { readFile } from "fs/promises";
import { resolve } from "path";

type Annotation = {
  annotation_level: "failure" | "notice" | "warning";
  end_column?: number | undefined;
  end_line: number;
  message: string;
  path: string;
  raw_details?: string | undefined;
  start_column?: number | undefined;
  start_line: number;
  title?: string | undefined;
};

type KeysOfType<T, TProp> = NonNullable<
  {
    [P in keyof T]: T[P] extends TProp ? P : never;
  }[keyof T]
>;

function getAnnotations(results: FormattedTestResults, cwd: string): Annotation[] {
  return results.testResults.flatMap((result) =>
    result.assertionResults
      .filter((assertion) => assertion.status === "failed")
      .map((assertion) => ({
        path: result.name.replace(cwd, ""),
        start_line: assertion.location?.line ?? 0,
        end_line: assertion.location?.line ?? 0,
        annotation_level: "failure",
        title: assertion.ancestorTitles.concat(assertion.title).join(" › "),
        message: assertion.failureMessages?.join("\n\n") ?? "",
      })),
  );
}

async function readJestFile(path: string): Promise<FormattedTestResults> {
  return JSON.parse(await readFile(path, "utf-8"));
}

async function combineAnnotations(
  jestFilePromises: Promise<FormattedTestResults>[],
  root: string,
): Promise<Annotation[]> {
  return (
    await Promise.all(
      jestFilePromises.map(async (jestFilePromise) =>
        getAnnotations(await jestFilePromise, root),
      ),
    )
  ).flat();
}

function getSha(): string {
  return context.payload.pull_request?.head.sha ?? context.sha;
}

function getOutputText(results: FormattedTestResults[]) {
  const entries = results
    .flatMap((result) => result.testResults)
    .map((r) => r.message)
    .filter(Boolean);
  return "```\n" + entries.join("\n").trimRight() + "\n```";
}

async function main([, , ...paths]: string[]): Promise<void> {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (token === undefined) {
      core.error("GITHUB_TOKEN not set.");
      core.setFailed("GITHUB_TOKEN not set.");
      return;
    }

    const root = resolve(__dirname, "..");

    const jestFilePromises = paths.map((path) => readJestFile(resolve(root, path)));

    const annotationsPromise = combineAnnotations(jestFilePromises, root);

    const octokit = getOctokit(token);

    const jestFiles = await Promise.all(jestFilePromises);

    const success = jestFiles.every((file) => file.success);
    type SummaryKey = KeysOfType<FormattedTestResults, number>;
    const summaryKeys: SummaryKey[] = [
      "numPassedTests",
      "numPassedTestSuites",
      "numFailedTests",
      "numFailedTestSuites",
    ];
    const summary = Object.fromEntries(
      summaryKeys.map((summaryKey) => [
        summaryKey,
        jestFiles.map((jestFile) => jestFile[summaryKey]).reduce((a, b) => a + b, 0),
      ]),
    ) as Record<SummaryKey, number>;

    const summaryText = success
      ? `${summary.numPassedTests} tests passing in ${summary.numPassedTestSuites} suite${
          summary.numPassedTestSuites > 1 ? "s" : ""
        }.`
      : `Failed tests: ${summary.numFailedTests}/${summary.numTotalTests}. Failed suites: ${summary.numFailedTests}/${summary.numTotalTestSuites}.`;

    // Checks
    await octokit.checks.create({
      ...context.repo,
      head_sha: getSha(),
      name: "Test results",
      status: "completed",
      conclusion: success ? "success" : "failure",
      output: {
        title: success ? "Jest tests passed" : "Jest tests failed",
        text: success ? "" : getOutputText(jestFiles),
        summary: summaryText,
        annotations: await annotationsPromise,
      },
    });
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
}

if (require.main === module) {
  main(process.argv).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
