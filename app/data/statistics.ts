export const TARIFF_PRIMARY_SOURCE = {
  label: "Тарифы на участке М-12 Исаметово — Асяново",
  url: "https://www.russianhighways.ru/press/news/136321/",
  publishedAt: "2025-12-09",
  verifiedAt: "2026-07-15",
} as const;

export const TARIFF_INDEXING_SOURCE = {
  label: "Перечень тарифов, не изменившихся 2 марта 2026 года",
  url: "https://russianhighways.ru/press/news/141463/",
  publishedAt: "2026-02-27",
  verifiedAt: "2026-07-15",
} as const;

export const VEHICLE_CATEGORY_TARIFFS = [
  { category: "I", priceRub: 325, figmaNodeId: "1767:7429" },
  { category: "II", priceRub: 456, figmaNodeId: "1767:7432" },
  { category: "III", priceRub: 586, figmaNodeId: "1767:7435" },
  { category: "IV", priceRub: 846, figmaNodeId: "1767:7438" },
] as const;

export const TARIFF_STATISTICS_SUMMARY = {
  categoriesCount: VEHICLE_CATEGORY_TARIFFS.length,
  minimumTariffRub: Math.min(
    ...VEHICLE_CATEGORY_TARIFFS.map(({ priceRub }) => priceRub),
  ),
  maximumTariffRub: Math.max(
    ...VEHICLE_CATEGORY_TARIFFS.map(({ priceRub }) => priceRub),
  ),
  verifiedAt: TARIFF_INDEXING_SOURCE.verifiedAt,
} as const;

export const TARIFF_STATISTICS_CHART_LABEL = `Базовые тарифы по категориям транспорта: ${VEHICLE_CATEGORY_TARIFFS.map(
  ({ category, priceRub }) => `${category} — ${priceRub} рублей`,
).join(", ")}`;

export const TARIFF_STATISTICS_CONTEXT = {
  metric: "Базовая стоимость проезда",
  road: "М-12 «Восток»",
  section: "Исаметово — Асяново, км 1148–1211",
  schedule: "понедельник — воскресенье",
  discount: "без скидки",
  unit: "рублей",
  sourceNote:
    "Тарифы опубликованы 9 декабря 2025 года и включены в перечень тарифов, не изменившихся с 2 марта 2026 года.",
} as const;

export const STATISTICS_SOURCE = {
  label: "Google Таблица, лист «Статистика»",
  url: "https://docs.google.com/spreadsheets/d/1SZl_7o-rjVSO6rrSGh5RD72oYq5xtvMUovVQnWUyCZg/edit?gid=2144340745#gid=2144340745",
  sheet: "Статистика",
  yearlyRange: "A4:B7",
  operationsRange: "I4:J8",
} as const;

export const YEARLY_STATISTICS = [
  { year: 2025, distanceKm: 288 },
  { year: 2024, distanceKm: 32.8 },
  { year: 2023, distanceKm: 837.8 },
] as const;

export const OPERATION_STATISTICS_2025 = [
  { operation: "Строительство", distanceKm: 288, figmaNodeId: "1767:7429" },
  { operation: "Реконструкция", distanceKm: 37.7, figmaNodeId: "1767:7432" },
  { operation: "Капитальный ремонт", distanceKm: 10.4, figmaNodeId: "1767:7435" },
  { operation: "Ремонт", distanceKm: 402.6, figmaNodeId: "1767:7438" },
] as const;

export const OPERATION_TOTAL_2025_KM = OPERATION_STATISTICS_2025.reduce(
  (total, item) => total + item.distanceKm,
  0,
);

export function getOperationPercentage(distanceKm: number): number {
  return (distanceKm / OPERATION_TOTAL_2025_KM) * 100;
}

export function formatDistanceKm(distanceKm: number): string {
  return distanceKm.toLocaleString("ru-RU", {
    maximumFractionDigits: 1,
    minimumFractionDigits: Number.isInteger(distanceKm) ? 0 : 1,
  });
}
