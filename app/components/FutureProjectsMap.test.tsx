import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FutureProjectsMap } from "./FutureProjectsMap.client";

describe("FutureProjectsMap", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () =>
          '<svg viewBox="0 0 4097 4097"><rect width="4096.33" height="4096.33" fill="#D1D1D1"/><g id="map-root"><g id="Vector 41"><path d="M0 0L100 100" /></g><g id="Vector 54"><path d="M10 10L90 90" /></g><circle id="Ellipse 2" cx="24" cy="24" r="5" fill="#FF5100"/><g id="&#208;&#156;&#208;&#190;&#209;&#129;&#208;&#186;&#208;&#178;&#208;&#176;"><path d="M20 20L30 30" /></g></g></svg>',
      }),
    );
  });

  afterEach(() => vi.unstubAllGlobals());

  it("shows complete road information from the map with pointer and keyboard controls", async () => {
    render(<FutureProjectsMap />);

    const road = await screen.findByRole("button", { name: "М-11 «Нева»" });
    expect(
      screen.getByTestId("future-map-atlas").querySelector("svg > rect"),
    ).not.toBeInTheDocument();
    fireEvent.pointerOver(road, { clientX: 120, clientY: 180 });
    fireEvent.pointerMove(road, { clientX: 140, clientY: 200 });

    const tooltip = screen.getByTestId("map-road-tooltip");
    const atlas = screen.getByTestId("future-map-atlas");
    const initialViewBox = atlas.querySelector("svg")?.getAttribute("viewBox");
    const baseMapLayer = atlas.querySelector<SVGGElement>("#map-root");
    expect(atlas).not.toHaveAttribute("data-road-hover");
    expect(baseMapLayer?.style.filter).not.toBe("grayscale(1)");
    expect(
      atlas.querySelector('[data-road-color-overlay="true"]'),
    ).not.toBeInTheDocument();
    expect(atlas.querySelector('[data-road-hit-layer="true"]')).toBeInTheDocument();
    expect(tooltip.parentElement).toHaveAttribute("data-cursor-follow", "true");
    expect(tooltip.parentElement).toHaveStyle({
      "--tooltip-left": "12px",
      "--tooltip-top": "12px",
    });
    expect(tooltip).toHaveTextContent("Категория");
    expect(tooltip).toHaveTextContent("Полос");
    expect(tooltip).toHaveTextContent("Скорость");
    expect(tooltip).not.toHaveTextContent("Дорога в управлении Автодора");
    expect(tooltip).not.toHaveTextContent("Иллюстрация");
    expect(tooltip).not.toHaveTextContent("Подробнее о дороге");

    fireEvent.keyDown(road, { key: "Enter" });
    await waitFor(() =>
      expect(screen.getByTestId("map-road-tooltip")).toBeInTheDocument(),
    );
    expect(atlas.querySelector("svg")?.getAttribute("viewBox")).toBe(initialViewBox);
  });

  it("repairs Figma city identifiers and shows the city tooltip", async () => {
    const { container } = render(<FutureProjectsMap />);

    const city = await screen.findByRole("button", { name: "Город Москва" });
    const label = container.querySelector<SVGElement>(
      '[data-city-label-name="Москва"]',
    );
    const marker = container.querySelector<SVGElement>(
      '[data-city-marker-name="Москва"]',
    );
    expect(city).toHaveAttribute("data-city-hit-target", "true");
    expect(label).toHaveAttribute("pointer-events", "none");
    expect(label).not.toHaveAttribute("role");
    expect(marker).toHaveAttribute("fill", "#FFFFFF");
    expect(marker).toHaveAttribute("stroke", "#FF5100");
    expect(marker).toHaveAttribute("stroke-width", "3");
    fireEvent.pointerOver(city);

    const tooltip = screen.getByTestId("map-city-tooltip");
    expect(tooltip).toHaveTextContent("Москва");
    expect(tooltip).toHaveTextContent(/центральный узел схемы/i);
    expect(tooltip).not.toHaveTextContent("Город на карте");
    expect(tooltip).not.toHaveTextContent(/Фото:/i);
    expect(label?.style.opacity).toBe("");
    expect(label?.style.filter).toBe("");
    expect(
      screen.getByRole("link", { name: "Источник фотографии города Москва" }),
    ).toBeInTheDocument();
  });

  it("uses the year scale as visual navigation without presenting it as a deadline", async () => {
    const { container } = render(<FutureProjectsMap />);

    expect(container.querySelector("aside")).not.toBeInTheDocument();
    expect(screen.queryByText("Выберите год")).not.toBeInTheDocument();

    const baseYear = screen.getByRole("button", { name: "2026" });
    const year = screen.getByRole("button", { name: "2028" });
    await waitFor(() =>
      expect(container.querySelector('[id="Vector 54"]')).toBeInTheDocument(),
    );
    const futureRoad = container.querySelector<SVGElement>('[id="Vector 54"]');

    expect(baseYear).toHaveAttribute("aria-pressed", "true");
    expect(futureRoad?.style.opacity).toBe("0");
    fireEvent.mouseEnter(year);
    expect(container.querySelector("aside")).not.toBeInTheDocument();
    expect(futureRoad?.style.opacity).toBe("0");
    fireEvent.click(year);

    expect(baseYear).toHaveAttribute("aria-pressed", "false");
    expect(year).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("future-map-atlas")).toHaveAttribute(
      "data-has-stage",
      "true",
    );
    expect(
      container.querySelector(
        '[data-map-asset="/brand/figma-road-map-2011-25273.svg"]',
      ),
    ).toHaveAttribute("data-interaction-disabled", "true");
    await waitFor(() =>
      expect(
        container.querySelector<SVGElement>('[id="Vector 54"]')?.style.opacity,
      ).toBe("1"),
    );
    expect(container.querySelector("aside")).toBeInTheDocument();

    const existingRoad = screen.getByRole("button", { name: "М-11 «Нева»" });
    fireEvent.pointerOver(existingRoad, { clientX: 120, clientY: 180 });
    fireEvent.click(existingRoad);
    expect(screen.queryByTestId("map-road-tooltip")).not.toBeInTheDocument();
    expect(year).toHaveAttribute("aria-pressed", "true");
    expect(existingRoad).toHaveAttribute("tabindex", "-1");
    expect(
      screen.getByRole("heading", { name: "Южный обход Краснодара" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/общий подтверждённый ориентир трёх проектов/i),
    ).toBeInTheDocument();

    fireEvent.click(baseYear);
    expect(baseYear).toHaveAttribute("aria-pressed", "true");
    expect(year).toHaveAttribute("aria-pressed", "false");
    await waitFor(() =>
      expect(
        container.querySelector<SVGElement>('[id="Vector 54"]')?.style.opacity,
      ).toBe("0"),
    );
    expect(container.querySelector("aside")).not.toBeInTheDocument();
  });

  it("moves across the year scale with arrow keys", () => {
    render(<FutureProjectsMap />);

    const firstYear = screen.getByRole("button", { name: "2026" });
    const secondYear = screen.getByRole("button", { name: "2027" });
    fireEvent.keyDown(firstYear, { key: "ArrowRight" });

    expect(firstYear).toHaveAttribute("aria-pressed", "true");
    expect(secondYear).toHaveAttribute("aria-pressed", "false");
    expect(secondYear).toHaveFocus();
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
  });
});
