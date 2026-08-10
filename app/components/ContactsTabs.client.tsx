"use client";

import { useEffect, useRef, useState } from "react";

import { CONTACT_TABS } from "@/app/data/home-content";

import styles from "./ContactsTabs.module.css";

const HEAD_OFFICE_ADDRESS = "127006, Москва, Страстной бульвар, 9";

const CONCEPT_CONTACT_TABS = [
  {
    id: "concept-logistics",
    label: "Концепт «Автодор Логистика»",
    name: "«Автодор Логистика» — концептуальное ДЗО",
    phone: "",
    email: "",
    href: "",
  },
  {
    id: "concept-digital",
    label: "Концепт «Автодор Цифра»",
    name: "«Автодор Цифра» — концептуальное ДЗО",
    phone: "",
    email: "",
    href: "",
  },
  {
    id: "concept-infrastructure",
    label: "Концепт «Автодор Инфраструктура»",
    name: "«Автодор Инфраструктура» — концептуальное ДЗО",
    phone: "",
    email: "",
    href: "",
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
    website: OFFICIAL_WEBSITES[contact.id as keyof typeof OFFICIAL_WEBSITES] ?? null,
  })),
  ...CONCEPT_CONTACT_TABS.map((contact) => ({ ...contact, website: null })),
] as const;

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
            {contact.id === "state-company" ? "ГК «АВТОДОР»" : contact.label}
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
                href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
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
              <a className={`contact-panel__more ${styles.more}`} href={contact.href}>
                Подробнее
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            ) : (
              <span className={styles.conceptNote}>Концептуальная карточка</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
