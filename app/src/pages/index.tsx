import { type NextPage } from "next";
import Head from "next/head";
import { FaSearch, FaStar } from "react-icons/fa";
import DashboardItem from "~/components/DashboardItem";
import DASHBOARD_ITEMS from "~/dashboard-items";

const Page: NextPage = () => {
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
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex-col items-center justify-center bg-slate-900 bg-gradient-to-b text-white">
        <main className="container mx-auto flex flex-col gap-8 py-8">
          <form className="flex gap-2">
            <input
              type="search"
              placeholder="Search"
              className="w-full rounded bg-slate-700 p-4"
            />

            <button className="flex items-center gap-2 rounded bg-sky-700 p-4 hover:bg-sky-600">
              <FaSearch />
              Submit
            </button>
          </form>

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <FaStar className="text-amber-400" />
              Your favourites
            </h2>

            <ul className="grid grid-cols-3 gap-2">
              <DashboardItem
                href="https://mail.google.com/mail/u/?authuser=hallo@simonknittel.de"
                title="Gmail"
                description="Primary email provider"
                isFavourite={true}
              />
            </ul>

            {/* <p className="italic text-slate-500">
              You don&apos;t have any favourites yet.
            </p> */}
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold">Most common</h2>

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

          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-4 text-xl font-bold">{section.title}</h2>

              <ul className="grid grid-cols-3 gap-2">
                {section.items.map((item) => (
                  <DashboardItem key={item.title} {...item} />
                ))}
              </ul>
            </section>
          ))}
        </main>

        <footer className="container mx-auto p-4 text-center text-slate-500">
          <p>
            <a
              href="https://github.com/simonknittel/dashboard/issues"
              className="text-sky-700 hover:underline"
            >
              Send us a ticket
            </a>
            , when you want to get a link added.
          </p>
        </footer>
      </div>
    </>
  );
};

export default Page;
