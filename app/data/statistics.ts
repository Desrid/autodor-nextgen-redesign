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
