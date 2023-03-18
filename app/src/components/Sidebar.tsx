import Link from "next/link";
import Account from "./Account";
import TeamSelector from "./TeamSelector";

interface Props {
  teamSlug: string;
}

const Sidebar = async ({ teamSlug }: Props) => {
  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <Account />

        <TeamSelector teamSlug={teamSlug} />

        <nav className="p-8">
          <ul>
            <li>
              <Link href={`/app/team/${teamSlug}`} className="block p-2">
                Dashboard
              </Link>
            </li>
          </ul>
        </nav>
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
