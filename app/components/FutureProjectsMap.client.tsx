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
import { CITY_PHOTOS } from "@/app/data/city-photos";
import { getRoadById, type RoadId, type RoadRecord } from "@/app/data/roads";

import styles from "./FutureProjectsMap.module.css";

const MAP_ASSET = "/brand/figma-road-map-2011-25273.svg";
const FALLBACK_MAP_ASSET = "/brand/autodor-official-network-overlay.png";
const MAP_ASSET_SIZE = 4097;
const FUTURE_STAGE_FILL_RATIO = 0.6;

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
  | Readonly<{
      kind: "road";
      id: RoadId;
      svgIds: readonly string[];
      nearbyCities: readonly MapCityName[];
      nearbyCityMarkerSvgIds: readonly string[];
    }>
  | Readonly<{ kind: "stage"; id: string; svgIds: readonly string[] }>;

type TooltipState =
  | Readonly<{ kind: "road"; road: RoadRecord }>
  | Readonly<{ kind: "city"; city: MapCityName }>
  | null;

type TooltipPosition = Readonly<{
  left: number;
  top: number;
}>;

type BleedGeometry = Readonly<{
  viewportLeft: number;
  viewportTop: number;
  viewportWidth: number;
  viewportHeight: number;
  imageLeft: number;
  imageTop: number;
  imageSize: number;
  featherX: number;
  featherY: number;
  clipPath: string;
}>;

const EXISTING_ROUTE_SVG_IDS = new Set(MAP_ROUTES.flatMap((route) => route.svgIds));
const FUTURE_STAGE_SVG_IDS = new Set([
  ...ALL_ROUTE_SVG_IDS.filter((svgId) => !EXISTING_ROUTE_SVG_IDS.has(svgId)),
  ...FUTURE_MAP_STAGES.flatMap((stage) => stage.svgIds),
]);
const MAP_LAYER_SVG_IDS = [
  ...new Set([
    ...ALL_ROUTE_SVG_IDS,
    ...FUTURE_MAP_STAGES.flatMap((stage) => stage.svgIds),
  ]),
];
const MAP_CITY_SVG_ALIASES: Partial<Record<MapCityName, string>> = {
  Новороссийск: "Новоросийск",
};

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
  let width = Math.max(box.width / FUTURE_STAGE_FILL_RATIO, 38);
  let height = Math.max(box.height / FUTURE_STAGE_FILL_RATIO, 38);

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
  const route = MAP_ROUTES.find(
    (item) => item.svgIds.includes(id) || item.labelSvgIds.includes(id),
  );
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

function getSvgTransformPoint(transform: string | null) {
  if (!transform) return null;
  const translate = transform.match(
    /translate\(\s*(-?[\d.]+)(?:[\s,]+)(-?[\d.]+)\s*\)/,
  );
  if (translate?.[1] && translate[2]) {
    return `${translate[1]},${translate[2]}`;
  }
  const matrix = transform.match(
    /matrix\(\s*-?[\d.]+[\s,]+-?[\d.]+[\s,]+-?[\d.]+[\s,]+-?[\d.]+[\s,]+(-?[\d.]+)[\s,]+(-?[\d.]+)\s*\)/,
  );
  return matrix?.[1] && matrix[2] ? `${matrix[1]},${matrix[2]}` : null;
}

function findMapHit(
  target: EventTarget | null,
  boundary: Element | null,
): MapHit | null {
  let element = target instanceof Element ? target : null;

  while (element && element !== boundary) {
    const roadId = element.getAttribute("data-road-id") as RoadId | null;
    if (roadId && MAP_ROUTES.some((route) => route.id === roadId)) {
      return { kind: "road", id: roadId };
    }
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

    route.labelSvgIds.forEach((svgId) => {
      const element = document.getElementById(svgId);
      if (!element) return;
      element.setAttribute("aria-label", getRoadById(route.id).label);
      element.setAttribute("data-map-hit", "road-label");
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
    Array.from(document.querySelectorAll("[id]"), (element) => [
      repairFigmaSvgId(element.id),
      element,
    ]),
  );

  MAP_CITY_NAMES.forEach((city) => {
    const element = semanticGroups.get(MAP_CITY_SVG_ALIASES[city] ?? city);
    if (!element) return;
    element.setAttribute("tabindex", "0");
    element.setAttribute("role", "button");
    element.setAttribute("aria-label", `Город ${city}`);
    element.setAttribute("data-map-hit", "city");
    element.setAttribute("data-city-name", city);
  });

  const hitLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
  hitLayer.setAttribute("data-road-hit-layer", "true");
  hitLayer.setAttribute("aria-hidden", "true");

  MAP_ROUTES.forEach((route) => {
    route.svgIds.forEach((svgId) => {
      const source = document.getElementById(svgId);
      if (!source) return;
      const routePoints = Array.from(source.querySelectorAll("use"))
        .map((element) => getSvgTransformPoint(element.getAttribute("transform")))
        .filter((point): point is string => Boolean(point));

      if (routePoints.length > 1) {
        const polyline = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polyline",
        );
        polyline.setAttribute("points", routePoints.join(" "));
        polyline.setAttribute("fill", "none");
        polyline.setAttribute("stroke", "transparent");
        polyline.setAttribute("stroke-width", "30");
        polyline.setAttribute("stroke-linecap", "round");
        polyline.setAttribute("stroke-linejoin", "round");
        polyline.setAttribute("vector-effect", "non-scaling-stroke");
        polyline.setAttribute("pointer-events", "stroke");
        polyline.setAttribute("data-road-id", route.id);
        polyline.setAttribute("cursor", "pointer");
        hitLayer.append(polyline);
        return;
      }

      const clone = source.cloneNode(true) as SVGElement;
      const cloneNodes = [clone, ...Array.from(clone.querySelectorAll("*"))];
      cloneNodes.forEach((node) => {
        node.removeAttribute("id");
        node.removeAttribute("tabindex");
        node.removeAttribute("role");
        node.removeAttribute("aria-label");
        node.removeAttribute("data-map-hit");
      });
      cloneNodes
        .filter((node) => node.matches("path, line, polyline, use"))
        .forEach((node) => {
          node.setAttribute("fill", "none");
          node.setAttribute("stroke", "transparent");
          node.setAttribute("stroke-width", "30");
          node.setAttribute("vector-effect", "non-scaling-stroke");
          node.setAttribute("pointer-events", "stroke");
          node.setAttribute("data-road-id", route.id);
          node.setAttribute("cursor", "pointer");
        });
      hitLayer.append(clone);
    });
  });

  const firstCityMarker = document.getElementById("Ellipse 2");
  if (firstCityMarker?.parentNode) {
    firstCityMarker.parentNode.insertBefore(hitLayer, firstCityMarker);
  } else {
    root.append(hitLayer);
  }

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
  const photo = CITY_PHOTOS[city];

  return (
    <article className={styles.tooltipCard} data-testid="map-city-tooltip">
      <div className={`${styles.tooltipImage} ${styles.cityImage}`}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          unoptimized
          sizes="(max-width: 720px) 38vw, 150px"
          onError={(event) => {
            event.currentTarget.srcset = "";
            event.currentTarget.src = FALLBACK_MAP_ASSET;
          }}
        />
        <span className={styles.photoCredit}>
          Фото:{" "}
          <a href={photo.sourceUrl} target="_blank" rel="noreferrer">
            {photo.author}
          </a>{" "}
          ·{" "}
          {photo.licenseUrl ? (
            <a href={photo.licenseUrl} target="_blank" rel="noreferrer">
              {photo.license}
            </a>
          ) : (
            photo.license
          )}
        </span>
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
  const [bleedGeometry, setBleedGeometry] = useState<BleedGeometry | null>(null);
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
    if (previewSelection?.kind === "stage") return previewSelection;

    if (selectedRoadId) {
      const route = MAP_ROUTES.find((item) => item.id === selectedRoadId);
      return route
        ? {
            kind: "road",
            id: route.id,
            svgIds: [...route.svgIds, ...route.labelSvgIds],
            nearbyCities: route.nearbyCities,
            nearbyCityMarkerSvgIds: route.nearbyCityMarkerSvgIds,
          }
        : null;
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

  const resetMapTo2026 = useCallback(() => {
    setPreviewSelection(null);
    setSelectedRoadId(null);
    setSelectedStageId(null);
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
      setPreviewSelection({
        kind: "road",
        id,
        svgIds: [...route.svgIds, ...route.labelSvgIds],
        nearbyCities: route.nearbyCities,
        nearbyCityMarkerSvgIds: route.nearbyCityMarkerSvgIds,
      });
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
    if (selectedStage) return;
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
    if (selectedStage) return;
    const hit = findMapHit(event.target, mapSurfaceRef.current);
    if (hit?.kind === "road" || hit?.kind === "city") {
      positionTooltipNearPointer(event.clientX, event.clientY);
    }
  };

  const handleMapExit = (
    event: ReactPointerEvent<HTMLDivElement> | ReactFocusEvent<HTMLDivElement>,
  ) => {
    if (selectedStage) return;
    const from = findMapHit(event.target, mapSurfaceRef.current);
    const to = findMapHit(event.relatedTarget, mapSurfaceRef.current);
    if (isSameMapHit(from, to)) return;
    if (from) clearTransientState();
  };

  const handleMapClick = (event: ReactSyntheticEvent<HTMLDivElement>) => {
    if (selectedStage) return;
    const hit = findMapHit(event.target, mapSurfaceRef.current);
    if (hit) activateMapHit(hit, hit.kind !== "city");
  };

  const handleMapKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (selectedStage) return;
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
    const frame = frameRef.current;
    if (!frame) return;

    const measureBleed = () => {
      const bounds = frame.getBoundingClientRect();
      if (bounds.width <= 0 || bounds.height <= 0) return;

      const scale = Math.min(
        bounds.width / DEFAULT_VIEW_BOX.width,
        bounds.height / DEFAULT_VIEW_BOX.height,
      );
      const fittedWidth = DEFAULT_VIEW_BOX.width * scale;
      const fittedHeight = DEFAULT_VIEW_BOX.height * scale;
      const overflowY = Math.min(Math.max(bounds.height * 0.34, 112), 240);
      const featherX = Math.min(Math.max(bounds.width * 0.06, 48), 88);
      const featherY = Math.min(Math.max(bounds.height * 0.1, 56), 96);
      const holeLeft = bounds.left + featherX;
      const holeTop = overflowY + featherY;
      const holeRight = bounds.right - featherX;
      const holeBottom = overflowY + bounds.height - featherY;

      setBleedGeometry({
        viewportLeft: -bounds.left,
        viewportTop: -overflowY,
        viewportWidth: window.innerWidth,
        viewportHeight: bounds.height + overflowY * 2,
        imageLeft:
          bounds.left + (bounds.width - fittedWidth) / 2 - DEFAULT_VIEW_BOX.x * scale,
        imageTop:
          overflowY + (bounds.height - fittedHeight) / 2 - DEFAULT_VIEW_BOX.y * scale,
        imageSize: MAP_ASSET_SIZE * scale,
        featherX,
        featherY,
        clipPath: `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${holeLeft}px ${holeTop}px, ${holeLeft}px ${holeBottom}px, ${holeRight}px ${holeBottom}px, ${holeRight}px ${holeTop}px, ${holeLeft}px ${holeTop}px)`,
      });
    };

    measureBleed();
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measureBleed);
    observer?.observe(frame);
    window.addEventListener("resize", measureBleed);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measureBleed);
    };
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
      baseMapLayer.style.transition = "filter 560ms ease-in-out";
      baseMapLayer.style.filter = "none";
    }

    const activeIds = new Set(activeSelection?.svgIds ?? []);

    MAP_LAYER_SVG_IDS.forEach((svgId) => {
      const element = findSvgElement<SVGElement>(svgId);
      if (!element) return;

      const isActive = activeIds.has(svgId);
      const isFutureStage = FUTURE_STAGE_SVG_IDS.has(svgId);
      if (isFutureStage) {
        const isVisible = activeSelection?.kind === "stage" && isActive;
        element.style.cursor = "default";
        element.style.pointerEvents = "none";
        element.style.transition =
          "opacity 520ms ease-in-out, filter 520ms ease-in-out";
        element.style.opacity = isVisible ? "1" : "0";
        element.style.filter = isVisible
          ? "drop-shadow(0 0 5px rgba(32,165,91,.45))"
          : "none";
        element.setAttribute("tabindex", "-1");
        if (isVisible) {
          element.removeAttribute("aria-hidden");
          element.setAttribute("aria-disabled", "true");
        } else {
          element.setAttribute("aria-hidden", "true");
          element.removeAttribute("aria-disabled");
        }
        return;
      }

      element.style.cursor = selectedStage ? "default" : "pointer";
      element.style.pointerEvents = selectedStage ? "none" : "auto";
      element.setAttribute("tabindex", selectedStage ? "-1" : "0");
      if (selectedStage) {
        element.setAttribute("aria-disabled", "true");
      } else {
        element.removeAttribute("aria-disabled");
      }
      element.style.transition = "opacity 520ms ease-in-out, filter 520ms ease-in-out";
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
      element.style.cursor = selectedStage ? "default" : "pointer";
      element.style.pointerEvents = selectedStage ? "none" : "auto";
      element.setAttribute("tabindex", selectedStage ? "-1" : "0");
      if (selectedStage) {
        element.setAttribute("aria-disabled", "true");
      } else {
        element.removeAttribute("aria-disabled");
      }
      element.style.transformBox = "fill-box";
      element.style.transformOrigin = "center";
      element.style.transition =
        "opacity 520ms ease-in-out, filter 520ms ease-in-out, transform 320ms ease-in-out";
      element.style.opacity = cityPreview && cityPreview !== city ? "0.42" : "1";
      element.style.filter =
        cityPreview === city ? "drop-shadow(0 0 4px #ff5100)" : "none";
      element.style.transform = cityPreview === city ? "scale(2)" : "scale(1)";
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
        overlay.style.opacity = "0";
        overlay.style.transition = "opacity 560ms ease-in-out";

        const appendCleanClone = (element: SVGElement) => {
          const clone = element.cloneNode(true) as SVGElement;
          [clone, ...Array.from(clone.querySelectorAll("*"))].forEach((node) => {
            node.removeAttribute("id");
            node.removeAttribute("tabindex");
            node.removeAttribute("role");
            node.removeAttribute("aria-label");
            node.removeAttribute("data-map-hit");
            node.removeAttribute("data-city-name");
            node.removeAttribute("data-road-id");
          });
          overlay.append(clone);
        };

        activeSelection.svgIds.forEach((svgId) => {
          const element = findSvgElement<SVGElement>(svgId);
          if (!element) return;
          appendCleanClone(element);
        });

        activeSelection.nearbyCities.forEach((city) => {
          const element = root.querySelector<SVGElement>(`[data-city-name="${city}"]`);
          if (!element) return;
          appendCleanClone(element);
        });

        activeSelection.nearbyCityMarkerSvgIds.forEach((svgId) => {
          const element = findSvgElement<SVGElement>(svgId);
          if (!element) return;
          appendCleanClone(element);
        });

        root.append(overlay);
        requestAnimationFrame(() => {
          if (overlay.isConnected) overlay.style.opacity = "1";
        });
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
  }, [
    activeSelection,
    animateViewBox,
    bleedGeometry,
    cityPreview,
    selectedStage,
    svgMarkup,
  ]);

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
    document.getElementById(`future-map-year-${nextStage.year}`)?.focus();
  };

  return (
    <div
      className={styles.atlas}
      data-fallback="no-webgl"
      data-has-stage={selectedStage ? "true" : "false"}
      data-active-year={selectedStage?.year ?? 2026}
      data-testid="future-map-atlas"
    >
      <div className={styles.mapColumn}>
        <div className={styles.mapFrame} ref={frameRef}>
          {bleedGeometry ? (
            <div
              className={styles.mapBleed}
              style={{
                left: `${bleedGeometry.viewportLeft}px`,
                top: `${bleedGeometry.viewportTop}px`,
                width: `${bleedGeometry.viewportWidth}px`,
                height: `${bleedGeometry.viewportHeight}px`,
                clipPath: bleedGeometry.clipPath,
              }}
              aria-hidden="true"
            >
              <Image
                className={styles.mapBleedImage}
                src={MAP_ASSET}
                alt=""
                width={MAP_ASSET_SIZE}
                height={MAP_ASSET_SIZE}
                unoptimized
                style={{
                  left: `${bleedGeometry.imageLeft}px`,
                  top: `${bleedGeometry.imageTop}px`,
                  width: `${bleedGeometry.imageSize}px`,
                  height: `${bleedGeometry.imageSize}px`,
                }}
              />
            </div>
          ) : null}

          <div
            ref={mapSurfaceRef}
            className={styles.mapObject}
            data-map-asset={MAP_ASSET}
            data-interaction-disabled={selectedStage ? "true" : "false"}
            style={
              bleedGeometry
                ? ({
                    "--map-feather-x": `${bleedGeometry.featherX}px`,
                    "--map-feather-y": `${bleedGeometry.featherY}px`,
                  } as CSSProperties)
                : undefined
            }
            role="group"
            aria-disabled={selectedStage ? "true" : undefined}
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
                  aria-pressed={
                    stage.year === 2026
                      ? selectedStageId === null
                      : selectedStageId === stage.id
                  }
                  onClick={() =>
                    stage.year === 2026 ? resetMapTo2026() : activateStage(stage, true)
                  }
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
