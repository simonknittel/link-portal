import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  globalSetup: "./setup/globalSetup.ts",
  globalTeardown: "./setup/globalTeardown.ts",

  use: {
    baseURL: "http://127.0.0.1:3000",
  },

  webServer: {
    command: "cd ../app/ && npm start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
