import Link from "next/link";
import { FaChevronRight, FaCog, FaUserAlt, FaUsers } from "react-icons/fa";
import { getAllProjects } from "~/server/services/project";
import Account from "./Account";
import Avatar from "./Avatar";
import CreateProjectButton from "./CreateProjectButton";
import ProjectSelector from "./ProjectSelector";

interface Props {
  projectSlug?: string;
}

const Sidebar = async ({ projectSlug }: Props) => {
  const projects = await getAllProjects();

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <Account />

        <nav className="p-4 border-b-2 border-slate-800">
          <ul>
            <li>
              <Link
                href={`/app`}
                className="flex gap-2 items-center p-4 hover:bg-slate-800 rounded"
              >
                <FaUserAlt />
                Personal dashboard
              </Link>
            </li>
          </ul>
        </nav>

        <ProjectSelector projectSlug={projectSlug} />

        {projectSlug ? (
          <nav className="p-4">
            <ul>
              <li>
                <Link
                  href={`/app/project/${projectSlug}`}
                  className="flex gap-2 items-center p-4 hover:bg-slate-800 rounded"
                >
                  <FaUsers />
                  Project dashboard
                </Link>
              </li>

              <li>
                <Link
                  href={`/app/project/${projectSlug}/settings`}
                  className="flex gap-2 items-center p-4 hover:bg-slate-800 rounded"
                >
                  <FaCog />
                  Project settings
                </Link>
              </li>
            </ul>
          </nav>
        ) : (
          <nav className="p-4">
            <ul>
              {projects
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((project) => (
                  <li key={project.slug}>
                    <Link
                      href={`/app/project/${project.slug}`}
                      className="p-4 flex justify-between items-center hover:bg-slate-800 rounded"
                    >
                      <span className="flex gap-2 items-center">
                        <Avatar
                          name={project.name}
                          image={project.image}
                          size={32}
                        />
                        {project.name}
                      </span>

                      <FaChevronRight />
                    </Link>
                  </li>
                ))}

              <li>
                <CreateProjectButton />
              </li>
            </ul>
          </nav>
        )}
      </div>

      <footer className="px-8 py-4 text-center text-slate-500">
        Link Portal •{" "}
        <a
          href="https://github.com/simonknittel/link-portal"
          className="text-slate-400 underline hover:text-slate-300"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
};

export default Sidebar;
