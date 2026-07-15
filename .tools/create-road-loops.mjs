import { spawn } from "node:child_process";
import { mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const ffmpegPath = process.argv[2];

if (!ffmpegPath) {
  throw new Error("Usage: node .tools/create-road-loops.mjs <ffmpeg executable>");
}

const root = path.resolve(import.meta.dirname, "..");
const inputDirectory = path.join(root, ".tools", "video-sources");
const outputDirectory = path.join(root, "public", "media", "video");
const frameCount = 144;

const loops = [
  { id: "m-1", source: "federal-highway-aerial-hero.jpg", direction: "forward" },
  { id: "m-3", source: "road-construction.jpg", direction: "forward" },
  { id: "m-4", source: "bridge-viaduct.jpg", direction: "reverse" },
  { id: "m-11", source: "federal-highway-aerial-hero.jpg", direction: "reverse" },
  { id: "m-12", source: "tunnel-portal.jpg", direction: "forward" },
  { id: "a-113", source: "bridge-viaduct.jpg", direction: "forward" },
  { id: "a-289", source: "road-construction.jpg", direction: "reverse" },
  { id: "a-105", source: "federal-highway-aerial-hero.jpg", direction: "forward" },
  { id: "a-107", source: "tunnel-portal.jpg", direction: "reverse" },
];

await mkdir(outputDirectory, { recursive: true });

async function writeFrames(stream, frame) {
  for (let index = 0; index < frameCount; index += 1) {
    if (!stream.write(frame)) {
      await new Promise((resolve) => stream.once("drain", resolve));
    }
  }
  stream.end();
}

async function createLoop(loop) {
  const frame = await readFile(path.join(inputDirectory, loop.source));
  const output = path.join(outputDirectory, `${loop.id}.webm`);
  const position =
    loop.direction === "reverse"
      ? "(in_w-out_w)*(1-min(t/6,1))"
      : "(in_w-out_w)*min(t/6,1)";
  const filter = `crop=960:540:x='${position}':y='(in_h-out_h)/2',format=yuv420p`;

  const child = spawn(
    ffmpegPath,
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-f",
      "image2pipe",
      "-framerate",
      "24",
      "-vcodec",
      "mjpeg",
      "-i",
      "pipe:0",
      "-vf",
      filter,
      "-frames:v",
      String(frameCount),
      "-an",
      "-c:v",
      "libvpx",
      "-b:v",
      "0",
      "-crf",
      "36",
      "-deadline",
      "good",
      "-cpu-used",
      "2",
      output,
    ],
    { stdio: ["pipe", "ignore", "pipe"] },
  );

  let stderr = "";
  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
  });

  const completion = new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg failed for ${loop.id}: ${stderr.trim()}`));
    });
  });

  await Promise.all([writeFrames(child.stdin, frame), completion]);
  const metadata = await stat(output);
  console.log(`${path.basename(output)} ${metadata.size} bytes`);
}

for (const loop of loops) {
  await createLoop(loop);
}
