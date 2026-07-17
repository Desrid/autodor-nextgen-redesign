import { readFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { getDocument } from "./pdf/node_modules/pdfjs-dist/legacy/build/pdf.mjs";
import { createCanvas } from "./pdf/node_modules/@napi-rs/canvas/index.js";

const input = process.argv[2];
const outputDirectory = process.argv[3];

if (!input || !outputDirectory) {
  throw new Error("Usage: node .tools/render-brandbook.mjs <input.pdf> <output-dir>");
}

await mkdir(outputDirectory, { recursive: true });
const bytes = new Uint8Array(await readFile(input));
const document = await getDocument({ data: bytes, disableFontFace: true }).promise;

for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
  const page = await document.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 2 });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const context = canvas.getContext("2d");
  await page.render({ canvasContext: context, viewport }).promise;
  const filename = `page-${String(pageNumber).padStart(2, "0")}.png`;
  await canvas.encode("png").then(async (buffer) => {
    const { writeFile } = await import("node:fs/promises");
    await writeFile(join(outputDirectory, filename), buffer);
  });
}

console.log(`Rendered ${document.numPages} pages to ${outputDirectory}`);
