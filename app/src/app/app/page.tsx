import { type Metadata } from "next";
import { FaStar, FaUserAlt } from "react-icons/fa";
import DashboardItem from "~/components/DashboardItem";
import Sidebar from "~/components/Sidebar";

export const metadata: Metadata = {
  title: "Teams | Link Portal",
};

export default function Page() {
  return (
    <div className="min-h-screen">
      <div className="fixed h-screen w-96 overflow-auto bg-slate-900">
        <Sidebar />
      </div>

      <main className="ml-96 min-h-screen p-8">
        <h1 className="font-bold text-2xl flex items-center gap-4">
          <FaUserAlt />
          Personal dashboard
        </h1>

        <section className="mt-8">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <FaStar className="text-amber-400" />
            Your favourites
          </h3>

          <ul className="grid grid-cols-4 gap-2">
            <DashboardItem
              href="https://mail.google.com/mail/u/?authuser=hallo@simonknittel.de"
              title="Gmail"
              description="Primary email provider"
              isFavourite={true}
            />
          </ul>

          {/* <p className="italic text-slate-500">
              You don&apos;t have any favourites.
            </p> */}
        </section>
      </main>
    </div>
  );
}
