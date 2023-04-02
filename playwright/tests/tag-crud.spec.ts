import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    {
      name: "next-auth.session-token",
      value: "04456e41-ec3b-4edf-92c1-48c14e57cacd2",
      domain: "127.0.0.1",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      expires: 4070952000, // 2099-01-01 @ 12:00am (UTC)
    },
  ]);
});

test("should create a tag", async ({ page }) => {
  await page.goto("/app/project/test-project/tags");

  await page.getByRole("button", { name: "Create" }).click();
  await page.locator('input[name="title"]').fill("Test tag");
  await page.locator('input[name="title"]').press("Tab");
  await page.locator('input[name="description"]').fill("Test tag description");
  await page.locator('input[name="description"]').press("Enter");

  await expect(
    page.getByRole("cell", { name: "Test tag", exact: true })
  ).toBeVisible();
});
