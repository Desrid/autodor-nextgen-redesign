import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NEWS } from "@/app/data/home-content";

import { NewsGrid } from "./NewsGrid";

describe("NewsGrid", () => {
  it("renders every source-backed news item as a labelled article", () => {
    const { container } = render(<NewsGrid />);

    expect(
      screen.getByRole("list", { name: "Последние новости Автодора" }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll("[data-news-item]")).toHaveLength(NEWS.length);
    expect(container.querySelectorAll("[data-news-date]")).toHaveLength(NEWS.length);
    expect(
      container.querySelectorAll("[data-news-date].card-eyebrow-tab"),
    ).toHaveLength(NEWS.length);
    expect(container.querySelectorAll("[data-news-excerpt]")).toHaveLength(NEWS.length);
    expect(screen.getAllByText("Читать новость")).toHaveLength(NEWS.length);

    for (const item of NEWS) {
      expect(
        screen.getByRole("link", { name: new RegExp(item.title) }),
      ).toHaveAttribute("href", item.href);
      expect(screen.getByRole("img", { name: item.imageAlt })).toBeInTheDocument();
      expect(
        container.querySelector(`time[datetime='${item.dateTime}']`),
      ).toHaveTextContent(item.date);
    }

    for (const excerpt of container.querySelectorAll("[data-news-excerpt]")) {
      expect(excerpt.textContent?.trim().length).toBeGreaterThan(40);
    }
  });

  it("offers the complete official news feed", () => {
    render(<NewsGrid />);

    expect(screen.getByRole("link", { name: /Все новости/ })).toHaveAttribute(
      "href",
      "https://www.russianhighways.ru/press/news/",
    );
  });

  it("uses right-facing 24px stroke icons instead of text arrows", () => {
    const { container } = render(<NewsGrid />);
    const icons = container.querySelectorAll(".news-card__cta-icon");

    expect(icons).toHaveLength(NEWS.length + 1);
    expect(container).not.toHaveTextContent("↗");

    for (const icon of icons) {
      expect(icon).toHaveAttribute("width", "24");
      expect(icon).toHaveAttribute("height", "24");
      expect(icon).toHaveAttribute("stroke-width", "1.75");
    }
  });
});
