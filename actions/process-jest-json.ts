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

    const success = Promise.all(jestFilePromises).then((array) =>
      array.every((jestFile) => jestFile.success),
    );

    // Checks
    await octokit.checks.create({
      ...context.repo,
      head_sha: getSha(),
      name: "Test results",
      status: "completed",
      conclusion: (await success) ? "success" : "failure",
      output: await annotationsPromise,
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
