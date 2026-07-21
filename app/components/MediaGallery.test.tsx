import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MediaGallery } from "./MediaGallery.client";

describe("MediaGallery", () => {
  it("opens and closes an image description", () => {
    render(
      <MediaGallery
        label="Галерея"
        descriptions={[{ title: "Мост", description: "Описание моста" }]}
      >
        <figure>
          {/* Test fixture intentionally avoids Next.js image behavior. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/bridge.webp" alt="Мост" />
        </figure>
      </MediaGallery>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Открыть: Мост" }));
    expect(screen.getByRole("dialog")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Мост" })).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Закрыть просмотр" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
