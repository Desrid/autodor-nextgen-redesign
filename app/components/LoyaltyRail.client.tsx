"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export type LoyaltyRailState = "ready" | "loading" | "empty" | "error";

export const LOYALTY_PROGRAMS = [
  {
    id: "large-families",
    nodeId: "1767:7292",
    meta: "До 30 сентября 2026",
    title: "12 000 баллов многодетным семьям",
    description:
      "Баллы можно обменять на скидку на проезд, а транспондер T-pass — приобрести со скидкой 30% при выполнении условий акции.",
    href: "https://www.russianhighways.ru/press/news/145160/",
    linkLabel: "Условия акции",
    image: "/media/loyalty/large-families-road-trip.png",
    imageAlt: "Автомобиль едет по скоростной дороге среди лесистых холмов",
  },
  {
    id: "bonus-discount",
    nodeId: "1767:7295",
    meta: "Скидка 3–15%",
    title: "Дополнительная скидка за баллы",
    description:
      "Накопленные баллы программы лояльности можно обменять на скидку, которая действует выбранный календарный месяц.",
    href: "https://www.russianhighways.ru/press/news/145160/",
    linkLabel: "Как работает скидка",
    image: "/media/loyalty/bonus-discount-transponder.png",
    imageAlt: "Транспондер в салоне автомобиля на фоне пункта оплаты",
  },
  {
    id: "earn-points",
    nodeId: "1767:7298",
    meta: "За поездки с T-pass",
    title: "Баллы за оплаченный проезд",
    description:
      "Баллы начисляются за проезды по платным участкам дорог Автодора после подключения программы лояльности.",
    href: "https://russianhighways.ru/press/news/83198/",
    linkLabel: "Правила начисления",
    image: "/media/loyalty/earn-points-motorway.png",
    imageAlt: "Вид сверху на многополосную дорогу среди зелёного леса",
  },
  {
    id: "discount-levels",
    nodeId: "1767:7273",
    meta: "Пять уровней",
    title: "Выберите размер скидки",
    description:
      "Доступные уровни — 3%, 5%, 7%, 10% или 15%. Чем выше скидка, тем больше бонусных баллов потребуется.",
    href: "https://russianhighways.ru/press/news/83198/",
    linkLabel: "Уровни программы",
    image: "/media/loyalty/discount-levels-console.png",
    imageAlt: "Транспондер и банковская карта на центральной консоли автомобиля",
  },
  {
    id: "flexible-period",
    nodeId: "1767:7276",
    meta: "На выбранный месяц",
    title: "Планируйте скидку заранее",
    description:
      "Скидку можно активировать на подходящий месяц, а до начала действия — отменить и выбрать другой период.",
    href: "https://russianhighways.ru/press/news/83198/",
    linkLabel: "Управление скидкой",
    image: "/media/loyalty/flexible-period-road-trip.png",
    imageAlt: "Автомобиль у зоны отдыха рядом со скоростной дорогой",
  },
  {
    id: "points-lifetime",
    nodeId: "1767:7279",
    meta: "Контроль баланса",
    title: "Следите за сроком баллов",
    description:
      "История начислений и срок действия баллов доступны в личном кабинете владельца транспондера T-pass.",
    href: "https://russianhighways.ru/press/news/83198/",
    linkLabel: "Подробнее о баллах",
    image: "/media/loyalty/points-balance-dashboard.png",
    imageAlt: "Вид из автомобиля на вечернюю скоростную дорогу",
  },
] as const;

type LoyaltyRailProps = Readonly<{
  state?: LoyaltyRailState;
  onRetry?: () => void;
}>;

function ArrowIcon({ direction }: Readonly<{ direction: "previous" | "next" }>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={direction === "previous" ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"} />
    </svg>
  );
}

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
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
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
          <ArrowIcon direction="previous" />
        </button>
        <button
          type="button"
          onClick={() => moveRail(1)}
          disabled={!canScrollNext}
          aria-label="Следующие программы"
        >
          <ArrowIcon direction="next" />
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
      >
        {LOYALTY_PROGRAMS.map((program) => (
          <article
            className="loyalty-card"
            data-loyalty-item
            data-node-id={program.nodeId}
            key={program.id}
          >
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
          </article>
        ))}
      </div>
    </>
  );
}
