import { statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

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
