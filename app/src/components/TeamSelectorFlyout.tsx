"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { FaChevronDown, FaRegPlusSquare } from "react-icons/fa";
import Avatar from "./Avatar";
import Button from "./Button";

interface Props {
  teams: [];
}

const TeamSelectorFlyout = ({ teams }: Props) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        title="Open team selection"
        iconOnly={true}
        onClick={() => setIsActive((value) => !value)}
      >
        <FaChevronDown />
      </Button>

      <div
        className={clsx({
          "absolute left-4 right-4 top-full rounded-b bg-slate-800 overflow-hidden p-4":
            true,
          hidden: isActive === false,
        })}
      >
        <ul>
          {teams
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((team) => (
              <li key={team.slug}>
                <Link
                  href={`/app/team/${team.slug}`}
                  className="p-4 flex gap-2 items-center hover:bg-slate-700 rounded"
                >
                  <Avatar name={team.name} image={team.image} size={32} />
                  {team.name}
                </Link>
              </li>
            ))}

          <li>
            <Link
              href={`/app`}
              className="p-4 flex gap-2 items-center hover:bg-slate-700 text-slate-500 rounded"
            >
              <FaRegPlusSquare /> Create new team
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default TeamSelectorFlyout;
