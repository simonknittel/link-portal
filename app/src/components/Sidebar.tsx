import Link from "next/link";
import { FaChevronRight, FaCog, FaUserAlt, FaUsers } from "react-icons/fa";
import { getAllTeams } from "~/server/services/team";
import Account from "./Account";
import Avatar from "./Avatar";
import CreateTeamButton from "./CreateTeamButton";
import TeamSelector from "./TeamSelector";

interface Props {
  teamSlug?: string;
}

const Sidebar = async ({ teamSlug }: Props) => {
  const teams = await getAllTeams();

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

        <TeamSelector teamSlug={teamSlug} />

        {teamSlug ? (
          <nav className="p-4">
            <ul>
              <li>
                <Link
                  href={`/app/team/${teamSlug}`}
                  className="flex gap-2 items-center p-4 hover:bg-slate-800 rounded"
                >
                  <FaUsers />
                  Team dashboard
                </Link>
              </li>

              <li>
                <Link
                  href={`/app/team/${teamSlug}/settings`}
                  className="flex gap-2 items-center p-4 hover:bg-slate-800 rounded"
                >
                  <FaCog />
                  Team settings
                </Link>
              </li>
            </ul>
          </nav>
        ) : (
          <nav className="p-4">
            <ul>
              {teams
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((team) => (
                  <li key={team.slug}>
                    <Link
                      href={`/app/team/${team.slug}`}
                      className="p-4 flex justify-between items-center hover:bg-slate-800 rounded"
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
