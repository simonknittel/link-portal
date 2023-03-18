import { prisma } from "~/server/db";

export function getTeamBySlug(slug: string) {
  return prisma.team.findUnique({
    where: {
      slug,
    },
  });
}

export function getAllTeams() {
  return prisma.team.findMany();
}
