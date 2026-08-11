import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ImportantStories, { IMPORTANT_STORIES } from "./ImportantStories.client";

describe("ImportantStories", () => {
  it("shows the transport complex portal as the first full-width story", () => {
    const { container } = render(<ImportantStories />);

    expect(
      screen.getByRole("heading", { name: "Всё о транспортном комплексе России" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("article")).toHaveAccessibleName(
      "Всё о транспортном комплексе России",
    );
    const link = screen.getByRole("link", { name: /открыть источник/i });

    expect(link).toHaveAttribute(
      "href",
      "https://transport.gov.ru/",
    );
    expect(link).toHaveClass("card-cta", "card-stretched-link");
    expect(link.querySelector(".card-cta__icon")).toBeInTheDocument();
    expect(container.querySelector(".important-state__meta")).toBeNull();
  });

  it("switches exactly one visible story with the controls", () => {
    render(<ImportantStories />);

    fireEvent.click(screen.getByLabelText("Следующая тема"));

    expect(
      screen.getByRole("heading", { name: IMPORTANT_STORIES[1].title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: IMPORTANT_STORIES[1].imageAlt }),
    ).toHaveAttribute("src", expect.stringContaining("road-infrastructure.png"));
    expect(screen.queryAllByRole("article")).toHaveLength(1);
    expect(
      screen.queryByText(`2 / ${IMPORTANT_STORIES.length}`),
    ).not.toBeInTheDocument();
  });
});
