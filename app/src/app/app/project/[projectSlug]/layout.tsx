import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { type ReactNode } from "react";
import Sidebar from "~/components/Sidebar";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

interface Props {
  children: ReactNode;
  params: {
    projectSlug?: string;
  };
}

export default async function ProjectLayout({ children, params }: Props) {
  const project = await prisma.project.findUnique({
    where: {
      slug: params.projectSlug,
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
    <div className="min-h-screen">
      <div className="fixed h-screen w-96 overflow-auto bg-slate-900">
        <Sidebar project={project} />
      </div>

      <div className="ml-96 min-h-screen">{children}</div>
    </div>
  );
}
