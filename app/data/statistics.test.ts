import { describe, expect, it } from "vitest";
import {
  getOperationPercentage,
  OPERATION_STATISTICS_2025,
  OPERATION_TOTAL_2025_KM,
  STATISTICS_SOURCE,
  YEARLY_STATISTICS,
} from "./statistics";

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

  it("uses only the provided spreadsheet as block provenance", () => {
    expect(STATISTICS_SOURCE.url).toContain(
      "1SZl_7o-rjVSO6rrSGh5RD72oYq5xtvMUovVQnWUyCZg",
    );
    expect(JSON.stringify(STATISTICS_SOURCE)).not.toMatch(
      /М-12|Исаметово|Асяново|тариф/i,
    );
  });
});
