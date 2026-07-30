import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ROADS } from "@/app/data/roads";

import { RoadNetworkHero } from "./RoadNetworkHero.client";

describe("RoadNetworkHero", () => {
  it("moves selection and the car marker without changing the island", () => {
    const { container } = render(<RoadNetworkHero withCar variant="cinematic" />);
    const island = container.querySelector(".road-hero__island");
    const firstTab = screen.getByRole("tab", { name: "М-1 «Беларусь»" });
    const secondTab = screen.getByRole("tab", { name: "М-3 «Украина»" });

    firstTab.focus();
    fireEvent.keyDown(firstTab, { key: "ArrowRight" });

    expect(secondTab).toHaveAttribute("aria-selected", "true");
    expect(secondTab).toHaveFocus();
    expect(island).toBeInTheDocument();
    expect(screen.getByTestId("car-pointer")).toBeInTheDocument();
    expect(screen.queryByTestId("road-route-map-m-1")).not.toBeInTheDocument();
  });

  it("gives keyboard users route-selection guidance without duplicate slide controls", () => {
    render(<RoadNetworkHero withCar variant="cinematic" />);

    const tabList = screen.getByRole("tablist", { name: "Выбор дороги" });
    const helpId = tabList.getAttribute("aria-describedby");

    expect(helpId).toBeTruthy();
    expect(document.getElementById(helpId ?? "")).toHaveTextContent("клавиши со стрелками");
    expect(screen.queryByRole("button", { name: "Предыдущая дорога" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Следующая дорога" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Подробнее о дороге" })).toHaveClass(
      "hero-detail-link",
    );
  });

  it("uses road-owned media and announces the selected panel", () => {
    const { container } = render(<RoadNetworkHero withCar variant="cinematic" />);

    expect(container.querySelector(".road-hero__visual img")).toHaveAttribute(
      "src",
      expect.stringContaining("federal-highway-aerial-hero"),
    );
    expect(screen.getByTestId("road-panel")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByTestId("road-panel")).toHaveAttribute("data-road-id", "m-1");

    fireEvent.click(screen.getByTestId("road-tab-m-3"));
    expect(container.querySelector(".road-hero__visual img")).toHaveAttribute(
      "src",
      expect.stringContaining("bridge-viaduct"),
    );
    expect(screen.getByTestId("road-panel")).toHaveAttribute("data-road-id", "m-3");
  });

  it("never assigns the same video to neighboring road tabs", () => {
    for (let index = 0; index < ROADS.length; index += 1) {
      const road = ROADS[index];
      const nextRoad = ROADS[(index + 1) % ROADS.length];

      expect(road?.heroMedia.video).not.toBe(nextRoad?.heroMedia.video);
    }
  });

  it("uses only video files published with the road hero", () => {
    expect(ROADS.map((road) => road.heroMedia.video)).toEqual(
      expect.arrayContaining([
        "/media/video/hero-road-01.mp4",
        "/media/video/hero-road-02.mp4",
        "/media/video/hero-road-03.mp4",
        "/media/video/hero-road-04.mp4",
      ]),
    );
    expect(
      ROADS.every((road) => road.heroMedia.video.startsWith("/media/video/hero-road-")),
    ).toBe(true);
  });

  it("wraps keyboard navigation and reports the shortest travel direction", () => {
    render(<RoadNetworkHero withCar variant="cinematic" />);
    const firstTab = screen.getByTestId("road-tab-m-1");

    firstTab.focus();
    fireEvent.keyDown(firstTab, { key: "ArrowLeft" });

    expect(screen.getByTestId("road-tab-a-107")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByTestId("car-pointer")).toHaveAttribute(
      "data-direction",
      "backward",
    );
  });

  it("only treats a mostly horizontal background gesture as a swipe", () => {
    const { container } = render(<RoadNetworkHero withCar variant="cinematic" />);
    const island = container.querySelector(".road-hero__island");
    if (!island) throw new Error("Expected the road hero island");

    fireEvent.pointerDown(island, { pointerId: 1, clientX: 180, clientY: 80 });
    fireEvent.pointerUp(island, { pointerId: 1, clientX: 120, clientY: 180 });
    expect(screen.getByTestId("road-tab-m-1")).toHaveAttribute("aria-selected", "true");

    fireEvent.pointerDown(island, { pointerId: 2, clientX: 180, clientY: 80 });
    fireEvent.pointerUp(island, { pointerId: 2, clientX: 100, clientY: 84 });
    expect(screen.getByTestId("road-tab-m-3")).toHaveAttribute("aria-selected", "true");
  });

  it("renders a verified route overlay for every cinematic road tab", () => {
    render(<RoadNetworkHero withCar variant="cinematic" />);

    expect(screen.getByTestId("road-route-map-m-1")).toHaveAttribute(
      "data-map-source",
      "https://russianhighways.ru/for_drivers/?tab=2",
    );
    expect(screen.getByRole("img", { name: "Схема маршрута М-1" })).toBeInTheDocument();

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
