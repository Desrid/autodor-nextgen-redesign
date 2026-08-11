"use client";

import { useEffect, useRef, useState } from "react";

import { ArrowIcon } from "@/app/components/ArrowIcon";
import { CONTACT_TABS } from "@/app/data/home-content";

import styles from "./ContactsTabs.module.css";

const HEAD_OFFICE_ADDRESS = "127006, Москва, Страстной бульвар, 9";

const ADDITIONAL_CONTACT_TABS = [
  {
    id: "development",
    label: "ООО «АВТОДОР - ДЕВЕЛОПМЕНТ»",
    name: "ООО «АВТОДОР - ДЕВЕЛОПМЕНТ»",
    phone: "+7 (495) 249-06-95",
    email: "",
    href: "",
    isConcept: false,
  },
  {
    id: "operation",
    label: "ООО «АВТОДОР - ЭКСПЛУАТАЦИЯ»",
    name: "ООО «АВТОДОР - ЭКСПЛУАТАЦИЯ»",
    phone: "+7 (495) 727-11-95 (доб. 6115)",
    email: "",
    href: "",
    isConcept: false,
  },
  {
    id: "concept-logistics",
    label: "Концепт «Автодор Логистика»",
    name: "«Автодор Логистика» — концептуальное ДЗО",
    phone: "",
    email: "",
    href: "",
    isConcept: true,
  },
] as const;

const OFFICIAL_WEBSITES = {
  "state-company": { href: "https://russianhighways.ru/", label: "russianhighways.ru" },
  "management-company": { href: "https://avtodor-mc.ru/", label: "avtodor-mc.ru" },
  "avtodor-tp": { href: "https://etp-avtodor.ru/", label: "etp-avtodor.ru" },
  "toll-roads": { href: "https://avtodor-tr.ru/", label: "avtodor-tr.ru" },
  engineering: { href: "https://avtodor-eng.ru/", label: "avtodor-eng.ru" },
  "sk-avtodor": { href: "https://skavtodor.ru/", label: "skavtodor.ru" },
} as const;

const DISPLAY_CONTACT_TABS = [
  ...CONTACT_TABS.map((contact) => ({
    ...contact,
    isConcept: false,
    website: OFFICIAL_WEBSITES[contact.id as keyof typeof OFFICIAL_WEBSITES] ?? null,
  })),
  ...ADDITIONAL_CONTACT_TABS.map((contact) => ({ ...contact, website: null })),
] as const;

const CONTACT_TAB_ICONS = {
  "state-company": {
    name: "state-road-network",
    path: "M4 21V8l8-5 8 5v13M8 21l2-10M16 21l-2-10M12 7v2M12 13v2M12 19v2",
  },
  "management-company": {
    name: "subsidiary-management",
    path: "M12 7v4M6 13v-2h12v2M4 13h4v4H4zM10 3h4v4h-4zM16 13h4v4h-4zM6 17v3M18 17v3",
  },
  "avtodor-tp": {
    name: "electronic-procurement-cart",
    path: "M3 4h2l2.2 10h10.6l2-7H6M10 10l2 2 4-4M9 19a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM17 19a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z",
  },
  "toll-roads": {
    name: "toll-operator",
    path: "M3 21V10h18v11M5 10l2-4h10l2 4M3 14h18M7 21v-4M17 21v-4M10 18h4",
  },
  "avtodor-up": {
    name: "road-restoration",
    path: "M4 21h16M7 21 9 6h6l2 15M8 15h8M9 10h6M5 18h14",
  },
  engineering: {
    name: "road-engineering",
    path: "M12 3 9 10 5 21M12 3l3 7 4 11M9 10h6M7 17h10M5 21h14",
  },
  "sk-avtodor": {
    name: "road-construction",
    path: "M4 15a8 8 0 0 1 16 0M3 15h18v4H3zM9 15V8M15 15V8M8 22h8",
  },
  development: {
    name: "roadside-services",
    path: "M5 21V5h10v16M7 8h6v5H7zM15 9h2l2 2v7a2 2 0 0 0 2 2V9l-2-2M8 21h5",
  },
  operation: {
    name: "road-maintenance",
    path: "M14.7 6.3a4 4 0 0 0-5.66 5.66l-6.5 6.5a2.12 2.12 0 0 0 3 3l6.5-6.5a4 4 0 0 0 5.66-5.66l-3 3-3-3 3-3Z",
  },
  "concept-logistics": {
    name: "logistics-route",
    path: "M3 7h11v9H3zM14 11h4l3 4v1h-7M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM3 4h10",
  },
} as const satisfies Record<
  (typeof DISPLAY_CONTACT_TABS)[number]["id"],
  { name: string; path: string }
>;

function ContactTabIcon({ id }: { id: keyof typeof CONTACT_TAB_ICONS }) {
  const icon = CONTACT_TAB_ICONS[id];

  return (
    <svg
      className={styles.tabIcon}
      data-contact-icon={icon.name}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={icon.path}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type BorderGeometry = {
  height: number;
  path: string;
  width: number;
};

const EMPTY_BORDER_GEOMETRY: BorderGeometry = {
  height: 1,
  path: "",
  width: 1,
};

const round = (value: number) => Math.round(value * 100) / 100;

const telephoneHref = (phone: string) => {
  const [number = "", extension] = phone.split(/\s*\(доб\.\s*/i);
  const normalizedNumber = number.replace(/[^+\d]/g, "");
  const normalizedExtension = extension?.replace(/\D/g, "");

  return `tel:${normalizedNumber}${normalizedExtension ? `;ext=${normalizedExtension}` : ""}`;
};

export function ContactsTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [borderGeometry, setBorderGeometry] = useState(EMPTY_BORDER_GEOMETRY);
  const directoryRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const directory = directoryRef.current;
    const activeTab = tabRefs.current[activeIndex];
    const activePanel = panelRefs.current[activeIndex];

    if (!directory || !activeTab || !activePanel) return;

    const updateBorderGeometry = () => {
      const directoryRect = directory.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();
      const panelRect = activePanel.getBoundingClientRect();

      if (
        directoryRect.width <= 0 ||
        directoryRect.height <= 0 ||
        tabRect.width <= 0 ||
        panelRect.width <= 0
      ) {
        return;
      }

      const panelLeft = round(panelRect.left - directoryRect.left);
      const panelRight = round(panelRect.right - directoryRect.left);
      const panelTop = round(panelRect.top - directoryRect.top);
      const panelBottom = round(panelRect.bottom - directoryRect.top);
      const tabLeft = round(tabRect.left - directoryRect.left);
      const tabTop = round(tabRect.top - directoryRect.top);
      const tabBottom = round(tabRect.bottom - directoryRect.top);
      const panelRadius = Math.min(24, panelRect.height / 2, panelRect.width / 2);
      const tabRadius = Math.min(16, tabRect.height / 2, tabRect.width / 2);
      const topJoinRadius = Math.min(
        20,
        tabRect.height / 2,
        Math.max(0, tabTop - panelTop - panelRadius),
      );
      const bottomJoinRadius = Math.min(
        20,
        tabRect.height / 2,
        Math.max(0, panelBottom - panelRadius - tabBottom),
      );

      const path = [
        `M ${round(panelLeft + panelRadius)} ${panelTop}`,
        `H ${round(panelRight - panelRadius)}`,
        `Q ${panelRight} ${panelTop} ${panelRight} ${round(panelTop + panelRadius)}`,
        `V ${round(panelBottom - panelRadius)}`,
        `Q ${panelRight} ${panelBottom} ${round(panelRight - panelRadius)} ${panelBottom}`,
        `H ${round(panelLeft + panelRadius)}`,
        `Q ${panelLeft} ${panelBottom} ${panelLeft} ${round(panelBottom - panelRadius)}`,
        `V ${round(tabBottom + bottomJoinRadius)}`,
        `Q ${panelLeft} ${tabBottom} ${round(panelLeft - bottomJoinRadius)} ${tabBottom}`,
        `H ${round(tabLeft + tabRadius)}`,
        `Q ${tabLeft} ${tabBottom} ${tabLeft} ${round(tabBottom - tabRadius)}`,
        `V ${round(tabTop + tabRadius)}`,
        `Q ${tabLeft} ${tabTop} ${round(tabLeft + tabRadius)} ${tabTop}`,
        `H ${round(panelLeft - topJoinRadius)}`,
        `Q ${panelLeft} ${tabTop} ${panelLeft} ${round(tabTop - topJoinRadius)}`,
        `V ${round(panelTop + panelRadius)}`,
        `Q ${panelLeft} ${panelTop} ${round(panelLeft + panelRadius)} ${panelTop}`,
        "Z",
      ].join(" ");

      const nextGeometry = {
        height: round(directoryRect.height),
        path,
        width: round(directoryRect.width),
      };

      setBorderGeometry((current) =>
        current.path === nextGeometry.path &&
        current.width === nextGeometry.width &&
        current.height === nextGeometry.height
          ? current
          : nextGeometry,
      );
    };

    updateBorderGeometry();

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(updateBorderGeometry);
    observer.observe(directory);
    observer.observe(activeTab);
    observer.observe(activePanel);

    return () => observer.disconnect();
  }, [activeIndex]);

  const select = (index: number, focus = false) => {
    const next = (index + DISPLAY_CONTACT_TABS.length) % DISPLAY_CONTACT_TABS.length;
    setActiveIndex(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  return (
    <div
      ref={directoryRef}
      className={`contacts-directory ${styles.directory}`}
      data-testid="contacts-tabs"
    >
      <div
        className={`contacts-tabs ${styles.tabs}`}
        role="tablist"
        aria-label="Компании группы"
        aria-orientation="vertical"
        onKeyDown={(event) => {
          if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
            return;
          }

          event.preventDefault();
          if (event.key === "Home") select(0, true);
          if (event.key === "End") select(DISPLAY_CONTACT_TABS.length - 1, true);
          if (event.key === "ArrowUp") select(activeIndex - 1, true);
          if (event.key === "ArrowDown") select(activeIndex + 1, true);
        }}
      >
        {DISPLAY_CONTACT_TABS.map((contact, index) => (
          <button
            key={contact.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={`contact-tab-${contact.id}`}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls={`contact-panel-${contact.id}`}
            tabIndex={activeIndex === index ? 0 : -1}
            className={styles.tab}
            title={contact.label}
            onClick={() => select(index)}
          >
            <ContactTabIcon id={contact.id} />
            <span className={styles.tabLabel}>
              {contact.id === "state-company" ? "ГК «АВТОДОР»" : contact.label}
            </span>
          </button>
        ))}
      </div>

      <svg
        className={styles.borderFx}
        data-testid="contacts-border-effect"
        viewBox={`0 0 ${borderGeometry.width} ${borderGeometry.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="contacts-beam-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop
              offset="0"
              stopColor="var(--color-brand-orange-light)"
              stopOpacity="0.68"
            />
            <stop offset="0.5" stopColor="var(--color-brand-orange)" />
            <stop
              offset="1"
              stopColor="var(--color-brand-orange-soft)"
              stopOpacity="0.72"
            />
          </linearGradient>
        </defs>
        <path
          className={styles.borderBeam}
          data-testid="contacts-border-beam"
          d={borderGeometry.path}
          pathLength="100"
          stroke="url(#contacts-beam-gradient)"
        />
      </svg>

      {DISPLAY_CONTACT_TABS.map((contact, index) => (
        <div
          key={contact.id}
          ref={(node) => {
            panelRefs.current[index] = node;
          }}
          id={`contact-panel-${contact.id}`}
          className={`contact-panel ${styles.panel}`}
          role="tabpanel"
          aria-labelledby={`contact-tab-${contact.id}`}
          hidden={activeIndex !== index}
        >
          <h3>{contact.name}</h3>
          <div className={`contact-panel__details ${styles.details}`}>
            {contact.phone ? (
              <a
                className={`contact-panel__row ${styles.row}`}
                href={telephoneHref(contact.phone)}
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M6 3h3l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
                {contact.phone}
              </a>
            ) : (
              <div className={`contact-panel__row ${styles.row} ${styles.unavailable}`}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M6 3h3l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
                Телефон не предоставлен
              </div>
            )}
            {contact.email ? (
              <a
                className={`contact-panel__row ${styles.row}`}
                href={`mailto:${contact.email}`}
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                {contact.email}
              </a>
            ) : (
              <div className={`contact-panel__row ${styles.row} ${styles.unavailable}`}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                Email не предоставлен
              </div>
            )}
            {contact.website ? (
              <a
                className={`contact-panel__row ${styles.row}`}
                href={contact.website.href}
                aria-label={`Сайт ${contact.name}: ${contact.website.label}`}
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21M12 3c-2.4 2.5-3.6 5.5-3.6 9S9.6 18.5 12 21"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
                {contact.website.label}
              </a>
            ) : null}
            {contact.id === "state-company" ? (
              <address className={`contact-panel__address ${styles.address}`}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 21s7-5.1 7-12A7 7 0 1 0 5 9c0 6.9 7 12 7 12Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <circle
                    cx="12"
                    cy="9"
                    r="2.25"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
                <span>{HEAD_OFFICE_ADDRESS}</span>
              </address>
            ) : null}
          </div>
          <div className={`contact-panel__actions ${styles.actions}`}>
            {contact.href ? (
              <a
                className={`contact-panel__more ${styles.more} card-cta`}
                href={contact.href}
              >
                Подробнее
                <ArrowIcon className="card-cta__icon" direction="right" />
              </a>
            ) : contact.isConcept ? (
              <span className={styles.conceptNote}>Концептуальная карточка</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
