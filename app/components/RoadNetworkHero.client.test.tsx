import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RoadNetworkHero } from "./RoadNetworkHero.client";

describe("RoadNetworkHero", () => {
  it("moves selection and the car marker without changing the island", () => {
    const { container } = render(<RoadNetworkHero withCar variant="cinematic" />);
    const island = container.querySelector(".road-hero__island");
    const firstTab = screen.getByRole("tab", { name: "М-1" });
    const secondTab = screen.getByRole("tab", { name: "М-3" });

    firstTab.focus();
    fireEvent.keyDown(firstTab, { key: "ArrowRight" });

    expect(secondTab).toHaveAttribute("aria-selected", "true");
    expect(secondTab).toHaveFocus();
    expect(island).toBeInTheDocument();
    expect(screen.getByTestId("car-pointer")).toBeInTheDocument();
    expect(screen.queryByTestId("road-route-map-m-1")).not.toBeInTheDocument();
  });

  it("renders a verified route overlay for every cinematic road tab", () => {
    render(<RoadNetworkHero withCar variant="cinematic" />);

    expect(screen.getByTestId("road-route-map-m-1")).toHaveAttribute(
      "data-map-source",
      "https://russianhighways.ru/for_drivers/?tab=2",
    );

    fireEvent.click(screen.getByTestId("road-tab-m-3"));
    expect(screen.queryByTestId("road-route-map-m-1")).not.toBeInTheDocument();
    expect(screen.getByTestId("road-route-map-m-3")).toHaveAttribute(
      "data-map-source",
      "https://russianhighways.ru/for_drivers/?tab=3",
    );
  });

  it.each(["cinematic", "atlas", "signal"] as const)(
    "renders the %s visual direction",
    (variant) => {
      const { container } = render(<RoadNetworkHero withCar variant={variant} />);

      expect(container.querySelector(".road-hero")).toHaveAttribute(
        "data-hero-variant",
        variant,
      );
      expect(screen.getAllByRole("tab")).toHaveLength(9);
    },
  );
});
