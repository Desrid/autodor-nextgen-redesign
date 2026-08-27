import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("has no automatically detectable WCAG A/AA violations", async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(results.violations).toEqual([]);
});

test("provides skip navigation and unique page landmarks", async ({ page }) => {
  const skipLink = page.getByRole("link", { name: /содержанию/i });

  await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page.locator("main#main-content")).toBeFocused();
  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page.getByRole("banner")).toHaveCount(1);
  await expect(page.getByRole("contentinfo")).toHaveCount(1);
});

test("all meaningful images have alternatives and loaded dimensions", async ({
  page,
}) => {
  const images = page.locator("img");

  await images.evaluateAll((nodes: HTMLImageElement[]) => {
    nodes.forEach((image) => {
      image.loading = "eager";
    });
  });

  await expect
    .poll(() =>
      images.evaluateAll((nodes: HTMLImageElement[]) =>
        nodes
          .filter(
            (image) =>
              !image.hasAttribute("alt") || !image.complete || image.naturalWidth <= 0,
          )
          .map((image) => image.currentSrc || image.src),
      ),
    )
    .toEqual([]);
});

test("interactive controls expose names and visible keyboard focus", async ({
  page,
}) => {
  const controls = page.locator(
    "a[href]:visible, button:visible:enabled, input:visible:enabled, select:visible:enabled, textarea:visible:enabled, [tabindex='0']:visible",
  );
  const count = Math.min(await controls.count(), 40);

  for (let index = 0; index < count; index += 1) {
    const control = controls.nth(index);
    await control.focus();
    await expect(control).toBeFocused();
    const name = await control.getAttribute("aria-label");
    const text = (await control.innerText().catch(() => "")).trim();
    const title = await control.getAttribute("title");
    expect(name || text || title).toBeTruthy();
  }
});

test("page does not introduce horizontal overflow", async ({ page }) => {
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth + 1,
      ),
    )
    .toBe(true);
});

test("primary touch controls meet the 44px target budget", async ({ page }) => {
  const hasTouch = await page.evaluate(() => navigator.maxTouchPoints > 0);
  test.skip(!hasTouch, "Target geometry is exercised by touch projects");

  const controls = page.locator(
    "[data-testid='road-slider'] button:visible, [data-testid='services-grid'] summary:visible, [data-testid='contacts-tabs'] button:visible, .floating-button:visible",
  );
  expect(await controls.count()).toBeGreaterThan(0);

  for (const control of await controls.all()) {
    const box = await control.boundingBox();
    expect(
      box,
      (await control.getAttribute("aria-label")) ?? "unnamed touch control",
    ).not.toBeNull();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
});
