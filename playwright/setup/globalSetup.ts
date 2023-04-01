import { chromium } from "@playwright/test";
import path from "node:path";
import { PrismaClient } from "../../app/node_modules/@prisma/client";

async function globalSetup() {
  const storagePath = path.resolve(__dirname, "storageState.json");
  const date = new Date();
  const sessionToken = "04456e41-ec3b-4edf-92c1-48c14e57cacd2";

  const prisma = new PrismaClient();

  await prisma.user.create({
    data: {
      name: "Test",
      email: "test@example.com",
      sessions: {
        create: {
          expires: new Date(date.getFullYear(), date.getMonth() + 1, 0),
          sessionToken,
        },
      },
      accounts: {
        create: {
          type: "oauth",
          provider: "github",
          providerAccountId: "1234567",
          // deepcode ignore HardcodedNonCryptoSecret: Only used for testing
          access_token: "ohg_1234567890abcdefghijklmnopqrstuv",
          token_type: "bearer",
          scope: "read:user,user:email",
        },
      },
    },
  });

  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: storagePath });
  await context.addCookies([
    {
      name: "next-auth.session-token",
      value: sessionToken,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      expires: 4070952000, // 01/01/2099 @ 12:00am (UTC)
    },
  ]);
  await context.storageState({ path: storagePath });
  await browser.close();
}

export default globalSetup;
