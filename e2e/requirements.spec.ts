import { expect, test } from "@playwright/test";

const sectionOrder = [
  "header",
  "roads",
  "services",
  "loyalty",
  "news",
  "important",
  "media",
  "contacts",
  "statistics",
  "subsidiary-services",
  "social",
  "future",
  "footer",
] as const;

const roadIds = [
  "m-1",
  "m-3",
  "m-4",
  "m-11",
  "m-12",
  "a-113",
  "a-289",
  "a-105",
  "a-107",
] as const;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("R01-R14: preserves the approved visible section order", async ({ page }) => {
  await expect(page.locator("[data-section]")).toHaveCount(sectionOrder.length);
  expect(
    await page
      .locator("[data-section]")
      .evaluateAll((sections) =>
        sections.map((section) => section.getAttribute("data-section")),
      ),
  ).toEqual(sectionOrder);
  await expect(page.locator("[data-section='documents']")).toHaveCount(0);
});

test("R01: header exposes keyboard-reachable institutional navigation", async ({
  page,
}) => {
  const header = page.locator("[data-section='header']");
  const compact = (page.viewportSize()?.width ?? 1920) < 1280;

  await expect(header).toBeVisible();
  await header
    .getByRole("button", {
      name: compact ? "Открыть меню" : "Открыть дополнительную навигацию",
    })
    .click();
  await expect(
    header.getByRole("navigation", { name: /основная навигация/i }),
  ).toBeVisible();
  await expect(header.getByRole("button").or(header.getByRole("link"))).not.toHaveCount(
    0,
  );
  await expect(
    header.getByRole("link", {
      name: "Нормативно-правовая информация",
      exact: true,
    }),
  ).toHaveAttribute("href", /\S+/);
});

test("R02: road network exposes all nine roads in approved order", async ({ page }) => {
  const slider = page.getByTestId("road-slider");
  const tabs = slider.getByRole("tab");

  await expect(slider).toBeVisible();
  await expect(slider.locator("[data-road-id]")).toHaveCount(roadIds.length);
  expect(
    await slider
      .locator("[data-road-id]")
      .evaluateAll((roads) => roads.map((road) => road.getAttribute("data-road-id"))),
  ).toEqual(roadIds);
  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
});

test("R02-R03: touch interaction does not depend on hover", async ({ page }) => {
  const hasTouch = await page.evaluate(() => navigator.maxTouchPoints > 0);
  test.skip(!hasTouch, "Touch contract is exercised only by touch projects");

  const secondRoad = page.getByTestId("road-slider").getByRole("tab").nth(1);
  await secondRoad.tap();
  await expect(secondRoad).toHaveAttribute("aria-selected", "true");

  const firstService = page
    .getByTestId("services-grid")
    .locator("[data-service-id]")
    .first();
  await expect(firstService).toContainText(/\S/);
  await firstService.locator("summary").tap();
  await expect(firstService.locator("p")).toBeVisible();
});

test("R03: services expose six items without hover-only copy", async ({ page }) => {
  const grid = page.getByTestId("services-grid");
  const items = grid.locator("[data-service-id]");

  await expect(items).toHaveCount(6);
  for (const item of await items.all()) {
    await expect(item).toContainText(/\S/);
    await expect(item.locator("summary")).toHaveCount(1);
    await expect(item.getByRole("link", { includeHidden: true })).toHaveAttribute(
      "href",
      /\S+/,
    );
  }
});

test("R04-R07: content rails expose honest data or explicit source states", async ({
  page,
}) => {
  await expect(page.getByTestId("loyalty-rail")).toBeVisible();
  await expect(
    page.locator("[data-loyalty-item], [data-loyalty-state='empty']"),
  ).not.toHaveCount(0);

  const newsGrid = page.getByTestId("news-grid");
  await expect(newsGrid.locator("[data-news-item]")).toHaveCount(5);
  await expect(newsGrid.locator("img")).toHaveCount(5);
  await expect(newsGrid.getByText("Иллюстрация", { exact: true })).toHaveCount(0);

  const allNews = newsGrid.getByRole("link", { name: "Все новости" });
  await expect(allNews).toBeVisible();
  await expect(allNews).toHaveCSS("background-color", "rgb(213, 68, 0)");
  await expect(allNews).toHaveCSS("color", "rgb(255, 255, 255)");

  if ((page.viewportSize()?.width ?? 0) >= 1024) {
    const [buttonBox, rightColumnCardBox] = await Promise.all([
      allNews.boundingBox(),
      newsGrid.locator(".news-card--3").boundingBox(),
    ]);
    expect(Math.abs((buttonBox?.x ?? 0) - (rightColumnCardBox?.x ?? 0))).toBeLessThan(
      1,
    );
    expect(
      Math.abs((buttonBox?.width ?? 0) - (rightColumnCardBox?.width ?? 0)),
    ).toBeLessThan(1);
  }

  for (const image of await newsGrid.locator("img").all()) {
    await expect(image).toHaveAttribute("alt", /.+/);
  }
  await expect(page.getByTestId("important-state")).toBeVisible();
  await expect(
    page.getByTestId("media-rail").locator("[data-media-item]"),
  ).not.toHaveCount(0);
  await expect(page.locator("[data-section='media'] h2:visible")).toHaveCount(0);

  const media = page.locator("[data-section='media']");
  const mediaRail = page.getByTestId("media-rail");
  await expect(mediaRail.locator("[data-media-original]")).toHaveCount(23);
  await expect(media.getByText(/\/ 23$/)).toBeVisible();

  await mediaRail.focus();
  await page.keyboard.press("ArrowRight");
});

test("R08: contacts implement the tabs keyboard contract", async ({ page }) => {
  const tabs = page.getByTestId("contacts-tabs").getByRole("tab");

  await expect(tabs).not.toHaveCount(0);
  await tabs.first().focus();
  await page.keyboard.press("ArrowDown");
  await expect(tabs.nth(1)).toBeFocused();
  await page.keyboard.press("End");
  await expect(tabs.last()).toBeFocused();
  await page.keyboard.press("Home");
  await expect(tabs.first()).toBeFocused();
});

test("R09-R10: verified spreadsheet statistics and subsidiary services remain accessible", async ({
  page,
}) => {
  const statistics = page.locator("[data-section='statistics']");
  await expect(page.getByTestId("statistics-source-gap")).toHaveCount(0);
  await expect(page.getByTestId("statistics-dashboard")).toBeVisible();
  await expect(statistics.getByRole("table")).toHaveCount(2);
  await expect(statistics.getByRole("img")).toHaveAttribute(
    "aria-label",
    /всего 738,7 км.*строительство: 288 км, 39,0%/i,
  );
  await expect(statistics).toContainText("2025");
  await expect(statistics).toContainText("2024");
  await expect(statistics).toContainText("2023");
  await expect(statistics).toContainText("837,8");
  await expect(statistics).toContainText("402,6");
  await expect(
    statistics.getByRole("link", { name: /диапазоны A4:B7 и I4:J8/i }),
  ).toHaveAttribute("href", /1SZl_7o-rjVSO6rrSGh5RD72oYq5xtvMUovVQnWUyCZg/);

  const firstTooltip = statistics.getByRole("button", {
    name: /строительство: точное значение и доля/i,
  });
  await firstTooltip.focus();
  await expect(firstTooltip).toBeFocused();
  await expect(
    statistics.getByRole("tooltip", {
      name: /строительство: 288 км, 39,0%/i,
    }),
  ).toBeVisible();

  const subsidiaryItems = page
    .getByTestId("subsidiary-grid")
    .locator("[data-subsidiary-item]");
  await expect(subsidiaryItems).not.toHaveCount(0);
  await expect(
    page.getByTestId("subsidiary-grid").locator(":scope > :empty"),
  ).toHaveCount(0);
});

test("R11-R14: hidden documents, social commitments, verified future projects and footer", async ({
  page,
}) => {
  await expect(page.locator("[data-section='documents']")).toHaveCount(0);
  await expect(page.locator("[data-section='social'] [data-social-item]")).toHaveCount(
    2,
  );

  const future = page.locator("[data-section='future']");
  const verifiedProjects = future.locator(
    "[data-future-project][data-status='verified']",
  );
  const blockedProjects = future.locator(
    "[data-future-project][data-status='blocked-source-gap']",
  );
  await expect(verifiedProjects).toHaveCount(3);
  await expect(blockedProjects).toHaveCount(0);
  for (let index = 0; index < 3; index += 1) {
    await expect(verifiedProjects.nth(index)).toContainText("К 2030 году");
  }
  await expect(future).toContainText("КАД-2");
  await expect(future).toContainText("А-108");
  await expect(future).toContainText("Южный обход г. Краснодар");
  await expect(future.getByRole("link", { name: /официальный источник/i })).toHaveCount(
    3,
  );
  await expect(page.locator("[data-section='footer']")).toBeVisible();
});

test("R15: chat starts with FAQ and restores trigger focus", async ({ page }) => {
  const trigger = page.getByTestId("chat-trigger");

  await trigger.focus();
  await trigger.press("Enter");
  const dialog = page.getByTestId("chat-dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("details")).toHaveCount(3);
  await expect(dialog.getByRole("link", { name: /форме обращения/i })).toHaveAttribute(
    "href",
    /\S+/,
  );
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).not.toHaveText(/обратная связь/i);
});

test("R16: car pointer has explicit on and off preview states", async ({ page }) => {
  await page.goto("/?car=on");
  await expect(page.getByTestId("car-pointer")).toBeVisible();

  await page.goto("/?car=off");
  await expect(page.getByTestId("car-pointer")).toHaveCount(0);
});

test("R17: back-to-top works from the keyboard", async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const control = page.getByTestId("back-to-top");

  await expect(control).toBeVisible();
  await control.focus();
  await control.press("Enter");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(8);
});
