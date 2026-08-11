import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SERVICES } from "@/app/data/home-content";

import { ServicesGrid } from "./ServicesGrid";

describe("ServicesGrid", () => {
  it("renders every source-backed service in two accessible rows", () => {
    const { container } = render(<ServicesGrid />);

    expect(screen.getByTestId("services-grid")).toBeInTheDocument();
    expect(container.querySelectorAll(".services-row")).toHaveLength(2);
    expect(screen.getAllByRole("group")).toHaveLength(SERVICES.length);

    for (const service of SERVICES) {
      expect(screen.getByTestId(`service-${service.id}`)).toHaveAttribute(
        "data-node-id",
        service.nodeId,
      );
      expect(screen.getByText(service.title)).toBeInTheDocument();
    }
  });

  it("discloses a service and provides a safely marked external link", () => {
    render(<ServicesGrid />);

    const service = SERVICES[0];
    const card = screen.getByTestId(`service-${service.id}`);
    fireEvent.click(screen.getByText(service.title));

    expect(card).toHaveAttribute("open");
    const link = within(card).getByRole("link", {
      name: /\u043e\u0442\u043a\u0440\u043e\u0435\u0442\u0441\u044f \u0432 \u043d\u043e\u0432\u043e\u0439 \u0432\u043a\u043b\u0430\u0434\u043a\u0435/i,
    });
    expect(link).toHaveAttribute("href", service.href);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
    expect(link).toHaveClass("card-cta");
    expect(link.querySelector(".card-cta__icon")).toBeInTheDocument();
  });
});
