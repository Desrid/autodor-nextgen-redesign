import { expect, test } from "@playwright/test";

test("mobile hero preload is present and reuses one responsive image request", async ({
  page,
  viewport,
}) => {
  test.skip(
    !viewport || viewport.width >= 768,
    "The responsive preload request contract is intentionally mobile-only.",
  );

  const heroRequests: string[] = [];

  page.on("request", (request) => {
    const url = request.url();
    if (url.includes("federal-highway-aerial-hero-mobile-") && url.endsWith(".avif")) {
      heroRequests.push(url);
    }
  });

  await page.goto("/", { waitUntil: "networkidle" });

  const preload = page.locator('link[rel="preload"][as="image"][type="image/avif"]');
  await expect(preload).toHaveCount(1);
  await expect(preload).toHaveAttribute(
    "imagesrcset",
    /federal-highway-aerial-hero-mobile-720\.avif 720w/,
  );
  await expect(preload).toHaveAttribute("imagesizes", "100vw");

  const uniqueHeroRequests = new Set(heroRequests);
  expect(uniqueHeroRequests.size).toBe(1);
  expect(heroRequests.length).toBe(1);
});
