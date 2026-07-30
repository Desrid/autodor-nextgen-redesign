import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  readHeroPreferences,
  RoadNetworkHeroQuery,
} from "./RoadNetworkHeroQuery.client";

afterEach(() => {
  window.history.replaceState({}, "", "/");
});

describe("RoadNetworkHeroQuery", () => {
  it("parses supported hero preview parameters", () => {
    expect(readHeroPreferences("?hero=signal&car=off")).toEqual({
      variant: "signal",
      withCar: false,
    });
  });

  it("applies query preferences after hydration", async () => {
    window.history.replaceState({}, "", "/?hero=atlas&car=off");

    const { container } = render(<RoadNetworkHeroQuery />);

    await waitFor(() => {
      expect(container.querySelector(".road-hero")).toHaveAttribute(
        "data-hero-variant",
        "atlas",
      );
    });
    expect(screen.queryByTestId("car-pointer")).not.toBeInTheDocument();
  });
});
