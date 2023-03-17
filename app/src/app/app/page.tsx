import { type Metadata } from "next";
import {
  FaStar,
  FaRegUser,
  FaRegPlusSquare,
  FaChartLine,
} from "react-icons/fa";
import DashboardItem from "~/components/DashboardItem";
import DashboardSearch from "~/components/DashboardSearch";
import NewSharedLinkModalButton from "~/components/NewSharedLinkModalButton";
import DASHBOARD_ITEMS from "~/dashboard-items";

export const metadata: Metadata = {
  title: "Dashboard | Link Portal",
};

export default function Page() {
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
      <div className="bg-slate-700 p-8">
        <DashboardSearch />
      </div>

      <main className="p-8">
        <section>
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <FaStar className="text-amber-400" />
            Your favourites
          </h3>

          <ul className="grid grid-cols-3 gap-2">
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

        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="flex items-center gap-2 text-xl font-bold">
              <FaRegUser />
              Your custom links
            </h3>

            <button
              title="Add custom link"
              type="button"
              className="rounded p-2 text-xl text-sky-400 hover:bg-slate-800"
            >
              <FaRegPlusSquare />
            </button>
          </div>

          {/* <ul className="grid grid-cols-3 gap-2"></ul> */}

          <p className="italic text-slate-500">
            You don&apos;t have any custom links.
          </p>
        </section>

        <section className="mt-8">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <FaChartLine />
            Most common
          </h3>

          <ul className="grid grid-cols-3 gap-2">
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
        </section>

        <div className="mt-16 mb-8 flex items-center gap-2">
          <h2 className="text-4xl">All links</h2>

          <NewSharedLinkModalButton />
        </div>

        {sections.map((section) => (
          <section key={section.title} className="mt-8">
            <h3 className="mb-4 text-xl font-bold">{section.title}</h3>

            <ul className="grid grid-cols-3 gap-2">
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
