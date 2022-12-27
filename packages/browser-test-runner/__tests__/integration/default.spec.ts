import { test, expect } from "@playwright/test";

test("Run integration tests", async ({ page }) => {
  await test.step("Navigate to app", async () => {
    await page.goto("http://local.revolt.chat:5173");
    await expect(page).toHaveScreenshot("Login.png");
  });

  await test.step("Log into app", async () => {
    await page.type('input[name="email"]', "user@revolt.chat");
    await page.type('input[name="password"]', "user@revolt.chat");
    await page.keyboard.press("Enter");

    await expect(page.getByText("home page")).toBeVisible();
    await expect(page).toHaveScreenshot("Home.png");
  });
});
