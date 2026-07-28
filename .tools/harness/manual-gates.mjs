import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const path = resolve(process.cwd(), "docs", "qa", "manual-gates.json");
const manifest = JSON.parse(readFileSync(path, "utf8"));
const unresolved = manifest.gates.filter(({ status }) => status !== "pass");

if (manifest.releaseStatus !== "ready" || unresolved.length > 0) {
  console.error(
    `[manual-gates] BLOCKED releaseStatus=${manifest.releaseStatus}; unresolved=${unresolved.length}`,
  );
  for (const gate of unresolved) {
    console.error(`[manual-gates] - ${gate.id}: ${gate.status} - ${gate.reason}`);
  }
  process.exitCode = 1;
} else {
  console.log(`[manual-gates] PASS ${manifest.gates.length} release gates`);
}
