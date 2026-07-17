import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders the server shell without console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });

  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  await expect(page.getByRole("main")).toBeAttached();
  expect(errors).toEqual([]);
});

test("has no automatically detectable accessibility violations", async ({ page }) => {
  await page.goto("/");

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
