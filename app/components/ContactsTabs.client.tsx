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
        aria-label="Организации"
        onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          if (event.key === "Home") select(0, true);
          if (event.key === "End") select(CONTACT_TABS.length - 1, true);
          if (event.key === "ArrowLeft") select(activeIndex - 1, true);
          if (event.key === "ArrowRight") select(activeIndex + 1, true);
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
          <div>
            <p>Контакт</p>
            <h3>{contact.name}</h3>
          </div>
          <div className="contact-panel__details">
            {contact.phone ? (
              <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}>
                {contact.phone}
              </a>
            ) : null}
            {contact.email ? (
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            ) : null}
            {contact.status !== "verified" ? (
              <p>
                Полный телефон и email требуют повторной проверки в официальном реестре.
              </p>
            ) : null}
            <a className="text-link" href={contact.href}>
              Подробнее
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
