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

  it("renders the reduced static map with a click-controlled year scale", async () => {
    const { container } = render(<FutureProjectsMap />);
    const atlas = screen.getByTestId("future-map-atlas");
    const map = screen.getByRole("img", {
      name: "Статическая схема сети дорог Автодора",
    });

    expect(atlas).toHaveAttribute("data-static-map", "true");
    expect(atlas).toHaveAttribute("data-map-scale", "0.7");
    expect(atlas).toHaveAttribute("data-label-scale", "1.3");
    expect(atlas).toHaveAttribute("data-edge-spacing", "36");
    expect(atlas).toHaveAttribute("data-stage-zoom", "2");
    expect(atlas).toHaveAttribute("data-active-year", "2026");
    expect(atlas).toHaveAttribute("data-timeline-enabled", "true");
    expect(map).toHaveAttribute("data-interaction-disabled", "true");
    expect(screen.getByRole("group", { name: "Шкала 2026–2030" })).toBeVisible();
    expect(screen.getAllByRole("button")).toHaveLength(5);
    expect(screen.getByRole("button", { name: "2026" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await waitFor(() => expect(atlas.querySelector("svg")).toBeInTheDocument());
    const svg = atlas.querySelector("svg");
    const viewBox = svg?.getAttribute("viewBox")?.split(" ").map(Number) ?? [];
    const label = container.querySelector('[data-map-label-scale="true"]');
    const futureRoad = container.querySelector<SVGElement>('[id="Vector 54"]');
    const cityMarker = container.querySelector<SVGElement>('[id="Ellipse 2"]');

    expect(viewBox[2]).toBeCloseTo(1299.07 / 0.7, 5);
    expect(viewBox[3]).toBeCloseTo(894.31 / 0.7, 5);
    expect(label).toBeInTheDocument();
    expect(futureRoad?.style.visibility).toBe("hidden");
    expect(cityMarker).toHaveAttribute("fill", "#FFFFFF");
    expect(cityMarker).toHaveAttribute("stroke", "#FF5100");
    expect(atlas.querySelector("[tabindex]")).toBeNull();
    expect(atlas.querySelector("[data-map-hit]")).toBeNull();

    const initialMarkup = svg?.outerHTML;
    fireEvent.pointerOver(map);
    fireEvent.click(map);
    expect(svg?.outerHTML).toBe(initialMarkup);
    expect(screen.queryByTestId("map-road-tooltip")).toBeNull();
    expect(screen.queryByTestId("map-city-tooltip")).toBeNull();
    expect(container.querySelector("aside")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "2028" }));
    expect(atlas).toHaveAttribute("data-active-year", "2028");
    expect(atlas).toHaveAttribute("data-active-stage", "krasnodar-bypass");
    expect(screen.getByRole("button", { name: "2028" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(container.querySelector('[class*="mapSvg"]')).toHaveStyle({
      "--stage-focus-x": "37%",
      "--stage-focus-y": "91%",
    });
    expect(container.querySelector("aside")).toHaveTextContent(
      "Южный обход Краснодара",
    );

    fireEvent.click(screen.getByRole("button", { name: "2026" }));
    expect(atlas).toHaveAttribute("data-active-year", "2026");
    expect(atlas).toHaveAttribute("data-active-stage", "base");
    expect(container.querySelector("aside")).toBeNull();
  });

  it("supports keyboard navigation on the restored timeline", () => {
    render(<FutureProjectsMap />);

    const year2026 = screen.getByRole("button", { name: "2026" });
    const year2027 = screen.getByRole("button", { name: "2027" });
    fireEvent.keyDown(year2026, { key: "ArrowRight" });

    expect(year2027).toHaveAttribute("aria-pressed", "true");
    expect(year2027).toHaveFocus();
  });

  it("keeps a non-interactive image fallback when the SVG cannot load", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    render(<FutureProjectsMap />);

    const map = screen.getByRole("img", {
      name: "Статическая схема сети дорог Автодора",
    });
    await waitFor(() =>
      expect(map.querySelector("img")).toHaveAttribute(
        "src",
        "/brand/autodor-official-network-overlay.png",
      ),
    );
    expect(screen.getAllByRole("button")).toHaveLength(5);
  });
});
