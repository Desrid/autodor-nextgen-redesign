import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "./page";

describe("HomePage", () => {
  it("provides the semantic main landmark for server-rendered sections", async () => {
    render(await HomePage());

    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
  });

  it("keeps the visible Figma sections in approved order", async () => {
    const { container } = render(await HomePage());

    expect(
      [...container.querySelectorAll<HTMLElement>("[data-section]")].map(
        (section) => section.dataset.section,
      ),
    ).toEqual([
      "header",
      "roads",
      "services",
      "loyalty",
      "news",
      "important",
      "media",
      "contacts",
      "statistics",
      "subsidiary-services",
      "social",
      "future",
      "footer",
    ]);
    expect(container.querySelector("[data-section='documents']")).toBeNull();
  });

  it("renders the query-aware road hero with the default car state", async () => {
    const { container } = render(await HomePage());

    expect(screen.getByTestId("car-pointer")).toBeInTheDocument();
    expect(container.querySelector(".road-hero")).toHaveAttribute(
      "data-hero-variant",
      "cinematic",
    );
  });

  it("presents the transport complex portal as the first important story", async () => {
    render(await HomePage());

    const link = screen.getByRole("link", {
      name: /открыть источник/i,
    });

    expect(
      screen.getByRole("heading", { name: "Всё о транспортном комплексе России" }),
    ).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://transport.gov.ru/");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByLabelText("Переключение важной информации")).toBeInTheDocument();
  });

  it("renders the verified statistics iteration", async () => {
    render(await HomePage());

    expect(screen.getByRole("heading", { name: "Статистика" })).toBeInTheDocument();
    expect(screen.getByTestId("statistics-dashboard")).toBeInTheDocument();
    expect(
      screen.getByRole("table", {
        name: "Текстовый эквивалент данных по годам",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Источник:/)).not.toBeInTheDocument();
  });

  it("renders social commitments from the source-backed records", async () => {
    const { container } = render(await HomePage());
    const socialSection = container.querySelector("[data-section='social']");

    expect(socialSection).toHaveAttribute("aria-labelledby", "social-title");
    expect(socialSection?.querySelectorAll("[data-social-item]")).toHaveLength(2);
    expect(
      socialSection?.querySelector("[data-social-commitment='large-families'] img"),
    ).toHaveAccessibleName(
      "Сгенерированный образ дорожной инфраструктуры без привязки к конкретной социальной программе",
    );
    expect(
      socialSection?.querySelector<HTMLImageElement>(
        "[data-social-commitment='large-families'] img",
      ),
    ).toHaveAttribute(
      "src",
      expect.stringContaining("/media/social/large-families-road.png"),
    );
    expect(
      socialSection?.querySelector("[data-social-commitment='small-business'] img"),
    ).toHaveAccessibleName(
      "Сгенерированный образ строительства дорожной инфраструктуры без привязки к конкретной закупке",
    );
    expect(
      socialSection?.querySelector<HTMLImageElement>(
        "[data-social-commitment='small-business'] img",
      ),
    ).toHaveAttribute(
      "src",
      expect.stringContaining("/media/social/small-business-roadworks.png"),
    );
    const links =
      socialSection?.querySelectorAll<HTMLAnchorElement>("[data-social-item] a");
    expect(links).toHaveLength(2);
    links?.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveAccessibleName(/откроется в новой вкладке/);
    });
  });

  it("makes every subsidiary service card descriptive and safe for external navigation", async () => {
    const { container } = render(await HomePage());
    const section = container.querySelector("[data-section='subsidiary-services']");
    const cards = section?.querySelectorAll("[data-subsidiary-item]");

    expect(section).toHaveAttribute("aria-labelledby", "subsidiary-title");
    expect(cards).toHaveLength(4);
    cards?.forEach((card) => {
      expect(card.querySelector("h3")).toBeInTheDocument();
      expect(card.querySelectorAll("li")).toHaveLength(2);
      expect(card.querySelector("a")).toHaveAttribute("target", "_blank");
      expect(card.querySelector("a")).toHaveAttribute("rel", "noreferrer");
      expect(card.querySelector("a")).toHaveAccessibleName(
        /откроется в новой вкладке/i,
      );
    });
  });

  it("presents the future-project map as an interactive Figma atlas with a static fallback", async () => {
    const { container } = render(await HomePage());
    const futureSection = container.querySelector("[data-section='future']");
    const atlas = futureSection?.querySelector("[data-testid='future-map-atlas']");
    const mapSurface = atlas?.querySelector("[data-map-asset]");

    expect(screen.getByText("КАД-2")).toBeInTheDocument();
    expect(screen.getByText("А-108")).toBeInTheDocument();
    expect(screen.getByText("Краснодар")).toBeInTheDocument();
    expect(atlas).toHaveAttribute("data-fallback", "no-webgl");
    expect(mapSurface).toHaveAttribute(
      "data-map-asset",
      "/brand/figma-road-map-2011-25273.svg",
    );
    expect(screen.getByRole("group", { name: "Шкала 2026–2030" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2026" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2030" })).toBeInTheDocument();
    const sourceLinks = screen.getAllByRole("link", {
      name: /Открыть: Проспект ценных бумаг Государственной компании «Автодор», стр. 36/,
    });

    expect(sourceLinks).toHaveLength(3);
    sourceLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", expect.stringMatching(/\.pdf$/));
    });
  });
});
