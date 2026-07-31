import {
  formatDistanceKm,
  getOperationPercentage,
  OPERATION_STATISTICS_2025,
  OPERATION_TOTAL_2025_KM,
  YEARLY_STATISTICS,
} from "@/app/data/statistics";
import type { CSSProperties } from "react";

const OPERATION_COLORS = [
  "var(--color-brand-orange)",
  "color-mix(in srgb, var(--color-brand-orange) 82%, var(--color-page))",
  "color-mix(in srgb, var(--color-brand-orange) 64%, var(--color-page))",
  "color-mix(in srgb, var(--color-brand-orange) 46%, var(--color-page))",
] as const;

const maxYearlyDistance = Math.max(...YEARLY_STATISTICS.map((item) => item.distanceKm));

const formatPercentage = (percentage: number) =>
  percentage.toLocaleString("ru-RU", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

const operationSegments = OPERATION_STATISTICS_2025.map((item, index) => ({
  ...item,
  color: OPERATION_COLORS[index],
  percentage: getOperationPercentage(item.distanceKm),
}));

let cumulativePercentage = 0;
const donutGradient = `conic-gradient(${operationSegments
  .map((item) => {
    const start = cumulativePercentage;
    cumulativePercentage += item.percentage;
    return `${item.color} ${start.toFixed(6)}% ${cumulativePercentage.toFixed(6)}%`;
  })
  .join(", ")})`;

const operationAccessibleLabel = operationSegments
  .map(
    (item) =>
      `${item.operation}: ${formatDistanceKm(item.distanceKm)} км, ${formatPercentage(item.percentage)}%`,
  )
  .join("; ");

export function StatisticsBlock() {
  return (
    <figure className="statistics-dashboard" data-testid="statistics-dashboard">
      <figcaption className="visually-hidden">
        Подтверждённые данные листа «Статистика»: значения в километрах по годам и
        распределение по видам работ за 2025 год.
      </figcaption>

      <section
        className="statistics-panel statistics-panel--summary"
        aria-labelledby="statistics-years-title"
      >
        <p className="statistics-kicker">Статистика</p>
        <h3 id="statistics-years-title">Построено дорог</h3>
        <div className="statistics-year-highlight">
          <strong>{formatDistanceKm(YEARLY_STATISTICS[0].distanceKm)} км</strong>
          <span>в 2025 году</span>
        </div>
        <table className="statistics-year-table">
          <caption>Текстовый эквивалент данных по годам</caption>
          <thead>
            <tr>
              <th scope="col">Год</th>
              <th scope="col">Значение, км</th>
            </tr>
          </thead>
          <tbody>
            {YEARLY_STATISTICS.map((item) => (
              <tr key={item.year}>
                <th scope="row">{item.year}</th>
                <td>{formatDistanceKm(item.distanceKm)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section
        className="statistics-panel statistics-panel--bars"
        aria-labelledby="statistics-bars-title"
      >
        <div className="statistics-panel__header">
          <p>Сравнение по годам</p>
          <h3 id="statistics-bars-title">Динамика строительства</h3>
        </div>
        <div
          className="statistics-bars"
          role="group"
          aria-label="Вертикальная диаграмма значений по годам в километрах"
        >
          {YEARLY_STATISTICS.map((item) => {
            const heightPercentage = (item.distanceKm / maxYearlyDistance) * 100;

            return (
              <div className="statistics-bars__item" key={item.year}>
                <button
                  className="statistics-bars__trigger"
                  type="button"
                  aria-describedby={`statistics-year-tip-${item.year}`}
                  aria-label={`${item.year} год, ${formatDistanceKm(item.distanceKm)} километров`}
                >
                  <span className="statistics-bars__value">
                    {formatDistanceKm(item.distanceKm)} км
                  </span>
                  <span className="statistics-bars__plot" aria-hidden="true">
                    <span
                      className="statistics-bars__column"
                      style={
                        {
                          "--statistics-bar-height": `${heightPercentage}%`,
                        } as CSSProperties
                      }
                    />
                  </span>
                  <span className="statistics-bars__year" aria-hidden="true">
                    {item.year}
                  </span>
                </button>
                <span
                  className="statistics-tooltip"
                  id={`statistics-year-tip-${item.year}`}
                  role="tooltip"
                >
                  {item.year}: {formatDistanceKm(item.distanceKm)} км
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section
        className="statistics-panel statistics-panel--donut"
        aria-labelledby="statistics-operations-title"
      >
        <div className="statistics-panel__header">
          <p>Доля видов операций</p>
          <h3 id="statistics-operations-title">Дорожные работы в 2025 году</h3>
        </div>
        <div className="statistics-operations-layout">
          <div
            className="statistics-donut"
            role="img"
            aria-label={`Распределение по видам работ. Всего ${formatDistanceKm(OPERATION_TOTAL_2025_KM)} км. ${operationAccessibleLabel}`}
            style={{ background: donutGradient }}
          >
            <div className="statistics-donut__center" aria-hidden="true">
              <strong>{formatDistanceKm(OPERATION_TOTAL_2025_KM)}</strong>
              <span>км всего</span>
            </div>
          </div>

          <table className="statistics-operation-table">
            <caption>Легенда и текстовый эквивалент круговой диаграммы</caption>
            <thead>
              <tr>
                <th scope="col">Вид работ</th>
                <th scope="col">Км</th>
                <th scope="col">Доля</th>
              </tr>
            </thead>
            <tbody>
              {operationSegments.map((item) => (
                <tr data-node-id={item.figmaNodeId} key={item.operation}>
                  <th scope="row">
                    <span className="statistics-legend-control">
                      <button
                        type="button"
                        aria-describedby={`statistics-operation-tip-${item.figmaNodeId.replace(":", "-")}`}
                        aria-label={`${item.operation}: точное значение и доля`}
                      >
                        <span
                          aria-hidden="true"
                          className="statistics-legend-swatch"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.operation}</span>
                      </button>
                      <span
                        className="statistics-tooltip statistics-tooltip--legend"
                        id={`statistics-operation-tip-${item.figmaNodeId.replace(":", "-")}`}
                        role="tooltip"
                      >
                        {item.operation}: {formatDistanceKm(item.distanceKm)} км,{" "}
                        {formatPercentage(item.percentage)}%
                      </span>
                    </span>
                  </th>
                  <td>{formatDistanceKm(item.distanceKm)}</td>
                  <td>{formatPercentage(item.percentage)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </figure>
  );
}
