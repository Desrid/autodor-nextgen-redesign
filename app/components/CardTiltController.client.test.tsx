import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CardTiltController } from "./CardTiltController.client";

describe("CardTiltController", () => {
  it("keeps loyalty cards free from the shared tilt treatment", async () => {
    const { container } = render(
      <>
        <CardTiltController />
        <article className="loyalty-card">
          <div className="loyalty-card__tilt">Программа лояльности</div>
        </article>
      </>,
    );
    const card = container.querySelector<HTMLElement>(".loyalty-card__tilt");
    expect(card).not.toBeNull();
    await waitFor(() => expect(card).not.toHaveClass("cursor-tilt-card"));

    fireEvent.pointerMove(card!, {
      clientX: 200,
      clientY: 0,
      pointerType: "mouse",
    });

    expect(card!.style.getPropertyValue("--cursor-card-rotate-x")).toBe("");
    expect(card!.style.getPropertyValue("--cursor-card-rotate-y")).toBe("");
    expect(card).not.toHaveAttribute("data-cursor-tilt");
  });

  it("leaves service cards on their dedicated tilt implementation", async () => {
    const { container } = render(
      <>
        <CardTiltController />
        <details className="service-card">
          <summary>Сервис</summary>
        </details>
      </>,
    );
    const serviceCard = container.querySelector<HTMLElement>(".service-card");

    await waitFor(() => expect(serviceCard).not.toHaveClass("cursor-tilt-card"));
  });

  it("keeps media gallery cards on direct CSS hover", async () => {
    const { container } = render(
      <>
        <CardTiltController />
        <button className="media-gallery__item" type="button">
          Media item
        </button>
      </>,
    );
    const mediaCard = container.querySelector<HTMLElement>(".media-gallery__item");

    await waitFor(() => expect(mediaCard).not.toHaveClass("cursor-tilt-card"));
    fireEvent.pointerMove(mediaCard!, {
      clientX: 16,
      clientY: 16,
      pointerType: "mouse",
    });

    expect(mediaCard).not.toHaveAttribute("data-cursor-tilt");
  });

  it("keeps contact panels free from the shared hover treatment", async () => {
    const { container } = render(
      <>
        <CardTiltController />
        <section className="contact-panel">Контакты</section>
        <article className="social-card">Социальная карточка</article>
      </>,
    );
    const contactPanel = container.querySelector<HTMLElement>(".contact-panel");
    const socialCard = container.querySelector<HTMLElement>(".social-card");

    await waitFor(() => expect(socialCard).toHaveClass("cursor-tilt-card"));
    expect(contactPanel).not.toHaveClass("cursor-tilt-card");
  });

  it("keeps the statistics dashboard free from shared tilt", async () => {
    const { container } = render(
      <>
        <CardTiltController />
        <figure className="statistics-dashboard">Статистика</figure>
      </>,
    );
    const statisticsDashboard = container.querySelector<HTMLElement>(
      ".statistics-dashboard",
    );

    await waitFor(() =>
      expect(statisticsDashboard).not.toHaveClass("cursor-tilt-card"),
    );
    expect(statisticsDashboard).not.toHaveAttribute("data-cursor-tilt");
  });
});
