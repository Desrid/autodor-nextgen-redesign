"use client";

import {
  Children,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type SyntheticEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

type GalleryDescription = Readonly<{ title: string; description: string }>;

type MediaGalleryProps = Readonly<{
  children: ReactNode;
  descriptions: readonly GalleryDescription[];
  label: string;
}>;

const AUTO_SCROLL_PX_PER_SECOND = 100;
const MAX_SCROLL_FRAME_MS = 32;

function GalleryArrow({ direction }: Readonly<{ direction: "left" | "right" }>) {
  const path = direction === "left" ? "M19 12H5m6-6-6 6 6 6" : "M5 12h14m-6-6 6 6-6 6";

  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} />
    </svg>
  );
}

export function MediaGallery({ children, descriptions, label }: MediaGalleryProps) {
  const items = Children.toArray(children);
  const railRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const activeIndexRef = useRef(0);
  const pauseRef = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dragRef = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const itemCount = Math.min(items.length, descriptions.length);
  const helpId = useId();
  const statusId = useId();

  const normalizeScroll = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const loopWidth = rail.scrollWidth / 2;
    if (!loopWidth) return;
    if (rail.scrollLeft >= loopWidth) rail.scrollLeft -= loopWidth;
    if (rail.scrollLeft < 0) rail.scrollLeft += loopWidth;
  }, []);

  const updateActiveItem = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const originals = [...rail.querySelectorAll<HTMLElement>("[data-media-original]")];
    const loopWidth = rail.scrollWidth / 2;
    if (!loopWidth) return;
    const position = ((rail.scrollLeft % loopWidth) + loopWidth) % loopWidth;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    originals.forEach((item, index) => {
      const distance = Math.abs(item.offsetLeft - rail.offsetLeft - position);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    if (nearestIndex !== activeIndexRef.current) {
      activeIndexRef.current = nearestIndex;
      setActiveIndex(nearestIndex);
    }
  }, []);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const tick = (time: number) => {
      const rail = railRef.current;
      if (rail && !pauseRef.current && !reduceMotion && !dragRef.current.active) {
        const elapsed = Math.min(
          time - (lastTimeRef.current ?? time),
          MAX_SCROLL_FRAME_MS,
        );
        // Increasing scrollLeft moves the visible images from right to left.
        rail.scrollLeft += (elapsed * AUTO_SCROLL_PX_PER_SECOND) / 1000;
        normalizeScroll();
        updateActiveItem();
      }
      lastTimeRef.current = time;
      animationRef.current = requestAnimationFrame(tick);
    };
    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    };
  }, [normalizeScroll, reduceMotion, updateActiveItem]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedIndex]);

  function scrollToItem(index: number) {
    if (!itemCount) return;
    const rail = railRef.current;
    const normalizedIndex = (index + itemCount) % itemCount;
    const item = rail?.querySelectorAll<HTMLElement>("[data-media-original]")[
      normalizedIndex
    ];
    if (!rail || !item) return;
    rail.scrollTo({ left: item.offsetLeft - rail.offsetLeft, behavior: "smooth" });
    activeIndexRef.current = normalizedIndex;
    setActiveIndex(normalizedIndex);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToItem(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    const rail = railRef.current;
    if (!rail) return;
    dragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      scrollLeft: rail.scrollLeft,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;
    if (!rail || !dragRef.current.active) return;
    const delta = event.clientX - dragRef.current.startX;
    if (Math.abs(delta) > 8 && !dragRef.current.moved) {
      dragRef.current.moved = true;
      rail.setPointerCapture(event.pointerId);
    }
    rail.scrollLeft = dragRef.current.scrollLeft - delta;
    normalizeScroll();
    updateActiveItem();
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;
    if (rail?.hasPointerCapture(event.pointerId))
      rail.releasePointerCapture(event.pointerId);
    dragRef.current.active = false;
  }

  function openItem(index: number, event: SyntheticEvent<HTMLButtonElement>) {
    triggerRef.current = event.currentTarget;
    setSelectedIndex(index);
  }

  function closeLightbox() {
    setSelectedIndex(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function handleLightboxKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;

    const first = focusable.item(0);
    const last = focusable.item(focusable.length - 1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const selected = selectedIndex === null ? null : descriptions[selectedIndex];

  return (
    <div className="media-gallery" aria-label={label} role="region">
      <p id={helpId} className="visually-hidden">
        Галерея движется автоматически. Используйте стрелки или перетаскивание для
        навигации. Нажмите на изображение, чтобы открыть описание.
      </p>
      <div
        ref={railRef}
        className="media-rail"
        data-testid="media-rail"
        tabIndex={0}
        aria-describedby={helpId}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => {
          pauseRef.current = true;
        }}
        onMouseLeave={() => {
          pauseRef.current = false;
        }}
        onFocusCapture={() => {
          pauseRef.current = true;
        }}
        onBlurCapture={() => {
          pauseRef.current = false;
        }}
      >
        <p id={statusId} className="visually-hidden" aria-live="polite">
          Изображение {activeIndex + 1} из {itemCount}
        </p>
        {[false, true].map((duplicate) => (
          <div
            className="media-gallery__set"
            key={duplicate ? "duplicate" : "original"}
            aria-hidden={duplicate || undefined}
          >
            {items.map((item, index) => (
              <button
                className="media-gallery__item"
                type="button"
                key={`${duplicate ? "duplicate" : "original"}-${index}`}
                data-media-item
                data-media-original={duplicate ? undefined : "true"}
                disabled={duplicate}
                aria-describedby={duplicate ? undefined : statusId}
                aria-label={
                  duplicate
                    ? undefined
                    : `Открыть: ${descriptions[index]?.title ?? "изображение"}`
                }
                onClick={(event) => openItem(index, event)}
              >
                {item}
                <span className="media-gallery__caption" aria-hidden="true">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{descriptions[index]?.title}</strong>
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
      {selected && selectedIndex !== null ? (
        <div
          className="media-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="media-lightbox-title"
          onClick={closeLightbox}
          onKeyDown={handleLightboxKeyDown}
        >
          <div
            ref={dialogRef}
            className="media-lightbox__panel"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="media-lightbox__close"
              type="button"
              aria-label="Закрыть просмотр"
              autoFocus
              onClick={closeLightbox}
            >
              ×
            </button>
            <div className="media-lightbox__image">
              {items[selectedIndex]}
              <div
                className="media-lightbox__navigation"
                aria-label="Навигация по галерее"
              >
                <button
                  type="button"
                  aria-label="Предыдущее изображение"
                  onClick={() =>
                    setSelectedIndex((selectedIndex - 1 + itemCount) % itemCount)
                  }
                >
                  <GalleryArrow direction="left" />
                </button>
                <button
                  type="button"
                  aria-label="Следующее изображение"
                  onClick={() => setSelectedIndex((selectedIndex + 1) % itemCount)}
                >
                  <GalleryArrow direction="right" />
                </button>
              </div>
            </div>
            <div className="media-lightbox__copy">
              <h2 id="media-lightbox-title">{selected.title}</h2>
              <p>{selected.description}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
