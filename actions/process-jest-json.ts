import type { FormattedTestResults } from "@jest/test-result/build/types";

import type {
  Annotation,
  CreateCheckParams,
  KeysOfType,
} from "@obidos/actions/read-config-file";
import {
  count,
  readFlags,
  readJsonFile,
  rootCwd,
  withGitHub,
} from "@obidos/actions/read-config-file";

function getAnnotations(results: FormattedTestResults): Annotation[] {
  return results.testResults.flatMap((result) =>
    result.assertionResults
      .filter((assertion) => assertion.status === "failed")
      .map((assertion) => ({
        path: result.name.replace(rootCwd(), ""),
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
): Promise<Annotation[]> {
  return (
    await Promise.all(
      jestFilePromises.map(async (jestFilePromise) =>
        getAnnotations(await jestFilePromise),
      ),
    )
  ).flat();
}

class Tree {
  readonly entries: Tree[] = [];

  constructor(readonly label: string) {}

  get last(): Tree | undefined {
    return this.entries[this.entries.length - 1];
  }

  private push(next: string) {
    this.entries.push(new Tree(next));
    return this.entries[this.entries.length - 1];
  }

  add(value: string, path: string[] = []): Tree {
    if (path.length === 0) {
      return this.push(value);
    } else {
      const [next, ...rest] = path;
      const last = next === this.last?.label ? this.last : this.push(next);
      last.add(value, rest);
      return last;
    }
  }

  toString(): string {
    return this.entries
      .map((entry) => {
        if (entry.entries.length === 0) return entry.label;
        return `${entry.label}\n${entry.toString().replace(/^(?!\n)/gm, "  ")}`;
      })
      .join("\n");
  }
}

function listToTree(results: FormattedTestResults): Tree {
  const tree = new Tree("");
  for (const test of results.testResults) {
    const subtree = tree.add(test.name.replace(rootCwd(), ""));
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
    "<details><summary>Full list of tests</summary>\n\n```\n" +
    fullTestOutput +
    "\n```\n\n</details>\n\n" +
    failureBlock
  );
}

async function prepareAnnotations(paths: string[]): Promise<CreateCheckParams> {
  const jestFilePromises = paths.map((path) =>
    readJsonFile<FormattedTestResults>(rootCwd(path)),
  );

  const annotationsPromise = combineAnnotations(jestFilePromises);

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
}

async function main([, , ...paths]: string[]) {
  const [flags, filePaths] = readFlags(paths);
  if (flags.includes("--no-github")) {
    console.log(await prepareAnnotations(filePaths));
  } else {
    await withGitHub(() => prepareAnnotations(filePaths));
  }
}

if (require.main === module) {
  main(process.argv).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
