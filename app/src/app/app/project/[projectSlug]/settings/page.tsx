import { type Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FaCog } from "react-icons/fa";
import AddProjectMember from "~/app/app/project/[projectSlug]/settings/components/AddProjectMember";
import DeleteProjectButton from "~/app/app/project/[projectSlug]/settings/components/DeleteProjectButton";
import InvitedProjectMembersTable from "~/app/app/project/[projectSlug]/settings/components/InvitedProjectMembersTable";
import ProjectMembersTable from "~/app/app/project/[projectSlug]/settings/components/ProjectMembersTable";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { getProjectBySlug } from "~/server/services/project";

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
    title: `Project settings - ${project.name || ""} | Link Portal`,
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
  });
  const session = await getServerSession(authOptions);
  if (
    !project ||
    !session?.user.projectMemberships.some(
      (projectMembership) => projectMembership.projectId === project.id
    )
  )
    notFound();

  const [projectMembers, invitedProjectMembers] = await prisma.$transaction([
    prisma.projectMember.findMany({
      where: {
        projectId: project.id,
      },
      include: {
        user: true,
      },
    }),
    prisma.invitedProjectMember.findMany({
      where: {
        projectId: project.id,
      },
    }),
  ]);

  return (
    <main className="p-8 pt-24 lg:pt-8">
      <h1 className="font-bold text-2xl flex items-center gap-4">
        <FaCog />
        Project settings
      </h1>

      <section className="p-8 bg-slate-700 rounded max-w-4xl mt-8">
        <h2 className="font-bold text-xl">Members</h2>

        <AddProjectMember projectId={project.id} />

        <ProjectMembersTable
          project={project}
          projectMembers={projectMembers}
        />

        {invitedProjectMembers.length > 0 && (
          <>
            <h3 className="font-bold text-xl mt-8">Invites</h3>

            <InvitedProjectMembersTable
              project={project}
              invitedProjectMembers={invitedProjectMembers}
            />
          </>
        )}
      </section>

      <section className="p-8 bg-red-900 rounded bg-opacity-25 max-w-4xl mt-8">
        <h2 className="font-bold text-xl text-red-500">Danger zone</h2>

        <p className="mt-4">
          Delete the project and all links of this project.
        </p>

        <DeleteProjectButton project={project} />
      </section>
    </main>
  );
}
