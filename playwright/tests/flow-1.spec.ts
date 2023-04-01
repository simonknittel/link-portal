import { expect, test } from "@playwright/test";

test("should create a project, a tag, a link and then favourite it", async ({
  page,
  context,
}) => {
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

  await page.goto("/app");
  await page.getByRole("button", { name: "Create new project" }).click();
  await page.locator('input[name="name"]').fill("Test project");
  await page.getByRole("button", { name: "Create", exact: true }).click();

  await expect(page).toHaveURL(/.*\/app\/project\/test-project-.{10}/);
  await page.getByRole("link", { name: "Tags" }).click();

  await expect(page).toHaveURL(/.*\/app\/project\/test-project-.{10}\/tags/);
  await page.getByRole("button", { name: "Create" }).click();
  await page.locator('input[name="title"]').fill("Test tag");
  await page.locator('input[name="title"]').press("Tab");
  await page.locator('input[name="description"]').fill("Test tag description");
  await page.locator('input[name="description"]').press("Enter");
  await expect(
    page.getByRole("cell", { name: "Test tag", exact: true })
  ).toBeVisible();
  await page.getByRole("link", { name: "Links" }).click();

  await expect(page).toHaveURL(/.*\/app\/project\/test-project-.{10}\/links/);
  await page.getByRole("button", { name: "Create" }).click();
  await page.locator('input[name="title"]').fill("Test link");
  await page.locator('input[name="title"]').press("Tab");
  await page.locator('input[name="description"]').fill("Test link description");
  await page.locator('input[name="description"]').press("Tab");
  await page.locator('input[name="href"]').fill("https://example.com");
  await page.getByRole("listbox").selectOption({ label: "Test tag" });
  await page.locator("form").getByRole("button", { name: "Create" }).click();
  await expect(
    page.getByRole("cell", { name: "Test link", exact: true })
  ).toBeVisible();
  await page.getByRole("link", { name: "Project dashboard" }).click();

  await expect(page).toHaveURL(/.*\/app\/project\/test-project-.{10}/);
  // TODO: Check that the link is listed on the project dashboard
  await expect(page.getByRole("heading", { name: "Test tag" })).toBeVisible();
  await page
    .getByRole("button", { name: "Add Test link to your favourites" })
    .click();
  await page.getByRole("link", { name: "Personal dashboard" }).click();

  await expect(page).toHaveURL(/.*\/app/);
  // TODO: Check that the link is listed on the personal dashboard under "Your favourites"
});
