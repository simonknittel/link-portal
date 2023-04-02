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

test("should create a project", async ({ page }) => {
  await page.goto("/app");

  await page.getByRole("button", { name: "Create new project" }).click();
  await page.locator('input[name="name"]').fill("Test project");
  await page.getByRole("button", { name: "Create", exact: true }).click();

  await expect(page).toHaveURL(/.*\/app\/project\/test-project-.{10}/);

  // TODO: Clean up created project
  // TODO: Why is it creating two projects?
});
