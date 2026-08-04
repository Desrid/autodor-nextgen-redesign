"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type SyntheticEvent as ReactSyntheticEvent,
} from "react";

import {
  ALL_ROUTE_SVG_IDS,
  FUTURE_MAP_STAGES,
  getMapCityDescription,
  MAP_CITY_NAMES,
  MAP_ROUTES,
  type FutureMapStage,
  type MapCityName,
} from "@/app/data/future-projects-map";
import { getRoadById, type RoadId, type RoadRecord } from "@/app/data/roads";

import styles from "./FutureProjectsMap.module.css";

const MAP_ASSET = "/brand/figma-road-map-2011-25273.svg";
const FALLBACK_MAP_ASSET = "/brand/autodor-official-network-overlay.png";

const DEFAULT_VIEW_BOX = {
  x: 610.94,
  y: 2632.88,
  width: 1299.07,
  height: 894.31,
} as const;

const ROAD_IMAGES: Record<RoadRecord["heroMedia"]["image"], string> = {
  "federal-highway-aerial-hero":
    "/media/optimized/federal-highway-aerial-hero/federal-highway-aerial-hero-desktop-640.avif",
  "bridge-viaduct": "/media/optimized/bridge-viaduct/bridge-viaduct-desktop-640.avif",
  "road-construction":
    "/media/optimized/road-construction/road-construction-desktop-640.avif",
  "tunnel-portal": "/media/optimized/tunnel-portal/tunnel-portal-desktop-640.avif",
};

type ViewBox = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

type RouteSelection =
  | Readonly<{ kind: "road"; id: RoadId; svgIds: readonly string[] }>
  | Readonly<{ kind: "stage"; id: string; svgIds: readonly string[] }>;

type TooltipState =
  | Readonly<{ kind: "road"; road: RoadRecord }>
  | Readonly<{ kind: "city"; city: MapCityName }>
  | null;

type TooltipPosition = Readonly<{
  left: number;
  top: number;
}>;

const toViewBoxString = ({ x, y, width, height }: ViewBox) =>
  `${x} ${y} ${width} ${height}`;

function unionBoxes(boxes: readonly DOMRect[]): DOMRect | null {
  if (boxes.length === 0) return null;

  const left = Math.min(...boxes.map((box) => box.x));
  const top = Math.min(...boxes.map((box) => box.y));
  const right = Math.max(...boxes.map((box) => box.x + box.width));
  const bottom = Math.max(...boxes.map((box) => box.y + box.height));

  return new DOMRect(left, top, right - left, bottom - top);
}

function fitViewBox(box: DOMRect, aspectRatio: number): ViewBox {
  let width = Math.max(box.width / 0.8, 38);
  let height = Math.max(box.height / 0.8, 38);

  if (width / height > aspectRatio) {
    height = width / aspectRatio;
  } else {
    width = height * aspectRatio;
  }

  return {
    x: box.x + box.width / 2 - width / 2,
    y: box.y + box.height / 2 - height / 2,
    width,
    height,
  };
}

type MapHit =
  | Readonly<{ kind: "road"; id: RoadId }>
  | Readonly<{ kind: "stage"; stage: FutureMapStage }>
  | Readonly<{ kind: "city"; city: MapCityName }>;

function getMapHitById(id: string): MapHit | null {
  const route = MAP_ROUTES.find((item) => item.svgIds.includes(id));
  if (route) return { kind: "road", id: route.id };

  const stage = FUTURE_MAP_STAGES.find((item) => item.svgIds.includes(id));
  if (stage) return { kind: "stage", stage };

  const city = MAP_CITY_NAMES.find((item) => item === id);
  return city ? { kind: "city", city } : null;
}

function repairFigmaSvgId(id: string) {
  if (!/[\u0080-\u00ff]/.test(id)) return id;
  const bytes = Uint8Array.from(
    Array.from(id),
    (character) => character.charCodeAt(0) & 0xff,
  );
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

function findMapHit(
  target: EventTarget | null,
  boundary: Element | null,
): MapHit | null {
  let element = target instanceof Element ? target : null;

  while (element && element !== boundary) {
    const cityName = element.getAttribute("data-city-name") as MapCityName | null;
    if (cityName && MAP_CITY_NAMES.includes(cityName)) {
      return { kind: "city", city: cityName };
    }
    if (element.id) {
      const hit = getMapHitById(element.id);
      if (hit) return hit;
    }
    element = element.parentElement;
  }

  return null;
}

function isSameMapHit(first: MapHit | null, second: MapHit | null) {
  if (!first || !second || first.kind !== second.kind) return false;
  if (first.kind === "road" && second.kind === "road") return first.id === second.id;
  if (first.kind === "stage" && second.kind === "stage") {
    return first.stage.id === second.stage.id;
  }
  return first.kind === "city" && second.kind === "city" && first.city === second.city;
}

function prepareMapMarkup(markup: string) {
  const document = new DOMParser().parseFromString(markup, "image/svg+xml");
  const root = document.documentElement;
  const exportedBackground = Array.from(root.children).find(
    (element) =>
      element.tagName.toLowerCase() === "rect" &&
      Number.parseFloat(element.getAttribute("width") ?? "0") >= 4000,
  );
  exportedBackground?.remove();
  root.setAttribute("viewBox", toViewBoxString(DEFAULT_VIEW_BOX));
  root.setAttribute("preserveAspectRatio", "xMidYMid meet");

  MAP_ROUTES.forEach((route) => {
    route.svgIds.forEach((svgId) => {
      const element = document.getElementById(svgId);
      if (!element) return;
      element.setAttribute("tabindex", "0");
      element.setAttribute("role", "button");
      element.setAttribute("aria-label", getRoadById(route.id).label);
      element.setAttribute("data-map-hit", "road");
    });
  });

  FUTURE_MAP_STAGES.forEach((stage) => {
    stage.svgIds.forEach((svgId) => {
      const element = document.getElementById(svgId);
      if (!element) return;
      element.setAttribute("tabindex", "0");
      element.setAttribute("role", "button");
      element.setAttribute("aria-label", `${stage.title}, слой ${stage.year}`);
      element.setAttribute("data-map-hit", "future-road");
    });
  });

  const semanticGroups = new Map(
    Array.from(document.querySelectorAll("g[id]"), (element) => [
      repairFigmaSvgId(element.id),
      element,
    ]),
  );

  MAP_CITY_NAMES.forEach((city) => {
    const element = semanticGroups.get(city);
    if (!element) return;
    element.setAttribute("tabindex", "0");
    element.setAttribute("role", "button");
    element.setAttribute("aria-label", `Город ${city}`);
    element.setAttribute("data-map-hit", "city");
    element.setAttribute("data-city-name", city);
  });

  return new XMLSerializer().serializeToString(root);
}

function RoadTooltip({ road }: Readonly<{ road: RoadRecord }>) {
  return (
    <article className={styles.tooltipCard} data-testid="map-road-tooltip">
      <div className={styles.tooltipImage}>
        <Image
          src={ROAD_IMAGES[road.heroMedia.image]}
          alt="Иллюстративный дорожный сюжет; не документальная съёмка конкретного участка"
          fill
          sizes="(max-width: 720px) 38vw, 150px"
        />
        <span>Иллюстрация</span>
      </div>
      <div className={styles.tooltipBody}>
        <p className={styles.tooltipEyebrow}>Дорога в управлении Автодора</p>
        <h3>{road.label}</h3>
        <p>{road.fact.extent}</p>
        <dl>
          <div>
            <dt>Категория</dt>
            <dd>{road.fact.classes.join(", ")}</dd>
          </div>
          <div>
            <dt>Полос</dt>
            <dd>до {road.fact.lanesMax}</dd>
          </div>
          <div>
            <dt>Скорость</dt>
            <dd>до {road.fact.speedKmhMax} км/ч</dd>
          </div>
        </dl>
        <a href={road.detailsUrl}>Подробнее о дороге</a>
      </div>
    </article>
  );
}

function CityTooltip({ city }: Readonly<{ city: MapCityName }>) {
  return (
    <article className={styles.tooltipCard} data-testid="map-city-tooltip">
      <div className={`${styles.tooltipImage} ${styles.cityImage}`}>
        <Image
          src={FALLBACK_MAP_ASSET}
          alt={`Фрагмент исходной дорожной схемы рядом с городом ${city}`}
          fill
          sizes="(max-width: 720px) 38vw, 150px"
        />
        <span>Фрагмент схемы</span>
      </div>
      <div className={styles.tooltipBody}>
        <p className={styles.tooltipEyebrow}>Город на карте</p>
        <h3>{city}</h3>
        <p>{getMapCityDescription(city)}</p>
      </div>
    </article>
  );
}

function StagePanel({ stage }: Readonly<{ stage: FutureMapStage }>) {
  return (
    <aside className={styles.stagePanel} aria-live="polite" aria-atomic="true">
      <p className={styles.stageYear}>{stage.year}</p>
      <p className={styles.stageLabel}>Проект на схеме</p>
      <h3>{stage.title}</h3>
      <p>{stage.description}</p>
      <p className={styles.stageSource}>{stage.sourceNote}</p>
    </aside>
  );
}

export function FutureProjectsMap() {
  const mapSurfaceRef = useRef<HTMLDivElement>(null);
  const svgRootRef = useRef<SVGSVGElement | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [previewSelection, setPreviewSelection] = useState<RouteSelection | null>(null);
  const [selectedRoadId, setSelectedRoadId] = useState<RoadId | null>(null);
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [cityPreview, setCityPreview] = useState<MapCityName | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const [mapLoadFailed, setMapLoadFailed] = useState(false);

  const selectedRoad = useMemo(
    () => (selectedRoadId ? getRoadById(selectedRoadId) : null),
    [selectedRoadId],
  );

  const selectedStage = useMemo(
    () => FUTURE_MAP_STAGES.find((stage) => stage.id === selectedStageId) ?? null,
    [selectedStageId],
  );

  const activeSelection = useMemo<RouteSelection | null>(() => {
    if (previewSelection) return previewSelection;

    if (selectedRoadId) {
      const route = MAP_ROUTES.find((item) => item.id === selectedRoadId);
      return route ? { kind: "road", id: route.id, svgIds: route.svgIds } : null;
    }

    if (selectedStage) {
      return {
        kind: "stage",
        id: selectedStage.id,
        svgIds: selectedStage.svgIds,
      };
    }

    return null;
  }, [previewSelection, selectedRoadId, selectedStage]);

  const tooltip = useMemo<TooltipState>(() => {
    if (cityPreview) return { kind: "city", city: cityPreview };
    if (previewSelection?.kind === "road") {
      return { kind: "road", road: getRoadById(previewSelection.id) };
    }
    if (selectedRoad) return { kind: "road", road: selectedRoad };
    return null;
  }, [cityPreview, previewSelection, selectedRoad]);

  const animateViewBox = useCallback((target: ViewBox) => {
    const root = svgRootRef.current;
    if (!root) return;

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const current = root.viewBox?.baseVal;
    if (!current) {
      root.setAttribute("viewBox", toViewBoxString(target));
      return;
    }
    const start: ViewBox = {
      x: current.x,
      y: current.y,
      width: current.width,
      height: current.height,
    };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      root.setAttribute("viewBox", toViewBoxString(target));
      return;
    }

    const startedAt = performance.now();
    const duration = 520;

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value: ViewBox = {
        x: start.x + (target.x - start.x) * eased,
        y: start.y + (target.y - start.y) * eased,
        width: start.width + (target.width - start.width) * eased,
        height: start.height + (target.height - start.height) * eased,
      };

      root.setAttribute("viewBox", toViewBoxString(value));

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(tick);
      } else {
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const clearTransientState = useCallback(() => {
    setPreviewSelection(null);
    setCityPreview(null);
    setTooltipPosition(null);
  }, []);

  const positionTooltipNearPointer = useCallback((clientX: number, clientY: number) => {
    const frame = frameRef.current;
    if (!frame) return;

    const bounds = frame.getBoundingClientRect();
    const inset = 12;
    const cursorGap = 18;
    const tooltipWidth = Math.min(464, Math.max(bounds.width - inset * 2, 240));
    const estimatedTooltipHeight = 210;
    const maxLeft = Math.max(inset, bounds.width - tooltipWidth - inset);
    const maxTop = Math.max(inset, bounds.height - estimatedTooltipHeight - inset);

    setTooltipPosition({
      left: Math.min(Math.max(clientX - bounds.left + cursorGap, inset), maxLeft),
      top: Math.min(Math.max(clientY - bounds.top + cursorGap, inset), maxTop),
    });
  }, []);

  const activateRoad = useCallback((id: RoadId, persistent: boolean) => {
    const route = MAP_ROUTES.find((item) => item.id === id);
    if (!route) return;

    setCityPreview(null);
    if (persistent) {
      setSelectedRoadId(id);
      setSelectedStageId(null);
      setPreviewSelection(null);
    } else {
      setPreviewSelection({ kind: "road", id, svgIds: route.svgIds });
    }
  }, []);

  const activateStage = useCallback((stage: FutureMapStage, persistent: boolean) => {
    setCityPreview(null);
    if (persistent) {
      setSelectedStageId(stage.id);
      setSelectedRoadId(null);
      setPreviewSelection(null);
    } else {
      setPreviewSelection({ kind: "stage", id: stage.id, svgIds: stage.svgIds });
    }
  }, []);

  const activateMapHit = useCallback(
    (hit: MapHit, persistent: boolean) => {
      if (hit.kind === "road") {
        activateRoad(hit.id, persistent);
        return;
      }
      if (hit.kind === "stage") {
        activateStage(hit.stage, persistent);
        return;
      }
      setPreviewSelection(null);
      setCityPreview(hit.city);
    },
    [activateRoad, activateStage],
  );

  const handleMapPreview = (
    event: ReactPointerEvent<HTMLDivElement> | ReactFocusEvent<HTMLDivElement>,
  ) => {
    const hit = findMapHit(event.target, mapSurfaceRef.current);
    if (!hit) return;
    if ("clientX" in event && (hit.kind === "road" || hit.kind === "city")) {
      positionTooltipNearPointer(event.clientX, event.clientY);
    } else if (!("clientX" in event)) {
      setTooltipPosition(null);
    }
    activateMapHit(hit, false);
  };

  const handleMapPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const hit = findMapHit(event.target, mapSurfaceRef.current);
    if (hit?.kind === "road" || hit?.kind === "city") {
      positionTooltipNearPointer(event.clientX, event.clientY);
    }
  };

  const handleMapExit = (
    event: ReactPointerEvent<HTMLDivElement> | ReactFocusEvent<HTMLDivElement>,
  ) => {
    const from = findMapHit(event.target, mapSurfaceRef.current);
    const to = findMapHit(event.relatedTarget, mapSurfaceRef.current);
    if (isSameMapHit(from, to)) return;
    if (from) clearTransientState();
  };

  const handleMapClick = (event: ReactSyntheticEvent<HTMLDivElement>) => {
    const hit = findMapHit(event.target, mapSurfaceRef.current);
    if (hit) activateMapHit(hit, hit.kind !== "city");
  };

  const handleMapKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      clearTransientState();
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") return;

    const hit = findMapHit(event.target, mapSurfaceRef.current);
    if (!hit) return;
    event.preventDefault();
    activateMapHit(hit, hit.kind !== "city");
  };

  useEffect(() => {
    const controller = new AbortController();

    fetch(MAP_ASSET, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Map asset returned ${response.status}`);
        return response.text();
      })
      .then((markup) => {
        setSvgMarkup(prepareMapMarkup(markup));
        setMapLoadFailed(false);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setMapLoadFailed(true);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const root = mapSurfaceRef.current?.querySelector("svg");
    if (!root) return;
    svgRootRef.current = root;
    const findSvgElement = <T extends SVGElement>(svgId: string) =>
      root.querySelector<T>(`[id="${svgId}"]`);

    root.querySelector('[data-road-color-overlay="true"]')?.remove();
    const baseMapLayer = Array.from(root.children).find(
      (element): element is SVGGElement =>
        element.tagName.toLowerCase() === "g" &&
        element.getAttribute("data-road-color-overlay") !== "true",
    );
    if (baseMapLayer) {
      baseMapLayer.style.transition = "filter 320ms ease-in-out";
      baseMapLayer.style.filter = "none";
    }

    const activeIds = new Set(activeSelection?.svgIds ?? []);

    ALL_ROUTE_SVG_IDS.forEach((svgId) => {
      const element = findSvgElement<SVGElement>(svgId);
      if (!element) return;

      const isActive = activeIds.has(svgId);
      element.style.cursor = "pointer";
      element.style.transition = "opacity 280ms ease-in-out, filter 280ms ease-in-out";
      element.style.opacity =
        activeSelection?.kind === "stage" ? (isActive ? "1" : "0.22") : "1";
      element.style.filter =
        activeSelection?.kind === "stage"
          ? isActive
            ? "drop-shadow(0 0 5px rgba(255,81,0,.38))"
            : "grayscale(1)"
          : "none";
    });

    MAP_CITY_NAMES.forEach((city) => {
      const element = root.querySelector<SVGElement>(`[data-city-name="${city}"]`);
      if (!element) return;
      element.style.cursor = "pointer";
      element.style.opacity = cityPreview && cityPreview !== city ? "0.42" : "1";
      element.style.filter =
        cityPreview === city ? "drop-shadow(0 0 4px #ff5100)" : "none";
    });

    if (activeSelection?.kind === "road") {
      if (baseMapLayer) {
        baseMapLayer.style.filter = "grayscale(1)";

        const overlay = root.ownerDocument.createElementNS(
          "http://www.w3.org/2000/svg",
          "g",
        );
        overlay.setAttribute("data-road-color-overlay", "true");
        overlay.setAttribute("aria-hidden", "true");
        overlay.style.pointerEvents = "none";
        overlay.style.filter = "drop-shadow(0 0 5px rgba(255,81,0,.42))";

        activeSelection.svgIds.forEach((svgId) => {
          const element = findSvgElement<SVGElement>(svgId);
          if (!element) return;
          const clone = element.cloneNode(true) as SVGElement;
          [clone, ...Array.from(clone.querySelectorAll("*"))].forEach((node) => {
            node.removeAttribute("id");
            node.removeAttribute("tabindex");
            node.removeAttribute("role");
            node.removeAttribute("aria-label");
            node.removeAttribute("data-map-hit");
          });
          overlay.append(clone);
        });

        root.append(overlay);
      }

      animateViewBox(DEFAULT_VIEW_BOX);
      return;
    }

    if (!activeSelection) {
      animateViewBox(DEFAULT_VIEW_BOX);
      return;
    }

    const boxes = activeSelection.svgIds
      .map((svgId) => findSvgElement<SVGGraphicsElement>(svgId))
      .filter((element): element is SVGGraphicsElement => Boolean(element?.getBBox))
      .map((element) => element.getBBox());
    const box = unionBoxes(boxes);
    if (!box) return;

    const frame = frameRef.current;
    const aspectRatio = frame
      ? frame.clientWidth / Math.max(frame.clientHeight, 1)
      : 1.5;
    animateViewBox(fitViewBox(box, aspectRatio));
  }, [activeSelection, animateViewBox, cityPreview, svgMarkup]);

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    },
    [],
  );

  const handleTimelineKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex = index;
    if (event.key === "ArrowRight")
      nextIndex = Math.min(index + 1, FUTURE_MAP_STAGES.length - 1);
    if (event.key === "ArrowLeft") nextIndex = Math.max(index - 1, 0);
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = FUTURE_MAP_STAGES.length - 1;
    if (nextIndex === index) return;

    event.preventDefault();
    const nextStage = FUTURE_MAP_STAGES[nextIndex];
    if (!nextStage) return;
    activateStage(nextStage, true);
    document.getElementById(`future-map-year-${nextStage.year}`)?.focus();
  };

  return (
    <div
      className={styles.atlas}
      data-fallback="no-webgl"
      data-has-stage={selectedStage ? "true" : "false"}
      data-road-hover={previewSelection?.kind === "road" ? "true" : "false"}
      data-testid="future-map-atlas"
    >
      <div className={styles.mapColumn}>
        <div className={styles.mapFrame} ref={frameRef}>
          <div
            ref={mapSurfaceRef}
            className={styles.mapObject}
            data-map-asset={MAP_ASSET}
            role="group"
            aria-label="Интерактивная схема дорог из Figma"
          >
            {svgMarkup ? (
              <div
                className={styles.mapSvg}
                onPointerOver={handleMapPreview}
                onPointerMove={handleMapPointerMove}
                onPointerOut={handleMapExit}
                onFocus={handleMapPreview}
                onBlur={handleMapExit}
                onClick={handleMapClick}
                onKeyDown={handleMapKeyDown}
                // The markup is a bundled, immutable export of the specified Figma node.
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
              />
            ) : (
              <Image
                src={mapLoadFailed ? FALLBACK_MAP_ASSET : MAP_ASSET}
                alt="Статическая схема сети дорог Автодора"
                fill
                unoptimized
                sizes="(max-width: 960px) 100vw, 70vw"
              />
            )}
          </div>

          <p className={styles.mapStatus} aria-live="polite">
            {activeSelection?.kind === "road"
              ? `Выбрана дорога ${getRoadById(activeSelection.id).label}`
              : activeSelection?.kind === "stage"
                ? `Выбран проектный слой ${FUTURE_MAP_STAGES.find((stage) => stage.id === activeSelection.id)?.title ?? ""}`
                : cityPreview
                  ? `Выбран город ${cityPreview}`
                  : "Показан обзор дорожной сети"}
          </p>

          {tooltip ? (
            <div
              className={styles.tooltip}
              data-cursor-follow={tooltipPosition ? "true" : "false"}
              style={
                tooltipPosition
                  ? ({
                      "--tooltip-left": `${tooltipPosition.left}px`,
                      "--tooltip-top": `${tooltipPosition.top}px`,
                    } as CSSProperties)
                  : undefined
              }
              aria-live="polite"
            >
              {tooltip.kind === "road" ? (
                <RoadTooltip road={tooltip.road} />
              ) : (
                <CityTooltip city={tooltip.city} />
              )}
            </div>
          ) : null}

          <div className={styles.timelineWrap}>
            <div className={styles.timeline} role="group" aria-label="Шкала 2026–2030">
              {FUTURE_MAP_STAGES.map((stage, index) => (
                <button
                  id={`future-map-year-${stage.year}`}
                  key={stage.id}
                  type="button"
                  aria-pressed={selectedStageId === stage.id}
                  onMouseEnter={() => activateStage(stage, false)}
                  onMouseLeave={clearTransientState}
                  onFocus={() => activateStage(stage, false)}
                  onBlur={clearTransientState}
                  onClick={() => activateStage(stage, true)}
                  onKeyDown={(event) => handleTimelineKeyDown(event, index)}
                >
                  <span>{stage.year}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedStage ? <StagePanel stage={selectedStage} /> : null}
    </div>
  );
}
