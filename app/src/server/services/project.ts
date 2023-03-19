import { prisma } from "~/server/db";

export function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: {
      slug,
    },
  });
}

export function getAllProjects() {
  return prisma.project.findMany();
}
