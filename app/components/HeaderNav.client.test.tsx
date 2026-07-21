import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HeaderNav } from "./HeaderNav.client";

describe("HeaderNav", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("opens and closes the full mega layer with the same trigger", () => {
    const { container } = render(<HeaderNav />);
    const trigger = screen.getByRole("button", {
      name: "Открыть дополнительную навигацию",
    });

    fireEvent.click(trigger);
    expect(container.querySelector(".header-shell")).toHaveAttribute(
      "data-header-state",
      "megaMenu",
    );
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("navigation", { name: "Дополнительная навигация" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("search")).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(container.querySelector(".header-shell")).toHaveAttribute(
      "data-header-state",
      "closed",
    );
    expect(trigger).toHaveFocus();
  });

  it("keeps search, language and mega menu mutually exclusive", async () => {
    render(<HeaderNav />);
    const more = screen.getByRole("button", {
      name: "Открыть дополнительную навигацию",
    });
    const search = screen.getByRole("button", { name: "Открыть поиск" });
    const language = screen.getByRole("button", { name: "Выбрать язык" });

    fireEvent.click(more);
    fireEvent.click(search);
    expect(more).toHaveAttribute("aria-expanded", "false");
    expect(search).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.queryByRole("navigation", { name: "Дополнительная навигация" }),
    ).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("searchbox")).toHaveFocus());

    fireEvent.click(language);
    expect(search).toHaveAttribute("aria-expanded", "false");
    expect(language).toHaveAttribute("aria-expanded", "true");
    await waitFor(() =>
      expect(
        within(screen.getByText("ENG").parentElement as HTMLElement).getByText("РУС"),
      ).toHaveFocus(),
    );
  });

  it("restores focus to the specific trigger after Escape and outside click", async () => {
    render(<HeaderNav />);
    const search = screen.getByRole("button", { name: "Открыть поиск" });

    fireEvent.click(search);
    await waitFor(() => expect(screen.getByRole("searchbox")).toHaveFocus());
    fireEvent.keyDown(document, { key: "Escape" });
    expect(search).toHaveFocus();

    fireEvent.click(search);
    await waitFor(() => expect(screen.getByRole("searchbox")).toHaveFocus());
    const outsideClick = new PointerEvent("pointerdown", {
      bubbles: true,
      cancelable: true,
    });
    document.body.dispatchEvent(outsideClick);
    expect(search).toHaveFocus();
    expect(outsideClick.defaultPrevented).toBe(false);
  });

  it("suggests matching navigation destinations while typing", async () => {
    render(<HeaderNav />);
    fireEvent.click(screen.getByRole("button", { name: "Открыть поиск" }));

    const searchbox = screen.getByRole("searchbox");
    fireEvent.change(searchbox, { target: { value: "нева" } });

    expect(screen.getByRole("link", { name: "М-11 «Нева»" })).toHaveAttribute(
      "href",
      "https://russianhighways.ru/for_drivers/?tab=5",
    );
    expect(screen.getByRole("status")).toHaveTextContent("Найдено подсказок: 1");

    fireEvent.change(searchbox, { target: { value: "несуществующий раздел" } });
    expect(
      screen.getByText("Подходящих разделов не найдено", {
        selector: ".header-search-empty",
      }),
    ).toBeVisible();
  });

  it("traps Tab inside the full-screen mobile layer and restores menu focus", async () => {
    const main = document.createElement("main");
    document.body.append(main);
    render(<HeaderNav />);
    const trigger = screen.getByRole("button", { name: "Открыть меню" });

    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Мобильная навигация" });
    const close = within(dialog).getByRole("button", { name: "Закрыть" });
    await waitFor(() => expect(close).toHaveFocus());
    expect(document.body).toHaveStyle({ overflow: "hidden" });
    expect(main.inert).toBe(true);

    const focusable = dialog.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])",
    );
    const last = focusable[focusable.length - 1];
    expect(last).toBeDefined();
    last?.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(close).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
    expect(main.inert).toBe(false);
    main.remove();
  });

  it("closes the mobile layer when the viewport switches to desktop", () => {
    let onDesktopChange: (() => void) | undefined;
    const desktopQuery = {
      matches: false,
      addEventListener: vi.fn(
        (_event: string, listener: () => void) => (onDesktopChange = listener),
      ),
      removeEventListener: vi.fn(),
    };
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => desktopQuery as unknown as MediaQueryList),
    );

    const { container } = render(<HeaderNav />);
    fireEvent.click(screen.getByRole("button", { name: "Открыть меню" }));
    expect(container.querySelector(".header-shell")).toHaveAttribute(
      "data-header-state",
      "mobileMenu",
    );

    desktopQuery.matches = true;
    act(() => onDesktopChange?.());
    expect(container.querySelector(".header-shell")).toHaveAttribute(
      "data-header-state",
      "closed",
    );
    expect(document.body.style.overflow).toBe("");
  });
});
