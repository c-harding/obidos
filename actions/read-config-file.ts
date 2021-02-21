import { context, getOctokit } from "@actions/github";
import { readFile } from "fs/promises";

/** Get all the keys of an object such that the value is of the given type. */
export type KeysOfType<T, TProp> = NonNullable<
  {
    [P in keyof T]: T[P] extends TProp ? P : never;
  }[keyof T]
>;

export type Annotation = {
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

export function count(n: number, singular: string, plural?: string): string {
  const computedPlural = plural || singular + "s";
  if (n === 1) return `${n} ${singular}`;
  else if (n === 0) return `no ${computedPlural}`;
  else return `${n} ${computedPlural}`;
}

export async function readJsonFile<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf-8"));
}
import * as core from "@actions/core";

export interface CreateCheckOutput {
  title: string;
  summary: string;
  text?: string;
  annotations: Annotation[];
}
export interface CreateCheckParams {
  name: string;
  status: "completed";
  conclusion: "success" | "failure";
  output: CreateCheckOutput;
}

function getSha(): string {
  return context.payload.pull_request?.head.sha ?? context.sha;
}

export async function withGitHub(
  handler: () => Promise<CreateCheckParams> | CreateCheckParams,
): Promise<void> {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (token === undefined) {
      core.error("GITHUB_TOKEN not set.");
      core.setFailed("GITHUB_TOKEN not set.");
      return;
    }

    const octokit = getOctokit(token);

    await octokit.checks.create({
      ...context.repo,
      head_sha: getSha(),
      ...(await handler()),
    });
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
}

export function readFlags(paths: string[]): [string[], string[]] {
  let literalIndex = paths.indexOf("--");
  if (literalIndex === -1) literalIndex = paths.length;
  const filePaths = paths.filter((term, i) => i > literalIndex || !term.startsWith("-"));
  const flags = paths.filter((term, i) => i < literalIndex && term.startsWith("-"));
  return [flags, filePaths];
}
