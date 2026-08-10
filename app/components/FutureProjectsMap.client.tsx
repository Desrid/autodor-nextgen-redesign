"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import {
  ALL_ROUTE_SVG_IDS,
  FUTURE_MAP_STAGES,
  MAP_CITY_MARKER_IDS,
  MAP_CITY_NAMES,
  MAP_ROUTES,
  type MapCityName,
} from "@/app/data/future-projects-map";

import styles from "./FutureProjectsMap.module.css";

const MAP_ASSET = "/brand/figma-road-map-2011-25273.svg";
const FALLBACK_MAP_ASSET = "/brand/autodor-official-network-overlay.png";
const MAP_ASSET_SIZE = 4097;
const STATIC_MAP_SCALE = 0.7;
const STATIC_LABEL_SCALE = 1.3;
const MAP_EDGE_SPACING_PX = 36;
const SAINT_PETERSBURG_TOP_Y = 2692.72 - 4.86491;
const SOCHI_BOTTOM_Y = 3483.91 + 3.69371;

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

const EXISTING_ROUTE_SVG_IDS = new Set(MAP_ROUTES.flatMap((route) => route.svgIds));
const FUTURE_STAGE_SVG_IDS = new Set([
  ...ALL_ROUTE_SVG_IDS.filter((svgId) => !EXISTING_ROUTE_SVG_IDS.has(svgId)),
  ...FUTURE_MAP_STAGES.flatMap((stage) => stage.svgIds),
]);

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

  FUTURE_STAGE_SVG_IDS.forEach((svgId) => {
    const element = document.getElementById(svgId);
    if (!element) return;
    element.setAttribute("aria-hidden", "true");
    element.setAttribute("style", "display:none;pointer-events:none");
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

export function FutureProjectsMap() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [bleedGeometry, setBleedGeometry] = useState<BleedGeometry | null>(null);
  const [visibleViewBox, setVisibleViewBox] = useState<ViewBox>(STATIC_VIEW_BOX);
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const [mapLoadFailed, setMapLoadFailed] = useState(false);

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

    const measureBleed = () => {
      const atlas = frame.closest<HTMLElement>('[data-testid="future-map-atlas"]');
      const layout = frame.closest<HTMLElement>(".future-layout");
      const heading = document.getElementById("future-title");

      if (atlas && layout && heading) {
        const layoutOffset =
          layout.getBoundingClientRect().top - heading.getBoundingClientRect().bottom;
        atlas.style.marginTop = `${-layoutOffset}px`;
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
      setVisibleViewBox((current) =>
        Math.abs(current.y - nextViewBox.y) < 0.01 &&
        Math.abs(current.height - nextViewBox.height) < 0.01
          ? current
          : nextViewBox,
      );

      const adjustedBounds = frame.getBoundingClientRect();
      const fittedWidth = nextViewBox.width * scale;
      const fittedHeight = nextViewBox.height * scale;
      const overflowY = Math.min(Math.max(frameHeight * 0.34, 112), 240);
      const featherX = Math.min(Math.max(adjustedBounds.width * 0.06, 48), 88);
      const featherY = Math.min(Math.max(frameHeight * 0.1, 36), 72);
      const holeLeft = adjustedBounds.left + featherX;
      const holeTop = overflowY + featherY;
      const holeRight = adjustedBounds.right - featherX;
      const holeBottom = overflowY + frameHeight - featherY;

      setBleedGeometry({
        viewportLeft: -adjustedBounds.left,
        viewportTop: -overflowY,
        viewportWidth: window.innerWidth,
        viewportHeight: frameHeight + overflowY * 2,
        imageLeft:
          adjustedBounds.left +
          (adjustedBounds.width - fittedWidth) / 2 -
          nextViewBox.x * scale,
        imageTop: overflowY + (frameHeight - fittedHeight) / 2 - nextViewBox.y * scale,
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
  }, [svgMarkup]);

  const renderedSvgMarkup = svgMarkup?.replace(
    /viewBox="[^"]+"/,
    `viewBox="${toViewBoxString(visibleViewBox)}"`,
  );

  return (
    <div
      className={styles.atlas}
      data-fallback="no-webgl"
      data-static-map="true"
      data-map-scale={STATIC_MAP_SCALE}
      data-label-scale={STATIC_LABEL_SCALE}
      data-edge-spacing={MAP_EDGE_SPACING_PX}
      data-testid="future-map-atlas"
    >
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
          className={styles.mapObject}
          data-map-asset={MAP_ASSET}
          data-interaction-disabled="true"
          style={
            bleedGeometry
              ? ({
                  "--map-feather-x": `${bleedGeometry.featherX}px`,
                  "--map-feather-y": `${bleedGeometry.featherY}px`,
                } as CSSProperties)
              : undefined
          }
          role="img"
          aria-label="Статическая схема сети дорог Автодора"
        >
          {renderedSvgMarkup ? (
            <div
              className={styles.mapSvg}
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
      </div>
    </div>
  );
}
