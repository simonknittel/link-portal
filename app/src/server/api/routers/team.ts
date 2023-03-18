import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const teamRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string(), slug: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.team.create({
        data: {
          name: input.name,
          slug: input.slug,
        },
      });
    }),
});
