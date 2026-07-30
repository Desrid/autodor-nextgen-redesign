"use client";

import { useEffect } from "react";

export const CARD_TILT_TARGETS = [
  ".hero-actions a",
  ".loyalty-card__tilt",
  ".news-card",
  ".news-bento__all",
  ".important-state",
  ".media-gallery__item:not(:disabled)",
  ".subsidiary-card",
  ".social-card",
  ".future-projects article",
] as const;

export const CARD_TILT_SELECTOR = CARD_TILT_TARGETS.join(",");

export const CARD_TILT_MOTION = {
  maxRotateXDeg: 10,
  maxRotateYDeg: 12,
  perspectiveRem: 62.5,
} as const;

const TILT_CLASS_NAME = "cursor-tilt-card";
const DEFAULT_POINTER_X = "58%";
const DEFAULT_POINTER_Y = "42%";

function findTiltCard(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return null;
  }

  const card = target.closest<HTMLElement>(CARD_TILT_SELECTOR);

  return card?.classList.contains(TILT_CLASS_NAME) ? card : null;
}

function resetCard(card: HTMLElement) {
  card.style.setProperty("--cursor-card-rotate-x", "0deg");
  card.style.setProperty("--cursor-card-rotate-y", "0deg");
  card.style.setProperty("--cursor-card-pointer-x", DEFAULT_POINTER_X);
  card.style.setProperty("--cursor-card-pointer-y", DEFAULT_POINTER_Y);
  delete card.dataset.cursorTilt;
}

export function CardTiltController() {
  useEffect(() => {
    const registeredCards = new Set<HTMLElement>();

    function registerCard(card: HTMLElement) {
      if (registeredCards.has(card)) {
        return;
      }

      card.classList.add(TILT_CLASS_NAME);
      registeredCards.add(card);
    }

    function registerCards(root: ParentNode) {
      if (root instanceof HTMLElement && root.matches(CARD_TILT_SELECTOR)) {
        registerCard(root);
      }

      root.querySelectorAll<HTMLElement>(CARD_TILT_SELECTOR).forEach(registerCard);
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType && event.pointerType !== "mouse") {
        return;
      }

      const card = findTiltCard(event.target);

      if (!card) {
        return;
      }

      const bounds = card.getBoundingClientRect();

      if (bounds.width <= 0 || bounds.height <= 0) {
        return;
      }

      const pointerX = Math.min(
        1,
        Math.max(0, (event.clientX - bounds.left) / bounds.width),
      );
      const pointerY = Math.min(
        1,
        Math.max(0, (event.clientY - bounds.top) / bounds.height),
      );
      const normalizedX = pointerX - 0.5;
      const normalizedY = pointerY - 0.5;

      card.style.setProperty(
        "--cursor-card-rotate-x",
        `${(-normalizedY * CARD_TILT_MOTION.maxRotateXDeg).toFixed(2)}deg`,
      );
      card.style.setProperty(
        "--cursor-card-rotate-y",
        `${(normalizedX * CARD_TILT_MOTION.maxRotateYDeg).toFixed(2)}deg`,
      );
      card.style.setProperty(
        "--cursor-card-pointer-x",
        `${(pointerX * 100).toFixed(1)}%`,
      );
      card.style.setProperty(
        "--cursor-card-pointer-y",
        `${(pointerY * 100).toFixed(1)}%`,
      );
      card.dataset.cursorTilt = "active";
    }

    function handlePointerOut(event: PointerEvent) {
      const card = findTiltCard(event.target);

      if (!card) {
        return;
      }

      if (event.relatedTarget instanceof Node && card.contains(event.relatedTarget)) {
        return;
      }

      resetCard(card);
    }

    function resetActiveCards() {
      registeredCards.forEach((card) => {
        if (card.dataset.cursorTilt === "active") {
          resetCard(card);
        }
      });
    }

    registerCards(document.documentElement);

    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            registerCards(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    document.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    document.addEventListener("pointerout", handlePointerOut);
    document.addEventListener("pointercancel", resetActiveCards);
    window.addEventListener("blur", resetActiveCards);

    return () => {
      observer.disconnect();
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerout", handlePointerOut);
      document.removeEventListener("pointercancel", resetActiveCards);
      window.removeEventListener("blur", resetActiveCards);

      registeredCards.forEach((card) => {
        resetCard(card);
        card.classList.remove(TILT_CLASS_NAME);
      });
    };
  }, []);

  return null;
}
