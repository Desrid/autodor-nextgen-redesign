"use client";

import { useRef } from "react";

export function FloatingUtilities() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const chatTriggerRef = useRef<HTMLButtonElement>(null);

  const openChat = () => {
    dialogRef.current?.showModal();
  };

  const closeChat = () => {
    dialogRef.current?.close();
    chatTriggerRef.current?.focus();
  };

  return (
    <>
      <aside className="floating-utilities" aria-label="Быстрые действия">
        <button
          type="button"
          className="floating-button"
          data-testid="back-to-top"
          aria-label="Наверх"
          onClick={() => {
            const reduced = window.matchMedia(
              "(prefers-reduced-motion: reduce)",
            ).matches;
            window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
            document.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
          }}
        >
          <span aria-hidden="true">↑</span>
        </button>
        <button
          ref={chatTriggerRef}
          type="button"
          className="floating-button floating-button--chat"
          data-testid="chat-trigger"
          aria-label="Открыть помощь"
          onClick={openChat}
        >
          <span aria-hidden="true">?</span>
        </button>
      </aside>

      <dialog
        ref={dialogRef}
        className="chat-dialog"
        data-testid="chat-dialog"
        aria-labelledby="chat-title"
        onCancel={(event) => {
          event.preventDefault();
          closeChat();
        }}
        onClose={() => chatTriggerRef.current?.focus()}
      >
        <div className="chat-dialog__header">
          <h2 id="chat-title">Чем помочь?</h2>
          <button type="button" onClick={closeChat} aria-label="Закрыть чат">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <p className="chat-dialog__intro">Частые вопросы</p>
        <div className="faq-list">
          <details>
            <summary>Как оплатить проезд?</summary>
            <p>
              Перейдите в сервис оплаты и выберите доступный способ для вашей поездки.
            </p>
            <a href="https://russianhighways.ru/for_drivers/">
              Открыть сервисы водителя
            </a>
          </details>
          <details>
            <summary>Что делать при поломке?</summary>
            <p>
              Позвоните по короткому номеру *2323. Помощь на платной дороге оказывается
              безвозмездно.
            </p>
          </details>
          <details>
            <summary>Как связаться с компанией?</summary>
            <p>
              Общий телефон: +7 (495) 727-11-95. Ситуационный центр: +7 (495) 580-98-41.
            </p>
          </details>
        </div>
        <a className="primary-button" href="https://www.russianhighways.ru/feedback/">
          Перейти к форме обращения
        </a>
      </dialog>
    </>
  );
}
