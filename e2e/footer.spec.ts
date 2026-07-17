import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("uses the exact Figma footer content and local SVG assets", async ({ page }) => {
  const footer = page.locator("[data-section='footer']");

  await expect(footer).toBeVisible();
  await expect(footer.locator(".footer-social a")).toHaveCount(4);
  await expect(footer.locator(".footer-government a")).toHaveCount(3);
  await expect(footer.locator(".footer-legal a")).toHaveText([
    "Раскрытие информации",
    "Противодействие коррупции",
    "Политика обработки персональных данных",
  ]);
  await expect(footer.locator(".footer-copyright")).toHaveText(
    "© 2009–2026 Государственная компания «Российские автомобильные дороги»",
  );

  const imagePaths = await footer
    .locator("img")
    .evaluateAll((images) =>
      images.map((image) => (image.getAttribute("src") ?? "").split("?")[0] ?? ""),
    );
  expect(imagePaths).toHaveLength(11);
  expect(imagePaths.every((path) => path.endsWith(".svg"))).toBe(true);
});

test("matches the 1920px Figma geometry and stays inside narrow viewports", async ({
  page,
}, testInfo) => {
  const footer = page.locator("[data-section='footer']");

  if (testInfo.project.name === "desktop-1920") {
    const footerBox = await footer.boundingBox();
    const frameBox = await footer.locator(".footer-frame").boundingBox();
    const topBox = await footer.locator(".footer-top-row").boundingBox();

    expect(footerBox).not.toBeNull();
    expect(frameBox).not.toBeNull();
    expect(topBox).not.toBeNull();
    expect(footerBox?.width).toBeCloseTo(1920, 0);
    expect(footerBox?.height).toBeCloseTo(408, 0);
    expect(frameBox?.x).toBeCloseTo(88, 0);
    expect(frameBox?.width).toBeCloseTo(1744, 0);
    expect((topBox?.y ?? 0) - (footerBox?.y ?? 0)).toBeCloseTo(64, 0);
    expect(topBox?.height).toBeCloseTo(48, 0);
  }

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
