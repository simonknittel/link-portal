import clsx from "clsx";
import { getAllProjects } from "~/server/services/project";
import Avatar from "./Avatar";
import ProjectSelectorFlyout from "./ProjectSelectorFlyout";

interface Props {
  projectSlug?: string;
}

const ProjectSelector = async ({ projectSlug }: Props) => {
  const projects = await getAllProjects();
  const selectedProject = projects.find(
    (project) => project.slug === projectSlug
  );

  return (
    <div className="flex items-center justify-between border-b-2 border-slate-800 px-8 py-4 relative">
      <div
        className={clsx("flex items-center", {
          "gap-4": selectedProject,
          "h-16": !selectedProject,
        })}
      >
        {selectedProject && (
          <div className="overflow-hidden rounded">
            <Avatar name={selectedProject?.name} />
          </div>
        )}

        <p className="text-xl font-bold">
          {selectedProject ? selectedProject.name : "Your projects"}
        </p>
      </div>

      {selectedProject && (
        <ProjectSelectorFlyout
          projects={projects}
          selectedProject={selectedProject}
        />
      )}
    </div>
  );
};

export default ProjectSelector;
