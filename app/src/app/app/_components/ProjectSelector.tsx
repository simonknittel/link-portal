import { type Project } from "@prisma/client";
import { getServerSession } from "next-auth";
import Avatar from "~/components/Avatar";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import ProjectSelectorFlyout from "./ProjectSelectorFlyout";

interface Props {
  activeProject?: Project | null;
}

const ProjectSelector = async ({ activeProject }: Props) => {
  const session = await getServerSession(authOptions);
  const projects = await prisma.project.findMany({
    where: {
      id: {
        in: session!.user.projectMemberships.map((m) => m.projectId),
      },
    },
  });

  return (
    <div className="flex items-center gap-4 justify-between border-b-2 border-slate-800 px-8 py-4 relative h-24">
      {activeProject && (
        <div className="overflow-hidden rounded flex-none">
          <Avatar name={activeProject?.name} />
        </div>
      )}

      <p
        className="text-xl font-bold text-ellipsis overflow-hidden whitespace-nowrap flex-1"
        title={activeProject?.name || "Your projects"}
      >
        {activeProject ? activeProject.name : "Your projects"}
      </p>

      {activeProject && (
        <ProjectSelectorFlyout
          projects={projects}
          selectedProject={activeProject}
        />
      )}
    </div>
  );
};

export default ProjectSelector;
