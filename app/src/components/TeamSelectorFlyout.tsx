"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { FaChevronDown, FaRegPlusSquare } from "react-icons/fa";
import Avatar from "./Avatar";
import Button from "./Button";
import CreateTeamModal from "./CreateTeamModal";

interface Props {
  teams: [];
}

const TeamSelectorFlyout = ({ teams }: Props) => {
  const [flyoutIsOpen, setFlyoutIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
                  className="p-4 flex gap-2 items-center hover:bg-slate-700 rounded"
                >
                  <Avatar name={team.name} image={team.image} size={32} />
                  {team.name}
                </Link>
              </li>
            ))}

          <li>
            <button
              className="p-4 flex gap-2 items-center hover:bg-slate-700 text-slate-500 rounded w-full"
              onClick={() => setModalIsOpen(true)}
            >
              <FaRegPlusSquare /> Create new team
            </button>
          </li>
        </ul>
      </div>

      <CreateTeamModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      />
    </>
  );
};

export default TeamSelectorFlyout;
