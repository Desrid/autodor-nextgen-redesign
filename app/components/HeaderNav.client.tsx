"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { MORE_NAVIGATION, PRIMARY_NAVIGATION } from "@/app/data/home-content";

export function HeaderNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      setSearchOpen(false);
      menuButtonRef.current?.focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, searchOpen]);

  return (
    <div className="header-shell">
      <a
        className="brand-lockup"
        href="https://russianhighways.ru/"
        aria-label="Государственная компания Автодор"
      >
        <Image
          src="/brand/autodor-logo-with-order.png"
          alt=""
          width="268"
          height="64"
          priority
        />
      </a>

      <nav className="desktop-navigation" aria-label="Основная навигация">
        {PRIMARY_NAVIGATION.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
        <details className="more-menu">
          <summary>Ещё</summary>
          <div className="more-menu__panel">
            {MORE_NAVIGATION.map((item) => (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </details>
      </nav>

      <div className="header-actions">
        <a
          className="utility-link"
          href="https://russianhighways.ru/en/"
          lang="en"
          hrefLang="en"
        >
          РУС
        </a>
        <button
          className="icon-button"
          type="button"
          aria-label={searchOpen ? "Закрыть поиск" : "Открыть поиск"}
          aria-expanded={searchOpen}
          aria-controls="site-search"
          onClick={() => setSearchOpen((value) => !value)}
        >
          <span aria-hidden="true">⌕</span>
        </button>
        <a className="account-link" href="https://avtodor-tr.ru/account/">
          Личный кабинет
        </a>
        <nav className="mobile-navigation-trigger" aria-label="Основная навигация">
          <button
            ref={menuButtonRef}
            className="menu-button"
            type="button"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span aria-hidden="true">Меню</span>
          </button>
        </nav>
      </div>

      {searchOpen ? (
        <form
          id="site-search"
          className="site-search"
          action="https://russianhighways.ru/search"
          method="get"
        >
          <label htmlFor="search-query">Поиск по сайту</label>
          <div>
            <input
              ref={searchInputRef}
              id="search-query"
              name="q"
              type="search"
              autoComplete="off"
            />
            <button type="submit">Найти</button>
          </div>
        </form>
      ) : null}

      {menuOpen ? (
        <nav
          id="mobile-navigation"
          className="mobile-navigation"
          aria-label="Мобильная навигация"
        >
          {[...PRIMARY_NAVIGATION, ...MORE_NAVIGATION].map((item) => (
            <a key={`${item.label}-${item.href}`} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
