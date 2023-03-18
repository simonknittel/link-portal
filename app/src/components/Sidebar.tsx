import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions } from "~/server/auth";
import Avatar from "./Avatar";
import LogoutButton from "./LogoutButton";

const Sidebar = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b-2 border-slate-800 px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="overflow-hidden rounded">
              <Avatar
                name={session.user.name}
                image={session.user.image}
                size={32}
              />
            </div>

            <div>
              <p>{session.user.name}</p>
              <p className="text-sm text-slate-500">{session.user.email}</p>
            </div>
          </div>

          <LogoutButton />
        </div>

        <div className="flex items-center justify-between border-b-2 border-slate-800 px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="overflow-hidden rounded">
              <Avatar name={"Personal"} />
            </div>

            <p>Personal</p>
          </div>
        </div>

        <nav className="p-8">
          <ul>
            <li>
              <Link href={"/app"} className="block p-2">
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
