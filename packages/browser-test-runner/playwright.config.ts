import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./__tests__",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    actionTimeout: 0,
    trace: "on-first-retry",
  },

  projects: process.env.CI
    ? // Skip Chromium in CI for now because font rendering is inconsistent
      [
        {
          name: "firefox",
          use: {
            ...devices["Desktop Firefox"],
          },
        },
      ]
    : [
        {
          name: "chromium",
          use: {
            ...devices["Desktop Chrome"],
          },
        },

        {
          name: "firefox",
          use: {
            ...devices["Desktop Firefox"],
          },
        },
      ],

  outputDir: "results/",
  webServer: undefined,
};

export default config;
