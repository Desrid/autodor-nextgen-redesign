"use client";

import { useState } from "react";

import { ROADS } from "@/app/data/roads";
import { VEHICLE_CATEGORY_TARIFFS } from "@/app/data/statistics";

const VEHICLE_CATEGORY_DETAILS = {
  I: "Легковые автомобили с прицепом и без него, а также мотоциклы с коляской и без неё. Высота над передней осью — до 2 м.",
  II: "Легковые автомобили с прицепом и без него, фургоны, микроавтобусы и небольшие грузовые автомобили. Высота над передней осью — от 2 до 2,6 м.",
  III: "Двухосные грузовые автомобили, трейлеры и автобусы. Высота над передней осью — свыше 2,6 м.",
  IV: "Грузовые автомобили, трейлеры, автобусы и специализированные крупногабаритные транспортные средства с тремя и более осями. Высота над передней осью — свыше 2,6 м.",
} as const;

function Arrow({ direction }: Readonly<{ direction: "previous" | "next" }>) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={direction === "previous" ? "m14 5-7 7 7 7" : "m10 5 7 7-7 7"} /></svg>;
}

export function RoadStatistics() {
  const initialIndex = Math.max(ROADS.findIndex((road) => road.id === "m-12"), 0);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const road = ROADS[activeIndex] ?? ROADS[initialIndex];

  if (!road) return null;

  const title = road.label.startsWith(road.shortLabel)
    ? road.label.slice(road.shortLabel.length).trim() || road.label
    : road.label;
  const selectRoad = (offset: number) => setActiveIndex((activeIndex + offset + ROADS.length) % ROADS.length);

  return (
    <>
      <div className="statistics-header">
        <div className="section-heading"><h2 id="statistics-title">Статистика</h2></div>
        <div className="statistics-controls" role="group" aria-label="Навигация по трассам">
          <button type="button" onClick={() => selectRoad(-1)} aria-label="Предыдущая трасса"><Arrow direction="previous" /></button>
          <button type="button" onClick={() => selectRoad(1)} aria-label="Следующая трасса"><Arrow direction="next" /></button>
        </div>
      </div>

      <figure className="tariff-statistics" data-testid="tariff-statistics" data-road-id={road.id}>
        <figcaption className="tariff-statistics__intro">
          <div className="tariff-statistics__route" aria-live="polite">
            <p>{road.shortLabel}</p>
            <h3 title={road.label}>{title}</h3>
          </div>
          <dl className="tariff-statistics__facts" aria-label={`Сводка трассы ${road.shortLabel}`}>
            <div><dt>Протяжённость</dt><dd>{road.fact.extent}</dd></div>
            <div><dt>Скорость</dt><dd>до {road.fact.speedKmhMax} км/ч</dd></div>
          </dl>
        </figcaption>

        <div className="tariff-statistics__data">
          <div className="tariff-chart" role="group" aria-label={`Базовые тарифы по категориям транспорта для ${road.shortLabel}`}>
            <div className="tariff-chart__heading"><span>Категория ТС</span><span>Базовый тариф</span></div>
            {VEHICLE_CATEGORY_TARIFFS.map((item) => (
              <div className="tariff-chart__row" key={item.category}>
                <span className="tariff-chart__category">{item.category}</span>
                <span className="tariff-chart__track" aria-hidden="true"><span className="tariff-chart__bar" style={{ width: `${(item.priceRub / 846) * 100}%` }} /></span>
                <strong>{item.priceRub} ₽</strong>
                <span className="tariff-tooltip">
                  <button type="button" aria-describedby={`tariff-tip-${item.category}`} aria-label={`Состав категории ${item.category}`}>i</button>
                  <span id={`tariff-tip-${item.category}`} role="tooltip">{VEHICLE_CATEGORY_DETAILS[item.category]}</span>
                </span>
              </div>
            ))}
          </div>
          <p className="tariff-statistics__verified">Данные сверены <time dateTime={road.factSource.verifiedAt}>{road.factSource.verifiedAt.split("-").reverse().join(".")}</time></p>
        </div>

        <div className="tariff-table-wrap"><table><caption>Текстовый эквивалент диаграммы тарифов</caption><thead><tr><th scope="col">Категория ТС</th><th scope="col">Базовый тариф, ₽</th></tr></thead><tbody>{VEHICLE_CATEGORY_TARIFFS.map((item) => <tr key={item.category}><th scope="row">{item.category}</th><td>{item.priceRub}</td></tr>)}</tbody></table></div>
        <div className="tariff-sources"><p>Данные по трассе опубликованы на официальном сайте Государственной компании «Автодор».</p><a href={road.detailsUrl}>Официальная страница {road.shortLabel}</a></div>
      </figure>
    </>
  );
}
