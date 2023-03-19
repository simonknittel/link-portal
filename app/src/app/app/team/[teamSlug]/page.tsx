import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { FaUsers } from "react-icons/fa";
import DashboardItem from "~/components/DashboardItem";
import DASHBOARD_ITEMS from "~/dashboard-items";
import { getTeamBySlug } from "~/server/services/team";

interface Params {
  teamSlug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const team = await getTeamBySlug(params.teamSlug);
  if (!team) return {};

  return {
    title: `Dashboard - ${team.name || ""} | Link Portal`,
  };
}

interface Props {
  params: Params;
}

export default async function Page({ params }: Props) {
  const team = await getTeamBySlug(params.teamSlug);
  if (!team) notFound();

  const tagSet = new Set<string>();

  DASHBOARD_ITEMS.forEach((item) => {
    item.tags.forEach((tag) => tagSet.add(tag));
  });

  const tagArray = Array.from(tagSet);
  const sortedTagArray = tagArray.sort((a, b) => a.localeCompare(b, "de-DE"));

  const sections = sortedTagArray.map((tag) => ({
    title: tag,
    items: DASHBOARD_ITEMS.filter((item) => item.tags.includes(tag)).sort(
      (a, b) => a.title.localeCompare(b.title, "de-DE")
    ),
  }));

  return (
    <>
      {/* <div className="bg-slate-700 p-8">
        <DashboardSearch />
      </div> */}

      <main className="p-8">
        <h1 className="font-bold text-2xl flex items-center gap-4">
          <FaUsers />
          Team dashboard
        </h1>

        {/* <section className="mt-8">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <FaChartLine />
            Most common
          </h3>

          <ul className="grid grid-cols-4 gap-2">
            <DashboardItem
              href="https://mail.google.com/mail/u/?authuser=hallo@simonknittel.de"
              title="Gmail"
              description="Primary email provider"
            />

            <DashboardItem
              href="https://github.com/simonknittel"
              title="GitHub"
              description="Primary Git provider and CI/CD platform"
            />
          </ul>
        </section> */}

        {sections.map((section) => (
          <section key={section.title} className="mt-8">
            <h3 className="mb-4 text-xl font-bold">{section.title}</h3>

            <ul className="grid grid-cols-4 gap-2">
              {section.items.map((item) => (
                <DashboardItem key={item.title} {...item} />
              ))}
            </ul>
          </section>
        ))}
      </main>
    </>
  );
}
