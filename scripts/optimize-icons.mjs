import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { extname, resolve } from "node:path";
import process from "node:process";

import { validateSource } from "./validate-icons.mjs";

const DEFAULT_TARGET = "app/components/icons";

function collectSvgFiles(targetPath) {
  const absoluteTarget = resolve(targetPath);
  const stats = statSync(absoluteTarget);
  if (stats.isFile())
    return extname(absoluteTarget).toLowerCase() === ".svg" ? [absoluteTarget] : [];
  return readdirSync(absoluteTarget, { withFileTypes: true }).flatMap((entry) => {
    const childPath = resolve(absoluteTarget, entry.name);
    if (entry.isDirectory()) return collectSvgFiles(childPath);
    return extname(entry.name).toLowerCase() === ".svg" ? [childPath] : [];
  });
}

async function main() {
  const targets = process.argv.slice(2);
  const requestedTargets = targets.length > 0 ? targets : [DEFAULT_TARGET];
  let svgFiles;
  try {
    svgFiles = requestedTargets.flatMap(collectSvgFiles);
  } catch (error) {
    console.error(`[icons] ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
    return;
  }

  if (svgFiles.length === 0) {
    console.log(
      "[icons] No standalone SVG files found; TSX geometry is intentionally preserved.",
    );
    return;
  }

  let optimize;
  try {
    ({ optimize } = await import("svgo"));
  } catch {
    console.error(
      "[icons] Standalone SVG files require the optional svgo dev dependency. Run: npm install --save-dev svgo",
    );
    process.exitCode = 1;
    return;
  }

  const candidates = [];
  for (const filePath of svgFiles) {
    const original = readFileSync(filePath, "utf8");
    const result = optimize(original, {
      path: filePath,
      multipass: false,
      plugins: [
        {
          name: "preset-default",
          params: {
            overrides: {
              cleanupIds: false,
              convertPathData: false,
              convertShapeToPath: false,
              mergePaths: false,
              removeViewBox: false,
            },
          },
        },
        "removeDimensions",
      ],
    });
    const validation = validateSource(result.data, filePath);
    if (validation.errors.length > 0) {
      for (const error of validation.errors) {
        console.error(`${filePath}:${error.line} [${error.rule}] ${error.message}`);
      }
      console.error("[icons] Optimization aborted; no files were changed.");
      process.exitCode = 1;
      return;
    }
    candidates.push({ data: result.data, filePath });
  }

  for (const candidate of candidates)
    writeFileSync(candidate.filePath, candidate.data, "utf8");
  console.log(
    `[icons] Optimized ${candidates.length} standalone SVG file(s) with conservative SVGO settings.`,
  );
}

await main();
