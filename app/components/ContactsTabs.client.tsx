"use client";

import { useRef, useState } from "react";

import { CONTACT_TABS } from "@/app/data/home-content";

export function ContactsTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = (index: number, focus = false) => {
    const next = (index + CONTACT_TABS.length) % CONTACT_TABS.length;
    setActiveIndex(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  return (
    <div className="contacts-directory" data-testid="contacts-tabs">
      <div
        className="contacts-tabs"
        role="tablist"
        aria-label="Компании группы"
        aria-orientation="vertical"
        onKeyDown={(event) => {
          if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
            return;
          }

          event.preventDefault();
          if (event.key === "Home") select(0, true);
          if (event.key === "End") select(CONTACT_TABS.length - 1, true);
          if (event.key === "ArrowUp") select(activeIndex - 1, true);
          if (event.key === "ArrowDown") select(activeIndex + 1, true);
        }}
      >
        {CONTACT_TABS.map((contact, index) => (
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
            onClick={() => select(index)}
          >
            {contact.label}
          </button>
        ))}
      </div>

      {CONTACT_TABS.map((contact, index) => (
        <div
          key={contact.id}
          id={`contact-panel-${contact.id}`}
          className="contact-panel"
          role="tabpanel"
          aria-labelledby={`contact-tab-${contact.id}`}
          hidden={activeIndex !== index}
        >
          <h3>{contact.name}</h3>
          <div className="contact-panel__details">
            <a
              className="contact-panel__row"
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
            <a className="contact-panel__row" href={`mailto:${contact.email}`}>
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
            <a className="contact-panel__more" href={contact.href}>
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
          </div>
        </div>
      ))}
    </div>
  );
}
