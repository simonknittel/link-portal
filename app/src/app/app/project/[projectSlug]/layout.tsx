import { type ReactNode } from "react";
import Sidebar from "~/components/Sidebar";
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

  return (
    <div className="min-h-screen">
      <div className="fixed h-screen w-96 overflow-auto bg-slate-900">
        <Sidebar project={project} />
      </div>

      <div className="ml-96 min-h-screen">{children}</div>
    </div>
  );
}
