"use client";

import { useEffect, useMemo, useState } from "react";

import styles from "./RoadTrafficSignal.module.css";

type TrafficLevel = "free" | "slow" | "busy";

const SIGNALS: Record<TrafficLevel, { label: string; description: string }> = {
  free: { label: "Свободно", description: "Движение без заметных задержек" },
  slow: { label: "Замедление", description: "Поток движется медленнее обычного" },
  busy: { label: "Затруднено", description: "На участке возможна задержка" },
};

const DEMO_FRAMES: readonly TrafficLevel[][] = [
  ["free", "slow", "free", "free", "slow", "free"],
  ["slow", "free", "free", "busy", "free", "slow"],
  ["free", "busy", "slow", "free", "free", "free"],
];

function getRoadIndex(road: string) {
  return [...road].reduce((total, character) => total + character.charCodeAt(0), 0) % 6;
}

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
  const [frame, setFrame] = useState(0);
  const roadIndex = useMemo(() => getRoadIndex(road), [road]);
  const level = DEMO_FRAMES[frame]?.[roadIndex] ?? "free";
  const signal = SIGNALS[level];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFrame((currentFrame) => (currentFrame + 1) % DEMO_FRAMES.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <aside
      className={styles.root}
      aria-label={`Ситуация на ${road}`}
      data-traffic-demo="true"
    >
      <TrafficLight level={level} />
      <div>
        <p className={styles.eyebrow}>
          Ситуация на дороге <span>Демо</span>
        </p>
        <strong>{signal.label}</strong>
        <p className={styles.description}>
          {road} {roadName}: {signal.description.toLocaleLowerCase()}.
        </p>
      </div>
    </aside>
  );
}
