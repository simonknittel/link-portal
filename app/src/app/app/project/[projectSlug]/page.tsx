import { type Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FaUsers } from "react-icons/fa";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import DashboardEntries from "../../_components/DashboardEntries";
import DashboardEntriesSkeleton from "../../_components/DashboardEntriesSkeleton";
import { getProjectBySlug } from "./_utils/getProject";

interface Params {
  projectSlug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const project = await getProjectBySlug(params.projectSlug);
  if (!project) return {};

  return {
    title: `Dashboard - ${project.name || ""} | Link Portal`,
  };
}

interface Props {
  params: Params;
}

export default async function Page({ params }: Props) {
  const project = await prisma.project.findUnique({
    where: {
      slug: params.projectSlug,
    },
    include: {
      tags: {
        include: {
          links: true,
        },
      },
    },
  });

  const session = await getServerSession(authOptions);
  if (
    !project ||
    !session?.user.projectMemberships.some(
      (projectMembership) => projectMembership.projectId === project.id
    )
  )
    notFound();

  return (
    <main className="p-8 pt-24 lg:pt-8">
      <h1 className="font-bold text-2xl flex items-center gap-4">
        <FaUsers />
        Project dashboard
      </h1>

      <Suspense fallback={<DashboardEntriesSkeleton />}>
        <DashboardEntries project={project} />
      </Suspense>
    </main>
  );
}
