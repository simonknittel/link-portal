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

test("should remove an invited project member", async ({ page }) => {
  const prisma = new PrismaClient();
  await prisma.invitedProjectMember.create({
    data: {
      project: {
        connect: {
          slug: "test-project",
        },
      },
      email: "test-2@example.com",
      role: 1,
    },
  });

  page.on("dialog", (dialog) => dialog.accept());

  await page.goto("/app/project/test-project/settings");

  await page
    .getByRole("button", {
      name: 'Remove user "test-2@example.com" from project "Test project"',
    })
    .click({
      force: true,
    });

  await expect(
    page.getByRole("cell", { name: "test-2@example.com", exact: true })
  ).toBeHidden();
});
