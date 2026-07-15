import { expect, test } from "@playwright/test";

test("critical content survives without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    locale: "ru-RU",
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();

  await page.goto("/");
  await expect(page.locator("main#main-content")).toBeVisible();
  await expect(page.locator("[data-section='roads'] [data-road-id]")).toHaveCount(9);
  await expect(page.locator("[data-section='services'] [data-service-id]")).toHaveCount(
    6,
  );
  await expect(page.locator("[data-section='news'] [data-news-item]")).toHaveCount(5);
  await expect(page.locator("[data-fallback='no-webgl']")).not.toHaveCount(0);
  await context.close();
});

test("no-WebGL mode keeps road and future-project content", async ({ page }) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = new Proxy(
      HTMLCanvasElement.prototype.getContext,
      {
        apply(target, thisArgument, argumentsList: [string, ...unknown[]]) {
          if (argumentsList[0] === "webgl" || argumentsList[0] === "webgl2") {
            return null;
          }
          return Reflect.apply(target, thisArgument, argumentsList);
        },
      },
    );
  });

  await page.goto("/");
  await expect(
    page.locator("[data-section='roads'] [data-fallback='no-webgl']"),
  ).toBeVisible();
  await expect(
    page.locator("[data-section='future'] [data-fallback='no-webgl']"),
  ).toBeVisible();
  await expect(page.locator("[data-section='roads'] [data-road-id]")).toHaveCount(9);
});

test("reduced motion disables non-essential autoplay and smooth scrolling", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const reduction = await page.evaluate(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  expect(reduction).toBe(true);

  const autoplayingVideos = page.locator("video[autoplay]");
  for (const video of await autoplayingVideos.all()) {
    await expect
      .poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused))
      .toBe(true);
  }

  await expect(page.locator("html")).not.toHaveCSS("scroll-behavior", "smooth");
});

test("local links and static assets have valid targets", async ({ page, request }) => {
  const failedResponses: string[] = [];
  page.on("response", (response) => {
    if (
      response.status() >= 400 &&
      new URL(response.url()).origin === new URL(page.url()).origin
    ) {
      failedResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(failedResponses).toEqual([]);

  const localTargets = await page.locator("a[href]").evaluateAll((links) =>
    [...new Set(links.map((link) => (link as HTMLAnchorElement).href))].filter(
      (href) => {
        const url = new URL(href);
        return (
          url.origin === window.location.origin &&
          url.pathname !== window.location.pathname
        );
      },
    ),
  );

  for (const href of localTargets) {
    const response = await request.get(href);
    expect(response.status(), href).toBeLessThan(400);
  }
});

test("page emits no console or uncaught runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(errors).toEqual([]);
});
