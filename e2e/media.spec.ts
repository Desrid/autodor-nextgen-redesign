import { expect, test } from "@playwright/test";

test("hero video stays decorative without a visible media control", async ({
  page,
}, testInfo) => {
  test.skip(
    !["desktop-1440", "mobile-390"].includes(testInfo.project.name),
    "Hero media is exercised on representative mouse and touch viewports",
  );

  await page.goto("/");
  await expect(page.getByTestId("video-control")).toHaveCount(0);
  await expect(
    page.getByTestId("road-panel").getByRole("heading", { level: 1 }),
  ).toBeVisible();
});

test("video request failure preserves the poster and semantic road panel", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-1440",
    "One deterministic viewport is sufficient for the network failure contract",
  );

  await page.route("**/media/video/**", (route) => route.abort("failed"));
  await page.goto("/");

  await page.waitForTimeout(5_000);
  await expect(page.locator("video source")).toHaveCount(0);
  await expect(page.getByTestId("video-control")).toHaveCount(0);
  await expect(page.getByTestId("road-panel")).toContainText("М-1");
  await expect(page.getByTestId("road-slider").locator("img").first()).toBeVisible();
});

test("save-data disables hero video activation", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-1440",
    "Capability fallback is independent of viewport width",
  );

  await page.addInitScript(() => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: { saveData: true },
    });
  });
  await page.goto("/");

  await expect(page.getByTestId("video-control")).toHaveCount(0);
  await expect(page.locator("video source")).toHaveCount(0);
});
