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
  {
    operation: "Строительство",
    distanceKm: 288,
    figmaNodeId: "1767:7429",
  },
  {
    operation: "Реконструкция",
    distanceKm: 37.7,
    figmaNodeId: "1767:7432",
  },
  {
    operation: "Капитальный ремонт",
    distanceKm: 10.4,
    figmaNodeId: "1767:7435",
  },
  {
    operation: "Ремонт",
    distanceKm: 402.6,
    figmaNodeId: "1767:7438",
  },
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
