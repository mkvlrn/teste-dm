import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src",
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: "http://proxy",
    headless: true,
    trace: "on-first-retry",
    video: "on",
  },
  outputDir: "./test-results",
});
