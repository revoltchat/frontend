import { Page, expect, test } from "@playwright/test";
import components from "showcase/componentData";

const CUSTOM_TESTS: Record<string, (page: Page) => Promise<void>> = {
  Modal: async (page) => {
    await page.goto("http://localhost:5273/all.html?filter=Modal&show=default");
    await expect(page).toHaveScreenshot("Modal-default.png");

    await page.goto(
      "http://localhost:5273/all.html?filter=Modal&show=no-actions"
    );
    await expect(page).toHaveScreenshot("Modal-no_actions.png");
  },
};

for (const component of components) {
  test(component, async ({ page }) => {
    if (CUSTOM_TESTS[component]) {
      await CUSTOM_TESTS[component](page);
    } else {
      await page.goto("http://localhost:5273/all.html?filter=" + component);

      // wait for load
      await page.waitForLoadState("networkidle");

      // reset any videos
      await page.$$eval("video", (videos) => {
        for (const video of videos) {
          video.pause();
          video.currentTime = 0;
        }
      });

      // ensure we are idle again
      await page.waitForLoadState("networkidle");

      await expect(page.locator(`#${component}`)).toHaveScreenshot(
        component + ".png"
      );
    }
  });
}
