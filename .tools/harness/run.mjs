import { spawnSync } from "node:child_process";
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
import process from "node:process";

import { blockProfiles, integrationBranch } from "./config.mjs";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const node = process.execPath;
const requestedMode = process.argv[2] ?? "preflight";
const blockArg = process.argv.find((argument) => argument.startsWith("--block="));
const requestedBlock = blockArg?.slice("--block=".length);
const startedAt = new Date();
const reportDirectory = resolve(process.cwd(), ".artifacts", "harness");
const lockPath = resolve(reportDirectory, ".lock");
const stages = [];

function capture(executable, args) {
  const result = spawnSync(executable, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: process.platform === "win32" && executable.endsWith(".cmd"),
  });
  return result.status === 0 ? result.stdout.trim() : "";
}

function git(args) {
  return capture("git", ["-c", "safe.directory=*", ...args]);
}

function command(label, executable, args) {
  return { label, executable, args };
}

function changedFiles() {
  const tracked = git(["diff", "--name-only", "HEAD"])
    .split(/\r?\n/)
    .filter(Boolean);
  const untracked = git(["ls-files", "--others", "--exclude-standard"])
    .split(/\r?\n/)
    .filter(Boolean);

  return [...new Set([...tracked, ...untracked])]
    .map((file) => file.replaceAll("\\", "/"))
    .filter(
      (file) =>
        !/^\.artifacts\//.test(file) &&
        !/^\.preview-.*\.log$/.test(file) &&
        file !== "debug.log",
    );
}

function resolveScope(files) {
  if (files.length === 0) {
    return { kind: "clean", mode: "preflight", blocks: [] };
  }

  const sharedPattern =
    /^(?:app\/(?:page|layout)\.tsx|app\/globals\.css|next-env\.d\.ts|package(?:-lock)?\.json|playwright\.config\.ts|vitest(?:\.config|\.setup)?\.ts|next\.config\.ts|tsconfig\.json|\.github\/|\.tools\/harness\/)/;

  if (files.some((file) => sharedPattern.test(file))) {
    return { kind: "full", mode: "release", blocks: [] };
  }

  if (files.every((file) => /^(?:docs\/|README\.md|AGENTS\.md)/.test(file))) {
    return { kind: "docs", mode: "preflight", blocks: [] };
  }

  const blocks = Object.entries(blockProfiles)
    .filter(([, profile]) => {
      const owned = profile.files
        .filter((file) => !["app/page.tsx", "app/globals.css", "app/layout.tsx"].includes(file))
        .map((file) => file.replaceAll("\\", "/"));
      return files.some((file) => owned.includes(file));
    })
    .map(([name]) => name);

  if (blocks.length === 1) {
    return { kind: "block", mode: "block", blocks };
  }

  return { kind: "full", mode: "release", blocks };
}

const currentFiles = changedFiles();
const detectedScope = resolveScope(currentFiles);
const changedFormatFiles = currentFiles.filter(
  (file) =>
    /\.(?:css|js|json|jsx|md|mjs|ts|tsx|yaml|yml)$/.test(file) &&
    !file.startsWith(".tools/"),
);

if (requestedMode === "scope") {
  console.log(
    JSON.stringify(
      {
        branch: git(["branch", "--show-current"]),
        head: git(["rev-parse", "--short", "HEAD"]),
        scope: detectedScope,
        changedFiles: currentFiles,
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

let mode = requestedMode;
let blockName = requestedBlock;

if (requestedMode === "changed") {
  mode = detectedScope.mode;
  blockName = detectedScope.blocks[0];
  console.log(
    `[harness] changed scope: ${detectedScope.kind}${blockName ? ` (${blockName})` : ""}; selected ${mode}`,
  );
}

const preflight = [
  command("integration branch", node, [".tools/harness/branch-guard.mjs"]),
  command("design contract", node, [".tools/harness/design-contract.mjs"]),
];

const quality = [
  ...(changedFormatFiles.length > 0
    ? [
        command("format changed files", npx, [
          "prettier",
          "--check",
          ...changedFormatFiles,
        ]),
      ]
    : []),
  command("lint", npm, ["run", "lint"]),
  command("unit", npm, ["test"]),
  command("typecheck", npm, ["run", "typecheck"]),
];

const ciQuality = [
  command("format", npm, ["run", "format"]),
  command("lint", npm, ["run", "lint"]),
  command("unit", npm, ["test"]),
  command("typecheck", npm, ["run", "typecheck"]),
];

const profiles = {
  preflight,
  quick: [...preflight, ...quality],
  ci: [...preflight, ...ciQuality, command("build", npm, ["run", "build"])],
  functional: [
    ...preflight,
    ...quality,
    command("build", npm, ["run", "build"]),
    command("functional E2E", npx, [
      "playwright",
      "test",
      "--grep-invert",
      "@visual",
      "--workers=1",
    ]),
  ],
  visual: [
    ...preflight,
    command("build", npm, ["run", "build"]),
    command("visual regression", npx, [
      "playwright",
      "test",
      "--grep",
      "@visual",
      "--workers=1",
    ]),
  ],
  release: [
    ...preflight,
    ...quality,
    command("build", npm, ["run", "build"]),
    command("functional E2E", npx, [
      "playwright",
      "test",
      "--grep-invert",
      "@visual",
      "--workers=1",
    ]),
    command("Windows visual regression", npx, [
      "playwright",
      "test",
      "--grep",
      "@visual",
      "--workers=1",
    ]),
    command("manual release gates", node, [".tools/harness/manual-gates.mjs"]),
  ],
};

if (mode === "block") {
  if (!blockName || !blockProfiles[blockName]) {
    console.error(
      `[harness] Unknown or missing block. Use --block=<${Object.keys(blockProfiles).join("|")}>`,
    );
    process.exit(1);
  }

  const block = blockProfiles[blockName];
  const files = [...new Set(block.files)].filter((file) => existsSync(resolve(file)));
  const unit = [...new Set(block.unit)].filter((file) => existsSync(resolve(file)));
  const e2e = [...new Set(block.e2e)].filter((file) => existsSync(resolve(file)));

  profiles.block = [
    ...preflight,
    command(`${blockName} format`, npx, ["prettier", "--check", ...files]),
    command(`${blockName} lint`, npx, [
      "eslint",
      "--max-warnings=0",
      ...files.filter((file) => /\.(?:ts|tsx|js|mjs)$/.test(file)),
    ]),
    command(`${blockName} unit`, npm, ["test", "--", "--run", ...unit]),
    command(`${blockName} typecheck`, npm, ["run", "typecheck"]),
    command(`${blockName} E2E`, npx, [
      "playwright",
      "test",
      ...e2e,
      "--project=desktop-1440",
      "--project=mobile-390",
      "--project=mobile-390-reduced-motion",
      "--workers=1",
    ]),
  ];
}

const selected = profiles[mode];
if (!selected) {
  console.error(
    `[harness] Unknown mode ${mode}. Use scope, changed, preflight, quick, ci, functional, visual, release or block.`,
  );
  process.exit(1);
}

mkdirSync(reportDirectory, { recursive: true });

let lockDescriptor;
const needsLock = !["preflight"].includes(mode);

if (needsLock) {
  try {
    lockDescriptor = openSync(lockPath, "wx");
    writeFileSync(
      lockDescriptor,
      `${JSON.stringify({ pid: process.pid, mode, startedAt: startedAt.toISOString() })}\n`,
      "utf8",
    );
    closeSync(lockDescriptor);
    lockDescriptor = undefined;
  } catch {
    const owner = existsSync(lockPath) ? readFileSync(lockPath, "utf8").trim() : "unknown";
    console.error(`[harness] Another harness run owns ${lockPath}: ${owner}`);
    process.exit(1);
  }
}

function releaseLock() {
  if (needsLock && existsSync(lockPath)) {
    unlinkSync(lockPath);
  }
}

process.once("SIGINT", () => {
  releaseLock();
  process.exit(130);
});
process.once("SIGTERM", () => {
  releaseLock();
  process.exit(143);
});

let failed = false;

try {
  for (const stage of selected) {
    const stageStartedAt = Date.now();
    console.log(`\n[harness] START ${stage.label}`);

    const result = spawnSync(stage.executable, stage.args, {
      cwd: process.cwd(),
      env: {
        ...process.env,
        HARNESS_BRANCH: integrationBranch,
        HARNESS_ISOLATED: "1",
        HARNESS_PRODUCTION: "1",
        HARNESS_REQUIRES_BUILD: ["ci", "functional", "visual", "release"].includes(
          mode,
        )
          ? "1"
          : "0",
      },
      shell: process.platform === "win32" && stage.executable.endsWith(".cmd"),
      stdio: "inherit",
    });

    if (result.error) {
      console.error(`[harness] process error: ${result.error.message}`);
    }

    const record = {
      label: stage.label,
      command: [stage.executable, ...stage.args].join(" "),
      durationMs: Date.now() - stageStartedAt,
      status: result.status ?? 1,
    };
    stages.push(record);

    if (record.status !== 0) {
      failed = true;
      console.error(`[harness] FAIL ${stage.label}`);
      break;
    }

    console.log(`[harness] PASS ${stage.label} (${record.durationMs} ms)`);
  }
} finally {
  releaseLock();
}

const report = {
  schemaVersion: 1,
  branch: integrationBranch,
  head: git(["rev-parse", "HEAD"]),
  mode,
  block: blockName ?? null,
  scope: detectedScope,
  dirty: currentFiles,
  environment: {
    node: process.version,
    npm: capture(npm, ["--version"]),
    platform: `${process.platform}-${process.arch}`,
  },
  startedAt: startedAt.toISOString(),
  finishedAt: new Date().toISOString(),
  status: failed ? "failed" : "passed",
  stages,
  manualReleaseChecks: [
    "NVDA or equivalent screen-reader pass",
    "real-device mobile pass at 320-390 px and 200 percent zoom/reflow",
    "field Core Web Vitals or an explicitly documented lab-only limitation",
    "source-gap review for R08 and R16",
    "asset rights and live-link review",
    "human review of Windows visual diffs before updating baselines",
  ],
};

writeFileSync(
  resolve(reportDirectory, "latest.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8",
);

console.log(`\n[harness] ${report.status.toUpperCase()} report: .artifacts/harness/latest.json`);
process.exitCode = failed ? 1 : 0;
