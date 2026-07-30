import { describe, expect, it } from "vitest";
import {
  getOperationPercentage,
  OPERATION_STATISTICS_2025,
  OPERATION_TOTAL_2025_KM,
  STATISTICS_SOURCE,
  TARIFF_INDEXING_SOURCE,
  TARIFF_PRIMARY_SOURCE,
  TARIFF_STATISTICS_CHART_LABEL,
  TARIFF_STATISTICS_CONTEXT,
  TARIFF_STATISTICS_SUMMARY,
  VEHICLE_CATEGORY_TARIFFS,
  YEARLY_STATISTICS,
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
    expect(TARIFF_STATISTICS_SUMMARY).toMatchObject({
      categoriesCount: 4,
      minimumTariffRub: 325,
      maximumTariffRub: 846,
      verifiedAt: "2026-07-15",
    });
    expect(TARIFF_STATISTICS_CHART_LABEL).toBe(
      "Базовые тарифы по категориям транспорта: I — 325 рублей, II — 456 рублей, III — 586 рублей, IV — 846 рублей",
    );
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

describe("confirmed spreadsheet statistics", () => {
  it("locks the confirmed yearly values from Статистика!A4:B7", () => {
    expect(YEARLY_STATISTICS.map(({ year, distanceKm }) => [year, distanceKm])).toEqual(
      [
        [2025, 288],
        [2024, 32.8],
        [2023, 837.8],
      ],
    );
    expect(STATISTICS_SOURCE.yearlyRange).toBe("A4:B7");
  });

  it("locks the confirmed 2025 operation values from Статистика!I4:J8", () => {
    expect(
      OPERATION_STATISTICS_2025.map(({ operation, distanceKm }) => [
        operation,
        distanceKm,
      ]),
    ).toEqual([
      ["Строительство", 288],
      ["Реконструкция", 37.7],
      ["Капитальный ремонт", 10.4],
      ["Ремонт", 402.6],
    ]);
    expect(STATISTICS_SOURCE.operationsRange).toBe("I4:J8");
  });

  it("derives the total and donut percentages from source values", () => {
    expect(OPERATION_TOTAL_2025_KM).toBeCloseTo(738.7, 8);

    const percentages = OPERATION_STATISTICS_2025.map((item) =>
      getOperationPercentage(item.distanceKm),
    );
    expect(percentages.reduce((total, value) => total + value, 0)).toBeCloseTo(100, 8);
    expect(percentages).toEqual([
      expect.closeTo(38.9874, 4),
      expect.closeTo(5.1036, 4),
      expect.closeTo(1.4079, 4),
      expect.closeTo(54.5012, 4),
    ]);
  });

  it("keeps spreadsheet provenance in data without rendering it in the block", () => {
    expect(STATISTICS_SOURCE.url).toContain(
      "1SZl_7o-rjVSO6rrSGh5RD72oYq5xtvMUovVQnWUyCZg",
    );
    expect(JSON.stringify(STATISTICS_SOURCE)).not.toMatch(
      /М-12|Исаметово|Асяново|тариф/i,
    );
  });
});
