"use client";

import { useState, type KeyboardEvent } from "react";

import { FutureProjectsMap } from "@/app/components/FutureProjectsMap.client";

const HISTORY = [
  { year: 2006, title: "М-11: подготовка проекта", text: "Утверждено обоснование инвестиций для строительства скоростной дороги Москва — Санкт-Петербург.", source: "https://russianhighways.ru/upload/iblock/7c5/kd.pdf" },
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
    <div className="about-history-map__timeline" role="group" aria-label="История строительства по годам">
      {HISTORY.map((stage, stageIndex) => <button id={`history-year-${stage.year}`} key={stage.year} type="button" aria-pressed={stage.year === selected.year} onClick={() => setIndex(stageIndex)} onKeyDown={(event) => move(event, stageIndex)}><i aria-hidden="true" /><span>{stage.year}</span></button>)}
    </div>
  </div>;
}
