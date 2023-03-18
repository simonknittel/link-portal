import Link from "next/link";
import { FaCog, FaHome } from "react-icons/fa";
import Account from "./Account";
import TeamSelector from "./TeamSelector";

interface Props {
  teamSlug?: string;
}

const Sidebar = ({ teamSlug }: Props) => {
  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <Account />

        <TeamSelector teamSlug={teamSlug} />

        {teamSlug && (
          <nav className="p-4">
            <ul>
              <li>
                <Link
                  href={`/app/team/${teamSlug}`}
                  className="flex gap-2 items-center p-4 hover:bg-slate-800 rounded"
                >
                  <FaHome />
                  Dashboard
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
