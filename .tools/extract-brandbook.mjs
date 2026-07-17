import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { getDocument } from "./pdf/node_modules/pdfjs-dist/legacy/build/pdf.mjs";

const input = process.argv[2];
const output = process.argv[3];

if (!input || !output) {
  throw new Error("Usage: node .tools/extract-brandbook.mjs <input.pdf> <output.json>");
}

const bytes = new Uint8Array(await readFile(input));
const document = await getDocument({ data: bytes, disableFontFace: true }).promise;
const pages = [];

for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
  const page = await document.getPage(pageNumber);
  const content = await page.getTextContent();
  const text = content.items
    .map((item) => ("str" in item ? item.str : ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  pages.push({ pageNumber, text });
}

await mkdir(dirname(output), { recursive: true });
await writeFile(output, JSON.stringify({ pageCount: document.numPages, pages }, null, 2), "utf8");
console.log(`Extracted ${document.numPages} pages to ${output}`);
