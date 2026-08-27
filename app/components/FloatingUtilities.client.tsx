"use client";

import { ArrowIcon } from "@/app/components/ArrowIcon";
import { Icon } from "@/app/components/icons";
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
          <Icon className="floating-button__dialog-icon" name="chat" size={32} />
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
            <Icon className="chat-dialog__close-icon" name="close" size={24} />
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
