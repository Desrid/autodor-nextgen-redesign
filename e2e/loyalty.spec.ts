import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("loyalty rail shows three desktop cards and responds to navigation", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.use.viewport!.width < 1024, "Desktop rail contract");

  await page.goto("/");

  const rail = page.getByTestId("loyalty-rail");
  await expect(rail.locator("[data-loyalty-item]")).toHaveCount(6);

  const visibleCards = await rail.evaluate((element) => {
    const railRect = element.getBoundingClientRect();
    return [...element.querySelectorAll<HTMLElement>("[data-loyalty-item]")].filter(
      (card) => {
        const cardRect = card.getBoundingClientRect();
        return cardRect.left >= railRect.left && cardRect.right <= railRect.right + 1;
      },
    ).length;
  });

  expect(visibleCards).toBe(3);

  const firstCard = rail.locator("[data-loyalty-item]").first();
  await firstCard.hover();
  await expect(firstCard).toHaveCSS("background-color", "rgb(213, 68, 0)");
  await expect(firstCard.locator("img")).not.toHaveCSS("transform", "none");

  await page.getByRole("button", { name: "Следующие программы" }).click();
  await expect
    .poll(() => rail.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(0);

  const accessibility = await new AxeBuilder({ page })
    .include("[data-section='loyalty']")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(accessibility.violations).toEqual([]);
});
