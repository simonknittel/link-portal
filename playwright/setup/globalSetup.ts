import { PrismaClient } from "../../app/node_modules/@prisma/client";

async function globalSetup() {
  const prisma = new PrismaClient();
  await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      name: "Test",
      email: "test@example.com",
      sessions: {
        create: {
          expires: new Date(4070952000 * 1000), // 2099-01-01 @ 12:00am (UTC)
          sessionToken: "04456e41-ec3b-4edf-92c1-48c14e57cacd2",
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
      projects: {
        create: {
          project: {
            create: {
              name: "Test project",
              slug: "test-project",
            },
          },
          role: 2,
        },
      },
    },
  });
}

export default globalSetup;
