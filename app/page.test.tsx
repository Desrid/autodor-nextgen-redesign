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
});
