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

    for (const item of NEWS) {
      expect(
        screen.getByRole("link", { name: new RegExp(item.title) }),
      ).toHaveAttribute("href", item.href);
      expect(screen.getByRole("img", { name: item.imageAlt })).toBeInTheDocument();
      expect(
        container.querySelector(`time[datetime='${item.dateTime}']`),
      ).toHaveTextContent(item.date);
    }
  });

  it("prioritizes the lead image and offers the complete official news feed", () => {
    render(<NewsGrid />);

    expect(screen.getAllByText("Официальный сайт")).toHaveLength(NEWS.length);
    expect(screen.getByRole("link", { name: /Все новости/ })).toHaveAttribute(
      "href",
      "https://www.russianhighways.ru/press/news/",
    );
  });
});
