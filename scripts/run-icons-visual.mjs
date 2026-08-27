import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import process from "node:process";

const playwrightCli = resolve("node_modules", "@playwright", "test", "cli.js");
const result = spawnSync(
  process.execPath,
  [playwrightCli, "test", "e2e/icons.spec.ts", "--project=desktop-1024"],
  {
    cwd: process.cwd(),
    env: { ...process.env, HARNESS_PORT: "3001" },
    stdio: "inherit",
  },
);

if (result.error) {
  console.error(`[icons] Unable to start Playwright: ${result.error.message}`);
  process.exitCode = 1;
} else {
  process.exitCode = result.status ?? 1;
}
