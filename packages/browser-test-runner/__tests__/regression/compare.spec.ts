import { test, expect } from '@playwright/test';

import components from 'showcase/componentData';

for (const component of components) {
  test(component, async ({ page }) => {
    await page.goto('http://localhost:5273/all.html');
    await expect(page.locator(`#${component}`)).toHaveScreenshot(component + '.png');
  })
}
