import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  globalSetup: "./setup/globalSetup.ts",

  use: {
    baseURL: "http://127.0.0.1:3000",
    storageState: "./setup/storageState.json",
  },

  webServer: {
    command: "cd ../ && npm start",
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
