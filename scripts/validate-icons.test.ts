import { describe, expect, it } from "vitest";

// The validator is intentionally executable JavaScript so agents can run it with plain Node.
// @ts-expect-error -- the executable .mjs file does not ship a separate declaration file.
import { validateSource } from "./validate-icons.mjs";

describe("validate-icons", () => {
  it("accepts a responsive decorative icon inside the safe area", () => {
    const result = validateSource(
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" focusable="false" aria-hidden="true"><path d="M4 12h16" /></svg>`,
      "ValidIcon.tsx",
    );

    expect(result.errors).toEqual([]);
  });

  it("reports contract and safe-area violations with rule names", () => {
    const result = validateSource(
      `<svg viewBox="0 0 20 20" fill="#f00" stroke="black" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter" focusable="false" aria-hidden="true"><path d="M0 0h24" /></svg>`,
      "BrokenIcon.tsx",
    );

    expect(result.errors.map((error: { rule: string }) => error.rule)).toEqual(
      expect.arrayContaining(["svg.color", "svg.contract", "svg.safe-area"]),
    );
  });

  it("rejects conflicting hidden and named accessibility states", () => {
    const result = validateSource(
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" focusable="false" aria-hidden="true" aria-label="Close"><path d="M8 8l8 8m0-8-8 8" /></svg>`,
      "ConflictingIcon.tsx",
    );

    expect(result.errors.map((error: { rule: string }) => error.rule)).toContain(
      "a11y.conflict",
    );
  });
});
