import { getOctokit } from "@actions/github";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { readFile } from "fs/promises";

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

export async function readJsonFile<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf-8"));
}
import * as core from "@actions/core";

export interface CreateCheckOutput {
  title: string;
  text: string;
  summary: string;
  annotations: Annotation[];
}
export type CreateCheckParams = RestEndpointMethodTypes["checks"]["create"]["parameters"] & {
  output: CreateCheckOutput;
};

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

    await octokit.checks.create(await handler());
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
}
