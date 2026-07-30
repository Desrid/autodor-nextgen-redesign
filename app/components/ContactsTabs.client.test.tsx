import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContactsTabs } from "./ContactsTabs.client";

describe("ContactsTabs", () => {
  it("renders the reference content with accessible contact links", () => {
    render(<ContactsTabs />);

    expect(screen.getByRole("tablist", { name: "Компании группы" })).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );
    expect(screen.getAllByRole("tab")).toHaveLength(7);
    expect(screen.getByRole("tab", { name: "ГК «АВТОДОР»" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "Государственная компания «Автодор»",
    );
    expect(screen.getByRole("link", { name: /\+7 \(495\) 727-11-95/ })).toHaveAttribute(
      "href",
      "tel:+74957271195",
    );
    expect(
      screen.getByRole("link", { name: "info@russianhighways.ru" }),
    ).toHaveAttribute("href", "mailto:info@russianhighways.ru");
    expect(screen.getByText("127006, Москва, Страстной бульвар, 9")).toBeVisible();
  });

  it("moves focus, activates tabs and wraps with vertical arrow keys", () => {
    render(<ContactsTabs />);

    const tabs = screen.getAllByRole("tab");
    tabs[0]?.focus();
    fireEvent.keyDown(tabs[0]!, { key: "ArrowDown" });

    expect(tabs[1]).toHaveFocus();
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("ООО УК «Автодор»");

    fireEvent.keyDown(tabs[1]!, { key: "Home" });
    expect(tabs[0]).toHaveFocus();

    fireEvent.keyDown(tabs[0]!, { key: "ArrowUp" });
    expect(tabs[6]).toHaveFocus();
    expect(tabs[6]).toHaveAttribute("aria-selected", "true");
  });

  it("leaves horizontal arrow keys to the browser for a vertical tablist", () => {
    render(<ContactsTabs />);

    const tabs = screen.getAllByRole("tab");
    tabs[0]?.focus();
    fireEvent.keyDown(tabs[0]!, { key: "ArrowRight" });

    expect(tabs[0]).toHaveFocus();
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });
});
