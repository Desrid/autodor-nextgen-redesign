"use client";

import { ArrowIcon } from "@/app/components/ArrowIcon";
import { SUPPORT_FAQ } from "@/app/data/home-content";
import { useEffect, useRef, useState } from "react";

export function FloatingUtilities() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const chatTriggerRef = useRef<HTMLButtonElement>(null);
  const [isBackToTopVisible, setIsBackToTopVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setIsBackToTopVisible(window.scrollY > 320);

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const openChat = () => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  };

  const closeChat = () => {
    dialogRef.current?.close();
  };

  return (
    <>
      <aside className="floating-utilities" aria-label="Быстрые действия">
        <button
          type="button"
          className="floating-button"
          data-testid="back-to-top"
          aria-label="Наверх"
          aria-hidden={!isBackToTopVisible}
          tabIndex={isBackToTopVisible ? 0 : -1}
          hidden={!isBackToTopVisible}
          onClick={() => {
            const reduced = window.matchMedia(
              "(prefers-reduced-motion: reduce)",
            ).matches;
            window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
            document.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
          }}
        >
          <ArrowIcon direction="up" />
        </button>
        <button
          ref={chatTriggerRef}
          type="button"
          className="floating-button floating-button--chat"
          data-testid="chat-trigger"
          aria-label="Открыть помощь"
          onClick={openChat}
        >
          <svg
            className="floating-button__dialog-icon"
            aria-hidden="true"
            viewBox="0 0 32 32"
            width="32"
            height="32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="var(--color-brand-orange)"
              d="M12 12.5h12a3.5 3.5 0 0 1 3.5 3.5v6a3.5 3.5 0 0 1-3.5 3.5h-4.5L15 29v-3.5h-3A3.5 3.5 0 0 1 8.5 22v-6a3.5 3.5 0 0 1 3.5-3.5Z"
            />
            <path
              fill="var(--color-brand-orange)"
              d="M8 4.5h12A3.5 3.5 0 0 1 23.5 8v6a3.5 3.5 0 0 1-3.5 3.5h-6.5L8.5 22v-4.5H8A3.5 3.5 0 0 1 4.5 14V8A3.5 3.5 0 0 1 8 4.5Z"
            />
          </svg>
        </button>
      </aside>

      <dialog
        ref={dialogRef}
        className="chat-dialog"
        data-testid="chat-dialog"
        aria-labelledby="chat-title"
        aria-describedby="chat-intro"
        onCancel={(event) => {
          event.preventDefault();
          closeChat();
        }}
        onClose={() => chatTriggerRef.current?.focus()}
      >
        <div className="chat-dialog__header">
          <h2 id="chat-title">Чем помочь?</h2>
          <button type="button" onClick={closeChat} aria-label="Закрыть чат">
            <svg
              className="chat-dialog__close-icon"
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              strokeWidth="1.5"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <p className="chat-dialog__intro" id="chat-intro">
          Частые вопросы
        </p>
        <div className="faq-list">
          {SUPPORT_FAQ.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
              {item.href && item.linkLabel ? (
                <a href={item.href}>{item.linkLabel}</a>
              ) : null}
            </details>
          ))}
        </div>
        <a className="primary-button" href="https://www.russianhighways.ru/feedback/">
          Перейти в чат
        </a>
      </dialog>
    </>
  );
}
