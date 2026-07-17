import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const sourceDirectory = new URL("public/media/source/", root);
const outputDirectory = new URL("public/media/optimized/", root);

const assets = [
  {
    file: "federal-highway-aerial-hero.png",
    desktop: { left: 40, top: 0, width: 1632, height: 918 },
    mobile: { left: 490, top: 0, width: 734, height: 918 },
  },
  {
    file: "bridge-viaduct.png",
    desktop: { left: 0, top: 80, width: 1536, height: 864 },
    mobile: { left: 359, top: 0, width: 819, height: 1024 },
  },
  {
    file: "tunnel-portal.png",
    desktop: { left: 0, top: 80, width: 1536, height: 864 },
    mobile: { left: 359, top: 0, width: 819, height: 1024 },
  },
  {
    file: "road-construction.png",
    desktop: { left: 0, top: 0, width: 1672, height: 941 },
    mobile: { left: 460, top: 0, width: 753, height: 941 },
  },
];

const variants = [
  { name: "desktop", widths: [640, 960, 1440] },
  { name: "mobile", widths: [320, 480, 720] },
];

const formats = [
  { extension: "avif", options: { quality: 55, effort: 4 } },
  { extension: "webp", options: { quality: 80, smartSubsample: true } },
];

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const manifest = [];

await mkdir(outputDirectory, { recursive: true });

for (const asset of assets) {
  const slug = basename(asset.file, ".png");
  const destination = new URL(`${slug}/`, outputDirectory);
  await mkdir(destination, { recursive: true });

  for (const variant of variants) {
    const crop = asset[variant.name];

    for (const width of variant.widths.filter((candidate) => candidate <= crop.width)) {
      for (const format of formats) {
        const filename = `${slug}-${variant.name}-${width}.${format.extension}`;
        const outputPath = new URL(filename, destination);
        let pipeline = sharp(fileURLToPath(new URL(asset.file, sourceDirectory)))
          .extract(crop)
          .resize({ width, withoutEnlargement: true });

        const options =
          format.extension === "avif" &&
          asset.file === "federal-highway-aerial-hero.png" &&
          variant.name === "mobile"
            ? { ...format.options, quality: 42 }
            : format.options;

        pipeline =
          format.extension === "avif" ? pipeline.avif(options) : pipeline.webp(options);

        await pipeline.toFile(fileURLToPath(outputPath));
        const bytes = await readFile(fileURLToPath(outputPath));
        const metadata = await sharp(bytes).metadata();
        manifest.push({
          source: `public/media/source/${asset.file}`,
          file: `public/media/optimized/${slug}/${filename}`,
          variant: variant.name,
          format: format.extension,
          width: metadata.width,
          height: metadata.height,
          bytes: bytes.length,
          sha256: sha256(bytes),
        });
      }
    }
  }
}

manifest.sort((a, b) => a.file.localeCompare(b.file));
await writeFile(
  new URL("manifest.json", outputDirectory),
  `${JSON.stringify({ generatedAt: "2026-07-15", assets: manifest }, null, 2)}\n`,
  "utf8",
);

console.log(`Generated ${manifest.length} optimized media files.`);
