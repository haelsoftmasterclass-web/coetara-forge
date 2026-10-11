import { expect, test } from "@playwright/test";

const PAGES = [
  { path: "/", h1: /practical skills/i },
  { path: "/about", h1: /learning platform/i },
  { path: "/our-story", h1: /why we're building/i },
  { path: "/our-impact", h1: /impact we'll/i },
  { path: "/team", h1: /people behind/i },
  { path: "/instructors", h1: /learn from/i },
  { path: "/partners", h1: /partner with us/i },
  { path: "/testimonials", h1: /learner stories/i },
  { path: "/contact", h1: /let's talk/i },
];

for (const { path, h1 } of PAGES) {
  test(`${path} renders without errors or horizontal overflow`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
    await expect(page).toHaveTitle(/Haelsoft EdTech/);
    expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toContain(path === "/" ? "" : path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test("instructor profile loads from the API and unknown slugs return 404", async ({ page, request }) => {
  await page.goto("/instructors");
  const first = page.locator("main ul li article h2 a").first();
  const name = (await first.textContent())?.trim() ?? "";
  test.skip(!name, "No published instructors in the API");
  await first.click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
  await expect(page.getByText("Courses will be listed here as they become available.")).toBeVisible();

  const missing = await request.get("/instructors/this-profile-does-not-exist");
  expect(missing.status()).toBe(404);
});

test("no internal link on the homepage is dead", async ({ page, request }) => {
  await page.goto("/");
  const hrefs = await page.locator("a[href^='/']").evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")!.split("#")[0]!))]);
  for (const href of hrefs) {
    const res = await request.get(href || "/");
    expect(res.status(), href).toBe(200);
  }
});

test("mobile menu opens and navigates", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile only");
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Menu" });
  await dialog.getByRole("link", { name: "Our Team" }).click();
  await expect(page).toHaveURL(/\/team$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("contact form validates, then confirms only after the API accepts", async ({ page, isMobile }) => {
  test.skip(isMobile, "Run once");
  await page.goto("/contact?type=learning&subject=Course%20updates");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Please fix" })).toBeVisible();

  await page.getByLabel("Full name").fill("E2E Test");
  await page.getByLabel("Email address").fill("e2e@example.com");
  await page.getByLabel(/^Country/).selectOption("Rwanda");
  await page.getByLabel(/^Message/).fill("This is an automated end-to-end test message.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("heading", { name: "Message received" })).toBeVisible();
});
