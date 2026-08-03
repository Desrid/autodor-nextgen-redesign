"use client";

import type { FocusEvent, MouseEvent, PointerEvent } from "react";

import Image from "next/image";

import { ArrowIcon } from "@/app/components/ArrowIcon";
import { SERVICES } from "@/app/data/home-content";

import styles from "./ServicesGrid.module.css";

const ROW_SIZE = 3;

export const SERVICES_CARD_HARNESS_CONTRACT = {
  id: "services-card-system-v1",
  sourceNodeId: "1767:7168",
  appearance: {
    accent: "#FF5100",
    cornerRadiusPx: 16,
    titleSizePx: 24,
    descriptionSizePx: 16,
    ctaHeightPx: 44,
    ctaIconSizePx: 24,
    ctaIconStrokePx: 1.5,
  },
  interaction: {
    finePointer: "hover-reveal-and-direct-click",
    coarsePointer: "details-disclosure",
    keyboard: "details-disclosure",
    reducedMotion: "instant-final-state",
  },
  motion: {
    revealDurationMs: 250,
    revealDelayMs: 90,
    routeExitDurationMs: 760,
    maxRotateXDeg: 10,
    maxRotateYDeg: 12,
  },
  scenes: {
    "route-calculator": "route-draw-to-target",
    "mobile-app": "phone-route-and-notifications",
    max: "communication-orbit",
    "legal-account": "document-sign-and-approval",
    "online-store": "package-fulfilment",
    "plate-payment": "license-scan-and-recognition",
  },
} as const;

const routeExitTimers = new WeakMap<HTMLDetailsElement, number>();

type ServiceId = (typeof SERVICES)[number]["id"];

const RUSSIAN_PREPOSITIONS =
  /(^|[\s(«„"])(из-за|из-под|без|близ|в|во|вместо|вне|для|до|за|из|к|ко|кроме|между|на|над|о|об|обо|около|от|перед|по|под|при|про|ради|с|со|сквозь|среди|у|через)\s+/giu;

function keepPrepositionsWithNextWord(text: string) {
  return text.replace(RUSSIAN_PREPOSITIONS, "$1$2\u00a0");
}

function updateServicePerspective(event: PointerEvent<HTMLDetailsElement>) {
  if (event.pointerType !== "mouse") {
    return;
  }

  const card = event.currentTarget;
  const exitTimer = routeExitTimers.get(card);

  if (exitTimer !== undefined) {
    window.clearTimeout(exitTimer);
    routeExitTimers.delete(card);
  }

  if (card.dataset.serviceId === "route-calculator") {
    card.dataset.routeMotion = "active";
  }

  const bounds = card.getBoundingClientRect();
  const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
  const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;

  card.style.setProperty(
    "--service-rotate-x",
    `${(-normalizedY * SERVICES_CARD_HARNESS_CONTRACT.motion.maxRotateXDeg).toFixed(
      2,
    )}deg`,
  );
  card.style.setProperty(
    "--service-rotate-y",
    `${(normalizedX * SERVICES_CARD_HARNESS_CONTRACT.motion.maxRotateYDeg).toFixed(
      2,
    )}deg`,
  );
}

function resetServicePerspective(event: PointerEvent<HTMLDetailsElement>) {
  event.currentTarget.style.setProperty("--service-rotate-x", "0deg");
  event.currentTarget.style.setProperty("--service-rotate-y", "0deg");

  if (
    event.pointerType !== "mouse" ||
    event.currentTarget.contains(document.activeElement) ||
    event.currentTarget.dataset.serviceId !== "route-calculator"
  ) {
    return;
  }

  const card = event.currentTarget;
  const previousTimer = routeExitTimers.get(card);

  if (previousTimer !== undefined) {
    window.clearTimeout(previousTimer);
  }

  card.dataset.routeMotion = "leaving";

  const exitTimer = window.setTimeout(() => {
    if (card.dataset.routeMotion === "leaving") {
      delete card.dataset.routeMotion;
    }

    routeExitTimers.delete(card);
  }, SERVICES_CARD_HARNESS_CONTRACT.motion.routeExitDurationMs);

  routeExitTimers.set(card, exitTimer);
}

function activateServiceCard(grid: HTMLDivElement, card: HTMLDetailsElement) {
  const row = card.closest<HTMLDivElement>("[data-services-row]");
  const rowPosition = card.dataset.rowPosition;

  if (!row || !rowPosition || !grid.contains(row)) {
    return;
  }

  for (const serviceRow of grid.querySelectorAll<HTMLElement>("[data-services-row]")) {
    if (serviceRow === row) {
      if (serviceRow.dataset.activeCard !== rowPosition) {
        serviceRow.dataset.activeCard = rowPosition;
      }
    } else if (serviceRow.dataset.activeCard !== undefined) {
      delete serviceRow.dataset.activeCard;
    }
  }
}

function clearActiveServiceCards(grid: HTMLDivElement) {
  for (const serviceRow of grid.querySelectorAll<HTMLElement>("[data-services-row]")) {
    if (serviceRow.dataset.activeCard !== undefined) {
      delete serviceRow.dataset.activeCard;
    }
  }
}

function updateActiveServiceCard(event: PointerEvent<HTMLDivElement>) {
  if (event.pointerType !== "mouse") {
    return;
  }

  const target = event.target as HTMLElement;
  const card = target.closest<HTMLDetailsElement>("[data-row-position]");

  if (!card || !event.currentTarget.contains(card)) {
    return;
  }

  activateServiceCard(event.currentTarget, card);
}

function syncActiveServiceCardFromFocus(event: FocusEvent<HTMLDivElement>) {
  const target = event.target as HTMLElement;
  const card = target.closest<HTMLDetailsElement>("[data-row-position]");

  if (card && event.currentTarget.contains(card)) {
    activateServiceCard(event.currentTarget, card);
  }
}

function clearActiveServiceCard(event: PointerEvent<HTMLDivElement>) {
  clearActiveServiceCards(event.currentTarget);
}

function clearActiveServiceCardOnPointerOut(event: PointerEvent<HTMLDivElement>) {
  if (event.pointerType !== "mouse") {
    return;
  }

  const nextTarget = event.relatedTarget as Node | null;

  if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
    clearActiveServiceCards(event.currentTarget);
  }
}

function clearActiveServiceCardOnBlur(event: FocusEvent<HTMLDivElement>) {
  const nextTarget = event.relatedTarget as Node | null;

  if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
    clearActiveServiceCards(event.currentTarget);
  }
}

function openServiceOnClick(event: MouseEvent<HTMLDetailsElement>, href: string) {
  const target = event.target as HTMLElement;
  const isDirectMouseClick =
    event.detail > 0 && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (!isDirectMouseClick || target.closest("summary") === null) {
    return;
  }

  event.preventDefault();
  window.open(href, "_blank", "noopener,noreferrer");
}

function RouteArtwork() {
  return (
    <span className={styles.expandMap}>
      <span className={styles.expandMapGradient} />
      <Image
        className={styles.expandMapDefaultMap}
        src="/media/services/route-map-russia.svg"
        alt=""
        width={3160}
        height={2058}
        unoptimized
      />

      <span className={styles.expandMapExpanded}>
        <span className={styles.expandMapSurface} />
        <svg
          className={styles.expandMapPreviewRoads}
          viewBox="0 0 360 280"
          preserveAspectRatio="none"
        >
          <path d="M182 0V64C182 82 196 98 214 98H360" />
          <path d="M252 0V74C252 88 264 98 278 98" />
          <path d="M214 98V154C214 172 228 182 246 182H360" />
          <path d="M306 98V182" />
        </svg>
        <svg
          className={styles.expandMapRoads}
          viewBox="0 0 360 280"
          preserveAspectRatio="none"
        >
          <line
            className={styles.expandMapRoadMain}
            x1="0"
            y1="98"
            x2="360"
            y2="98"
            pathLength="1"
          />
          <line
            className={styles.expandMapRoadMain}
            x1="0"
            y1="182"
            x2="360"
            y2="182"
            pathLength="1"
          />
          <line
            className={styles.expandMapRoadVertical}
            x1="108"
            y1="0"
            x2="108"
            y2="280"
            pathLength="1"
          />
          <line
            className={styles.expandMapRoadVertical}
            x1="252"
            y1="0"
            x2="252"
            y2="280"
            pathLength="1"
          />
          {[56, 140, 224].map((y) => (
            <line
              className={styles.expandMapRoadMinor}
              key={`expand-map-horizontal-${y}`}
              x1="0"
              y1={y}
              x2="360"
              y2={y}
              pathLength="1"
            />
          ))}
          {[54, 162, 198, 306].map((x) => (
            <line
              className={styles.expandMapRoadMinor}
              key={`expand-map-vertical-${x}`}
              x1={x}
              y1="0"
              x2={x}
              y2="280"
              pathLength="1"
            />
          ))}
        </svg>

        <span
          className={`${styles.expandMapBuilding} ${styles.expandMapBuildingOne}`}
        />
        <span
          className={`${styles.expandMapBuilding} ${styles.expandMapBuildingTwo}`}
        />
        <span
          className={`${styles.expandMapBuilding} ${styles.expandMapBuildingThree}`}
        />
        <span
          className={`${styles.expandMapBuilding} ${styles.expandMapBuildingFour}`}
        />
        <span
          className={`${styles.expandMapBuilding} ${styles.expandMapBuildingFive}`}
        />
        <span
          className={`${styles.expandMapBuilding} ${styles.expandMapBuildingSix}`}
        />

        <span className={styles.expandMapFade} />
        <svg
          className={styles.expandMapRouteLayer}
          viewBox="0 0 360 280"
          preserveAspectRatio="none"
        >
          <path
            className={styles.expandMapRouteShadow}
            d="M360 56H252V140H180"
            pathLength="1"
          />
          <path
            className={styles.expandMapRoute}
            d="M360 56H252V140H180"
            pathLength="1"
          />
        </svg>
        <span className={styles.expandMapPin}>
          <svg viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
        </span>
      </span>

      <span className={styles.expandMapGrid}>
        <svg viewBox="0 0 360 280" preserveAspectRatio="none">
          <defs>
            <pattern
              id="service-expand-map-grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path d="M20 0H0V20" />
            </pattern>
          </defs>
          <rect width="360" height="280" fill="url(#service-expand-map-grid)" />
        </svg>
      </span>

      <span className={styles.expandMapTarget} />
    </span>
  );
}

function MobileAppArtwork() {
  const homeIcons = Array.from({ length: 24 }, (_, index) => ({
    column: index % 4,
    index,
    row: Math.floor(index / 4),
  }));

  return (
    <svg className={styles.phoneScene} viewBox="0 0 380 240" aria-hidden="true">
      <defs>
        <linearGradient id="phone-route-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-brand-orange-light)" />
          <stop offset="0.52" stopColor="var(--color-brand-orange)" />
          <stop offset="1" stopColor="var(--color-brand-orange-hover)" />
        </linearGradient>
        <radialGradient id="phone-pin-aura">
          <stop offset="0" stopColor="var(--color-brand-orange)" stopOpacity="0.34" />
          <stop offset="1" stopColor="var(--color-brand-orange)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="phone-map-fade" cx="0" cy="1" r="1.08">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.39" stopColor="#fff" stopOpacity="0.98" />
          <stop offset="0.58" stopColor="#fff" stopOpacity="0.8" />
          <stop offset="0.86" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <pattern
          id="phone-service-map-grid"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path className={styles.phoneMapGridPath} d="M20 0H0V20" />
        </pattern>
        <clipPath id="phone-screen-clip">
          <rect x="140" y="8" width="100" height="218" rx="20" />
        </clipPath>
        <filter id="phone-soft-shadow" x="-40%" y="-40%" width="180%" height="200%">
          <feDropShadow
            dx="0"
            dy="6"
            stdDeviation="6"
            floodColor="var(--color-brand-black)"
            floodOpacity="0.13"
          />
        </filter>
      </defs>

      <g className={styles.phoneShadow}>
        <ellipse cx="190" cy="229" rx="57" ry="7" />
      </g>

      <g className={styles.phoneShell}>
        <g className={styles.phoneDevice}>
          <rect
            className={styles.phoneFrameBack}
            x="139"
            y="7"
            width="108"
            height="226"
            rx="21.5"
          />
          <rect
            className={styles.phoneFrame}
            x="136"
            y="4"
            width="108"
            height="226"
            rx="21.5"
            fill="#fff"
          />
          <rect
            className={styles.phoneScreen}
            x="140"
            y="8"
            width="100"
            height="218"
            rx="20"
            fill="#fff"
          />
          <g clipPath="url(#phone-screen-clip)">
            <g className={styles.phoneHomeScreen} data-phone-home-screen>
              <g className={styles.phoneAppGrid} data-phone-app-grid>
                {homeIcons.map(({ column, index, row }) => {
                  const x = 142 + column * 26;
                  const y = 50 + row * 26;
                  const isAutodor = index === 5;

                  return (
                    <g
                      className={
                        isAutodor
                          ? `${styles.phoneHomeIcon} ${styles.phoneAutodorIcon}`
                          : styles.phoneHomeIcon
                      }
                      data-phone-autodor-icon={isAutodor ? "true" : undefined}
                      key={index}
                    >
                      <rect x={x} y={y} width="19" height="19" rx="4.4" />
                      {isAutodor ? (
                        <g
                          className={styles.phoneAutodorGlyph}
                          transform={`translate(${x + 1.7} ${y + 4.5}) scale(0.158)`}
                        >
                          <path d="M92.302 28.26C80.908 32.197 71.901 43.043 69.768 56.593C69.695 57.056 70.065 57.478 70.536 57.478H79.658C82.789 57.478 85.518 55.356 86.276 52.331L92.302 28.26Z" />
                          <path d="M35.8911 56.4C35.6721 56.905 36.0521 57.477 36.6041 57.477H55.4871C56.0521 57.477 56.5411 57.105 56.7021 56.567C61.4861 40.595 73.7281 27.806 92.4901 23.994C93.0521 23.88 93.5031 23.462 93.6421 22.909L94.7181 18.63C70.6351 19.779 46.6191 31.663 35.8911 56.4Z" />
                          <path d="M98.4387 3.694L99.3807 0H18.9957C15.4697 0 12.3977 2.393 11.5497 5.799L8.11767 19.582C7.88067 20.534 8.83767 21.33 9.73867 20.934C33.6137 10.451 64.1077 4.947 96.9877 4.818C97.6717 4.815 98.2697 4.355 98.4387 3.694Z" />
                          <path d="M3.12361 39.438L0.145604 51.426C-0.618396 54.503 1.72061 57.477 4.90461 57.477H19.0996C19.7496 57.477 20.3346 57.105 20.6196 56.525C32.6106 32.126 57.4086 16.033 94.7076 14.332C95.3666 14.303 95.9326 13.849 96.0896 13.213L97.0766 9.20898C57.5126 9.63398 28.2876 19.099 4.83761 36.825C3.98261 37.472 3.3806 38.399 3.12361 39.438Z" />
                        </g>
                      ) : null}
                    </g>
                  );
                })}
              </g>
            </g>

            <g className={styles.phoneAppScreen} data-phone-service-screen>
              <svg
                className={styles.phoneMapReplica}
                x="140"
                y="8"
                width="100"
                height="218"
                viewBox="0 0 100 218"
              >
                <rect className={styles.phoneMapSurface} width="100" height="218" />
                <rect width="100" height="218" fill="url(#phone-service-map-grid)" />

                <g className={styles.phoneMapPreviewRoads}>
                  <path d="M50 0V50C50 64 56 76 63 76H100" />
                  <path d="M70 0V58C70 69 75 76 81 76" />
                  <path d="M63 76V120C63 134 68 144 75 144H100" />
                  <path d="M85 76V144" />
                </g>

                <g className={styles.phoneMapRoads}>
                  <line
                    className={styles.phoneMapRoadMain}
                    x1="0"
                    y1="76"
                    x2="100"
                    y2="76"
                    pathLength="1"
                  />
                  <line
                    className={styles.phoneMapRoadMain}
                    x1="0"
                    y1="144"
                    x2="100"
                    y2="144"
                    pathLength="1"
                  />
                  <line
                    className={styles.phoneMapRoadVertical}
                    x1="31"
                    y1="0"
                    x2="31"
                    y2="218"
                    pathLength="1"
                  />
                  <line
                    className={styles.phoneMapRoadVertical}
                    x1="70"
                    y1="0"
                    x2="70"
                    y2="218"
                    pathLength="1"
                  />
                  {[42, 178].map((y) => (
                    <line
                      className={styles.phoneMapRoadMinor}
                      key={`phone-map-horizontal-${y}`}
                      x1="0"
                      y1={y}
                      x2="100"
                      y2={y}
                      pathLength="1"
                    />
                  ))}
                  {[15, 85].map((x) => (
                    <line
                      className={styles.phoneMapRoadMinor}
                      key={`phone-map-vertical-${x}`}
                      x1={x}
                      y1="0"
                      x2={x}
                      y2="218"
                      pathLength="1"
                    />
                  ))}
                </g>

                <g className={styles.phoneMapBuildings}>
                  <rect x="10" y="87" width="15" height="44" rx="3" />
                  <rect x="35" y="33" width="12" height="33" rx="3" />
                  <rect x="75" y="153" width="18" height="39" rx="3" />
                  <rect x="80" y="44" width="10" height="55" rx="3" />
                  <rect x="5" y="120" width="8" height="26" rx="3" />
                  <rect x="75" y="18" width="14" height="22" rx="3" />
                </g>

                <rect
                  className={styles.phoneMapFade}
                  width="100"
                  height="218"
                  fill="url(#phone-map-fade)"
                />
                <path
                  className={styles.phoneRouteGlow}
                  d="M100 42H70V110H50"
                  pathLength="1"
                />
                <path
                  className={styles.phoneRoute}
                  d="M100 42H70V110H50"
                  pathLength="1"
                />
                <g className={styles.phonePin}>
                  <ellipse
                    className={styles.phonePinAura}
                    cx="50"
                    cy="110"
                    rx="12"
                    ry="5"
                  />
                  <ellipse
                    className={styles.phonePinPulse}
                    cx="50"
                    cy="110"
                    rx="7"
                    ry="3"
                  />
                  <path d="M50 86c-5 0-9 4-9 9 0 7 9 15 9 15s9-8 9-15c0-5-4-9-9-9Z" />
                  <circle cx="50" cy="95" r="2.5" />
                </g>
              </svg>
            </g>
          </g>

          <rect
            className={styles.phoneIsland}
            x="170"
            y="16"
            width="40"
            height="10"
            rx="4"
          />

          <path className={styles.phoneSideButton} d="M245 68v34" />
        </g>
      </g>

      <g className={`${styles.phoneNotification} ${styles.phoneNotificationOne}`}>
        <rect
          className={styles.phoneNotificationSurface}
          x="258"
          y="42"
          width="110"
          height="44"
          rx="14"
        />
        <g className={styles.phoneNotificationGlyph} transform="translate(267 52)">
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 17V7h3.75a3.25 3.25 0 0 1 0 6.5H9.5M9.5 10.25h3.75" />
        </g>
        <path className={styles.phoneNotificationLines} d="M296 59h48M296 69h35" />
      </g>

      <g className={`${styles.phoneNotification} ${styles.phoneNotificationTwo}`}>
        <rect
          className={styles.phoneNotificationSurface}
          x="264"
          y="101"
          width="104"
          height="44"
          rx="14"
        />
        <g className={styles.phoneNotificationGlyph} transform="translate(273 111)">
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="M3 10h18M7 15h4" />
        </g>
        <path className={styles.phoneNotificationLines} d="M302 118h42M302 128h31" />
      </g>

      <g className={`${styles.phoneNotification} ${styles.phoneNotificationThree}`}>
        <rect
          className={styles.phoneNotificationSurface}
          x="254"
          y="160"
          width="114"
          height="44"
          rx="14"
        />
        <g className={styles.phoneNotificationGlyph} transform="translate(263 170)">
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 19c.8-3.7 3.1-5.5 7-5.5s6.2 1.8 7 5.5" />
        </g>
        <path className={styles.phoneNotificationLines} d="M292 177h49M292 187h36" />
      </g>
    </svg>
  );
}

function MaxArtwork() {
  return (
    <span className={styles.maxScene} aria-hidden="true">
      <span className={styles.maxAura} />
      <span className={`${styles.maxOrbit} ${styles.maxOrbitChat}`}>
        <span className={styles.maxSatellite}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="4.75" y="5.25" width="14.5" height="11.5" rx="3" />
            <path d="M8 16.75v2.5l3.75-2.5M8.5 9.75h7M8.5 12.75h4.5" />
          </svg>
        </span>
      </span>
      <span className={`${styles.maxOrbit} ${styles.maxOrbitSend}`}>
        <span className={styles.maxSatellite}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m20.5 11.5-8.65 8.65a5.5 5.5 0 0 1-7.78-7.78l9.19-9.19a3.75 3.75 0 0 1 5.3 5.3l-9.2 9.2a2 2 0 0 1-2.82-2.83l8.48-8.48" />
          </svg>
        </span>
      </span>
      <span className={`${styles.maxOrbit} ${styles.maxOrbitBell}`}>
        <span className={styles.maxSatellite}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 9a6 6 0 0 0-12 0c0 6.5-2.5 7-2.5 7h17S18 15.5 18 9Z" />
            <path d="M9.75 19a2.5 2.5 0 0 0 4.5 0" />
          </svg>
        </span>
      </span>
      <Image
        className={styles.maxLogo}
        src="/media/brand/max-colored.svg"
        alt=""
        width={132}
        height={132}
        unoptimized
      />
    </span>
  );
}

function LegalAccountArtwork() {
  return (
    <svg className={styles.legalScene} viewBox="0 0 380 240" aria-hidden="true">
      <path
        className={styles.legalOrbit}
        d="M77 205C159 229 294 213 345 132C374 87 345 39 298 22"
      />
      <g className={styles.legalPayments}>
        <rect x="205" y="42" width="142" height="142" rx="18" />
        <path d="M224 73h64M224 91h98M224 112h78M224 139h91M224 157h58" />
        <circle cx="318" cy="73" r="7" />
        <circle cx="318" cy="112" r="7" />
        <circle cx="318" cy="151" r="7" />
      </g>
      <g className={styles.legalDocument}>
        <rect x="76" y="26" width="188" height="190" rx="20" />
        <rect x="96" y="45" width="82" height="12" rx="6" />
        <rect x="96" y="68" width="127" height="7" rx="3.5" />
        <g className={styles.legalRows}>
          <path d="M96 103h129" />
          <path d="M96 125h108" />
          <path d="M96 147h129" />
          <path d="M96 169h76" />
        </g>
        <path
          className={styles.legalSignature}
          d="M163 192c20-25 18 6 37-11 9-8 17 3 29-2"
        />
      </g>
      <g className={styles.legalSeal}>
        <circle cx="314" cy="188" r="32" />
        <circle cx="314" cy="188" r="24" />
        <path className={styles.legalSealCheck} d="m300 188 9 9 20-22" />
      </g>
    </svg>
  );
}

function StoreArtwork() {
  return (
    <svg className={styles.storeScene} viewBox="0 0 380 240" aria-hidden="true">
      <g className={styles.storeTransponder}>
        <rect
          className={styles.storeTransponderShadow}
          x="123"
          y="45"
          width="138"
          height="72"
          rx="20"
        />
        <rect
          className={styles.storeTransponderBody}
          x="120"
          y="42"
          width="138"
          height="72"
          rx="20"
        />
        <rect
          className={styles.storeTransponderInset}
          x="129"
          y="51"
          width="120"
          height="54"
          rx="14"
        />
        <image
          className={styles.storeTransponderLogo}
          href="/media/brand/tpass-figma.svg"
          x="138"
          y="58"
          width="102"
          height="40"
          preserveAspectRatio="xMidYMid meet"
        />
      </g>

      <g className={styles.storeFulfilmentStage}>
        <g className={styles.storeConveyor}>
          <rect
            className={styles.storeConveyorBelt}
            x="18"
            y="195"
            width="344"
            height="15"
            rx="7.5"
          />
          <path className={styles.storeConveyorDash} d="M34 202.5h312" pathLength="1" />
          <g className={styles.storeConveyorWheels}>
            <circle cx="58" cy="219" r="9" />
            <circle cx="112" cy="219" r="9" />
            <circle cx="268" cy="219" r="9" />
            <circle cx="322" cy="219" r="9" />
          </g>
        </g>

        <g className={styles.storePackingBox}>
          <rect
            className={styles.storeBoxBody}
            x="136"
            y="135"
            width="108"
            height="66"
            rx="5"
          />
          <rect
            className={styles.storeBoxLabel}
            x="151"
            y="156"
            width="37"
            height="20"
            rx="4"
          />
          <path className={styles.storeBoxLabelLines} d="M157 163h24M157 169h17" />
          <rect className={styles.storeBoxTape} x="187" y="135" width="7" height="66" />
          <path
            className={`${styles.storeBoxLid} ${styles.storeBoxLidLeft}`}
            d="M136 135v-16h54v16Z"
          />
          <path
            className={`${styles.storeBoxLid} ${styles.storeBoxLidRight}`}
            d="M190 135v-16h54v16Z"
          />
        </g>
      </g>
    </svg>
  );
}

function PlatePaymentArtwork() {
  return (
    <svg className={styles.plateScene} viewBox="0 0 400 250" aria-hidden="true">
      <defs>
        <linearGradient id="plate-scanner-trail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e31e24" stopOpacity="0" />
          <stop offset="0.58" stopColor="#ff5a5f" stopOpacity="0.12" />
          <stop offset="1" stopColor="#e31e24" stopOpacity="0.52" />
        </linearGradient>
      </defs>
      <g className={styles.plateRoad}>
        <path d="M66 250 174 160M330 250 243 160" />
        <path d="M164 250 199 169M244 250 219 169" />
      </g>
      <g className={styles.plateBody}>
        <rect
          className={styles.plateOutline}
          x="58"
          y="122"
          width="289"
          height="79"
          rx="8"
        />
        <g className={styles.plateGlyph}>
          <g transform="matrix(1.038139 0 0 1 80.0507 133.3096)">
            <path d="M159.141 14.049C158.762 16.344 158.226 18.622 157.533 20.885L154.268 31.383 164.266 31.383 161.216 21.471C160.272 18.427 159.58 15.953 159.141 14.049ZM131.798 14.049C131.419 16.344 130.883 18.622 130.19 20.885L126.925 31.383 136.923 31.383 133.872 21.471C132.929 18.427 132.237 15.953 131.798 14.049ZM13.245 14.049C12.865 16.344 12.329 18.622 11.637 20.885L8.372 31.383 18.369 31.383 15.319 21.471C14.375 18.427 13.684 15.953 13.245 14.049ZM95.421 13.756C93.79 13.756 92.425 14.758 91.324 16.761 90.223 18.765 89.672 22.65 89.672 28.416 89.672 34.232 90.231 38.129 91.348 40.108 92.465 42.087 93.896 43.077 95.642 43.077 97.289 43.077 98.667 42.075 99.776 40.072 100.885 38.068 101.44 34.183 101.44 28.416 101.44 22.585 100.881 18.683 99.764 16.712 98.647 14.741 97.199 13.756 95.421 13.756ZM72.618 13.756C70.987 13.756 69.621 14.758 68.52 16.761 67.419 18.765 66.869 22.65 66.869 28.416 66.869 34.232 67.428 38.129 68.545 40.108 69.662 42.087 71.093 43.077 72.838 43.077 74.486 43.077 75.864 42.075 76.973 40.072 78.082 38.068 78.637 34.183 78.637 28.416 78.637 22.585 78.078 18.683 76.961 16.712 75.844 14.741 74.396 13.756 72.618 13.756ZM49.815 13.756C48.184 13.756 46.818 14.758 45.717 16.761 44.616 18.765 44.066 22.65 44.066 28.416 44.066 34.232 44.624 38.129 45.741 40.108 46.859 42.087 48.29 43.077 50.035 43.077 51.682 43.077 53.061 42.075 54.17 40.072 55.279 38.068 55.833 34.183 55.833 28.416 55.833 22.585 55.275 18.683 54.157 16.712 53.04 14.741 51.593 13.756 49.815 13.756ZM129.823 10.289H133.975L145.919 45.855 157.167 10.289H161.319L173.338 46.08H168.894L165.481 35.24H153.133L149.943 46.08H145.848L141.551 46.08 138.137 35.24H125.79L122.6 46.08H118.505L129.823 10.289ZM11.27 10.289H15.422L27.441 46.08H22.998L19.584 35.24H7.236L4.046 46.08H-.049L11.27 10.289ZM95.58 10.143C98.38 10.143 100.585 11.396 102.197 13.902 104.15 16.93 105.126 21.772 105.126 28.429 105.126 34.402 104.321 38.939 102.709 42.039 101.098 45.14 98.705 46.69 95.532 46.69 92.732 46.69 90.441 45.323 88.659 42.589 86.877 39.854 85.986 35.134 85.986 28.429 85.986 22.423 86.795 17.874 88.415 14.781 90.034 11.689 92.423 10.143 95.58 10.143ZM72.777 10.143C75.577 10.143 77.782 11.396 79.393 13.902 81.346 16.93 82.323 21.772 82.323 28.429 82.323 34.402 81.517 38.939 79.906 42.039 78.295 45.14 75.902 46.69 72.728 46.69 69.929 46.69 67.638 45.323 65.856 42.589 64.074 39.854 63.182 35.134 63.182 28.429 63.182 22.423 63.992 17.874 65.612 14.781 67.231 11.689 69.62 10.143 72.777 10.143ZM49.974 10.143C52.773 10.143 54.979 11.396 56.59 13.902 58.543 16.93 59.52 21.772 59.52 28.429 59.52 34.402 58.714 38.939 57.103 42.039 55.491 45.14 53.099 46.69 49.925 46.69 47.125 46.69 44.835 45.323 43.052 42.589 41.27 39.854 40.379 35.134 40.379 28.429 40.379 22.423 41.189 17.874 42.808 14.781 44.428 11.689 46.816 10.143 49.974 10.143Z" />
          </g>
        </g>
        <path className={styles.plateSeparator} d="M274 128v67" />
        <g className={styles.plateGlyph}>
          <g transform="matrix(1.185715 0 0 1 288.3733 129.5067)">
            <path d="M30.387 6.884H42.528V9.071C40.715 11.426 39.121 14.491 37.746 18.267 36.371 22.043 35.58 25.785 35.371 29.493H33.012C33.043 27.577 33.347 25.342 33.924 22.79 34.501 20.238 35.293 17.806 36.301 15.493 37.309 13.181 38.395 11.212 39.559 9.587H30.387V6.884ZM15.795 6.884H27.936V9.071C26.123 11.426 24.529 14.491 23.154 18.267 21.779 22.043 20.988 25.785 20.779 29.493H18.42C18.451 27.577 18.755 25.342 19.332 22.79 19.909 20.238 20.701 17.806 21.709 15.493 22.717 13.181 23.803 11.212 24.967 9.587H15.795V6.884ZM1.203 6.884H13.344V9.071C11.531 11.426 9.938 14.491 8.563 18.267 7.188 22.043 6.396 25.785 6.188 29.493H3.828C3.859 27.577 4.163 25.342 4.74 22.79 5.317 20.238 6.109 17.806 7.117 15.493 8.125 13.181 9.211 11.212 10.375 9.587H1.203V6.884Z" />
          </g>
        </g>
        <g className={styles.plateGlyph}>
          <g transform="matrix(1.230462 0 0 1 285.1475 170.7291)">
            <path d="M1.547 3.133V5.738H3.384C3.785 5.738 4.089 5.689 4.297 5.593 4.505 5.496 4.669 5.344 4.791 5.136 4.913 4.928 4.974 4.687 4.974 4.411 4.974 4.014 4.857 3.701 4.625 3.474 4.392 3.246 4.046 3.133 3.588 3.133H1.547ZM7.205 2.263H8.059V6.807C8.059 7.519 8.114 8.035 8.225 8.353 8.336 8.672 8.518 8.915 8.771 9.081 9.023 9.248 9.33 9.331 9.692 9.331 10.3 9.331 10.742 9.159 11.016 8.815 11.29 8.472 11.427 7.802 11.427 6.807V2.263H12.281V6.812C12.281 7.575 12.206 8.2 12.058 8.689 11.909 9.178 11.639 9.564 11.248 9.847 10.856 10.13 10.358 10.271 9.753 10.271 8.902 10.271 8.265 10.017 7.841 9.508 7.417 9 7.205 8.101 7.205 6.812V2.263ZM.693 2.263H3.556C4.154 2.263 4.595 2.336 4.88 2.483 5.164 2.629 5.398 2.874 5.581 3.215 5.763 3.557 5.854 3.953 5.854 4.404 5.854 4.998 5.7 5.48 5.39 5.848 5.08 6.217 4.63 6.451 4.039 6.551 4.279 6.696 4.462 6.842 4.587 6.989 4.841 7.29 5.065 7.625 5.258 7.994L6.386 10.137H5.312L4.451 8.499C4.117 7.859 3.866 7.427 3.696 7.205 3.526 6.983 3.361 6.833 3.202 6.756 3.043 6.679 2.82 6.64 2.534 6.64H1.547V10.137H.693V2.263ZM15.962 2.123C16.442 2.123 16.862 2.218 17.222 2.408 17.581 2.597 17.861 2.87 18.059 3.224 18.258 3.579 18.365 3.996 18.379 4.476L17.557 4.551C17.514 4.039 17.361 3.659 17.098 3.412 16.835 3.165 16.465 3.041 15.989 3.041 15.505 3.041 15.137 3.15 14.882 3.366 14.628 3.583 14.501 3.863 14.501 4.207 14.501 4.525 14.594 4.773 14.78 4.948 14.967 5.123 15.385 5.301 16.037 5.481 16.674 5.657 17.121 5.81 17.379 5.939 17.773 6.141 18.07 6.405 18.271 6.733 18.472 7.06 18.572 7.451 18.572 7.905 18.572 8.356 18.467 8.766 18.255 9.136 18.044 9.506 17.757 9.788 17.393 9.981 17.03 10.174 16.592 10.271 16.08 10.271 15.282 10.271 14.645 10.031 14.171 9.551 13.696 9.071 13.45 8.421 13.432 7.602L14.238 7.516C14.281 7.949 14.378 8.286 14.531 8.528 14.683 8.77 14.9 8.964 15.183 9.111 15.466 9.258 15.785 9.331 16.139 9.331 16.648 9.331 17.042 9.207 17.324 8.959 17.605 8.71 17.745 8.388 17.745 7.991 17.745 7.759 17.694 7.556 17.592 7.383 17.49 7.209 17.336 7.067 17.13 6.957 16.924 6.846 16.479 6.689 15.795 6.487 15.187 6.306 14.753 6.124 14.496 5.942 14.238 5.759 14.037 5.527 13.894 5.246 13.751 4.965 13.679 4.647 13.679 4.293 13.679 3.656 13.885 3.135 14.297 2.73 14.709 2.325 15.264 2.123 15.962 2.123Z" />
          </g>
        </g>
        <g className={styles.plateFlag}>
          <rect x="313" y="168" width="26" height="12" rx="1" />
          <path className={styles.plateFlagBlue} d="M314 172h24v4h-24Z" />
          <path className={styles.plateFlagRed} d="M314 176h24v3h-24Z" />
        </g>
      </g>
      <g className={styles.plateTarget}>
        <path d="M78 92H48v30" pathLength="1" />
        <path d="M327 92h30v30" pathLength="1" />
        <path d="M48 161v30h30" pathLength="1" />
        <path d="M357 161v30h-30" pathLength="1" />
      </g>
      <rect
        className={styles.plateScannerTrail}
        x="0"
        y="106"
        width="76"
        height="71"
        rx="6"
        fill="url(#plate-scanner-trail)"
      />
      <rect
        className={styles.plateScanner}
        x="74"
        y="106"
        width="4"
        height="71"
        rx="2"
      />
      <g className={styles.plateSuccess}>
        <circle cx="205" cy="206" r="25" />
        <path d="m193 206 8 8 17-19" />
      </g>
    </svg>
  );
}

function ServiceArtwork({ id }: Readonly<{ id: ServiceId }>) {
  if (id === "route-calculator") {
    return <RouteArtwork />;
  }

  if (id === "mobile-app") {
    return <MobileAppArtwork />;
  }

  if (id === "max") {
    return <MaxArtwork />;
  }

  if (id === "legal-account") {
    return <LegalAccountArtwork />;
  }

  if (id === "online-store") {
    return <StoreArtwork />;
  }

  return <PlatePaymentArtwork />;
}

export function ServicesGrid() {
  const rows = [SERVICES.slice(0, ROW_SIZE), SERVICES.slice(ROW_SIZE)];

  return (
    <div
      className={`services-grid ${styles.grid}`}
      data-testid="services-grid"
      onPointerMove={updateActiveServiceCard}
      onPointerOut={clearActiveServiceCardOnPointerOut}
      onPointerLeave={clearActiveServiceCard}
      onFocusCapture={syncActiveServiceCardFromFocus}
      onBlurCapture={clearActiveServiceCardOnBlur}
    >
      {rows.map((row, rowIndex) => (
        <div
          className={`services-row ${styles.row}`}
          data-services-row
          key={`services-row-${rowIndex + 1}`}
        >
          {row.map((service, cardIndex) => (
            <details
              key={service.id}
              className={`service-card ${styles.card}`}
              data-service-id={service.id}
              data-row-position={cardIndex + 1}
              data-testid={`service-${service.id}`}
              data-node-id={service.nodeId}
              data-card-system={SERVICES_CARD_HARNESS_CONTRACT.id}
              data-motion-scene={SERVICES_CARD_HARNESS_CONTRACT.scenes[service.id]}
              onPointerMove={updateServicePerspective}
              onPointerLeave={resetServicePerspective}
              onClick={(event) => openServiceOnClick(event, service.href)}
            >
              <summary className={styles.summary}>
                <span className={styles.copy}>
                  <span className={`service-card__title ${styles.title}`}>
                    {keepPrepositionsWithNextWord(service.title)}
                  </span>
                  <span
                    className={`service-card__teaser ${styles.teaser}`}
                    aria-hidden="true"
                  >
                    {keepPrepositionsWithNextWord(service.description)}
                  </span>
                  <span className={styles.serviceCta} aria-hidden="true">
                    <span>Открыть сервис</span>
                    <svg className={styles.serviceCtaIcon} viewBox="0 0 24 24">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </span>
                <span
                  className={`service-card__visual ${styles.visual}`}
                  data-artwork={service.id}
                  aria-hidden="true"
                >
                  <ServiceArtwork id={service.id} />
                </span>
              </summary>
              <div className={`service-card__body ${styles.body}`}>
                <p>{keepPrepositionsWithNextWord(service.description)}</p>
                <a href={service.href} target="_blank" rel="noreferrer">
                  {keepPrepositionsWithNextWord(service.actionLabel)}
                  <ArrowIcon className="inline-arrow-icon" direction="right" />
                  <span className="visually-hidden">
                    {
                      " (\u043e\u0442\u043a\u0440\u043e\u0435\u0442\u0441\u044f \u0432 \u043d\u043e\u0432\u043e\u0439 \u0432\u043a\u043b\u0430\u0434\u043a\u0435)"
                    }
                  </span>
                </a>
              </div>
            </details>
          ))}
        </div>
      ))}
    </div>
  );
}
