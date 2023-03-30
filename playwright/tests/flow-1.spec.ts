import { expect, test } from "@playwright/test";

test.skip("test", async ({ page }) => {
  // TODO: Figure out authentication before enabling this test

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
  await expect(page.getByRole("cell", { name: "Test tag" })).toBeVisible();
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
  await expect(page.getByRole("cell", { name: "Test link" })).toBeVisible();
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
