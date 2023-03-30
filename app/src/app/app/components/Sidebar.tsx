import { type Project } from "@prisma/client";
import Link from "next/link";
import {
  FaChevronRight,
  FaCog,
  FaListUl,
  FaUserAlt,
  FaUsers,
} from "react-icons/fa";
import Avatar from "~/components/Avatar";
import { prisma } from "~/server/db";
import Account from "./Account";
import CreateProjectButton from "./CreateProjectButton";
import ProjectSelector from "./ProjectSelector";

interface Props {
  project?: Project | null;
}

const Sidebar = async ({ project }: Props) => {
  const projects = await prisma.project.findMany();

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

        <ProjectSelector activeProject={project} />

        {project ? (
          <nav className="p-4">
            <ul>
              <li>
                <Link
                  href={`/app/project/${project.slug}`}
                  className="flex gap-2 items-center p-4 hover:bg-slate-800 rounded"
                >
                  <FaUsers />
                  Project dashboard
                </Link>
              </li>

              <li>
                <Link
                  href={`/app/project/${project.slug}/links`}
                  className="flex gap-2 items-center p-4 hover:bg-slate-800 rounded"
                >
                  <FaListUl />
                  Links
                </Link>
              </li>

              <li>
                <Link
                  href={`/app/project/${project.slug}/tags`}
                  className="flex gap-2 items-center p-4 hover:bg-slate-800 rounded"
                >
                  <FaListUl />
                  Tags
                </Link>
              </li>

              <li>
                <Link
                  href={`/app/project/${project.slug}/settings`}
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
                      className="p-4 flex gap-2 justify-between items-center hover:bg-slate-800 rounded"
                    >
                      <Avatar
                        name={project.name}
                        image={project.image}
                        size={32}
                        className="flex-shrink-0"
                      />

                      <p className="text-ellipsis overflow-hidden whitespace-nowrap flex-1">
                        {project.name}
                      </p>

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
