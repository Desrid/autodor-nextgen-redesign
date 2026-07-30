import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CardTiltController } from "./CardTiltController.client";

describe("CardTiltController", () => {
  it("applies the service-card perspective and cursor glare coordinates", async () => {
    const { container } = render(
      <>
        <CardTiltController />
        <article className="loyalty-card">
          <div className="loyalty-card__tilt">Программа лояльности</div>
        </article>
      </>,
    );
    const card = container.querySelector<HTMLElement>(".loyalty-card__tilt");
    const layoutSlot = container.querySelector<HTMLElement>(".loyalty-card");

    expect(card).not.toBeNull();
    await waitFor(() => expect(card).toHaveClass("cursor-tilt-card"));
    expect(layoutSlot).not.toHaveClass("cursor-tilt-card");

    card!.getBoundingClientRect = () =>
      ({
        bottom: 100,
        height: 100,
        left: 0,
        right: 200,
        top: 0,
        width: 200,
        x: 0,
        y: 0,
        toJSON: () => undefined,
      }) as DOMRect;

    fireEvent.pointerMove(card!, {
      clientX: 200,
      clientY: 0,
      pointerType: "mouse",
    });

    expect(card!.style.getPropertyValue("--cursor-card-rotate-x")).toBe("5.00deg");
    expect(card!.style.getPropertyValue("--cursor-card-rotate-y")).toBe("6.00deg");
    expect(card!.style.getPropertyValue("--cursor-card-pointer-x")).toBe("100.0%");
    expect(card!.style.getPropertyValue("--cursor-card-pointer-y")).toBe("0.0%");
    expect(card).toHaveAttribute("data-cursor-tilt", "active");

    fireEvent.pointerOut(card!, {
      relatedTarget: document.body,
    });

    expect(card!.style.getPropertyValue("--cursor-card-rotate-x")).toBe("0deg");
    expect(card!.style.getPropertyValue("--cursor-card-rotate-y")).toBe("0deg");
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
});
