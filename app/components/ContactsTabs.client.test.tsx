import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ContactsTabs } from "./ContactsTabs.client";

const rect = (left: number, top: number, width: number, height: number) =>
  ({
    bottom: top + height,
    height,
    left,
    right: left + width,
    toJSON: () => ({}),
    top,
    width,
    x: left,
    y: top,
  }) as DOMRect;

describe("ContactsTabs", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the reference content with accessible contact links", () => {
    render(<ContactsTabs />);

    expect(screen.getByRole("tablist", { name: "Компании группы" })).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );
    expect(screen.getAllByRole("tab")).toHaveLength(10);
    expect(screen.getAllByRole("tab").at(-1)).toHaveAccessibleName(
      "Концепт «Автодор Логистика»",
    );
    expect(screen.getByTestId("contacts-border-effect")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
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
    expect(
      screen.getByRole("link", {
        name: /Сайт Государственная компания «Автодор»: russianhighways\.ru/,
      }),
    ).toHaveAttribute("href", "https://russianhighways.ru/");
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
    expect(tabs[9]).toHaveFocus();
    expect(tabs[9]).toHaveAttribute("aria-selected", "true");
  });

  it("keeps the remaining invented DZO marked as a concept", () => {
    render(<ContactsTabs />);

    fireEvent.click(screen.getByRole("tab", { name: "Концепт «Автодор Логистика»" }));

    const panel = screen.getByRole("tabpanel");

    expect(panel).toHaveTextContent("«Автодор Логистика» — концептуальное ДЗО");
    expect(within(panel).getByText("Телефон не предоставлен")).toBeVisible();
    expect(within(panel).getByText("Email не предоставлен")).toBeVisible();
    expect(
      within(panel).queryByRole("link", { name: "Подробнее" }),
    ).not.toBeInTheDocument();
    expect(
      within(panel).queryByRole("link", { name: /^Сайт / }),
    ).not.toBeInTheDocument();
  });

  it("renders the two additional DZO from the Contacts sheet", () => {
    render(<ContactsTabs />);

    fireEvent.click(screen.getByRole("tab", { name: "ООО «АВТОДОР - ДЕВЕЛОПМЕНТ»" }));

    let panel = screen.getByRole("tabpanel");
    expect(panel).toHaveTextContent("ООО «АВТОДОР - ДЕВЕЛОПМЕНТ»");
    expect(
      within(panel).getByRole("link", { name: "+7 (495) 249-06-95" }),
    ).toHaveAttribute("href", "tel:+74952490695");
    expect(within(panel).getByText("Email не предоставлен")).toBeVisible();
    expect(
      within(panel).queryByText("Концептуальная карточка"),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "ООО «АВТОДОР - ЭКСПЛУАТАЦИЯ»" }));

    panel = screen.getByRole("tabpanel");
    expect(panel).toHaveTextContent("ООО «АВТОДОР - ЭКСПЛУАТАЦИЯ»");
    expect(
      within(panel).getByRole("link", {
        name: "+7 (495) 727-11-95 (доб. 6115)",
      }),
    ).toHaveAttribute("href", "tel:+74957271195;ext=6115");
    expect(within(panel).getByText("Email не предоставлен")).toBeVisible();
    expect(
      within(panel).queryByRole("link", { name: /^Сайт / }),
    ).not.toBeInTheDocument();
    expect(
      within(panel).queryByText("Концептуальная карточка"),
    ).not.toBeInTheDocument();
  });

  it("shows only the verified official company websites", () => {
    const { container } = render(<ContactsTabs />);

    const websiteHrefs = Array.from(
      container.querySelectorAll<HTMLAnchorElement>('a[aria-label^="Сайт "]'),
      (link) => link.getAttribute("href"),
    );

    expect(websiteHrefs).toEqual([
      "https://russianhighways.ru/",
      "https://avtodor-mc.ru/",
      "https://etp-avtodor.ru/",
      "https://avtodor-tr.ru/",
      "https://avtodor-eng.ru/",
      "https://skavtodor.ru/",
    ]);

    fireEvent.click(screen.getByRole("tab", { name: "ООО «АВТОДОР-УП»" }));
    expect(
      within(screen.getByRole("tabpanel")).queryByRole("link", { name: /^Сайт / }),
    ).not.toBeInTheDocument();
  });

  it("leaves horizontal arrow keys to the browser for a vertical tablist", () => {
    render(<ContactsTabs />);

    const tabs = screen.getAllByRole("tab");
    tabs[0]?.focus();
    fireEvent.keyDown(tabs[0]!, { key: "ArrowRight" });

    expect(tabs[0]).toHaveFocus();
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });

  it("builds one continuous outline for the active tab and panel", async () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function (this: HTMLElement) {
        if (this.dataset.testid === "contacts-tabs") {
          return rect(0, 0, 1000, 448);
        }

        if (this.getAttribute("role") === "tab") {
          const tabs = Array.from(
            document.querySelectorAll<HTMLElement>('[role="tab"]'),
          );
          const index = tabs.indexOf(this);
          const tabHeight = 384 / tabs.length;
          return rect(0, 32 + index * tabHeight, 360, tabHeight);
        }

        if (this.getAttribute("role") === "tabpanel") {
          return rect(360, 0, 640, 448);
        }

        return rect(0, 0, 0, 0);
      },
    );

    render(<ContactsTabs />);

    const outline = screen.getByTestId("contacts-border-beam");

    await waitFor(() => {
      expect(outline).toHaveAttribute(
        "d",
        expect.stringContaining("H 352 Q 360 32 360 24"),
      );
    });

    fireEvent.click(screen.getByRole("tab", { name: "Концепт «Автодор Логистика»" }));

    await waitFor(() => {
      expect(outline).toHaveAttribute(
        "d",
        expect.stringContaining("V 424 Q 360 416 352 416"),
      );
    });
  });
});
