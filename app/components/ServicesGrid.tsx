"use client";

import type { MouseEvent, PointerEvent } from "react";

import Image from "next/image";

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
  card.style.setProperty(
    "--service-pointer-x",
    `${((normalizedX + 0.5) * 100).toFixed(1)}%`,
  );
  card.style.setProperty(
    "--service-pointer-y",
    `${((normalizedY + 0.5) * 100).toFixed(1)}%`,
  );
}

function resetServicePerspective(event: PointerEvent<HTMLDetailsElement>) {
  event.currentTarget.style.setProperty("--service-rotate-x", "0deg");
  event.currentTarget.style.setProperty("--service-rotate-y", "0deg");
  event.currentTarget.style.setProperty("--service-pointer-x", "58%");
  event.currentTarget.style.setProperty("--service-pointer-y", "42%");

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
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.56" stopColor="#f7f5f4" />
          <stop offset="1" stopColor="#dcdbe2" />
        </linearGradient>
        <linearGradient id="phone-screen-gradient" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#fffdfb" />
          <stop offset="0.52" stopColor="#fff7f1" />
          <stop offset="1" stopColor="#eef4f4" />
        </linearGradient>
        <linearGradient id="phone-route-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb23e" />
          <stop offset="0.52" stopColor="#ff5100" />
          <stop offset="1" stopColor="#ff7652" />
        </linearGradient>
        <radialGradient id="phone-pin-aura">
          <stop offset="0" stopColor="#ff5100" stopOpacity="0.34" />
          <stop offset="1" stopColor="#ff5100" stopOpacity="0" />
        </radialGradient>
        <clipPath id="phone-screen-clip">
          <rect x="80" y="21" width="122" height="190" rx="23" />
        </clipPath>
        <filter id="phone-soft-shadow" x="-40%" y="-40%" width="180%" height="200%">
          <feDropShadow
            dx="0"
            dy="7"
            stdDeviation="7"
            floodColor="#513426"
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
        <text className={styles.plateNumber} x="80" y="180">
          А 000 АА
        </text>
        <path className={styles.plateSeparator} d="M274 128v67" />
        <text className={styles.plateRegion} x="289.8" y="159">
          777
        </text>
        <text className={styles.plateCountry} x="286" y="181">
          RUS
        </text>
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
    <div className={`services-grid ${styles.grid}`} data-testid="services-grid">
      {rows.map((row, rowIndex) => (
        <div
          className={`services-row ${styles.row}`}
          key={`services-row-${rowIndex + 1}`}
        >
          {row.map((service) => (
            <details
              key={service.id}
              className={`service-card ${styles.card}`}
              data-service-id={service.id}
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
                  <span aria-hidden="true">↗</span>
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
