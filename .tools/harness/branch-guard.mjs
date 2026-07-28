import { spawnSync } from "node:child_process";
import { existsSync, realpathSync } from "node:fs";
import { resolve, sep } from "node:path";

import { integrationBranch } from "./config.mjs";

function git(args) {
  const result = spawnSync("git", ["-c", "safe.directory=*", ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || "git command failed").trim());
  }

  return result.stdout.trim();
}

function resolveBranch() {
  if (process.env.GITHUB_HEAD_REF) {
    return process.env.GITHUB_HEAD_REF;
  }
  if (process.env.GITHUB_REF_TYPE === "branch" && process.env.GITHUB_REF_NAME) {
    return process.env.GITHUB_REF_NAME;
  }
  return git(["branch", "--show-current"]);
}

try {
  const root = git(["rev-parse", "--show-toplevel"]);
  const branch = resolveBranch();

  if (branch !== integrationBranch) {
    throw new Error(
      `Wrong branch: ${branch || "(detached HEAD)"}. Expected ${integrationBranch}.`,
    );
  }

  git(["diff", "--check"]);

  if (process.env.HARNESS_REQUIRES_BUILD === "1") {
    const dependencies = resolve(root, "node_modules");
    if (existsSync(dependencies)) {
      const realRoot = realpathSync(root);
      const realDependencies = realpathSync(dependencies);
      const insideRoot = realDependencies
        .toLowerCase()
        .startsWith(`${realRoot.toLowerCase()}${sep}`);

      if (!insideRoot) {
        throw new Error(
          `node_modules resolves outside this worktree (${realDependencies}). Next/Turbopack production builds require worktree-local dependencies.`,
        );
      }
    }
  }

  const status = git(["status", "--short"]);
  const entries = status ? status.split(/\r?\n/) : [];
  const ignoredArtifacts = entries.filter((line) =>
    /(?:^|\s)(?:\.preview-.*\.log|debug\.log|\.next\/|test-results\/|playwright-report\/)/.test(
      line,
    ),
  );
  const relevantEntries = entries.filter((line) => !ignoredArtifacts.includes(line));

  console.log(`[branch-guard] PASS ${integrationBranch}`);
  console.log(`[branch-guard] root: ${root}`);
  console.log(`[branch-guard] relevant working-tree entries: ${relevantEntries.length}`);
  for (const entry of relevantEntries) {
    console.log(`[branch-guard]   ${entry}`);
  }
} catch (error) {
  console.error(`[branch-guard] FAIL ${error.message}`);
  process.exitCode = 1;
}
