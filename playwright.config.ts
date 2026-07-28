import { defineConfig } from "@playwright/test";

const harnessPort = process.env.HARNESS_PORT ?? "3000";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${harnessPort}`;
const isolatedHarness = process.env.HARNESS_ISOLATED === "1";
const productionHarness =
  process.env.CI === "true" || process.env.HARNESS_PRODUCTION === "1";

const viewports = [
  { name: "desktop-1920", width: 1920, height: 1080, hasTouch: false },
  { name: "desktop-1440", width: 1440, height: 900, hasTouch: false },
  { name: "desktop-1024", width: 1024, height: 768, hasTouch: false },
  { name: "tablet-768", width: 768, height: 1024, hasTouch: true },
  { name: "mobile-390", width: 390, height: 844, hasTouch: true },
  { name: "mobile-375", width: 375, height: 812, hasTouch: true },
  { name: "mobile-320", width: 320, height: 568, hasTouch: true },
] as const;

const localWebServer = process.env.PLAYWRIGHT_BASE_URL
  ? {}
  : {
      webServer: {
        command: productionHarness
          ? `npm run start -- --port ${harnessPort}`
          : `npx next dev --webpack --hostname 127.0.0.1 --port ${harnessPort}`,
        url: baseURL,
        reuseExistingServer: !productionHarness && !isolatedHarness,
        timeout: 120_000,
      },
    };

export default defineConfig({
  ...localWebServer,
  testDir: "./e2e",
  outputDir: "test-results",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: process.env.CI
    ? [
        ["line"],
        ["html", { open: "never" }],
        ["junit", { outputFile: "test-results/junit.xml" }],
      ]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    locale: "ru-RU",
    timezoneId: "Europe/Moscow",
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  expect: {
    timeout: 5_000,
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.01,
    },
  },
  projects: [
    ...viewports.map(({ name, width, height, hasTouch }) => ({
      name,
      use: {
        browserName: "chromium" as const,
        viewport: { width, height },
        hasTouch,
        isMobile: width < 768,
      },
    })),
    {
      name: "mobile-390-reduced-motion",
      use: {
        browserName: "chromium",
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true,
        contextOptions: {
          reducedMotion: "reduce",
        },
      },
    },
  ],
});
