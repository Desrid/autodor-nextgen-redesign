import { spawn } from "node:child_process";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const ffmpegPath = process.argv[2];

if (!ffmpegPath) {
  throw new Error("Usage: node .tools/transcode-road-mp4.mjs <full ffmpeg executable>");
}

const videoDirectory = path.resolve(import.meta.dirname, "..", "public", "media", "video");
const sources = (await readdir(videoDirectory)).filter((file) => file.endsWith(".webm")).sort();

function transcode(source) {
  return new Promise((resolve, reject) => {
    const input = path.join(videoDirectory, source);
    const output = path.join(videoDirectory, source.replace(/\.webm$/, ".mp4"));
    const child = spawn(
      ffmpegPath,
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        input,
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "slow",
        "-crf",
        "27",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        output,
      ],
      { stdio: ["ignore", "ignore", "pipe"] },
    );

    let stderr = "";
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(output);
      else reject(new Error(`ffmpeg failed for ${source}: ${stderr.trim()}`));
    });
  });
}

for (const source of sources) {
  const output = await transcode(source);
  const metadata = await stat(output);
  console.log(`${path.basename(output)} ${metadata.size} bytes`);
}
