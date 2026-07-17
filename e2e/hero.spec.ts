import { expect, test } from "@playwright/test";

const variants = ["cinematic", "atlas", "signal"] as const;

test("road switch preserves the hero height and moves the car", async ({ page }) => {
  await page.goto("/?hero=cinematic");

  const hero = page.getByTestId("road-slider");
  const island = hero.locator(".road-hero__island");
  const carTrack = hero.locator(".road-car-track");
  const car = hero.getByTestId("car-pointer");
  const m4 = hero.getByTestId("road-tab-m-4");
  const heightBefore = await island.evaluate(
    (element) => element.getBoundingClientRect().height,
  );
  const transformBefore = await carTrack.evaluate(
    (element) => getComputedStyle(element).transform,
  );

  await m4.click();
  await expect(m4).toHaveAttribute("aria-selected", "true");
  await expect(car).toHaveAttribute("data-direction", "forward");

  const heightAfter = await island.evaluate(
    (element) => element.getBoundingClientRect().height,
  );
  expect(heightAfter).toBe(heightBefore);
  await expect
    .poll(() => carTrack.evaluate((element) => getComputedStyle(element).transform))
    .not.toBe(transformBefore);
  await expect(hero.getByRole("heading", { level: 1 })).toContainText("М-4");

  const m1 = hero.getByTestId("road-tab-m-1");
  await m1.click();
  await expect(car).toHaveAttribute("data-direction", "backward");
});

test("service actions compensate the top inset and preserve size and hover motion", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-1440",
    "One desktop viewport verifies the service panel geometry",
  );

  await page.goto("/?hero=cinematic");

  const panel = page.getByTestId("road-slider").locator(".road-hero__notch");
  const cards = panel.locator(".hero-actions a");
  await expect(cards).toHaveCount(4);

  const geometry = await panel.evaluate((element) => {
    const panelRect = element.getBoundingClientRect();
    const cardRects = Array.from(element.querySelectorAll(".hero-actions a"), (card) =>
      card.getBoundingClientRect(),
    );
    const firstCard = element.querySelector(".hero-actions a");
    if (!firstCard) {
      throw new Error("Expected the service panel to contain action cards");
    }
    const panelStyle = getComputedStyle(element);

    return {
      padding: {
        top: panelStyle.paddingTop,
        right: panelStyle.paddingRight,
        bottom: panelStyle.paddingBottom,
        left: panelStyle.paddingLeft,
      },
      notchRadii: {
        topLeft: panelStyle.borderTopLeftRadius,
        topRight: panelStyle.borderTopRightRadius,
      },
      backgroundColor: panelStyle.backgroundColor,
      offsets: {
        top: Math.round(cardRects[0].top - panelRect.top),
        right: Math.round(panelRect.right - cardRects[3].right),
        bottom: Math.round(panelRect.bottom - cardRects[0].bottom),
        left: Math.round(cardRects[0].left - panelRect.left),
      },
      gap: Math.round(cardRects[1].left - cardRects[0].right),
      cardBorderRadius: getComputedStyle(firstCard).borderTopLeftRadius,
      sizes: cardRects.map((rect) => ({ width: rect.width, height: rect.height })),
    };
  });

  expect(geometry.padding).toEqual({
    top: "11px",
    right: "0px",
    bottom: "0px",
    left: "24px",
  });
  expect(geometry.offsets).toEqual({ top: 11, right: 0, bottom: 0, left: 24 });
  expect(geometry.notchRadii).toEqual({ topLeft: "32px", topRight: "24px" });
  expect(geometry.backgroundColor).toBe("rgba(0, 0, 0, 0)");
  expect(geometry.gap).toBe(24);
  expect(geometry.cardBorderRadius).toBe("24px");

  for (const size of geometry.sizes.slice(1)) {
    expect(Math.abs(size.width - geometry.sizes[0].width)).toBeLessThan(0.02);
    expect(Math.abs(size.height - geometry.sizes[0].height)).toBeLessThan(0.02);
  }

  const paymentCard = cards.first();
  await paymentCard.hover();
  await expect(paymentCard).toHaveCSS("background-color", "rgb(217, 67, 0)");
  await expect
    .poll(() =>
      paymentCard
        .locator(".hero-action-icon__card")
        .evaluate((element) => getComputedStyle(element).animationName),
    )
    .toBe("hero-icon-card-reveal");
});

for (const variant of variants) {
  test(`renders the ${variant} hero direction`, async ({ page }) => {
    await page.goto(`/?hero=${variant}`);

    await expect(page.getByTestId("road-slider")).toHaveAttribute(
      "data-hero-variant",
      variant,
    );
    await expect(
      page.getByRole("navigation", { name: "Дорожные сервисы" }),
    ).toBeVisible();
  });
}

test("shows a route overlay for every cinematic road tab", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-1440",
    "One desktop viewport verifies the route overlay visibility",
  );

  await page.goto("/?hero=cinematic");
  await expect(page.getByTestId("road-route-map-m-1")).toBeVisible();

  await page.getByTestId("road-tab-m-3").click();
  await expect(page.getByTestId("road-route-map-m-1")).toHaveCount(0);
  await expect(page.getByTestId("road-route-map-m-3")).toBeVisible();

  for (const roadId of ["m-4", "m-11", "m-12", "a-113", "a-289", "a-105", "a-107"]) {
    await page.getByTestId(`road-tab-${roadId}`).click();
    await expect(page.getByTestId(`road-route-map-${roadId}`)).toBeVisible();
  }
});
