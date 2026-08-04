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
          '<svg viewBox="0 0 4097 4097"><rect width="4096.33" height="4096.33" fill="#D1D1D1"/><g id="map-root"><g id="Vector 41"><path d="M0 0L100 100" /></g><g id="Vector 54"><path d="M10 10L90 90" /></g><g id="&#208;&#156;&#208;&#190;&#209;&#129;&#208;&#186;&#208;&#178;&#208;&#176;"><path d="M20 20L30 30" /></g></g></svg>',
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
    const baseMapLayer = atlas.querySelector<SVGGElement>("#map-root");
    expect(atlas).toHaveAttribute("data-road-hover", "true");
    expect(baseMapLayer?.style.filter).toBe("grayscale(1)");
    expect(atlas.querySelector('[data-road-color-overlay="true"]')).toBeInTheDocument();
    expect(tooltip.parentElement).toHaveAttribute("data-cursor-follow", "true");
    expect(tooltip.parentElement).toHaveStyle({
      "--tooltip-left": "12px",
      "--tooltip-top": "12px",
    });
    expect(tooltip).toHaveTextContent("Категория");
    expect(tooltip).toHaveTextContent("Полос");
    expect(tooltip).toHaveTextContent("Скорость");
    expect(
      screen.getByRole("link", { name: "Подробнее о дороге" }),
    ).toBeInTheDocument();

    fireEvent.keyDown(road, { key: "Enter" });
    await waitFor(() =>
      expect(screen.getByTestId("map-road-tooltip")).toBeInTheDocument(),
    );
  });

  it("repairs Figma city identifiers and shows the city tooltip", async () => {
    render(<FutureProjectsMap />);

    const city = await screen.findByRole("button", { name: "Город Москва" });
    fireEvent.pointerOver(city);

    expect(screen.getByTestId("map-city-tooltip")).toHaveTextContent("Москва");
    expect(screen.getByTestId("map-city-tooltip")).toHaveTextContent(
      /центральный узел схемы/i,
    );
  });

  it("uses the year scale as visual navigation without presenting it as a deadline", () => {
    const { container } = render(<FutureProjectsMap />);

    expect(container.querySelector("aside")).not.toBeInTheDocument();
    expect(screen.queryByText("Выберите год")).not.toBeInTheDocument();

    const year = screen.getByRole("button", { name: "2028" });
    fireEvent.click(year);

    expect(year).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelector("aside")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Южный обход Краснодара" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/общий подтверждённый ориентир трёх проектов/i),
    ).toBeInTheDocument();
  });

  it("moves across the year scale with arrow keys", () => {
    render(<FutureProjectsMap />);

    const firstYear = screen.getByRole("button", { name: "2026" });
    const secondYear = screen.getByRole("button", { name: "2027" });
    fireEvent.keyDown(firstYear, { key: "ArrowRight" });

    expect(secondYear).toHaveAttribute("aria-pressed", "true");
    expect(secondYear).toHaveFocus();
  });
});
