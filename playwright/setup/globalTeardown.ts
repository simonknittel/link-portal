import { PrismaClient } from "../../app/node_modules/@prisma/client";

async function globalTeardown() {
  if (process.env.CI) return;

  const prisma = new PrismaClient();
  await prisma.$transaction([
    prisma.project.delete({
      where: { slug: "test-project" },
    }),

    prisma.user.delete({
      where: { email: "test@example.com" },
    }),
  ]);
}

export default globalTeardown;
