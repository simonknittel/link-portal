"use client";

import { type Project } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import Avatar from "~/components/Avatar";
import Button from "~/components/Button";
import CreateProjectButton from "./CreateProjectButton";

interface Props {
  projects: Project[];
  selectedProject?: Project;
}

const ProjectSelectorFlyout = ({ projects, selectedProject }: Props) => {
  const [flyoutIsOpen, setFlyoutIsOpen] = useState(!Boolean(selectedProject));

  return (
    <>
      <Button
        variant="secondary"
        title="Open project selection"
        iconOnly={true}
        onClick={() => setFlyoutIsOpen((value) => !value)}
        className="flex-none"
      >
        <FaChevronDown />
      </Button>

      <div
        className={clsx({
          "absolute left-4 right-4 top-full rounded-b bg-slate-800 overflow-hidden p-4":
            true,
          hidden: flyoutIsOpen === false,
        })}
      >
        <ul>
          {projects
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/app/project/${project.slug}`}
                  className="p-4 flex justify-between items-center hover:bg-slate-700 rounded gap-2"
                  onClick={() => setFlyoutIsOpen(false)}
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
      </div>
    </>
  );
};

export default ProjectSelectorFlyout;
