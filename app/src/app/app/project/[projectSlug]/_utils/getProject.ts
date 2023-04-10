import { type Project } from "@prisma/client";
import { cache } from "react";
import { prisma } from "~/server/db";

export const getProjectBySlug = cache((slug?: Project["slug"]) => {
  return prisma.project.findUnique({
    where: {
      slug,
    },
  });
});
