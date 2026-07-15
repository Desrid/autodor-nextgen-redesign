import { mkdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const sourceDirectory = path.join(root, "public", "media", "source");
const outputDirectory = path.join(root, ".tools", "video-sources");

const sources = [
  "federal-highway-aerial-hero",
  "bridge-viaduct",
  "tunnel-portal",
  "road-construction",
];

await mkdir(outputDirectory, { recursive: true });

for (const source of sources) {
  await sharp(path.join(sourceDirectory, `${source}.png`))
    .resize(1056, 594, { fit: "cover", position: "centre" })
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4", progressive: true })
    .toFile(path.join(outputDirectory, `${source}.jpg`));
}

console.log(`Prepared ${sources.length} temporary MJPEG-compatible sources.`);
