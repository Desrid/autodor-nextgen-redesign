import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import LoyaltyRail, { LOYALTY_PROGRAMS } from "./LoyaltyRail.client";

vi.stubGlobal(
  "ResizeObserver",
  class ResizeObserver {
    observe() {}
    disconnect() {}
  },
);

describe("LoyaltyRail", () => {
  it("renders six source-backed cards in a three-card rail", () => {
    render(<LoyaltyRail />);

    expect(screen.getAllByRole("article")).toHaveLength(LOYALTY_PROGRAMS.length);
    expect(screen.getAllByRole("img")).toHaveLength(LOYALTY_PROGRAMS.length);
    expect(screen.getByLabelText("Предыдущие программы")).toBeDisabled();
    expect(screen.getByLabelText("Следующие программы")).toBeInTheDocument();
  });

  it.each(["loading", "empty", "error"] as const)(
    "exposes the %s source state",
    (state) => {
      render(<LoyaltyRail state={state} />);
      expect(screen.getByTestId("loyalty-rail")).toHaveAttribute(
        "data-loyalty-state",
        state,
      );
    },
  );
});
