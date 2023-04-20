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

const LAX_CONFIGURATION = ["Attachment", "Embed"];

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
          // pause everything at start
          video.pause();
          video.currentTime = 0;

          // disable the controls because of platform differences
          video.controls = false;
        }
      });

      // delete all native audio components (because of platform differences)
      await page.$$eval("audio", (elements) => {
        for (const element of elements) {
          const parent = element.parentNode!;
          element.remove();

          const fakeContainer = document.createElement("div");
          fakeContainer.innerText = "Native Audio Element";
          fakeContainer.style.height = "fit-content";
          parent.appendChild(fakeContainer);
        }
      });

      // make sure fonts have loaded in
      await page.evaluate(() => document.fonts.ready);

      // ensure we are idle again
      await page.waitForLoadState("networkidle");

      await expect(page.locator(`#${component}`)).toHaveScreenshot(
        component + ".png",
        LAX_CONFIGURATION.includes(component)
          ? {
              maxDiffPixelRatio: 0.02,
              maxDiffPixels: 1500,
            }
          : {}
      );
    }
  });
}
