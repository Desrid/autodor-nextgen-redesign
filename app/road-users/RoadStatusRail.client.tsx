"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

import { ArrowIcon } from "@/app/components/ArrowIcon";

import styles from "./RoadStatusRail.module.css";

export type RoadStatus = Readonly<{
  road: string;
  status: string;
  detail: string;
  tone: "free" | "work";
}>;

type RoadStatusRailProps = Readonly<{
  items: readonly RoadStatus[];
}>;

export function RoadStatusRail({ items }: RoadStatusRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const updateControls = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;

    const maximumScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    setCanScrollPrevious(rail.scrollLeft > 8);
    setCanScrollNext(rail.scrollLeft < maximumScroll - 8);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    updateControls();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateControls);
      return () => window.removeEventListener("resize", updateControls);
    }

    const resizeObserver = new ResizeObserver(updateControls);
    resizeObserver.observe(rail);
    return () => resizeObserver.disconnect();
  }, [items.length, updateControls]);

  const moveRail = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;

    rail.scrollBy({
      left: direction * rail.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveRail(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveRail(1);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.controls} role="group" aria-label="Навигация по ситуации на дорогах">
        <button type="button" onClick={() => moveRail(-1)} disabled={!canScrollPrevious} aria-label="Предыдущие дороги">
          <ArrowIcon direction="left" />
        </button>
        <button type="button" onClick={() => moveRail(1)} disabled={!canScrollNext} aria-label="Следующие дороги">
          <ArrowIcon direction="right" />
        </button>
      </div>
      <div ref={railRef} className={styles.rail} role="region" tabIndex={0} aria-label="Ситуация на всех дорогах" onScroll={updateControls} onKeyDown={onKeyDown}>
        {items.map((item) => (
          <article key={item.road} className={styles.card}>
            <h3>{item.road}</h3>
            <p className={item.tone === "free" ? styles.free : styles.work}>{item.status}</p>
            <span>{item.detail}</span>
            <ArrowIcon direction="right" />
          </article>
        ))}
      </div>
    </div>
  );
}
