import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { designContract } from "./config.mjs";

const failures = [];

function read(relativePath) {
  const absolutePath = resolve(process.cwd(), relativePath);
  if (!existsSync(absolutePath)) {
    failures.push(`Missing required file: ${relativePath}`);
    return "";
  }
  return readFileSync(absolutePath, "utf8");
}

function requireText(source, expected, label) {
  if (!source.includes(expected)) {
    failures.push(`${label}: missing ${JSON.stringify(expected)}`);
  }
}

function requireRegex(source, pattern, label) {
  if (!pattern.test(source)) {
    failures.push(`${label}: missing pattern ${pattern}`);
  }
}

const page = read("app/page.tsx");
const designRead = read("docs/design/design-read.md");
const designSystem = read("docs/design/design-system.md");
const traceability = read("docs/requirements/traceability-matrix.md");
const playwright = read("playwright.config.ts");
const requirements = read("e2e/requirements.spec.ts");
const visual = read("e2e/visual.spec.ts");
const header = read("e2e/header.spec.ts");
const globals = read("app/globals.css");
const ci = read(".github/workflows/ci.yml");
const packageJson = read("package.json");

const sectionTags = [
  ...page.matchAll(
    /<(?:header|div|section|footer)\b[^>]*\bdata-section="([^"]+)"[^>]*>/g,
  ),
].map((match) => {
  const nodeMatch = match[0].match(/\bdata-node-id="([^"]+)"/);
  return { key: match[1], nodeId: nodeMatch?.[1] ?? null };
});

const actualSectionKeys = sectionTags.map(({ key }) => key);
const expectedSectionKeys = designContract.sections.map(({ key }) => key);

if (JSON.stringify(actualSectionKeys) !== JSON.stringify(expectedSectionKeys)) {
  failures.push(
    `Visible section order differs.\nExpected: ${expectedSectionKeys.join(", ")}\nActual: ${actualSectionKeys.join(", ")}`,
  );
}

for (const expected of designContract.sections) {
  const actual = sectionTags.find(({ key }) => key === expected.key);
  if (actual && actual.nodeId !== expected.nodeId) {
    failures.push(
      `${expected.key}: expected node ${expected.nodeId}, received ${actual.nodeId ?? "none"}`,
    );
  }
}

for (const hidden of designContract.hiddenSections) {
  if (actualSectionKeys.includes(hidden.key)) {
    failures.push(
      `${hidden.key}: node ${hidden.nodeId} must remain hidden as a visible section`,
    );
  }
}

requireText(
  designRead,
  `DESIGN_VARIANCE: ${designContract.designDials.variance}`,
  "design read",
);
requireText(
  designRead,
  `MOTION_INTENSITY: ${designContract.designDials.motion}`,
  "design read",
);
requireText(
  designRead,
  `VISUAL_DENSITY: ${designContract.designDials.density}`,
  "design read",
);
requireRegex(designRead, /one consistent light theme|The page stays light/i, "theme lock");
requireText(designRead, designContract.colors.accent, "brand accent");
requireText(designRead, designContract.colors.text, "brand text color");

for (const section of designContract.sections) {
  requireText(designSystem, `\`${section.nodeId}\``, `design-system ${section.key}`);
  requireText(traceability, `\`${section.nodeId}\``, `traceability ${section.key}`);
}

requireText(traceability, `\`${designContract.figmaRoot}\``, "Figma root traceability");
requireText(designSystem, "WCAG 2.2 AA", "accessibility contract");
requireText(designSystem, "reduced motion", "reduced-motion contract");
requireText(designSystem, "no-WebGL", "WebGL fallback contract");
requireText(designSystem, "no-JS", "no-JS fallback contract");
requireRegex(globals, /prefers-reduced-motion:\s*reduce/, "CSS reduced motion");
requireRegex(globals, /@media\s+print/, "CSS print fallback");

for (const viewport of designContract.viewports) {
  requireText(playwright, viewport, `Playwright viewport ${viewport}`);
}

for (const group of [
  "R01-R14",
  "R01",
  "R02",
  "R03",
  "R04-R07",
  "R08",
  "R09-R10",
  "R11-R14",
  "R15",
  "R16",
  "R17",
]) {
  requireText(requirements, group, `requirements coverage ${group}`);
}

for (const relativePath of designContract.requiredE2E) {
  if (!existsSync(resolve(process.cwd(), relativePath))) {
    failures.push(`Missing required E2E suite: ${relativePath}`);
  }
}

requireText(visual, 'reducedMotion: "reduce"', "visual reduced-motion stability");
requireText(visual, "fullPage: true", "full-page visual regression");
requireText(visual, "@visual homepage visual regression", "homepage visual tag");
requireText(header, "@visual header visual states", "header visual tag");
requireText(ci, '--grep-invert "@visual"', "functional/visual CI split");
requireText(ci, '--grep "@visual"', "Windows visual CI");
requireText(packageJson, '"packageManager": "npm@', "canonical package manager");

if (failures.length > 0) {
  console.error(`[design-contract] FAIL (${failures.length})`);
  for (const failure of failures) {
    console.error(`[design-contract] - ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `[design-contract] PASS ${designContract.sections.length} visible sections, ${designContract.viewports.length} viewport profiles, R01-R17`,
  );
}
