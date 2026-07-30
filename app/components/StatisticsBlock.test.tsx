import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatisticsBlock } from "./StatisticsBlock";

describe("StatisticsBlock", () => {
  it("renders the donut and both visible tables without a source footer", () => {
    render(<StatisticsBlock />);

    expect(
      screen.getByRole("img", {
        name: /всего 738,7 км.*строительство: 288 км, 39,0%/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("table", { name: /текстовый эквивалент данных по годам/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("table", {
        name: /легенда и текстовый эквивалент круговой диаграммы/i,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/^Источник:/i)).not.toBeInTheDocument();
  });

  it("connects exact-value tooltips to keyboard-focusable controls", () => {
    render(<StatisticsBlock />);

    const operationControl = screen.getByRole("button", {
      name: /строительство: точное значение и доля/i,
    });
    const tooltipId = operationControl.getAttribute("aria-describedby");

    expect(operationControl).toHaveAttribute("type", "button");
    expect(tooltipId).toBeTruthy();
    expect(document.getElementById(tooltipId ?? "")).toHaveTextContent(
      "Строительство: 288 км, 39,0%",
    );
  });
});
