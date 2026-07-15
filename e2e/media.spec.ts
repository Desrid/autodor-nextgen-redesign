import { expect, test } from "@playwright/test";

test("hero video can be paused without hiding road content", async ({
  page,
}, testInfo) => {
  test.skip(
    !["desktop-1440", "mobile-390"].includes(testInfo.project.name),
    "Media control is exercised on representative mouse and touch viewports",
  );

  await page.goto("/");
  const control = page.getByTestId("video-control");
  await expect(control).toHaveAccessibleName(/приостановить видео/i);
  await expect(control).toBeEnabled({ timeout: 10_000 });
  await expect(page.locator("video source[type='video/webm']")).toHaveCount(1);
  await expect(page.locator("video source[type='video/mp4']")).toHaveCount(1);
  await control.click();
  await expect(control).toHaveAttribute("aria-pressed", "true");
  await expect(control).toHaveAccessibleName(/воспроизвести видео/i);
  await expect(
    page.getByTestId("road-panel").getByRole("heading", { level: 1 }),
  ).toBeVisible();
  await expect
    .poll(() => page.locator("video").evaluate((node: HTMLVideoElement) => node.paused))
    .toBe(true);
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

  await expect(page.getByRole("button", { name: /видео отключено/i })).toBeDisabled({
    timeout: 10_000,
  });
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

  await expect(page.getByRole("button", { name: /видео отключено/i })).toBeDisabled();
  await expect(page.locator("video source")).toHaveCount(0);
});
