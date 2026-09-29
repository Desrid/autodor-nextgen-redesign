import {
  copyFile,
  mkdir,
  readFile,
  readdir,
  rename,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

// Sites limits individual static assets to 25 MiB. Keep the original media
// bytes on the matching GitHub Pages deployment and redirect only those files.
const root = process.cwd();
const serverRoot = path.join(root, "dist/server");
const clientRoot = path.join(root, "dist/client");
const packageRoot = path.join(
  root,
  ".artifacts/sites-runtime",
  (await readFile(path.join(serverRoot, "BUILD_ID"), "utf8")).trim(),
);
const pagesOrigin = "https://desrid.github.io/autodor-nextgen-redesign";
const maxFileBytes = 25 * 1024 * 1024;

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const filename = path.join(directory, entry.name);
      return entry.isDirectory() ? files(filename) : [filename];
    }),
  );
  return nested.flat();
}

const runtimeFiles = (await files(path.join(root, "app"))).filter(
  (filename) => /\.(tsx?|css)$/.test(filename) && !/\.(test|stories)\./.test(filename),
);
const runtimeSource = (
  await Promise.all(runtimeFiles.map((filename) => readFile(filename, "utf8")))
).join("\n");
const dynamicMedia = [
  "/media/gallery/",
  "/media/optimized/",
  "/media/figma/",
  "/media/ui/",
];
const selected = (await files(clientRoot)).filter((filename) => {
  const relative = path.relative(clientRoot, filename).split(path.sep).join("/");
  const url = `/${relative}`;
  return (
    !relative.startsWith("media/") ||
    runtimeSource.includes(url) ||
    dynamicMedia.some((prefix) => url.startsWith(prefix))
  );
});
const redirects = [];

for (const filename of [...(await files(serverRoot)), ...selected]) {
  const relative = path.relative(root, filename);
  const size = (await stat(filename)).size;
  if (filename.startsWith(clientRoot + path.sep) && size > maxFileBytes) {
    const url = `/${path.relative(clientRoot, filename).split(path.sep).join("/")}`;
    redirects.push(url);
    continue;
  }
  const destination = path.join(packageRoot, relative);
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(filename, destination);
}

const workerRoot = path.join(packageRoot, "dist/server");
await rename(path.join(workerRoot, "index.js"), path.join(workerRoot, "site-app.js"));
await writeFile(
  path.join(workerRoot, "index.js"),
  `import app from "./site-app.js";
export * from "./site-app.js";
const largeMedia = new Set(${JSON.stringify(redirects)});
export default {
  fetch(request, env, context) {
    const url = new URL(request.url);
    if (largeMedia.has(url.pathname)) {
      return Response.redirect(${JSON.stringify(pagesOrigin)} + url.pathname, 307);
    }
    return app.fetch(request, env, context);
  }
};
`,
);
await mkdir(path.join(packageRoot, ".openai"), { recursive: true });
await copyFile(
  path.join(root, ".openai/hosting.json"),
  path.join(packageRoot, ".openai/hosting.json"),
);
const packageFiles = await files(packageRoot);
const bytes = (
  await Promise.all(packageFiles.map(async (filename) => (await stat(filename)).size))
).reduce((sum, size) => sum + size, 0);
if (bytes > 250 * 1024 * 1024)
  throw new Error(`Sites package is too large: ${bytes} bytes`);
console.log(
  JSON.stringify({ packageRoot, files: packageFiles.length, bytes, redirects }),
);
