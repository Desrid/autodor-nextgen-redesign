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
    "legal-account": "document-scan-and-approval",
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
  return (
    <svg className={styles.phoneScene} viewBox="0 0 380 240" aria-hidden="true">
      <defs>
        <linearGradient id="phone-frame-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-page)" />
          <stop offset="0.56" stopColor="var(--color-surface-subtle)" />
          <stop offset="1" stopColor="var(--color-gray-3)" />
        </linearGradient>
        <linearGradient id="phone-screen-gradient" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="var(--color-page)" />
          <stop offset="0.52" stopColor="var(--color-brand-orange-faint)" />
          <stop offset="1" stopColor="var(--color-surface-subtle)" />
        </linearGradient>
        <linearGradient id="phone-route-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-brand-orange-light)" />
          <stop offset="0.52" stopColor="var(--color-brand-orange)" />
          <stop offset="1" stopColor="var(--color-brand-orange-hover)" />
        </linearGradient>
        <radialGradient id="phone-pin-aura">
          <stop offset="0" stopColor="var(--color-brand-orange)" stopOpacity="0.34" />
          <stop offset="1" stopColor="var(--color-brand-orange)" stopOpacity="0" />
        </radialGradient>
        <clipPath id="phone-screen-clip">
          <rect x="80" y="21" width="122" height="190" rx="23" />
        </clipPath>
        <filter id="phone-soft-shadow" x="-40%" y="-40%" width="180%" height="200%">
          <feDropShadow
            dx="0"
            dy="7"
            stdDeviation="7"
            floodColor="var(--color-brand-black)"
            floodOpacity="0.15"
          />
        </filter>
      </defs>

      <path
        className={styles.phoneOrbit}
        d="M69 174C18 136 53 62 134 47C233 28 356 47 357 120C359 188 291 216 205 210"
      />
      <g className={styles.phoneOrbitNodes}>
        <circle cx="62" cy="166" r="4" />
        <circle cx="280" cy="45" r="3.5" />
        <circle cx="356" cy="120" r="4" />
        <circle cx="285" cy="210" r="3.5" />
      </g>

      <g className={styles.phoneShadow}>
        <ellipse cx="145" cy="224" rx="79" ry="10" />
      </g>

      <g className={styles.phoneShell}>
        <g className={styles.phoneDevice} transform="rotate(3 141 119)">
          <rect
            className={styles.phoneFrameBack}
            x="71"
            y="10"
            width="138"
            height="215"
            rx="31"
          />
          <rect
            className={styles.phoneFrame}
            x="68"
            y="7"
            width="138"
            height="215"
            rx="31"
            fill="url(#phone-frame-gradient)"
          />
          <rect
            className={styles.phoneScreen}
            x="80"
            y="21"
            width="122"
            height="190"
            rx="23"
            fill="url(#phone-screen-gradient)"
          />
          <rect
            className={styles.phoneIsland}
            x="119"
            y="27"
            width="44"
            height="9"
            rx="4.5"
          />

          <g clipPath="url(#phone-screen-clip)">
            <g className={styles.phoneMap}>
              <path d="M57 68C97 71 117 62 153 48S207 38 226 45" />
              <path d="M65 108C105 91 134 103 169 88S210 63 225 68" />
              <path d="M68 144C102 137 125 149 158 132S208 112 225 119" />
              <path d="M97 21C91 58 102 81 93 112S77 168 83 213" />
              <path d="M146 21C143 52 150 78 143 104S128 158 135 212" />
              <path d="M188 21C180 57 190 89 179 123S166 174 171 212" />
            </g>
            <path
              className={styles.phoneRouteGlow}
              d="M111 130C119 113 149 126 157 106S138 87 164 75S147 64 160 54"
            />
            <path
              className={styles.phoneRoute}
              d="M111 130C119 113 149 126 157 106S138 87 164 75S147 64 160 54"
              stroke="url(#phone-route-gradient)"
            />

            <g className={styles.phoneNavigator}>
              <circle cx="111" cy="130" r="12" />
              <path d="m106 132 3-8 8 3-5 2-1 5-2-4-3 2Z" />
            </g>

            <g className={styles.phonePin}>
              <circle className={styles.phonePinAura} cx="160" cy="54" r="28" />
              <circle className={styles.phonePinPulse} cx="160" cy="54" r="13" />
              <path d="M160 38c-10 0-17 7-17 16 0 13 17 28 17 28s17-15 17-28c0-9-7-16-17-16Z" />
              <circle cx="160" cy="54" r="5" />
            </g>

            <g className={styles.phoneTopBar}>
              <path d="M91 43h13M91 47h10M91 51h8" />
              <path d="M184 45c0-4 5-4 5 0v4l2 3h-9l2-3v-4Z" />
            </g>

            <g className={styles.phoneDockPanel}>
              <rect x="87" y="145" width="108" height="48" rx="14" />
              <path className={styles.phoneDockLabel} d="M99 154h28M99 160h40" />
              <path className={styles.phoneDockAmount} d="M157 153h23M157 160h16" />

              <g className={`${styles.phoneTile} ${styles.phoneTileRoad}`}>
                <rect x="95" y="170" width="20" height="20" rx="6" />
                <path d="M102 186h7M104 173l-2 13M108 173l2 13M103 180h6" />
              </g>
              <g className={`${styles.phoneTile} ${styles.phoneTileCar}`}>
                <rect x="120" y="170" width="20" height="20" rx="6" />
                <path d="m124 181 2-5h8l2 5M124 181h12v5h-12v-5ZM126 186v2M134 186v2" />
              </g>
              <g className={`${styles.phoneTile} ${styles.phoneTileShield}`}>
                <rect x="145" y="170" width="20" height="20" rx="6" />
                <path d="M155 174 160 176v4c0 4-2 6-5 8-3-2-5-4-5-8v-4l5-2Z" />
              </g>
              <g className={`${styles.phoneTile} ${styles.phoneTileParking}`}>
                <rect x="170" y="170" width="20" height="20" rx="6" />
                <path d="M177 187v-13h5a4 4 0 0 1 0 8h-5M178 176h4a2 2 0 0 1 0 4h-4" />
              </g>
            </g>

            <g className={styles.phoneBottomNav}>
              <path d="m101 203 5-5 5 5v5h-10v-5Z" />
              <circle cx="133" cy="203" r="5" />
              <path d="M130 203h6M133 200v6" />
              <path d="M158 198h10v10h-10Z" />
              <circle cx="188" cy="203" r="5" />
            </g>
          </g>

          <path className={styles.phoneSideButton} d="M207 67v30" />
        </g>
      </g>

      <g className={`${styles.phoneNotification} ${styles.phoneNotificationOne}`}>
        <rect
          className={styles.phoneNotificationSurface}
          x="224"
          y="38"
          width="139"
          height="49"
          rx="15"
        />
        <circle className={styles.phoneNotificationIcon} cx="248" cy="62.5" r="11" />
        <path
          className={styles.phoneNotificationRoadIcon}
          d="M243 69h10M245 55l-2 14M251 55l2 14M244 62h8"
        />
        <path className={styles.phoneNotificationLines} d="M269 56h68M269 68h49" />
        <path className={styles.phoneNotificationArrow} d="m345 59 4 4-4 4" />
      </g>

      <g className={`${styles.phoneNotification} ${styles.phoneNotificationTwo}`}>
        <rect
          className={styles.phoneNotificationSurface}
          x="230"
          y="101"
          width="134"
          height="49"
          rx="15"
        />
        <circle className={styles.phoneNotificationIcon} cx="254" cy="125.5" r="11" />
        <path
          className={styles.phoneNotificationShieldIcon}
          d="M254 117 260 119v5c0 5-2 7-6 10-4-3-6-5-6-10v-5l6-2Z"
        />
        <path className={styles.phoneNotificationLines} d="M275 119h63M275 131h44" />
        <path className={styles.phoneNotificationArrow} d="m346 122 4 4-4 4" />
      </g>

      <g className={`${styles.phoneNotification} ${styles.phoneNotificationThree}`}>
        <rect
          className={styles.phoneNotificationSurface}
          x="216"
          y="164"
          width="139"
          height="49"
          rx="15"
        />
        <circle className={styles.phoneNotificationIcon} cx="240" cy="188.5" r="11" />
        <path
          className={styles.phoneNotificationParkingIcon}
          d="M236 196v-15h5a4 4 0 0 1 0 8h-5M237 183h4a2 2 0 0 1 0 4h-4"
        />
        <path className={styles.phoneNotificationLines} d="M261 182h68M261 194h48" />
        <path className={styles.phoneNotificationArrow} d="m337 185 4 4-4 4" />
      </g>
    </svg>
  );
}

function MaxArtwork() {
  return (
    <span className={styles.maxScene} aria-hidden="true">
      <span className={styles.maxAura} />
      <span className={`${styles.maxSatellite} ${styles.maxSatelliteChat}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 5.5h14v10H11l-4.5 3v-3H5v-10Z" />
          <path d="M8.5 10.5h7" />
        </svg>
      </span>
      <span className={`${styles.maxSatellite} ${styles.maxSatelliteSend}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m4.5 11.5 15-7-5 15-3.2-5-6.8-3Z" />
          <path d="m11.3 14.5 3-3" />
        </svg>
      </span>
      <span className={`${styles.maxSatellite} ${styles.maxSatelliteBell}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 16.5h10l-1.5-2V10a3.5 3.5 0 0 0-7 0v4.5l-1.5 2Z" />
          <path d="M10.5 19h3" />
        </svg>
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
      <rect
        className={styles.legalScan}
        x="72"
        y="105"
        width="281"
        height="5"
        rx="2.5"
      />
      <g className={styles.legalSeal}>
        <circle cx="314" cy="188" r="32" />
        <circle cx="314" cy="188" r="24" />
        <path d="m300 188 9 9 20-22" />
      </g>
    </svg>
  );
}

function StoreArtwork() {
  return (
    <svg className={styles.storeScene} viewBox="0 0 380 240" aria-hidden="true">
      <path
        className={styles.storeJourney}
        d="M292 30C338 59 346 111 318 145C287 183 225 189 191 219"
      />
      <g className={styles.storeConveyor}>
        <path d="M18 193h344" />
        <circle cx="58" cy="207" r="12" />
        <circle cx="116" cy="207" r="12" />
        <circle cx="288" cy="207" r="12" />
        <circle cx="338" cy="207" r="12" />
        <path className={styles.storeConveyorDash} d="M31 193h317" />
      </g>
      <g className={styles.storePackage}>
        <path d="m132 76 74-29 66 35-76 32-64-38Z" />
        <path d="m132 76 64 38v74l-64-37V76Z" />
        <path d="m196 114 76-32v74l-76 32v-74Z" />
        <path className={styles.storeTape} d="m168 62 67 36v25l-13-8-11 18-15-19" />
      </g>
      <g className={styles.storeBadge}>
        <rect x="36" y="28" width="132" height="58" rx="15" />
        <text x="54" y="50">
          Транспондер T-pass
        </text>
        <text className={styles.storePrice} x="54" y="73">
          3 900 ₽
        </text>
      </g>
      <g className={styles.storePin}>
        <circle cx="315" cy="67" r="15" />
        <circle cx="315" cy="67" r="5" />
        <path d="M315 82v18" />
      </g>
      <g className={styles.storeSpark}>
        <path d="M74 117v18M65 126h18" />
        <path d="M286 25v14M279 32h14" />
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
