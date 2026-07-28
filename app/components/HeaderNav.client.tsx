"use client";

/* eslint-disable jsx-a11y/role-supports-aria-props -- Preserve the production Sites v3 search combobox contract. */

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";

import {
  HEADER_CONTACTS,
  HEADER_NAVIGATION_GROUPS,
  HEADER_SOCIAL_LINKS,
  PRIMARY_NAVIGATION,
} from "@/app/data/header-navigation";

type HeaderLayer = "closed" | "megaMenu" | "search" | "language" | "mobileMenu";

type OpenHeaderLayer = Exclude<HeaderLayer, "closed">;

const EXIT_DURATION_MS = 180;
const MAX_SEARCH_SUGGESTIONS = 6;

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const SEARCH_ITEMS = [
  ...PRIMARY_NAVIGATION,
  ...HEADER_NAVIGATION_GROUPS.flatMap((group) => [
    ...group.links,
    ...("secondary" in group ? group.secondary.links : []),
  ]),
].filter(
  (item, index, items) =>
    items.findIndex(
      (candidate) => candidate.label === item.label && candidate.href === item.href,
    ) === index,
);

export function HeaderNav() {
  const [activeLayer, setActiveLayer] = useState<HeaderLayer>("closed");
  const [renderedLayer, setRenderedLayer] = useState<OpenHeaderLayer | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const headerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchSuggestionRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const mobileCloseRef = useRef<HTMLButtonElement>(null);
  const languageCurrentRef = useRef<HTMLAnchorElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sentinelVisibleRef = useRef(true);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeLayer = useCallback(
    (restoreFocus = true) => {
      if (!renderedLayer) return;

      clearCloseTimer();
      setActiveLayer("closed");
      setIsClosing(true);

      if (activeLayer === "search") {
        setSearchQuery("");
      }

      if (restoreFocus) {
        restoreFocusRef.current?.focus();
      }

      closeTimerRef.current = setTimeout(() => {
        setRenderedLayer(null);
        setIsClosing(false);
        closeTimerRef.current = null;
      }, EXIT_DURATION_MS);
    },
    [activeLayer, clearCloseTimer, renderedLayer],
  );

  const toggleLayer = useCallback(
    (layer: OpenHeaderLayer, trigger: HTMLElement) => {
      if (activeLayer === layer) {
        closeLayer();
        return;
      }

      clearCloseTimer();
      restoreFocusRef.current = trigger;
      setRenderedLayer(layer);
      setActiveLayer(layer);
      setIsClosing(false);
    },
    [activeLayer, clearCloseTimer, closeLayer],
  );

  const closeAfterNavigation = useCallback(() => {
    closeLayer(false);
  }, [closeLayer]);

  useEffect(() => clearCloseTimer, [clearCloseTimer]);

  useEffect(() => {
    const sentinel = document.getElementById("header-scroll-sentinel");
    if (
      !sentinel ||
      typeof IntersectionObserver === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    const desktop = window.matchMedia("(min-width: 1280px)");

    const observer = new IntersectionObserver(
      ([entry]) => {
        sentinelVisibleRef.current = entry?.isIntersecting ?? true;
        setIsScrolled(desktop.matches && !sentinelVisibleRef.current);
      },
      { rootMargin: "-104px 0px 0px 0px", threshold: 0 },
    );

    observer.observe(sentinel);
    const handleDesktopChange = () => {
      setIsScrolled(desktop.matches && !sentinelVisibleRef.current);
    };

    desktop.addEventListener("change", handleDesktopChange);
    return () => {
      observer.disconnect();
      desktop.removeEventListener("change", handleDesktopChange);
    };
  }, []);

  useEffect(() => {
    const header = headerRef.current?.closest<HTMLElement>(".site-header");
    if (!header) return;

    const shouldFrost =
      isScrolled &&
      activeLayer !== "megaMenu" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(min-width: 1280px)").matches &&
      !window.matchMedia("(prefers-reduced-transparency: reduce)").matches;

    if (shouldFrost) {
      header.style.backdropFilter = "blur(20px) saturate(112%)";
    } else {
      header.style.removeProperty("backdrop-filter");
    }

    return () => {
      header.style.removeProperty("backdrop-filter");
    };
  }, [activeLayer, isScrolled]);

  useEffect(() => {
    if (!renderedLayer || activeLayer === "closed" || isClosing) return;

    const frame = requestAnimationFrame(() => {
      if (activeLayer === "search") searchInputRef.current?.focus();
      if (activeLayer === "language") languageCurrentRef.current?.focus();
      if (activeLayer === "mobileMenu") mobileCloseRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [activeLayer, isClosing, renderedLayer]);

  useEffect(() => {
    if (activeLayer === "closed") return;

    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        closeLayer();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLayer();
        return;
      }

      if (event.key !== "Tab" || activeLayer !== "mobileMenu") return;

      const focusable =
        panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeLayer, closeLayer]);

  useEffect(() => {
    if (activeLayer !== "mobileMenu") return;

    const previousOverflow = document.body.style.overflow;
    const main = document.querySelector<HTMLElement>("main");
    const mainWasInert = main?.inert ?? false;
    document.body.style.overflow = "hidden";
    if (main) main.inert = true;

    return () => {
      document.body.style.overflow = previousOverflow;
      if (main) main.inert = mainWasInert;
    };
  }, [activeLayer]);

  useEffect(() => {
    if (activeLayer !== "mobileMenu" || typeof window.matchMedia !== "function") {
      return;
    }

    const desktop = window.matchMedia("(min-width: 1280px)");
    const handleDesktopChange = () => {
      if (desktop.matches) closeLayer(false);
    };

    desktop.addEventListener("change", handleDesktopChange);
    return () => desktop.removeEventListener("change", handleDesktopChange);
  }, [activeLayer, closeLayer]);

  const onLayerButtonClick =
    (layer: OpenHeaderLayer) => (event: ReactMouseEvent<HTMLButtonElement>) => {
      toggleLayer(layer, event.currentTarget);
    };

  const searchSuggestions = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("ru");
    if (!query) return [];

    return SEARCH_ITEMS.filter((item) =>
      item.label.toLocaleLowerCase("ru").includes(query),
    ).slice(0, MAX_SEARCH_SUGGESTIONS);
  }, [searchQuery]);

  const focusSearchSuggestion = useCallback((index: number) => {
    searchSuggestionRefs.current[index]?.focus();
  }, []);

  const onSearchInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && searchSuggestions.length) {
      event.preventDefault();
      focusSearchSuggestion(0);
    }
  };

  const onSearchSuggestionKeyDown = (
    event: ReactKeyboardEvent<HTMLAnchorElement>,
    index: number,
  ) => {
    if (event.key === "ArrowDown" && index < searchSuggestions.length - 1) {
      event.preventDefault();
      focusSearchSuggestion(index + 1);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (index === 0) {
        searchInputRef.current?.focus();
      } else {
        focusSearchSuggestion(index - 1);
      }
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusSearchSuggestion(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      focusSearchSuggestion(searchSuggestions.length - 1);
    }
  };

  const panelClassName = [
    "header-layer",
    isClosing ? "header-layer--closing" : "header-layer--open",
    renderedLayer === "mobileMenu" ? "header-layer--mobile" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={headerRef}
      className={`header-shell${isScrolled ? " header-shell--scrolled" : ""}`}
      data-header-state={activeLayer}
    >
      <a
        className="brand-lockup"
        href="https://russianhighways.ru/"
        aria-label="Государственная компания Автодор, главная"
        aria-current="page"
      >
        <Image
          src="/brand/autodor-logo.svg"
          alt=""
          width={726}
          height={123}
          priority
          unoptimized
        />
      </a>

      <nav className="desktop-navigation" aria-label="Основная навигация">
        <ul>
          {PRIMARY_NAVIGATION.map((item) => (
            <li key={item.label}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
          <li>
            <button
              ref={moreButtonRef}
              className="more-button"
              type="button"
              aria-label={
                activeLayer === "megaMenu"
                  ? "Закрыть дополнительную навигацию"
                  : "Открыть дополнительную навигацию"
              }
              aria-expanded={activeLayer === "megaMenu"}
              aria-controls="header-mega-panel"
              onClick={onLayerButtonClick("megaMenu")}
            >
              <span className="more-button__icon" aria-hidden="true">
                {Array.from({ length: 9 }, (_, index) => (
                  <i key={index} />
                ))}
              </span>
              <span>Ещё</span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="header-actions">
        <div className="language-control">
          <button
            ref={languageButtonRef}
            className="language-button"
            type="button"
            aria-label="Выбрать язык"
            aria-expanded={activeLayer === "language"}
            aria-controls="header-language-panel"
            onClick={onLayerButtonClick("language")}
          >
            <span>РУС</span>
            <span className="language-button__chevron" aria-hidden="true" />
          </button>
          {renderedLayer === "language" ? (
            <div
              id="header-language-panel"
              className={panelClassName}
              data-layer="language"
              aria-hidden={isClosing || undefined}
              style={{
                insetBlockEnd: "auto",
                insetInlineStart: 0,
                insetInlineEnd: "auto",
                minHeight: 0,
              }}
            >
              <a
                ref={languageCurrentRef}
                href="https://russianhighways.ru/"
                aria-current="page"
              >
                <span
                  className="language-option__flag language-option__flag--ru"
                  aria-hidden="true"
                />
                РУС
              </a>
              <a href="https://russianhighways.ru/en/" hrefLang="en" lang="en">
                <span
                  className="language-option__flag language-option__flag--en"
                  aria-hidden="true"
                />
                ENG
              </a>
            </div>
          ) : null}
        </div>
        <button
          ref={searchButtonRef}
          className="icon-button search-button"
          type="button"
          aria-label={activeLayer === "search" ? "Закрыть поиск" : "Открыть поиск"}
          aria-expanded={activeLayer === "search"}
          aria-controls="header-search-panel"
          onClick={onLayerButtonClick("search")}
        >
          <Image
            src="/brand/header/search.svg"
            alt=""
            width={24}
            height={24}
            unoptimized
          />
        </button>
        <a className="account-link" href="https://avtodor-tr.ru/account/">
          Личный кабинет
        </a>
        <button
          ref={mobileButtonRef}
          className="menu-button"
          type="button"
          aria-label={activeLayer === "mobileMenu" ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={activeLayer === "mobileMenu"}
          aria-controls="header-mega-panel"
          onClick={onLayerButtonClick("mobileMenu")}
        >
          Меню
        </button>
      </div>

      {renderedLayer && renderedLayer !== "language" ? (
        <div
          ref={panelRef}
          id={renderedLayer === "search" ? "header-search-panel" : "header-mega-panel"}
          className={panelClassName}
          data-layer={renderedLayer}
          role={renderedLayer === "mobileMenu" ? "dialog" : undefined}
          aria-modal={renderedLayer === "mobileMenu" ? "true" : undefined}
          aria-labelledby={
            renderedLayer === "mobileMenu" ? "mobile-navigation-title" : undefined
          }
          aria-hidden={isClosing || undefined}
          onPointerDown={(event) => {
            const clickedSearchContent =
              event.target instanceof Element &&
              event.target.closest(".header-search-form");

            if (renderedLayer === "search" && !clickedSearchContent) {
              closeLayer();
            }
          }}
        >
          <div className="header-layer__inner">
            {renderedLayer === "mobileMenu" ? (
              <div className="mobile-panel-heading">
                <span id="mobile-navigation-title">Мобильная навигация</span>
                <button
                  ref={mobileCloseRef}
                  type="button"
                  className="mobile-close-button"
                  onClick={() => closeLayer()}
                >
                  Закрыть
                </button>
              </div>
            ) : null}

            {renderedLayer === "search" ? (
              <form
                className="header-search-form"
                action="https://russianhighways.ru/search"
                method="get"
                role="search"
              >
                <label className="visually-hidden" htmlFor="header-search-query">
                  Поиск по сайту
                </label>
                <div
                  className="header-search-control"
                  style={{ position: "relative", height: 48 }}
                >
                  <input
                    ref={searchInputRef}
                    id="header-search-query"
                    name="q"
                    type="search"
                    placeholder="Поиск"
                    autoComplete="off"
                    value={searchQuery}
                    aria-autocomplete="list"
                    aria-expanded={Boolean(searchQuery.trim())}
                    aria-controls={
                      searchQuery.trim() ? "header-search-suggestions" : undefined
                    }
                    onChange={(event) => setSearchQuery(event.currentTarget.value)}
                    onKeyDown={onSearchInputKeyDown}
                  />
                  {searchQuery ? (
                    <button
                      className="header-search-clear header-search-clear-button"
                      type="button"
                      aria-label="Очистить поле поиска"
                      onClick={() => {
                        setSearchQuery("");
                        searchInputRef.current?.focus();
                      }}
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path
                          d="M4 4 20 20M20 4 4 20"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </button>
                  ) : null}
                </div>
                <button className="visually-hidden" type="submit">
                  Найти
                </button>
                {searchQuery.trim() ? (
                  <div className="header-search-results">
                    <p className="visually-hidden" role="status" aria-live="polite">
                      {searchSuggestions.length
                        ? `Найдено подсказок: ${searchSuggestions.length}`
                        : "Подходящих разделов не найдено"}
                    </p>
                    <ul id="header-search-suggestions" aria-label="Подсказки поиска">
                      {searchSuggestions.map((item, index) => (
                        <li key={`${item.label}-${item.href}`}>
                          <a
                            ref={(element) => {
                              searchSuggestionRefs.current[index] = element;
                            }}
                            href={item.href}
                            onClick={closeAfterNavigation}
                            onKeyDown={(event) =>
                              onSearchSuggestionKeyDown(event, index)
                            }
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                    {!searchSuggestions.length ? (
                      <p className="header-search-empty">
                        Подходящих разделов не найдено
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </form>
            ) : null}

            {renderedLayer === "mobileMenu" ? (
              <nav
                className="mobile-primary-navigation"
                aria-label="Основная навигация"
              >
                <ul>
                  {PRIMARY_NAVIGATION.map((item) => (
                    <li key={item.label}>
                      <a href={item.href} onClick={closeAfterNavigation}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mobile-utilities">
                  <a href="https://russianhighways.ru/" aria-current="page">
                    РУС
                  </a>
                  <a href="https://russianhighways.ru/en/" hrefLang="en" lang="en">
                    ENG
                  </a>
                  <a href="https://avtodor-tr.ru/account/">Личный кабинет</a>
                </div>
              </nav>
            ) : null}

            {renderedLayer !== "search" ? (
              <nav
                className="header-mega-navigation"
                aria-label="Дополнительная навигация"
              >
                <div className="header-mega-grid">
                  {HEADER_NAVIGATION_GROUPS.map((group) => (
                    <div className="header-mega-group" key={group.title}>
                      <h2>{group.title}</h2>
                      <ul>
                        {group.links.map((item) => (
                          <li key={`${group.title}-${item.label}`}>
                            <a href={item.href} onClick={closeAfterNavigation}>
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                      {"secondary" in group ? (
                        <div className="header-mega-group__secondary">
                          <h2>{group.secondary.title}</h2>
                          <ul>
                            {group.secondary.links.map((item) => (
                              <li key={`${group.secondary.title}-${item.label}`}>
                                <a href={item.href} onClick={closeAfterNavigation}>
                                  {item.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </nav>
            ) : null}

            {renderedLayer !== "search" ? (
              <div className="header-contact-row">
                <p>{HEADER_CONTACTS.copyright}</p>
                <div className="header-contact-links">
                  <span>
                    <Image
                      src="/brand/header/location.svg"
                      alt=""
                      width={24}
                      height={24}
                      unoptimized
                    />
                    {HEADER_CONTACTS.address}
                  </span>
                  <a href={HEADER_CONTACTS.email.href}>
                    <Image
                      src="/brand/header/email.svg"
                      alt=""
                      width={24}
                      height={24}
                      unoptimized
                    />
                    {HEADER_CONTACTS.email.label}
                  </a>
                  <a href={HEADER_CONTACTS.phone.href}>
                    <Image
                      src="/brand/header/phone.svg"
                      alt=""
                      width={24}
                      height={24}
                      unoptimized
                    />
                    {HEADER_CONTACTS.phone.label}
                  </a>
                </div>
                <div className="header-social-links" aria-label="Социальные сети">
                  {HEADER_SOCIAL_LINKS.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      aria-label={item.label}
                      style={
                        item.label === "MAX"
                          ? {
                              borderRadius: 8,
                              backgroundColor: "var(--color-brand-orange)",
                            }
                          : undefined
                      }
                    >
                      <Image
                        src={item.image}
                        alt=""
                        width={48}
                        height={48}
                        unoptimized
                      />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
