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

  it("renders a reduced static map with enlarged labels and no controls", async () => {
    const { container } = render(<FutureProjectsMap />);
    const atlas = screen.getByTestId("future-map-atlas");
    const map = screen.getByRole("img", {
      name: "Статическая схема сети дорог Автодора",
    });

    expect(atlas).toHaveAttribute("data-static-map", "true");
    expect(atlas).toHaveAttribute("data-map-scale", "0.7");
    expect(atlas).toHaveAttribute("data-label-scale", "1.3");
    expect(atlas).toHaveAttribute("data-edge-spacing", "36");
    expect(map).toHaveAttribute("data-interaction-disabled", "true");
    expect(screen.queryByRole("group", { name: "Шкала 2026–2030" })).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();

    await waitFor(() => expect(atlas.querySelector("svg")).toBeInTheDocument());
    const svg = atlas.querySelector("svg");
    const viewBox = svg?.getAttribute("viewBox")?.split(" ").map(Number) ?? [];
    const label = container.querySelector('[data-map-label-scale="true"]');
    const futureRoad = container.querySelector<SVGElement>('[id="Vector 54"]');
    const cityMarker = container.querySelector<SVGElement>('[id="Ellipse 2"]');

    expect(viewBox[2]).toBeCloseTo(1299.07 / 0.7, 5);
    expect(viewBox[3]).toBeCloseTo(894.31 / 0.7, 5);
    expect(label).toBeInTheDocument();
    expect(futureRoad?.style.display).toBe("none");
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
    expect(screen.queryByRole("button")).toBeNull();
  });
});
