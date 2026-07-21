"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { HERO_ACTIONS } from "@/app/data/home-content";
import { hasVerifiedGeometry } from "@/app/data/map-contracts";
import { ROADS } from "@/app/data/roads";

import { RoadRouteMap } from "./RoadRouteMap";

export type HeroVariant = "cinematic" | "atlas" | "signal";

const HERO_ACTION_ICON_KINDS = ["payment", "route", "loyalty", "tariffs"] as const;

function HeroActionIcon({
  kind,
}: Readonly<{ kind: (typeof HERO_ACTION_ICON_KINDS)[number] }>) {
  if (kind === "payment") {
    return (
      <svg viewBox="0 0 48 48" focusable="false">
        <rect
          className="hero-action-icon__banknote"
          x="11"
          y="8"
          width="30"
          height="22"
          rx="3"
        />
        <circle className="hero-action-icon__banknote-detail" cx="31" cy="19" r="3" />
        <rect
          className="hero-action-icon__card"
          x="7"
          y="14"
          width="30"
          height="22"
          rx="4"
        />
        <path className="hero-action-icon__detail" d="M7 21h30M13 29h9" />
      </svg>
    );
  }

  if (kind === "route") {
    return (
      <svg viewBox="0 0 48 48" focusable="false">
        <path
          className="hero-action-icon__route-wave"
          d="M11 30c4-11 8 11 13 0s9 11 13-10"
        />
        <path
          className="hero-action-icon__pin"
          d="M37 9a5 5 0 0 0-5 5c0 4 5 9 5 9s5-5 5-9a5 5 0 0 0-5-5Z"
        />
        <circle className="hero-action-icon__detail" cx="37" cy="14" r="1" />
        <circle className="hero-action-icon__detail" cx="11" cy="35" r="2" />
      </svg>
    );
  }

  if (kind === "loyalty") {
    return (
      <svg viewBox="0 0 48 48" focusable="false">
        <path
          className="hero-action-icon__gift"
          d="M9 22h30v18H9zM7 17h34v6H7zM24 17v23"
        />
        <path
          className="hero-action-icon__bow"
          d="M24 17c-8 0-10-3-10-6 0-2 2-4 4-4 4 0 6 6 6 10Zm0 0c8 0 10-3 10-6 0-2-2-4-4-4-4 0-6 6-6 10Z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" focusable="false">
      <path
        className="hero-action-icon__ticket"
        d="M10 13h28v7a4 4 0 0 0 0 8v7H10v-7a4 4 0 0 0 0-8z"
      />
      <path className="hero-action-icon__detail" d="M24 14v20M29 20l-9 9" />
    </svg>
  );
}

function HeroArrowIcon({ direction }: Readonly<{ direction: "left" | "right" }>) {
  const path = direction === "left" ? "M19 12H5m6-6-6 6 6 6" : "M5 12h14m-6-6 6 6-6 6";

  return (
    <svg
      className="hero-arrow-icon"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} />
    </svg>
  );
}

function RoadPicture({
  media,
  priority,
}: Readonly<{
  media: (typeof ROADS)[number]["heroMedia"]["image"];
  priority: boolean;
}>) {
  return (
    <picture>
      <source
        type="image/avif"
        media="(max-width: 767px)"
        srcSet={`/media/optimized/${media}/${media}-mobile-320.avif 320w, /media/optimized/${media}/${media}-mobile-480.avif 480w, /media/optimized/${media}/${media}-mobile-720.avif 720w`}
        sizes="100vw"
      />
      <source
        type="image/webp"
        media="(max-width: 767px)"
        srcSet={`/media/optimized/${media}/${media}-mobile-320.webp 320w, /media/optimized/${media}/${media}-mobile-480.webp 480w, /media/optimized/${media}/${media}-mobile-720.webp 720w`}
        sizes="100vw"
      />
      <source
        type="image/avif"
        srcSet={`/media/optimized/${media}/${media}-desktop-640.avif 640w, /media/optimized/${media}/${media}-desktop-960.avif 960w, /media/optimized/${media}/${media}-desktop-1440.avif 1440w`}
        sizes="(max-width: 1200px) 100vw, 92vw"
      />
      <img
        src={`/media/optimized/${media}/${media}-desktop-1440.webp`}
        alt=""
        width="1440"
        height="810"
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}

function roadName(label: string, shortLabel: string) {
  const name = label.replace(shortLabel, "").replace(/[«»]/g, "").trim();
  return name || "Федеральная трасса";
}

function kilometersOnly(extent: string) {
  return extent.match(/\d+(?:[,.]\d+)?\s*км/u)?.[0] ?? extent;
}

export function RoadNetworkHero({
  withCar,
  variant,
}: Readonly<{ withCar: boolean; variant: HeroVariant }>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const [travelDirection, setTravelDirection] = useState<"forward" | "backward">(
    "forward",
  );
  const pointerStart = useRef<{
    x: number;
    y: number;
    pointerId: number;
  } | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeRoad = ROADS[activeIndex] ?? ROADS[0];
  const activeRoadName = roadName(activeRoad.label, activeRoad.shortLabel);
  const activeVideo = activeRoad.heroMedia.video;
  const tabRailStyle = { "--road-index": activeIndex } as CSSProperties;

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & {
        connection?: Readonly<{ saveData?: boolean }>;
      }
    ).connection;
    const syncCapability = () => {
      if (motion.matches || connection?.saveData === true) {
        setVideoEnabled(false);
        return;
      }

      setVideoEnabled(true);
    };

    syncCapability();
    motion.addEventListener("change", syncCapability);
    return () => {
      motion.removeEventListener("change", syncCapability);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setVideoReady(false);
    setMediaFailed(false);

    if (!videoEnabled) return;

    video.load();
    void video
      .play()
      .then(() => setVideoReady(true))
      .catch(() => {
        setMediaFailed(true);
      });
  }, [activeIndex, videoEnabled]);

  const selectRoad = (index: number, focus = false) => {
    const nextIndex = (index + ROADS.length) % ROADS.length;
    if (nextIndex !== activeIndex) {
      const forwardDistance = (nextIndex - activeIndex + ROADS.length) % ROADS.length;
      const backwardDistance = (activeIndex - nextIndex + ROADS.length) % ROADS.length;
      setTravelDirection(forwardDistance <= backwardDistance ? "forward" : "backward");
    }
    setActiveIndex(nextIndex);
    if (focus) tabRefs.current[nextIndex]?.focus();
  };

  const finishSwipe = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start || start.pointerId !== event.pointerId) return;

    const horizontalDistance = event.clientX - start.x;
    const verticalDistance = event.clientY - start.y;
    if (
      Math.abs(horizontalDistance) < 48 ||
      Math.abs(horizontalDistance) <= Math.abs(verticalDistance)
    ) {
      return;
    }

    selectRoad(activeIndex + (horizontalDistance < 0 ? 1 : -1));
  };

  return (
    <section
      className="road-hero"
      aria-labelledby="road-heading"
      data-testid="road-slider"
      data-hero-variant={variant}
    >
      <div
        className="road-hero__island"
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          if ((event.target as HTMLElement).closest("a, button")) return;
          pointerStart.current = {
            x: event.clientX,
            y: event.clientY,
            pointerId: event.pointerId,
          };
        }}
        onPointerUp={finishSwipe}
        onPointerCancel={() => {
          pointerStart.current = null;
        }}
      >
        <div className="road-hero__media">
          <div className="road-hero__visual" key={`${variant}-${activeRoad.id}-visual`}>
            <RoadPicture
              media={activeRoad.heroMedia.image}
              priority={activeIndex === 0}
            />
            <video
              key={activeRoad.id}
              ref={videoRef}
              className="road-hero__video"
              data-ready={videoReady && !mediaFailed ? "true" : "false"}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              tabIndex={-1}
              onCanPlay={() => setVideoReady(true)}
              onPlaying={() => setVideoReady(true)}
              onError={() => setMediaFailed(true)}
            >
              {videoEnabled && !mediaFailed ? (
                <source src={activeVideo} type="video/mp4" />
              ) : null}
            </video>
          </div>

          <div className="road-hero__scrim" />
          {variant === "cinematic" ? (
            <div className="road-hero__topography" aria-hidden="true" />
          ) : null}
          {variant === "cinematic" && hasVerifiedGeometry(activeRoad.mapGeometry) ? (
            <RoadRouteMap
              key={activeRoad.id}
              geometry={activeRoad.mapGeometry}
              roadId={activeRoad.id}
              routeLabel={activeRoad.shortLabel}
            />
          ) : null}

          <div className="road-tabs-viewport">
            <div className="road-tabs-rail" style={tabRailStyle}>
              {withCar ? (
                <div className="road-car-track" aria-hidden="true">
                  <span
                    className="car-pointer"
                    data-direction={travelDirection}
                    data-testid="car-pointer"
                  >
                    <Image
                      src="/media/ui/road-car-tight.png"
                      alt=""
                      width={950}
                      height={379}
                      sizes="4rem"
                    />
                  </span>
                </div>
              ) : null}
              <div
                className="road-tabs"
                role="tablist"
                aria-label="Выбор дороги"
                onKeyDown={(event) => {
                  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
                    return;
                  event.preventDefault();
                  if (event.key === "Home") selectRoad(0, true);
                  if (event.key === "End") selectRoad(ROADS.length - 1, true);
                  if (event.key === "ArrowLeft") selectRoad(activeIndex - 1, true);
                  if (event.key === "ArrowRight") selectRoad(activeIndex + 1, true);
                }}
              >
                {ROADS.map((road, index) => (
                  <button
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    id={`road-tab-${road.id}`}
                    key={road.id}
                    type="button"
                    role="tab"
                    aria-controls="road-panel"
                    aria-label={road.label}
                    aria-selected={activeIndex === index}
                    tabIndex={activeIndex === index ? 0 : -1}
                    data-road-id={road.id}
                    data-testid={`road-tab-${road.id}`}
                    onClick={() => selectRoad(index)}
                  >
                    <span className="road-tab__label">{road.shortLabel}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            className="road-hero__content"
            id="road-panel"
            role="tabpanel"
            aria-labelledby={`road-tab-${activeRoad.id}`}
            aria-live="polite"
            aria-atomic="true"
            data-testid="road-panel"
            key={`${variant}-${activeRoad.id}-content`}
          >
            <p className="road-hero__eyebrow">Сеть дорог</p>
            <div className="road-title-row">
              <h1 id="road-heading" tabIndex={-1} data-road-id={activeRoad.id}>
                <span className="road-title__number">{activeRoad.shortLabel}</span>
                <strong>{activeRoadName}</strong>
                <span className="road-title__accent" aria-hidden="true" />
              </h1>
            </div>
            <dl className="road-facts">
              <div>
                <dt>Платный участок</dt>
                <dd>{kilometersOnly(activeRoad.fact.extent)}</dd>
              </div>
              <div>
                <dt>Полос</dt>
                <dd>до {activeRoad.fact.lanesMax}</dd>
              </div>
              <div>
                <dt>Скорость</dt>
                <dd>до {activeRoad.fact.speedKmhMax} км/ч</dd>
              </div>
            </dl>
            <a className="hero-detail-link" href={activeRoad.detailsUrl}>
              <span>Подробнее о дороге</span>
              <HeroArrowIcon direction="right" />
            </a>
          </div>

          <div className="road-controls" aria-label="Управление слайдером">
            <button
              type="button"
              onClick={() => selectRoad(activeIndex - 1)}
              aria-label="Предыдущая дорога"
            >
              <HeroArrowIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={() => selectRoad(activeIndex + 1)}
              aria-label="Следующая дорога"
            >
              <HeroArrowIcon direction="right" />
            </button>
          </div>
        </div>

        <div className="road-hero__notch">
          <nav className="hero-actions" aria-label="Дорожные сервисы">
            {HERO_ACTIONS.map((action, index) => (
              <a key={action.label} href={action.href}>
                <span
                  className="hero-action-icon"
                  data-icon={HERO_ACTION_ICON_KINDS[index]}
                  aria-hidden="true"
                >
                  <HeroActionIcon kind={HERO_ACTION_ICON_KINDS[index] ?? "payment"} />
                </span>
                <span className="hero-action-label">{action.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      {false ? (
        <>
          <div className="static-map-fallback" data-fallback="no-webgl">
            <div>
              <p>Карта сети</p>
              <strong>Текстовый режим</strong>
            </div>
            <p>
              Проверенная геометрия дорог с лицензией пока не опубликована. Выбор и
              ссылки доступны в списке.
            </p>
          </div>
          <ol className="road-static-list" data-testid="road-static-list">
            {ROADS.map((road) => (
              <li key={road.id}>
                <a href={road.detailsUrl}>{road.label}</a>
              </li>
            ))}
          </ol>
        </>
      ) : null}
    </section>
  );
}
