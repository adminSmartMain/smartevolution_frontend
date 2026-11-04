const { defineConfig, devices } = require("@playwright/test");
const port = process.env.PLAYWRIGHT_PORT || "3000";
const baseURL = `http://127.0.0.1:${port}`;

module.exports = defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    launchOptions: {
      // Useful for local visual QA. CI keeps the default of zero milliseconds.
      slowMo: Number(process.env.PLAYWRIGHT_SLOW_MO || 0),
    },
  },
  webServer: {
    command: `npm run start -- -p ${port}`,
    url: `${baseURL}/auth/login`,
    // A non-default port gives local QA an isolated server and prevents a
    // previous developer server from serving an outdated build to Playwright.
    reuseExistingServer: !process.env.CI && port === "3000",
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_API_URL: "/api",
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
