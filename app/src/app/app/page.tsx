import { type Metadata } from "next";
import { getServerSession } from "next-auth";
import { FaStar, FaUserAlt } from "react-icons/fa";
import DashboardItem from "~/components/DashboardItem";
import Sidebar from "~/components/Sidebar";
import SidebarContainer from "~/components/SidebarContainer";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

export const metadata: Metadata = {
  title: "Projects | Link Portal",
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  const favourites = await prisma.linkUserKeyValue.findMany({
    where: {
      userId: session!.user.id,
      key: "favourited",
      value: "true",
    },
    include: {
      link: true,
    },
  });

  return (
    <div className="min-h-screen">
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>

      <main className="lg:ml-96 min-h-screen p-8 pt-24 lg:pt-8">
        <h1 className="font-bold text-2xl flex items-center gap-4">
          <FaUserAlt />
          Personal dashboard
        </h1>

        <section className="mt-8">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <FaStar className="text-amber-400" />
            Your favourites
          </h3>

          {favourites.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
              {favourites
                .sort((a, b) => a.link.title.localeCompare(b.link.title))
                .map((item) => (
                  <DashboardItem
                    key={item.link.id}
                    link={item.link}
                    favourited={true}
                  />
                ))}
            </ul>
          ) : (
            <p className="italic text-slate-500">
              You don&apos;t have any favourites yet.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
