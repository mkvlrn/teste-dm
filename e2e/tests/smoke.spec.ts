import { expect, test } from "@playwright/test";

test("should show login page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Hey!")).toBeVisible();
});
