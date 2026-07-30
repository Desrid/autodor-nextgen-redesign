"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { ArrowIcon } from "@/app/components/ArrowIcon";
import { LOYALTY_PROGRAMS } from "@/app/data/loyalty";

export type LoyaltyRailState = "ready" | "loading" | "empty" | "error";

export { LOYALTY_PROGRAMS };

type LoyaltyRailProps = Readonly<{
  state?: LoyaltyRailState;
  onRetry?: () => void;
}>;

export default function LoyaltyRail({ state = "ready", onRetry }: LoyaltyRailProps) {
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
    if (state !== "ready") return;

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
  }, [state, updateControls]);

  const moveRail = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;

    rail.scrollBy({
      left: direction * rail.clientWidth,
      behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  const handleRailKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveRail(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveRail(1);
    }
  };

  if (state === "loading") {
    return (
      <div
        className="loyalty-feedback loyalty-feedback--loading"
        data-testid="loyalty-rail"
        data-loyalty-state="loading"
        role="status"
        aria-label="Загружаем программы лояльности"
      >
        <span className="visually-hidden">Загружаем программы лояльности</span>
        {[0, 1, 2].map((item) => (
          <span className="loyalty-skeleton" key={item} aria-hidden="true" />
        ))}
      </div>
    );
  }

  if (state === "empty" || state === "error") {
    const isError = state === "error";

    return (
      <div
        className="loyalty-feedback loyalty-feedback--message"
        data-testid="loyalty-rail"
        data-loyalty-state={state}
        role={isError ? "alert" : "status"}
      >
        <div>
          <strong>
            {isError
              ? "Не удалось загрузить программы"
              : "Сейчас нет доступных предложений"}
          </strong>
          <p>
            {isError
              ? "Проверьте подключение и попробуйте ещё раз."
              : "Новые предложения появятся здесь после публикации официальных условий."}
          </p>
        </div>
        {isError && onRetry ? (
          <button type="button" onClick={onRetry}>
            Повторить
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <div
        className="loyalty-controls"
        role="group"
        aria-label="Навигация по программам"
      >
        <button
          type="button"
          onClick={() => moveRail(-1)}
          disabled={!canScrollPrevious}
          aria-label="Предыдущие программы"
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          type="button"
          onClick={() => moveRail(1)}
          disabled={!canScrollNext}
          aria-label="Следующие программы"
        >
          <ArrowIcon direction="right" />
        </button>
      </div>

      <div
        ref={railRef}
        className="loyalty-rail"
        data-testid="loyalty-rail"
        data-loyalty-state="ready"
        role="region"
        tabIndex={0}
        aria-label="Прокручиваемые карточки программы лояльности"
        onScroll={updateControls}
        onKeyDown={handleRailKeyDown}
      >
        {LOYALTY_PROGRAMS.map((program) => (
          <article
            className="loyalty-card"
            data-loyalty-item
            data-node-id={program.nodeId}
            key={program.id}
          >
            <div className="loyalty-card__tilt">
              <div className="loyalty-card__media">
                <Image
                  className="loyalty-card__image"
                  src={program.image}
                  alt={program.imageAlt}
                  width={1600}
                  height={1000}
                  sizes="(max-width: 767px) 88vw, (max-width: 1023px) 50vw, 33vw"
                />
              </div>
              <div className="loyalty-card__content">
                <p className="loyalty-card__meta">{program.meta}</p>
                <h3>{program.title}</h3>
                <p className="loyalty-card__description">{program.description}</p>
                <a href={program.href}>{program.linkLabel}</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
