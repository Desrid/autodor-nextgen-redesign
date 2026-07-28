import { statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { LOYALTY_PROGRAMS } from "./loyalty";
import { ROADS } from "./roads";

describe("road video delivery contract", () => {
  it("ships non-empty WebM and MP4 fallbacks for every approved road", () => {
    for (const road of ROADS) {
      for (const extension of ["webm", "mp4"] as const) {
        const path = join(
          process.cwd(),
          "public",
          "media",
          "video",
          `${road.id}.${extension}`,
        );
        expect(statSync(path).size, path).toBeGreaterThan(1_024);
      }
    }
  });
});

describe("media gallery delivery contract", () => {
  it("ships all generated gallery images as optimized WebP assets", () => {
    for (let index = 1; index <= 20; index += 1) {
      const filename = `gallery-${String(index).padStart(2, "0")}.webp`;
      const path = join(process.cwd(), "public", "media", "gallery", filename);
      expect(statSync(path).size, path).toBeGreaterThan(20_000);
    }
  });
});

describe("loyalty rail media delivery contract", () => {
  it("ships a substantial local image for every source-backed program", () => {
    for (const program of LOYALTY_PROGRAMS) {
      const path = join(process.cwd(), "public", program.image);
      expect(statSync(path).size, path).toBeGreaterThan(20_000);
    }
  });
});
