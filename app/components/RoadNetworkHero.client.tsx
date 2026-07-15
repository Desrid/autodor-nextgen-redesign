"use client";

import { useEffect, useRef, useState } from "react";

import { HERO_ACTIONS } from "@/app/data/home-content";
import { ROADS } from "@/app/data/roads";

const MEDIA = [
  "federal-highway-aerial-hero",
  "bridge-viaduct",
  "road-construction",
  "tunnel-portal",
] as const;

function RoadPicture({
  roadLabel,
  media,
}: Readonly<{ roadLabel: string; media: (typeof MEDIA)[number] }>) {
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
        sizes="(max-width: 1200px) 100vw, 64vw"
      />
      <img
        src={`/media/optimized/${media}/${media}-desktop-1440.webp`}
        alt={`Обобщённый визуальный образ федеральной автомагистрали. Не является документальным изображением ${roadLabel}`}
        width="1440"
        height="810"
        fetchPriority="high"
      />
    </picture>
  );
}

export function RoadNetworkHero({ withCar }: Readonly<{ withCar: boolean }>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const pointerStart = useRef<number | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeRoad = ROADS[activeIndex] ?? ROADS[0];

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & {
        connection?: Readonly<{ saveData?: boolean }>;
      }
    ).connection;
    let enableTimer: number | undefined;

    const syncCapability = () => {
      if (enableTimer !== undefined) window.clearTimeout(enableTimer);

      if (motion.matches || connection?.saveData === true) {
        setVideoEnabled(false);
        return;
      }

      // Keep the poster as the LCP candidate and defer decode work until the
      // critical render and initial hydration have settled.
      enableTimer = window.setTimeout(() => setVideoEnabled(true), 4_000);
    };

    syncCapability();
    motion.addEventListener("change", syncCapability);
    return () => {
      if (enableTimer !== undefined) window.clearTimeout(enableTimer);
      motion.removeEventListener("change", syncCapability);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setVideoReady(false);
    setMediaFailed(false);

    if (!videoEnabled) return;

    if (userPaused) {
      video.pause();
      return;
    }

    video.load();
    void video.play().catch(() => {
      setMediaFailed(true);
    });
  }, [activeIndex, userPaused, videoEnabled]);

  const selectRoad = (index: number, focus = false) => {
    const nextIndex = (index + ROADS.length) % ROADS.length;
    setActiveIndex(nextIndex);
    if (focus) tabRefs.current[nextIndex]?.focus();
  };

  return (
    <section
      className="road-hero"
      aria-labelledby="road-heading"
      data-testid="road-slider"
    >
      <div
        className="road-hero__media"
        onPointerDown={(event) => {
          pointerStart.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (pointerStart.current === null) return;
          const displacement = event.clientX - pointerStart.current;
          pointerStart.current = null;
          if (Math.abs(displacement) < 48) return;
          selectRoad(activeIndex + (displacement < 0 ? 1 : -1));
        }}
      >
        <RoadPicture
          roadLabel={activeRoad.label}
          media={MEDIA[activeIndex % MEDIA.length] ?? MEDIA[0]}
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
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={() => setVideoReady(true)}
          onError={() => setMediaFailed(true)}
        >
          {videoEnabled && !mediaFailed ? (
            <>
              <source src={`/media/video/${activeRoad.id}.webm`} type="video/webm" />
              <source src={`/media/video/${activeRoad.id}.mp4`} type="video/mp4" />
            </>
          ) : null}
        </video>
        <div className="road-hero__scrim" />
        <button
          className="media-control"
          data-testid="video-control"
          type="button"
          aria-pressed={userPaused}
          disabled={!videoEnabled || mediaFailed}
          onClick={() => setUserPaused((value) => !value)}
        >
          {videoEnabled && !mediaFailed
            ? userPaused
              ? "Воспроизвести видео"
              : "Приостановить видео"
            : "Видео отключено"}
        </button>
        <div
          className="road-hero__content"
          id="road-panel"
          role="tabpanel"
          data-testid="road-panel"
        >
          <p>Сеть дорог</p>
          <div className="road-title-row">
            <h1 id="road-heading" tabIndex={-1}>
              {activeRoad.label}
            </h1>
            {withCar ? (
              <span
                className="car-pointer"
                data-testid="car-pointer"
                aria-hidden="true"
              >
                <span />
              </span>
            ) : null}
          </div>
          <dl className="road-facts">
            <div>
              <dt>Протяжённость</dt>
              <dd>{activeRoad.fact.extent}</dd>
            </div>
            <div>
              <dt>Категория</dt>
              <dd>{activeRoad.fact.classes.join(", ")}</dd>
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
            Подробнее о дороге
          </a>
        </div>
      </div>

      <div className="road-selector-shell">
        <div
          className="road-tabs"
          role="tablist"
          aria-label="Выбор дороги"
          onKeyDown={(event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
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
              key={road.id}
              type="button"
              role="tab"
              aria-controls="road-panel"
              aria-selected={activeIndex === index}
              tabIndex={activeIndex === index ? 0 : -1}
              data-road-id={road.id}
              data-testid={`road-tab-${road.id}`}
              onClick={() => selectRoad(index)}
            >
              {road.shortLabel}
            </button>
          ))}
        </div>
        <div className="road-controls" aria-label="Управление слайдером">
          <button
            type="button"
            onClick={() => selectRoad(activeIndex - 1)}
            aria-label="Предыдущая дорога"
          >
            <span aria-hidden="true">←</span>
          </button>
          <span aria-live="polite">
            {activeIndex + 1} из {ROADS.length}
          </span>
          <button
            type="button"
            onClick={() => selectRoad(activeIndex + 1)}
            aria-label="Следующая дорога"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <nav className="hero-actions" aria-label="Дорожные сервисы">
        {HERO_ACTIONS.map((action) => (
          <a key={action.label} href={action.href}>
            {action.label}
          </a>
        ))}
      </nav>

      <div className="static-map-fallback" data-fallback="no-webgl">
        <div>
          <p>Карта сети</p>
          <strong>Текстовый режим</strong>
        </div>
        <p>
          Проверенная геометрия дорог с лицензией пока не опубликована. Выбор и ссылки
          доступны в списке.
        </p>
      </div>
      <ol className="road-static-list" data-testid="road-static-list">
        {ROADS.map((road) => (
          <li key={road.id}>
            <a href={road.detailsUrl}>{road.label}</a>
          </li>
        ))}
      </ol>
    </section>
  );
}
