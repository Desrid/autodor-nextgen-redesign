"use client";

import {
  Children,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type GalleryDescription = Readonly<{ title: string; description: string }>;

type MediaGalleryProps = Readonly<{
  children: ReactNode;
  descriptions: readonly GalleryDescription[];
  label: string;
}>;

export function MediaGallery({ children, descriptions, label }: MediaGalleryProps) {
  const items = Children.toArray(children);
  const railRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const pauseRef = useRef(false);
  const dragRef = useRef({ active: false, moved: false, startX: 0, scrollLeft: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const normalizeScroll = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const loopWidth = rail.scrollWidth / 2;
    if (rail.scrollLeft >= loopWidth) rail.scrollLeft -= loopWidth;
    if (rail.scrollLeft < 0) rail.scrollLeft += loopWidth;
  }, []);

  const updateActiveItem = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const originals = [...rail.querySelectorAll<HTMLElement>("[data-media-original]")];
    const loopWidth = rail.scrollWidth / 2;
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
    setActiveIndex(nearestIndex);
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
        const elapsed = Math.min(time - (lastTimeRef.current ?? time), 40);
        rail.scrollLeft += elapsed * 0.025;
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
    const rail = railRef.current;
    const normalizedIndex = (index + items.length) % items.length;
    const item = rail?.querySelectorAll<HTMLElement>("[data-media-original]")[
      normalizedIndex
    ];
    if (!rail || !item) return;
    rail.scrollTo({ left: item.offsetLeft - rail.offsetLeft, behavior: "smooth" });
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

  const selected = selectedIndex === null ? null : descriptions[selectedIndex];

  return (
    <div
      className="media-gallery"
      aria-label={label}
      role="region"
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
      <p id="media-gallery-help" className="visually-hidden">
        Галерея движется автоматически. Используйте стрелки или перетаскивание для
        навигации. Нажмите на изображение, чтобы открыть описание.
      </p>
      <div
        ref={railRef}
        className="media-rail"
        data-testid="media-rail"
        tabIndex={0}
        aria-describedby="media-gallery-help"
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {[false, true].map((duplicate) => (
          <div
            className="media-gallery__set"
            key={duplicate ? "duplicate" : "original"}
            aria-hidden={duplicate || undefined}
          >
            {items.map((item, index) => (
              <div
                className="media-gallery__item"
                role="button"
                key={`${duplicate ? "duplicate" : "original"}-${index}`}
                data-media-item
                data-media-original={duplicate ? undefined : "true"}
                tabIndex={duplicate ? -1 : 0}
                aria-label={
                  duplicate
                    ? undefined
                    : `Открыть: ${descriptions[index]?.title ?? "изображение"}`
                }
                onClick={() => setSelectedIndex(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedIndex(index);
                  }
                }}
              >
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="media-gallery__status" aria-live="polite" aria-atomic="true">
        <span className="visually-hidden">Изображение </span>
        {activeIndex + 1} / {items.length}
      </p>

      {selected && selectedIndex !== null ? (
        <div
          className="media-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="media-lightbox-title"
          onClick={() => setSelectedIndex(null)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setSelectedIndex(null);
          }}
        >
          <div
            className="media-lightbox__panel"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="media-lightbox__close"
              type="button"
              aria-label="Закрыть просмотр"
              autoFocus
              onClick={() => setSelectedIndex(null)}
            >
              ×
            </button>
            <div className="media-lightbox__image">{items[selectedIndex]}</div>
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
