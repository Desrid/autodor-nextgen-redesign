import { describe, expect, it } from "vitest";
import {
  TARIFF_INDEXING_SOURCE,
  TARIFF_PRIMARY_SOURCE,
  TARIFF_STATISTICS_CONTEXT,
  VEHICLE_CATEGORY_TARIFFS,
} from "./statistics";

describe("verified M-12 tariff statistics", () => {
  it("locks the four official vehicle-category tariffs", () => {
    expect(
      VEHICLE_CATEGORY_TARIFFS.map(({ category, priceRub }) => [category, priceRub]),
    ).toEqual([
      ["I", 325],
      ["II", 456],
      ["III", 586],
      ["IV", 846],
    ]);
  });

  it("keeps the metric scoped to the verified road section and schedule", () => {
    expect(TARIFF_STATISTICS_CONTEXT.section).toContain("Исаметово — Асяново");
    expect(TARIFF_STATISTICS_CONTEXT.schedule).toBe("понедельник — воскресенье");
    expect(TARIFF_STATISTICS_CONTEXT.discount).toBe("без скидки");
  });

  it("retains both official evidence links", () => {
    expect(TARIFF_PRIMARY_SOURCE.url).toContain("/136321/");
    expect(TARIFF_INDEXING_SOURCE.url).toContain("/141463/");
  });
});
