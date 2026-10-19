"use client";

import { useState } from "react";

import styles from "./RoadTrafficSignal.module.css";

type TrafficLevel = "free" | "slow" | "busy";

const SIGNALS: Record<TrafficLevel, { label: string; description: string }> = {
  free: { label: "Свободно", description: "Движение без заметных задержек" },
  slow: { label: "Замедление", description: "Поток движется медленнее обычного" },
  busy: { label: "Затруднено", description: "На участке возможна задержка" },
};

const LEVELS: readonly TrafficLevel[] = ["free", "slow", "busy"];

function TrafficLight({ level }: { level: TrafficLevel }) {
  return (
    <span
      className={styles.light}
      aria-label={`Сигнал: ${SIGNALS[level].label}`}
      role="img"
    >
      <i className={level === "busy" ? styles.activeBusy : undefined} />
      <i className={level === "slow" ? styles.activeSlow : undefined} />
      <i className={level === "free" ? styles.activeFree : undefined} />
    </span>
  );
}

export function RoadTrafficSignal({
  road,
  roadName,
}: Readonly<{ road: string; roadName: string }>) {
  const [selection, setSelection] = useState<{ road: string; level: TrafficLevel }>({
    road,
    level: "free",
  });
  const level = selection.road === road ? selection.level : "free";
  const signal = SIGNALS[level];

  function cycleSignal() {
    setSelection({
      road,
      level: LEVELS[(LEVELS.indexOf(level) + 1) % LEVELS.length] ?? "free",
    });
  }

  return (
    <button
      type="button"
      onClick={cycleSignal}
      className={styles.root}
      aria-label={`Ситуация на ${road}: ${signal.label}. Нажмите, чтобы переключить`}
      data-traffic-demo="true"
    >
      <TrafficLight level={level} />
      <span>
        <span className={styles.eyebrow}>Ситуация на дороге</span>
        <strong>{signal.label}</strong>
        <span className={styles.description}>
          {road} {roadName}: {signal.description.toLocaleLowerCase()}.
        </span>
      </span>
    </button>
  );
}
