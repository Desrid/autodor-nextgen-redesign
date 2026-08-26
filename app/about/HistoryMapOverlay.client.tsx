"use client";

import { useState, type KeyboardEvent } from "react";

import { FutureProjectsMap } from "@/app/components/FutureProjectsMap.client";

const HISTORY = [
  { year: 2009, title: "Создание Государственной компании", text: "17 июля вступил в силу Федеральный закон № 145-ФЗ, ставший отправной точкой деятельности Государственной компании «Автодор».", source: "https://russianhighways.ru/about/" },
  { year: 2011, title: "М-4 «Дон»: реконструкция участка", text: "Открыто движение на реконструированном участке км 599–633 в Воронежской области.", source: "https://russianhighways.ru/press/news/55928/" },
  { year: 2016, title: "М-11: строительство моста через Волхов", text: "На новгородском участке завершили 75% строительства моста длиной 741,74 метра.", source: "https://www.russianhighways.ru/upload/iblock/6fc/QR0316.pdf" },
  { year: 2021, title: "ЦКАД: движение по всей трассе", text: "8 июля запущено движение по всем 336 километрам Центральной кольцевой автомобильной дороги.", source: "https://www.russianhighways.ru/for_drivers/a-113/" },
  { year: 2026, title: "ЦКАД: новая транспортная развязка", text: "Введена в эксплуатацию развязка на пересечении ЦКАД и Дмитровского шоссе.", source: "https://russianhighways.ru/press/news/149487/" },
] as const;

export function HistoryMapOverlay() {
  const [index, setIndex] = useState(HISTORY.length - 1);
  const selected = HISTORY[index]!;
  const move = (event: KeyboardEvent<HTMLButtonElement>, current: number) => {
    const next = event.key === "ArrowLeft" ? Math.max(0, current - 1) : event.key === "ArrowRight" ? Math.min(HISTORY.length - 1, current + 1) : event.key === "Home" ? 0 : event.key === "End" ? HISTORY.length - 1 : current;
    if (next === current) return;
    event.preventDefault();
    setIndex(next);
    document.getElementById(`history-year-${HISTORY[next]!.year}`)?.focus();
  };

  return <div className="about-history-map" data-history-year={selected.year}>
    <FutureProjectsMap />
    <article className="about-history-map__card" aria-live="polite">
      <p>{selected.year}</p><h3>{selected.title}</h3><span>{selected.text}</span>
      <a href={selected.source} target="_blank" rel="noreferrer">Источник<svg aria-hidden="true" viewBox="0 0 16 16"><path d="M5 11 11 5M6 5h5v5" /></svg></a>
    </article>
    <aside className="about-history-map__legend" aria-label="Условные обозначения карты">
      <h3>Условные обозначения</h3>
      <ul>
        <li><i className="about-history-map__legend-line about-history-map__legend-line--managed" aria-hidden="true" />Сеть дорог в доверительном управлении Автодора</li>
        <li><i className="about-history-map__legend-line about-history-map__legend-line--future" aria-hidden="true" />Перспективные проекты</li>
        <li><i className="about-history-map__legend-line about-history-map__legend-line--construction" aria-hidden="true" />Строящиеся участки</li>
        <li><svg className="about-history-map__legend-port" aria-hidden="true" viewBox="770 2687 11 11"><path d="M775.31 2690.25L775.31 2697.15M774.326 2691.73L776.296 2691.73M771.371 2694.19C771.371 2694.19 772.356 2697.15 775.311 2697.15C778.266 2697.15 779.251 2694.19 779.251 2694.19" /><circle cx="775.311" cy="2689.27" r="0.98499" /><path d="M770.933 2692.87C770.948 2692.82 771.017 2692.8 771.057 2692.84L772.082 2693.87C772.123 2693.91 772.104 2693.98 772.049 2693.99L770.649 2694.37C770.594 2694.38 770.543 2694.33 770.558 2694.27L770.933 2692.87ZM779.562 2692.84C779.602 2692.8 779.671 2692.82 779.686 2692.87L780.061 2694.27C780.076 2694.33 780.025 2694.38 779.971 2694.37L778.57 2693.99C778.515 2693.97 778.497 2693.91 778.537 2693.87L779.562 2692.84Z" /></svg>Морские порты</li>
      </ul>
    </aside>
    <div className="about-history-map__timeline" role="group" aria-label="История строительства по годам">
      {HISTORY.map((stage, stageIndex) => <button id={`history-year-${stage.year}`} key={stage.year} type="button" aria-pressed={stage.year === selected.year} onClick={() => setIndex(stageIndex)} onKeyDown={(event) => move(event, stageIndex)}><i aria-hidden="true" /><span>{stage.year}</span></button>)}
    </div>
  </div>;
}
