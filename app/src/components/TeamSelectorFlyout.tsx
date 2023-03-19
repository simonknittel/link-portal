"use client";

import { type Team } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import Avatar from "./Avatar";
import Button from "./Button";
import CreateTeamButton from "./CreateTeamButton";

interface Props {
  teams: Team[];
  selectedTeam?: Team;
}

const TeamSelectorFlyout = ({ teams, selectedTeam }: Props) => {
  const [flyoutIsOpen, setFlyoutIsOpen] = useState(!Boolean(selectedTeam));

  return (
    <>
      <Button
        variant="secondary"
        title="Open team selection"
        iconOnly={true}
        onClick={() => setFlyoutIsOpen((value) => !value)}
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
          {teams
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((team) => (
              <li key={team.slug}>
                <Link
                  href={`/app/team/${team.slug}`}
                  className="p-4 flex justify-between items-center hover:bg-slate-700 rounded"
                >
                  <span className="flex gap-2 items-center">
                    <Avatar name={team.name} image={team.image} size={32} />
                    {team.name}
                  </span>

                  <FaChevronRight />
                </Link>
              </li>
            ))}

          <li>
            <CreateTeamButton />
          </li>
        </ul>
      </div>
    </>
  );
};

export default TeamSelectorFlyout;
