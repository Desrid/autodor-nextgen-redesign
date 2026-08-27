import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Icon } from "./Icon";

describe("Icon", () => {
  it("renders decorative outline icons with the shared SVG contract", () => {
    const { container } = render(<Icon name="close" size={20} />);
    const icon = container.querySelector("svg");

    expect(icon).toHaveAttribute("viewBox", "0 0 24 24");
    expect(icon).toHaveAttribute("fill", "none");
    expect(icon).toHaveAttribute("stroke", "currentColor");
    expect(icon).toHaveAttribute("stroke-width", "1.75");
    expect(icon).toHaveAttribute("stroke-linecap", "round");
    expect(icon).toHaveAttribute("stroke-linejoin", "round");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveAttribute("focusable", "false");
    expect(icon).toHaveAttribute("width", "20");
    expect(icon).toHaveAttribute("height", "20");
  });

  it("exposes one accessible name for a meaningful icon", () => {
    const { getByRole } = render(<Icon label="Закрыть" name="close" />);
    const icon = getByRole("img", { name: "Закрыть" });

    expect(icon).not.toHaveAttribute("aria-hidden");
    expect(icon).toHaveAttribute("aria-label", "Закрыть");
  });

  it("rejects conflicting accessible-name props", () => {
    expect(() => render(<Icon alt="Закрыть" label="Закрыть" name="close" />)).toThrow(
      /either alt or label/,
    );
  });
});
