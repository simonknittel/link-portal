import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { type ReactNode } from "react";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import Sidebar from "../../components/Sidebar";
import SidebarContainer from "../../components/SidebarContainer";

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
      <SidebarContainer>
        <Sidebar project={project} />
      </SidebarContainer>

      <div className="lg:ml-96 min-h-screen">{children}</div>
    </div>
  );
}
