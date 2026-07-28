import { expect, test } from "@playwright/test";

test("@visual homepage visual regression", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  for (const image of await page.locator("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((node: HTMLImageElement) => node.complete))
      .toBe(true);
  }

  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        document
          .querySelectorAll<HTMLElement>(
            "[data-testid='media-rail'], [data-testid='loyalty-rail'], .road-tabs",
          )
          .forEach((rail) => {
            rail.style.scrollBehavior = "auto";
            rail.style.scrollSnapType = "none";
            rail.scrollLeft = 0;
            rail.scrollTop = 0;
          });
        window.scrollTo(0, 0);
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );

  await expect(page).toHaveScreenshot("homepage.png", {
    animations: "disabled",
    caret: "hide",
    fullPage: true,
  });
});
