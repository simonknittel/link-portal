import { expect, test } from "@playwright/test";
import { PrismaClient } from "../../app/node_modules/@prisma/client";

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
});

test("should create a link", async ({ page }) => {
  const prisma = new PrismaClient();
  await prisma.tag.create({
    data: {
      title: "Test tag A",
      description: "Test tag description",
      project: {
        connect: {
          slug: "test-project",
        },
      },
    },
  });

  await page.goto("/app/project/test-project/links");

  await page.getByRole("button", { name: "Create" }).click();
  await page.locator('input[name="title"]').fill("Test link");
  await page.locator('input[name="title"]').press("Tab");
  await page.locator('input[name="description"]').fill("Test link description");
  await page.locator('input[name="description"]').press("Tab");
  await page.locator('input[name="href"]').fill("https://example.com");
  await page.getByRole("listbox").selectOption({ label: "Test tag A" });
  await page.locator("form").getByRole("button", { name: "Create" }).click();

  await expect(
    page.getByRole("cell", { name: "Test link", exact: true })
  ).toBeVisible();
});

test("should list tag and link on the project dashboard", async ({ page }) => {
  const prisma = new PrismaClient();
  await prisma.link.create({
    data: {
      title: "Test link B",
      description: "Test link description",
      href: "https://example.com",
      project: {
        connect: {
          slug: "test-project",
        },
      },
      tags: {
        create: {
          title: "Test tag B",
          description: "Test tag description",
          project: {
            connect: {
              slug: "test-project",
            },
          },
        },
      },
    },
  });

  await page.goto("/app/project/test-project");

  await expect(page.getByRole("heading", { name: "Test tag B" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Test link B" })).toBeVisible();
});

test("should favourite and unfavourite a link", async ({ page }) => {
  const prisma = new PrismaClient();
  await prisma.link.create({
    data: {
      title: "Test link C",
      description: "Test link description",
      href: "https://example.com",
      project: {
        connect: {
          slug: "test-project",
        },
      },
      tags: {
        create: {
          title: "Test tag C",
          description: "Test tag description",
          project: {
            connect: {
              slug: "test-project",
            },
          },
        },
      },
    },
  });

  await page.goto("/app/project/test-project");

  await page
    .getByRole("button", { name: "Add Test link C to your favourites" })
    .click();
  await page
    .getByRole("button", { name: "Remove Test link C from your favourites" })
    .click();
});

test.skip("should favourite a link and then check if it's visible on the personal dashboard", async ({
  page,
}) => {});
