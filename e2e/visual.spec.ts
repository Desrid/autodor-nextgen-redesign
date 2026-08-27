import { expect, test } from "@playwright/test";

test("@visual homepage visual regression", async ({ page }) => {
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await page.locator("img").evaluateAll((images: HTMLImageElement[]) => {
    images.forEach((image) => {
      image.loading = "eager";
    });
  });

  await page.evaluate(async () => {
    const viewportStep = Math.max(window.innerHeight, 1);

    for (
      let offset = 0;
      offset < document.documentElement.scrollHeight;
      offset += viewportStep
    ) {
      window.scrollTo(0, offset);
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
    }
  });

  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll((images: HTMLImageElement[]) =>
          images
            .filter((image) => !image.complete)
            .map((image) => image.currentSrc || image.src),
        ),
    )
    .toEqual([]);

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
    timeout: 15_000,
  });
});
