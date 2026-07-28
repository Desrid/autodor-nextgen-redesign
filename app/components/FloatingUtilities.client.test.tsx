import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SUPPORT_FAQ } from "@/app/data/home-content";

import { FloatingUtilities } from "./FloatingUtilities.client";

describe("FloatingUtilities", () => {
  it("renders the support trigger and data-backed FAQ", () => {
    const { container } = render(<FloatingUtilities />);

    expect(screen.getByRole("button", { name: "Открыть помощь" })).toBeVisible();
    expect(container.querySelector(".floating-button__dialog-icon")).toHaveAttribute(
      "viewBox",
      "0 0 32 32",
    );
    expect(screen.getByTestId("back-to-top")).toHaveAttribute("hidden");
    expect(container.querySelectorAll(".faq-list details")).toHaveLength(SUPPORT_FAQ.length);
    expect(screen.getByTestId("chat-dialog")).toHaveAttribute(
      "aria-describedby",
      "chat-intro",
    );
    expect(container.querySelector(".primary-button")).toHaveAttribute(
      "href",
      "https://www.russianhighways.ru/feedback/",
    );
  });
});
