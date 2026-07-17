import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

const primaryLabels = [
  "О компании",
  "Пресс-центр",
  "Пользователям автодорог",
  "Партнёрам",
  "Закупки",
] as const;

const megaGroups = [
  {
    title: "Дочерние общества",
    links: [
      "ООО УК «Автодор»",
      "ООО «АВТОДОР-ТП»",
      "ООО «АВТОДОР - ПЛАТНЫЕ ДОРОГИ»",
      "ООО «АВТОДОР-УП»",
      "ООО «АВТОДОР - ИНЖИНИРИНГ»",
      "ООО «СК АВТОДОР»",
    ],
  },
  {
    title: "Федеральные трассы",
    links: [
      "Сеть дорог",
      "М-1 «Беларусь»",
      "М-3 «Украина»",
      "М-11 «Нева»",
      "М-4 «Дон»",
      "М-12 «Восток»",
      "А-113 ЦКАД",
      "А-289",
      "А-105 Москва-Домодедово",
      "А-107 «ММК»",
    ],
  },
  {
    title: "Информация о дорогах",
    links: [
      "Грузоперевозчикам",
      "Ремонтные работы",
      "Проезд школьных автобусов",
      "Помощь на дороге",
      "Расчет стоимости работы",
      "Договор об организации проезда",
    ],
  },
  {
    title: "Инвесторам",
    links: [
      "Инвестиционные проекты",
      "Ценные бумаги",
      "Раскрытие информации",
      "Существенные факты",
      "Инсайдерам Госкомпании",
      "Реквизиты",
    ],
  },
  {
    title: "Поддержка субъектов МСП",
    links: [
      "Информация для субъектов МСП",
      "Программа партерства с субъеткати МСП",
      "Деятельность экспертного совета",
    ],
  },
  {
    title: "Документация",
    links: [
      "Центральный аппарат и филиалы",
      "Дочерние общества",
      "Деятельность компании",
      "Антимонопольный комплекс",
      "Противодействие коррупции",
      "Нормативно-правовая информация",
      "Отозванные доверенности",
    ],
  },
] as const;

const viewportWidth = (page: Page) => page.viewportSize()?.width ?? 1920;

async function openNavigation(page: Page) {
  const desktop = viewportWidth(page) >= 1280;
  const trigger = page.locator(desktop ? ".more-button" : ".menu-button");

  await trigger.click();
  await expect(page.locator("#header-mega-panel")).toBeVisible();
  return { desktop, trigger };
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("preserves the approved primary order at every breakpoint", async ({ page }) => {
  const { desktop } = await openNavigation(page);
  const navigation = desktop
    ? page.getByRole("navigation", { name: "Основная навигация" }).first()
    : page.getByRole("navigation", { name: "Основная навигация" });

  await expect(navigation.locator("ul").first().getByRole("link")).toHaveText([
    ...primaryLabels,
  ]);
});

test("1280 keeps the complete desktop row without wrapping or overflow", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-1920",
    "Single intermediate-width probe",
  );
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const navigation = page.getByRole("navigation", { name: "Основная навигация" });
  const links = navigation.locator("ul").first().getByRole("link");

  await expect(links).toHaveText([...primaryLabels]);
  await expect
    .poll(() =>
      navigation.locator("li").evaluateAll((items) => {
        const tops = items.map((item) => item.getBoundingClientRect().top);
        return Math.max(...tops) - Math.min(...tops);
      }),
    )
    .toBeLessThan(1);
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

test("renders every Figma mega group and link in the approved order", async ({
  page,
}) => {
  await openNavigation(page);
  const mega = page.getByRole("navigation", {
    name: "Дополнительная навигация",
  });

  for (const group of megaGroups) {
    const heading = mega.getByRole("heading", {
      name: group.title,
      exact: true,
    });
    const links = heading.locator("xpath=parent::*").locator("ul").first();
    await expect(links.getByRole("link")).toHaveText([...group.links]);
  }

  const hrefs = await mega
    .getByRole("link")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(hrefs.every((href) => href && href !== "#")).toBe(true);
});

test("desktop More supports click, Enter, Space and repeat close", async ({ page }) => {
  test.skip(viewportWidth(page) < 1280, "Desktop-only control contract");
  const trigger = page.locator(".more-button");

  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#header-mega-panel")).toHaveCount(0);

  await trigger.focus();
  await trigger.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await trigger.press("Enter");
  await expect(page.locator("#header-mega-panel")).toHaveCount(0);

  await trigger.focus();
  await trigger.press("Space");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
});

test("Escape and outside click close the layer and restore its own trigger", async ({
  page,
}) => {
  const { trigger } = await openNavigation(page);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(page.locator("#header-mega-panel")).toHaveCount(0);

  await trigger.click();
  if (viewportWidth(page) >= 1280) {
    const viewportHeight = page.viewportSize()?.height ?? 1080;
    const panel = await page.locator("#header-mega-panel").boundingBox();
    if (panel && panel.y + panel.height <= viewportHeight - 24) {
      await page.mouse.click(10, viewportHeight - 10);
    } else {
      await page.evaluate(() =>
        document.body.dispatchEvent(
          new PointerEvent("pointerdown", { bubbles: true, cancelable: true }),
        ),
      );
    }
    await expect(trigger).toBeFocused();
    await expect(page.locator("#header-mega-panel")).toHaveCount(0);
  }
});

test("search and language are mutually exclusive and restore the correct focus", async ({
  page,
}) => {
  test.skip(viewportWidth(page) < 1280, "Desktop utility-state contract");
  const search = page.getByRole("button", { name: "Открыть поиск" });
  const language = page.getByRole("button", { name: "Выбрать язык" });

  await search.click();
  await expect(page.getByRole("searchbox", { name: "Поиск по сайту" })).toBeFocused();
  await language.click();
  await expect(page.locator("[data-layer='search']")).toHaveCount(0);
  await expect(page.locator("[data-layer='language']")).toBeVisible();
  await expect(
    page.locator("[data-layer='language'] a[aria-current='page']"),
  ).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(language).toBeFocused();
  await search.click();
  await page.keyboard.press("Escape");
  await expect(search).toBeFocused();
});

test("navigation closes after following a mega link", async ({ page }) => {
  await openNavigation(page);
  const link = page
    .getByRole("navigation", { name: "Дополнительная навигация" })
    .getByRole("link", { name: "Сеть дорог", exact: true });
  await link.evaluate((element) =>
    element.addEventListener("click", (event) => event.preventDefault(), {
      once: true,
    }),
  );
  await link.click();
  await expect(page.locator("#header-mega-panel")).toHaveCount(0);
});

test("mobile menu traps focus, locks scroll and returns focus", async ({ page }) => {
  test.skip(viewportWidth(page) >= 1280, "Compact navigation contract");
  const trigger = page.getByRole("button", { name: "Открыть меню" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Мобильная навигация" });
  const first = dialog.getByRole("button", { name: "Закрыть" });
  const focusable = dialog.locator(
    "a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])",
  );
  const last = focusable.last();

  await expect(first).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe("hidden");
  await first.press("Shift+Tab");
  await expect(last).toBeFocused();
  await last.press("Tab");
  await expect(first).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
});

test("header tab order follows logo, primary navigation and utility actions", async ({
  page,
}) => {
  test.skip(viewportWidth(page) < 1280, "Desktop tab-order contract");
  await page.locator("body").focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(page.locator(".brand-lockup")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "О компании", exact: true }).first(),
  ).toBeFocused();
});

test("all visible header controls are at least 44 by 44 and never overflow", async ({
  page,
}) => {
  const controls = page.locator(
    "[data-section='header'] a:visible, [data-section='header'] button:visible, [data-section='header'] input:visible",
  );

  for (const control of await controls.all()) {
    const box = await control.boundingBox();
    const name =
      (await control.getAttribute("aria-label")) ??
      (await control.textContent()) ??
      "unnamed header control";
    expect(box).not.toBeNull();
    expect(box?.height ?? 0, name.trim()).toBeGreaterThanOrEqual(44);
    expect(box?.width ?? 0, name.trim()).toBeGreaterThanOrEqual(44);
  }

  await openNavigation(page);
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

test("open header states have no detectable WCAG A/AA violations", async ({ page }) => {
  await openNavigation(page);
  const results = await new AxeBuilder({ page })
    .include("[data-section='header']")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(results.violations).toEqual([]);
});

test("reduced motion removes header transforms and long animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openNavigation(page);
  const motion = await page.locator("#header-mega-panel").evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      animationDuration: Number.parseFloat(style.animationDuration) || 0,
      transform: style.transform,
    };
  });

  expect(motion.animationDuration).toBeLessThanOrEqual(0.08);
  expect(motion.transform).toBe("none");
});

test("header visual states", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const width = viewportWidth(page);
  const clip = {
    x: 0,
    y: 0,
    width,
    height: Math.min(page.viewportSize()?.height ?? 1080, width >= 1280 ? 844 : 844),
  };

  await expect(page).toHaveScreenshot(`header-${testInfo.project.name}-closed.png`, {
    clip,
  });

  const { desktop } = await openNavigation(page);
  await expect(page).toHaveScreenshot(
    `header-${testInfo.project.name}-${desktop ? "mega" : "mobile-open"}.png`,
    { clip },
  );

  if (desktop) {
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Открыть поиск" }).click();
    await expect(page).toHaveScreenshot(`header-${testInfo.project.name}-search.png`, {
      clip,
    });
  }
});

test("capture reviewed header evidence", async ({ page }, testInfo) => {
  test.skip(
    process.env.CAPTURE_HEADER !== "1",
    "Evidence capture is an explicit manual-review step",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  const directory = path.resolve("docs/qa/screenshots/header");
  await mkdir(directory, { recursive: true });

  await page.screenshot({
    path: path.join(directory, `${testInfo.project.name}-closed.png`),
  });
  const { desktop } = await openNavigation(page);
  await page.screenshot({
    path: path.join(
      directory,
      `${testInfo.project.name}-${desktop ? "mega" : "mobile-open"}.png`,
    ),
  });

  if (desktop) {
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Открыть поиск" }).click();
    await page.screenshot({
      path: path.join(directory, `${testInfo.project.name}-search.png`),
    });
  }
});
