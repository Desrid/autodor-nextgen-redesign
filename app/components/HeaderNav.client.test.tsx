import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HeaderNav } from "./HeaderNav.client";

describe("HeaderNav", () => {
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
    fireEvent.pointerDown(document.body);
    expect(search).toHaveFocus();
  });

  it("traps Tab inside the full-screen mobile layer and restores menu focus", async () => {
    render(<HeaderNav />);
    const trigger = screen.getByRole("button", { name: "Открыть меню" });

    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Мобильная навигация" });
    const close = within(dialog).getByRole("button", { name: "Закрыть" });
    await waitFor(() => expect(close).toHaveFocus());

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
  });
});
