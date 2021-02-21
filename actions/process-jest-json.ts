import type { FormattedTestResults } from "@jest/test-result/build/types";
import { resolve } from "path";

import type { Annotation, KeysOfType } from "@obidos/actions/read-config-file";
import { count, readJsonFile, withGitHub } from "@obidos/actions/read-config-file";

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

class Tree {
  entries: Tree[] = [];

  constructor(readonly label: string) {}

  get last(): Tree | undefined {
    return this.entries[this.entries.length - 1];
  }

  add(value: string, path: string[] = []): this {
    if (path.length === 0) {
      this.entries.push(new Tree(value));
    } else {
      const [next, ...rest] = path;
      if (next === this.last?.label) this.last.add(value, rest);
      else this.entries.push(new Tree(next).add(value, rest));
    }
    return this;
  }

  toString(): string {
    return this.entries
      .map((entry) => `${entry}\n${entry.toString().replace("\n", "\n  ")}`)
      .join("\n");
  }
}

function listToTree(results: FormattedTestResults): Tree {
  const tree = new Tree("");
  for (const test of results.testResults) {
    const subtree = tree.add(test.name);
    for (const assertion of test.assertionResults) {
      const testSuffix =
        assertion.status === "passed" ? "" : ` (${assertion.status.toUpperCase()})`;
      const testTree = subtree.add(
        assertion.title + testSuffix,
        assertion.ancestorTitles,
      );
      for (const message of assertion.failureMessages ?? []) testTree.add(message);
    }
  }
  return tree;
}

function getOutputText(results: FormattedTestResults[], success: boolean) {
  let failureBlock = "";
  if (!success) {
    const entries = results
      .flatMap((result) => result.testResults)
      .map((r) => r.message)
      .filter(Boolean);
    failureBlock = "```\n" + entries.join("\n").trimRight() + "\n```";
  }
  const fullTestOutput = results.map(listToTree).join("\n\n");
  return (
    "<details><summary>Full list of tests</summary>\n\n```" +
    fullTestOutput +
    "```\n\n</details>\n\n" +
    failureBlock
  );
}

const main = ([, , ...paths]: string[]) =>
  withGitHub(async () => {
    const root = resolve(__dirname, "..");

    const jestFilePromises = paths.map((path) =>
      readJsonFile<FormattedTestResults>(resolve(root, path)),
    );

    const annotationsPromise = combineAnnotations(jestFilePromises, root);

    const jestFiles = await Promise.all(jestFilePromises);

    const success = jestFiles.every((file) => file.success);
    type SummaryKey = KeysOfType<FormattedTestResults, number>;
    const summaryKeys: SummaryKey[] = [
      "numPassedTests",
      "numPassedTestSuites",
      "numFailedTests",
      "numFailedTestSuites",
      "numTotalTests",
      "numTotalTestSuites",
    ];
    const summary = Object.fromEntries(
      summaryKeys.map((summaryKey) => [
        summaryKey,
        jestFiles.map((jestFile) => jestFile[summaryKey]).reduce((a, b) => a + b, 0),
      ]),
    ) as Record<SummaryKey, number>;

    const summaryText = success
      ? `${count(summary.numPassedTests, "test")} passing in ${count(
          summary.numPassedTestSuites,
          "suite",
        )}.`
      : `Failed tests: ${summary.numFailedTests}/${summary.numTotalTests}. Failed suites: ${summary.numFailedTestSuites}/${summary.numTotalTestSuites}.`;

    return {
      name: "Test results",
      status: "completed",
      conclusion: success ? "success" : "failure",
      output: {
        title: success ? "Jest tests passed" : "Jest tests failed",
        text: getOutputText(jestFiles, success),
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
