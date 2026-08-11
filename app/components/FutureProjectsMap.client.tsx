"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import {
  FUTURE_MAP_STAGES,
  MAP_CITY_MARKER_IDS,
  MAP_CITY_NAMES,
  MAP_ROUTES,
  type FutureMapStage,
  type MapCityName,
} from "@/app/data/future-projects-map";

import styles from "./FutureProjectsMap.module.css";

const MAP_ASSET = "/brand/figma-road-map-2011-25273.svg";
const FALLBACK_MAP_ASSET = "/brand/autodor-official-network-overlay.png";
const STATIC_MAP_SCALE = 0.7;
const STATIC_LABEL_SCALE = 1.3;
const MAP_EDGE_SPACING_PX = 36;
const TIMELINE_HEADING_SPACING_PX = 48;
const FUTURE_STAGE_ZOOM = 2;
const SAINT_PETERSBURG_TOP_Y = 2692.72 - 4.86491;
const SOCHI_BOTTOM_Y = 3483.91 + 3.69371;

const STAGE_FOCUS: Record<string, Readonly<{ x: number; y: number }>> = {
  "orekhovo-bypass": { x: 38, y: 35 },
  "krasnodar-bypass": { x: 37, y: 91 },
  "m4-sochi": { x: 41, y: 95 },
  "southwest-chord": { x: 48, y: 82 },
};

const DEFAULT_VIEW_BOX = {
  x: 610.94,
  y: 2632.88,
  width: 1299.07,
  height: 894.31,
} as const;

type ViewBox = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

type FeatherGeometry = Readonly<{
  featherX: number;
  featherY: number;
}>;

const STATIC_VIEW_BOX: ViewBox = (() => {
  const width = DEFAULT_VIEW_BOX.width / STATIC_MAP_SCALE;
  const height = DEFAULT_VIEW_BOX.height / STATIC_MAP_SCALE;

  return {
    x: DEFAULT_VIEW_BOX.x - (width - DEFAULT_VIEW_BOX.width) / 2,
    y: DEFAULT_VIEW_BOX.y - (height - DEFAULT_VIEW_BOX.height) / 2,
    width,
    height,
  };
})();

const MAP_CITY_SVG_ALIASES: Partial<Record<MapCityName, string>> = {
  Новороссийск: "Новоросийск",
};

const toViewBoxString = ({ x, y, width, height }: ViewBox) =>
  `${x} ${y} ${width} ${height}`;

function repairFigmaSvgId(id: string) {
  if (!/[\u0080-\u00ff]/.test(id)) return id;
  const bytes = Uint8Array.from(
    Array.from(id),
    (character) => character.charCodeAt(0) & 0xff,
  );
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

function prepareStaticMapMarkup(markup: string) {
  const document = new DOMParser().parseFromString(markup, "image/svg+xml");
  const root = document.documentElement;
  const exportedBackground = Array.from(root.children).find(
    (element) =>
      element.tagName.toLowerCase() === "rect" &&
      Number.parseFloat(element.getAttribute("width") ?? "0") >= 4000,
  );
  exportedBackground?.remove();

  root.setAttribute("viewBox", toViewBoxString(STATIC_VIEW_BOX));
  root.setAttribute("preserveAspectRatio", "xMidYMid meet");
  root.setAttribute("aria-hidden", "true");
  root.setAttribute("focusable", "false");
  root.setAttribute("data-static-map-root", "true");
  root.setAttribute("style", "pointer-events:none;user-select:none");

  FUTURE_MAP_STAGES.forEach((stage) => {
    stage.svgIds.forEach((svgId) => {
      const element = document.getElementById(svgId);
      if (!element) return;
      element.setAttribute("aria-hidden", "true");
      element.setAttribute("data-future-stage", stage.id);
      element.setAttribute("style", "opacity:0;visibility:hidden;pointer-events:none");
    });
  });

  const semanticGroups = new Map(
    Array.from(document.querySelectorAll("[id]"), (element) => [
      repairFigmaSvgId(element.id),
      element,
    ]),
  );
  const scaledLabels = new Set<Element>();

  const wrapScaledLabel = (element: Element | undefined | null) => {
    if (!element || scaledLabels.has(element)) return;
    if (element.closest('[data-map-label-scale="true"]')) return;
    const parent = element.parentNode;
    if (!parent) return;

    const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
    wrapper.setAttribute("data-map-label-scale", "true");
    wrapper.setAttribute("aria-hidden", "true");
    parent.insertBefore(wrapper, element);
    wrapper.append(element);
    scaledLabels.add(element);
  };

  MAP_ROUTES.forEach((route) => {
    route.labelSvgIds.forEach((svgId) =>
      wrapScaledLabel(document.getElementById(svgId)),
    );
  });

  MAP_CITY_NAMES.forEach((city) => {
    wrapScaledLabel(semanticGroups.get(MAP_CITY_SVG_ALIASES[city] ?? city));

    const marker = document.getElementById(MAP_CITY_MARKER_IDS[city]);
    if (marker?.tagName.toLowerCase() !== "circle") return;
    marker.setAttribute("fill", "#FFFFFF");
    marker.setAttribute("stroke", "#FF5100");
    marker.setAttribute("stroke-width", "3");
    marker.setAttribute("vector-effect", "non-scaling-stroke");
    marker.setAttribute("aria-hidden", "true");
  });

  document.querySelectorAll("text").forEach((element) => wrapScaledLabel(element));
  document
    .querySelectorAll(
      "[tabindex], [role], [aria-label], [data-map-hit], [data-road-id], [data-city-name]",
    )
    .forEach((element) => {
      element.removeAttribute("tabindex");
      element.removeAttribute("role");
      element.removeAttribute("aria-label");
      element.removeAttribute("data-map-hit");
      element.removeAttribute("data-road-id");
      element.removeAttribute("data-city-name");
    });

  return new XMLSerializer().serializeToString(root);
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
  const frameRef = useRef<HTMLDivElement>(null);
  const [featherGeometry, setFeatherGeometry] = useState<FeatherGeometry | null>(null);
  const [baseViewBox, setBaseViewBox] = useState<ViewBox>(STATIC_VIEW_BOX);
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const [mapLoadFailed, setMapLoadFailed] = useState(false);

  const selectedStage = useMemo(
    () => FUTURE_MAP_STAGES.find((stage) => stage.id === selectedStageId) ?? null,
    [selectedStageId],
  );

  useEffect(() => {
    const controller = new AbortController();

    fetch(MAP_ASSET, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Map asset returned ${response.status}`);
        return response.text();
      })
      .then((markup) => {
        setSvgMarkup(prepareStaticMapMarkup(markup));
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

    const measureMap = () => {
      const atlas = frame.closest<HTMLElement>('[data-testid="future-map-atlas"]');
      const layout = frame.closest<HTMLElement>(".future-layout");
      const heading = document.getElementById("future-title");

      if (atlas && layout && heading) {
        const layoutOffset =
          layout.getBoundingClientRect().top - heading.getBoundingClientRect().bottom;
        atlas.style.marginTop = `${TIMELINE_HEADING_SPACING_PX - layoutOffset}px`;
      }

      const bounds = frame.getBoundingClientRect();
      if (bounds.width <= 0 || bounds.height <= 0) return;

      const scale = bounds.width / STATIC_VIEW_BOX.width;
      const layoutGap = layout
        ? Number.parseFloat(window.getComputedStyle(layout).rowGap) || 0
        : 0;
      const bottomInset = Math.max(MAP_EDGE_SPACING_PX - layoutGap, 0);
      const nextViewBox: ViewBox = {
        x: STATIC_VIEW_BOX.x,
        y: SAINT_PETERSBURG_TOP_Y - MAP_EDGE_SPACING_PX / scale,
        width: STATIC_VIEW_BOX.width,
        height:
          SOCHI_BOTTOM_Y -
          (SAINT_PETERSBURG_TOP_Y - MAP_EDGE_SPACING_PX / scale) +
          bottomInset / scale,
      };
      const frameHeight = nextViewBox.height * scale;
      frame.style.height = `${frameHeight}px`;
      frame.style.aspectRatio = "auto";
      setBaseViewBox((current) =>
        Math.abs(current.y - nextViewBox.y) < 0.01 &&
        Math.abs(current.height - nextViewBox.height) < 0.01
          ? current
          : nextViewBox,
      );

      const adjustedBounds = frame.getBoundingClientRect();
      const featherX = Math.min(Math.max(adjustedBounds.width * 0.06, 48), 88);
      const featherY = Math.min(Math.max(frameHeight * 0.1, 36), 72);
      setFeatherGeometry({ featherX, featherY });
    };

    measureMap();
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measureMap);
    observer?.observe(frame);
    window.addEventListener("resize", measureMap);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measureMap);
    };
  }, [svgMarkup]);

  const handleTimelineKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") {
      nextIndex = Math.min(index + 1, FUTURE_MAP_STAGES.length - 1);
    }
    if (event.key === "ArrowLeft") nextIndex = Math.max(index - 1, 0);
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = FUTURE_MAP_STAGES.length - 1;
    if (nextIndex === index) return;

    event.preventDefault();
    const nextStage = FUTURE_MAP_STAGES[nextIndex];
    if (!nextStage) return;
    setSelectedStageId(nextStage.year === 2026 ? null : nextStage.id);
    document.getElementById(`future-map-year-${nextStage.year}`)?.focus();
  };

  const renderedSvgMarkup = svgMarkup?.replace(
    /viewBox="[^"]+"/,
    `viewBox="${toViewBoxString(baseViewBox)}"`,
  );
  const stageFocus = selectedStage ? STAGE_FOCUS[selectedStage.id] : null;

  return (
    <div
      className={styles.atlas}
      data-fallback="no-webgl"
      data-static-map="true"
      data-map-scale={STATIC_MAP_SCALE}
      data-label-scale={STATIC_LABEL_SCALE}
      data-edge-spacing={MAP_EDGE_SPACING_PX}
      data-stage-zoom={FUTURE_STAGE_ZOOM}
      data-active-year={selectedStage?.year ?? 2026}
      data-active-stage={selectedStage?.id ?? "base"}
      data-has-stage={selectedStage ? "true" : "false"}
      data-timeline-enabled="true"
      data-testid="future-map-atlas"
    >
      <div className={styles.mapColumn}>
        <div className={styles.mapFrame} ref={frameRef}>
          <div
            className={styles.mapObject}
            data-map-asset={MAP_ASSET}
            data-interaction-disabled="true"
            style={
              featherGeometry
                ? ({
                    "--map-feather-x": `${featherGeometry.featherX}px`,
                    "--map-feather-y": `${featherGeometry.featherY}px`,
                  } as CSSProperties)
                : undefined
            }
            role="img"
            aria-label={
              selectedStage
                ? `Схема сети дорог Автодора: выбран проект ${selectedStage.title}`
                : "Статическая схема сети дорог Автодора"
            }
          >
            {renderedSvgMarkup ? (
              <div
                className={styles.mapSvg}
                style={
                  stageFocus
                    ? ({
                        "--stage-focus-x": `${stageFocus.x}%`,
                        "--stage-focus-y": `${stageFocus.y}%`,
                      } as CSSProperties)
                    : undefined
                }
                // The markup is a bundled, immutable export of the specified Figma node.
                dangerouslySetInnerHTML={{ __html: renderedSvgMarkup }}
              />
            ) : (
              <Image
                src={mapLoadFailed ? FALLBACK_MAP_ASSET : MAP_ASSET}
                alt=""
                fill
                unoptimized
                sizes="(max-width: 960px) 100vw, 70vw"
              />
            )}
          </div>

          <div className={styles.timelineWrap}>
            <div className={styles.timeline} role="group" aria-label="Шкала 2026–2030">
              {FUTURE_MAP_STAGES.map((stage, index) => {
                const isSelected =
                  stage.year === 2026
                    ? selectedStageId === null
                    : selectedStageId === stage.id;

                return (
                  <button
                    id={`future-map-year-${stage.year}`}
                    key={stage.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() =>
                      setSelectedStageId(stage.year === 2026 ? null : stage.id)
                    }
                    onKeyDown={(event) => handleTimelineKeyDown(event, index)}
                  >
                    <span>{stage.year}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedStage ? <StagePanel stage={selectedStage} /> : null}
        </div>
      </div>
    </div>
  );
}
