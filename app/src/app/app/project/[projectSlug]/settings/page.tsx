import { type Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FaCog, FaExclamationTriangle } from "react-icons/fa";
import { env } from "~/env.mjs";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { getProjectBySlug } from "../_utils/getProject";
import AddProjectMember from "./_components/AddProjectMember";
import DeleteProjectButton from "./_components/DeleteProjectButton";
import InvitedProjectMembersTable from "./_components/InvitedProjectMembersTable";
import ProjectMembersTable from "./_components/ProjectMembersTable";

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
  const project = await getProjectBySlug(params.projectSlug);
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

        {env.NEXT_PUBLIC_DEMO === "true" &&
        projectMembers.length + invitedProjectMembers.length >= 3 ? (
          <>
            <AddProjectMember
              className="opacity-50 pointer-events-none"
              projectId={project.id}
            />

            <p className="mt-2 px-4 h-11 bg-amber-700 rounded flex gap-2 items-center">
              <FaExclamationTriangle />
              You can only invite two other project members in this demo.
            </p>
          </>
        ) : (
          <AddProjectMember projectId={project.id} />
        )}

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
