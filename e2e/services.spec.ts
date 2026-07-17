import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("services desktop interaction", () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("services-grid").scrollIntoViewIfNeeded();
  });

  test("expands one card without changing the outer container", async ({ page }) => {
    const grid = page.getByTestId("services-grid");
    const active = page.getByTestId("service-route-calculator");
    const sibling = page.getByTestId("service-mobile-app");
    await expect(page.locator(".services-heading svg")).toHaveCount(0);
    await expect(grid.locator(".service-card__toggle")).toHaveCount(0);

    const beforeGrid = await grid.boundingBox();
    const beforeActive = await active.boundingBox();
    const beforeSibling = await sibling.boundingBox();

    expect(beforeGrid).not.toBeNull();
    expect(beforeActive).not.toBeNull();
    expect(beforeSibling).not.toBeNull();

    await active.hover();
    await expect
      .poll(async () => (await active.boundingBox())?.width ?? 0)
      .toBeGreaterThan(beforeActive!.width * 1.35);

    const afterGrid = await grid.boundingBox();
    const afterActive = await active.boundingBox();
    const afterSibling = await sibling.boundingBox();

    expect(afterGrid?.width).toBeCloseTo(beforeGrid!.width, 0);
    expect(afterGrid?.height).toBeCloseTo(beforeGrid!.height, 0);
    expect(afterActive!.width).toBeGreaterThan(beforeActive!.width * 1.35);
    expect(afterActive!.height).toBeCloseTo(beforeActive!.height, 0);
    expect(afterSibling!.width).toBeLessThan(beforeSibling!.width * 0.85);
  });

  test("runs the route loop only while the calculator card is active", async ({
    page,
  }) => {
    const routeCard = page.getByTestId("service-route-calculator");
    const vehicle = routeCard.locator(".route-preview__vehicle");
    const routeLine = routeCard.locator(".route-preview__route-line");

    await expect(routeCard.locator(".route-preview__status")).toHaveCount(0);
    await expect(routeCard.locator(".route-preview__osm-map")).toHaveCount(0);
    await expect(routeCard.locator(".route-preview__attribution")).toHaveCount(0);
    await expect(routeCard.locator(".route-preview__street-network path")).toHaveCount(
      35,
    );
    await expect(routeCard.locator(".route-preview__route-road")).toHaveCount(0);
    await expect(routeLine).toHaveCount(1);

    await expect(vehicle).toHaveCSS("animation-name", "none");
    await routeCard.hover();
    await expect(vehicle).toHaveCSS("animation-name", "route-vehicle-loop");
    const reducedMotion = await page.evaluate(
      () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    await expect(vehicle).toHaveCSS(
      "animation-iteration-count",
      reducedMotion ? "1" : "infinite",
    );

    await page.mouse.move(0, 0);
    await expect(vehicle).toHaveCSS("animation-name", "none");
  });

  test("keyboard focus expands the same card and exposes its service link", async ({
    page,
  }) => {
    const routeCard = page.getByTestId("service-route-calculator");
    const summary = routeCard.locator("summary");
    const collapsedWidth = (await routeCard.boundingBox())?.width ?? 0;
    await summary.focus();

    await expect
      .poll(async () => (await routeCard.boundingBox())?.width ?? 0)
      .toBeGreaterThan(collapsedWidth * 1.35);

    await summary.press("Enter");
    await expect(routeCard).toHaveAttribute("open", "");
    await expect(
      routeCard.getByRole("link", { name: /Открыть сервис/i }),
    ).toBeVisible();
  });

  test("the redesigned block has no detectable WCAG A/AA violations", async ({
    page,
  }) => {
    const results = await new AxeBuilder({ page })
      .include("[data-section='services']")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});

test.describe("services touch disclosure", () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

  test("keeps the service copy and link available without hover", async ({ page }) => {
    await page.goto("/");
    const routeCard = page.getByTestId("service-route-calculator");
    await routeCard.scrollIntoViewIfNeeded();
    await routeCard.locator("summary").tap();

    await expect(routeCard).toHaveAttribute("open", "");
    await expect(routeCard.locator("p")).toBeVisible();
    await expect(
      routeCard.getByRole("link", { name: /Открыть сервис/i }),
    ).toBeVisible();
  });
});
