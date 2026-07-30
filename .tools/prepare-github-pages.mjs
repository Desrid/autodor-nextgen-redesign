import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const outputRoot = path.join(projectRoot, "out");
const publicRoot = path.join(projectRoot, "public");
const basePath = (
  process.env.GITHUB_PAGES_BASE_PATH || "/autodor-nextgen-redesign"
).replace(/\/+$/, "");
const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".map",
  ".svg",
  ".txt",
  ".xml",
]);

if (!basePath.startsWith("/")) {
  throw new Error("GITHUB_PAGES_BASE_PATH must start with a slash");
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listFiles(entryPath)));
    } else {
      files.push(entryPath);
    }
  }

  return files;
}

const publicDirectories = (await readdir(publicRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);
const outputFiles = await listFiles(outputRoot);
let changedFiles = 0;

for (const filePath of outputFiles) {
  if (!textExtensions.has(path.extname(filePath))) continue;

  const original = await readFile(filePath, "utf8");
  let updated = original;

  for (const directory of publicDirectories) {
    const escapedDirectory = directory.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const publicPathPattern = new RegExp(
      `(?<![A-Za-z0-9._~-])/${escapedDirectory}/`,
      "g",
    );

    updated = updated.replace(
      publicPathPattern,
      `${basePath}/${directory}/`,
    );
  }

  if (updated !== original) {
    await writeFile(filePath, updated);
    changedFiles += 1;
  }
}

await writeFile(path.join(outputRoot, ".nojekyll"), "");

console.log(
  `[github-pages] prefixed public assets in ${changedFiles} files with ${basePath}`,
);
