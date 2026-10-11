import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end smoke tests. They expect both servers to be running:
 *   backend:  python manage.py runserver 8000   (with demo data: manage.py seed_demo, SHOW_DEMO_CONTENT=true)
 *   frontend: npm run build && npm start
 * Set PLAYWRIGHT_CHROMIUM_EXECUTABLE to use an already-installed Chromium.
 */
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined;

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: { baseURL: process.env.E2E_BASE_URL || "http://localhost:3000", launchOptions: { executablePath } },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], launchOptions: { executablePath } } },
    { name: "mobile", use: { ...devices["Pixel 7"], launchOptions: { executablePath } } },
  ],
});
