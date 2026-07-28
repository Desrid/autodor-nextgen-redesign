import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RoadStatistics } from "./RoadStatistics.client";

describe("RoadStatistics", () => {
  it("updates every road-specific statistic from the header controls", () => {
    render(<RoadStatistics />);

    expect(screen.getByTestId("tariff-statistics")).toHaveAttribute("data-road-id", "m-12");
    expect(screen.getByRole("table")).toHaveTextContent("325");
    expect(screen.getByRole("button", { name: "Состав категории IV" })).toHaveAttribute(
      "aria-describedby",
      "tariff-tip-IV",
    );

    fireEvent.click(screen.getByRole("button", { name: "Следующая трасса" }));

    expect(screen.getByTestId("tariff-statistics")).toHaveAttribute("data-road-id", "a-113");
    expect(screen.getByRole("heading", { name: "ЦКАД" })).toBeInTheDocument();
    expect(screen.getByLabelText("Сводка трассы А-113")).toHaveTextContent(
      "267 км платных участков",
    );
  });
});
