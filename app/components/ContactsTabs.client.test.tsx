import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ContactsTabs } from "./ContactsTabs.client";

describe("ContactsTabs", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses a vertical tablist and moves focus through the company list", () => {
    render(<ContactsTabs />);

    const tablist = screen.getByRole("tablist", { name: "Организации" });
    const tabs = screen.getAllByRole("tab");

    expect(tablist).toHaveAttribute("aria-orientation", "vertical");

    tabs[0]?.focus();
    fireEvent.keyDown(tabs[0]!, { key: "ArrowDown" });

    expect(tabs[1]).toHaveFocus();
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("ООО УК «Автодор»");
    expect(screen.queryByText("Контакт")).not.toBeInTheDocument();
  });
});
