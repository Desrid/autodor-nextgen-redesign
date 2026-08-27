import { expect, test } from "@playwright/test";

test("@visual icon showcase loads and produces a review artifact", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/icon-showcase");

  const showcase = page.getByTestId("icon-showcase");
  await expect(showcase).toBeVisible();
  await expect(showcase.locator("[data-icon-name]").first()).toBeVisible();
  await expect(showcase.locator("[data-icon-size='16']").first()).toBeVisible();
  await expect(showcase.locator("[data-icon-size='20']").first()).toBeVisible();
  await expect(showcase.locator("[data-icon-size='24']").first()).toBeVisible();
  expect(errors).toEqual([]);

  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
  await page.screenshot({
    animations: "disabled",
    fullPage: true,
    path: testInfo.outputPath("icon-showcase.png"),
  });
});
