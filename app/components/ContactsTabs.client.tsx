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
    name: "procurement-hammer",
    path: "M20.344 9.141 20.438 9.891 20.156 10.594 15.328 15.328 14.625 15.469 13.875 15.234 12.422 13.781 12.328 13.219 12.75 12.047 12.516 11.812 11.766 12.516 10.969 12.375 6.938 17.391 4.125 20.156 2.906 20.484 1.547 20.016 0.844 19.078 0.703 17.859 1.172 16.781 3.656 14.297 8.766 10.172 8.625 9.422 9.328 8.578 9 8.438 8.016 8.812 7.266 8.672 5.953 7.312 5.766 6.094 6.047 5.531 10.922 0.844 11.719 0.75 12.328 0.984 13.688 2.297 13.828 2.906 13.453 3.984 13.594 4.359 14.391 3.938 15.281 4.031 16.969 5.578 17.25 6.234 17.203 6.984 16.828 7.547 17.016 7.781 18.609 7.359ZM7.266 6.422 7.969 7.219 9.516 6.797 10.359 7.547 11.297 6.797 12.047 7.031 12.234 7.453 12.094 8.016 10.453 9.609 11.438 10.734 13.125 9.047 13.781 8.906 14.25 9.234 14.344 9.891 13.641 10.781 14.344 11.578 13.969 13.219 14.672 13.922 18.938 9.703 18.234 8.953 16.875 9.375 16.359 9.234 15.047 7.875 15.047 7.219 15.75 6.469 14.719 5.484 14.062 6.094 13.547 6.234 12.234 5.156 11.812 4.547 12.234 3 11.484 2.25ZM21.75 22.688 21.188 23.25 10.312 23.25 9.75 22.688 9.75 20.719 10.266 19.828 11.25 19.5 11.391 18.047 12.281 17.297 18.984 17.25 20.016 17.906 20.25 18.516 20.25 19.5 20.953 19.641 21.516 20.156 21.75 20.766ZM2.25 18 2.297 18.469 2.625 18.844 3.562 18.703 5.766 16.5 9.938 11.344 9.797 11.25 4.594 15.469ZM11.25 21 11.25 21.75 20.25 21.75 20.25 21ZM12.75 18.75 12.75 19.5 18.75 19.5 18.75 18.75Z",
    filled: true,
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
  { name: string; path: string; filled?: boolean }
>;

function ContactTabIcon({ id }: { id: keyof typeof CONTACT_TAB_ICONS }) {
  const icon = CONTACT_TAB_ICONS[id];
  const filled = "filled" in icon && icon.filled;

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
        fill={filled ? "currentColor" : "none"}
        fillRule={filled ? "evenodd" : undefined}
        clipRule={filled ? "evenodd" : undefined}
        stroke={filled ? "none" : "currentColor"}
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
