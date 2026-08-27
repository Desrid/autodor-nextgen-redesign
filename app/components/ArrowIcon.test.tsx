import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ArrowIcon } from "./ArrowIcon";

describe("ArrowIcon", () => {
  it("uses the shared 24px size and 1.75px stroke", () => {
    const { container, rerender } = render(<ArrowIcon direction="right" />);
    const icon = container.querySelector("svg");

    expect(icon).toHaveAttribute("width", "24");
    expect(icon).toHaveAttribute("height", "24");
    expect(icon).toHaveAttribute("stroke", "currentColor");
    expect(icon).toHaveAttribute("stroke-width", "1.75");
    expect(icon?.querySelector("path")).toHaveAttribute("d", "M5 12h14m-6-6 6 6-6 6");

    rerender(<ArrowIcon direction="up" />);

    expect(container.querySelector("path")).toHaveAttribute(
      "d",
      "M12 19V5m-6 6 6-6 6 6",
    );
  });

  it("accepts a supported compact size", () => {
    const { container } = render(<ArrowIcon direction="left" size={16} />);

    expect(container.querySelector("svg")).toHaveAttribute("width", "16");
    expect(container.querySelector("svg")).toHaveAttribute("height", "16");
  });
});
