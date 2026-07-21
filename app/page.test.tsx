import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "./page";

describe("HomePage", () => {
  it("provides the semantic main landmark for server-rendered sections", async () => {
    render(await HomePage());

    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
  });

  it("keeps the visible Figma sections in approved order", async () => {
    const { container } = render(await HomePage({}));

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

  it("renders both explicit car preview states", async () => {
    const withCar = render(
      await HomePage({ searchParams: Promise.resolve({ car: "on" }) }),
    );
    expect(withCar.getByTestId("car-pointer")).toBeInTheDocument();
    withCar.unmount();

    const withoutCar = render(
      await HomePage({ searchParams: Promise.resolve({ car: "off" }) }),
    );
    expect(withoutCar.queryByTestId("car-pointer")).not.toBeInTheDocument();
  });

  it("presents the transport complex portal as the first important story", async () => {
    render(await HomePage({}));

    const link = screen.getByRole("link", {
      name: /открыть источник/i,
    });

    expect(
      screen.getByRole("heading", { name: "Всё о транспортном комплексе России" }),
    ).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      "https://transport.gov.ru/",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByLabelText("Переключение важной информации")).toBeInTheDocument();
  });

  it("renders road statistics with header navigation controls", async () => {
    render(await HomePage({}));

    expect(screen.getByRole("group", { name: "Навигация по трассам" })).toBeInTheDocument();
    expect(screen.getByRole("table")).toHaveAccessibleName("Текстовый эквивалент диаграммы тарифов");
    expect(screen.getByTestId("tariff-statistics")).toHaveAttribute("data-road-id", "m-12");
  });

  it("renders social commitments from the source-backed records", async () => {
    const { container } = render(await HomePage({}));
    const socialSection = container.querySelector("[data-section='social']");

    expect(socialSection).toHaveAttribute("aria-labelledby", "social-title");
    expect(
      socialSection?.querySelectorAll("[data-social-item]"),
    ).toHaveLength(2);
    expect(
      socialSection?.querySelector("[data-social-commitment='large-families'] img"),
    ).toHaveAccessibleName(
      "Сгенерированный образ дорожной инфраструктуры без привязки к конкретной социальной программе",
    );
    expect(
      socialSection?.querySelector<HTMLImageElement>("[data-social-commitment='large-families'] img"),
    ).toHaveAttribute("src", expect.stringContaining("/media/social/large-families-road.png"));
    expect(
      socialSection?.querySelector("[data-social-commitment='small-business'] img"),
    ).toHaveAccessibleName(
      "Сгенерированный образ строительства дорожной инфраструктуры без привязки к конкретной закупке",
    );
    expect(
      socialSection?.querySelector<HTMLImageElement>("[data-social-commitment='small-business'] img"),
    ).toHaveAttribute("src", expect.stringContaining("/media/social/small-business-roadworks.png"));
    const links = socialSection?.querySelectorAll<HTMLAnchorElement>("[data-social-item] a");
    expect(links).toHaveLength(2);
    links?.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveAccessibleName(/откроется в новой вкладке/);
    });
  });

  it("makes every subsidiary service card descriptive and safe for external navigation", async () => {
    const { container } = render(await HomePage({}));
    const section = container.querySelector("[data-section='subsidiary-services']");
    const cards = section?.querySelectorAll("[data-subsidiary-item]");

    expect(section).toHaveAttribute("aria-labelledby", "subsidiary-title");
    expect(cards).toHaveLength(4);
    cards?.forEach((card) => {
      expect(card.querySelector("h3")).toBeInTheDocument();
      expect(card.querySelectorAll("li")).toHaveLength(2);
      expect(card.querySelector("a")).toHaveAttribute("target", "_blank");
      expect(card.querySelector("a")).toHaveAttribute("rel", "noreferrer");
      expect(card.querySelector("a")).toHaveAccessibleName(/откроется в новой вкладке/i);
    });
  });

  it("presents the future-project map as a single accessible image", async () => {
    const { container } = render(await HomePage({}));
    const futureSection = container.querySelector("[data-section='future']");

    expect(screen.getByText("КАД-2")).toBeInTheDocument();
    expect(screen.getByText("А-108")).toBeInTheDocument();
    expect(screen.getByText("Краснодар")).toBeInTheDocument();
    expect(
      futureSection?.querySelector(".future-map__image"),
    ).toHaveAttribute("src", expect.stringContaining("autodor-official-network-overlay.png"));
    const sourceLinks = screen.getAllByRole("link", {
      name: /Открыть: Проспект ценных бумаг Государственной компании «Автодор», стр. 36/,
    });

    expect(sourceLinks).toHaveLength(3);
    sourceLinks.forEach((link) => {
      expect(link).toHaveAttribute("href", expect.stringMatching(/\.pdf$/));
    });
  });
});
