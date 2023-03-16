import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import {
  FaChartLine,
  FaRegPlusSquare,
  FaRegUser,
  FaSearch,
  FaStar,
} from "react-icons/fa";
import Button from "~/components/Button";
import DashboardItem from "~/components/DashboardItem";
import Modal from "~/components/Modal";
import DASHBOARD_ITEMS from "~/dashboard-items";
import { getServerAuthSession } from "~/server/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

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

  const [showNewSharedLinkModal, setShowNewSharedLinkModal] = useState(false);

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex-col items-center justify-center bg-slate-900 bg-gradient-to-b text-white">
        <header className="pb-8">
          <h1 className="py-4 text-center text-xl">Dashboard</h1>

          {/* <Button onClick={() => signOut()} variant="secondary">
            <FaSignOutAlt />
            Logout
          </Button> */}

          <form className="mx-auto flex w-full max-w-2xl">
            <input
              type="search"
              placeholder="Search"
              className="h-11 w-full rounded-l bg-slate-700 px-4"
              autoFocus
            />

            <Button title="Search" className="rounded-l-none">
              <FaSearch />
            </Button>
          </form>
        </header>

        <main className="container mx-auto">
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

          <div className="mt-16 mb-8 flex items-center justify-center gap-2">
            <h2 className="text-center text-4xl">All links</h2>

            <button
              title="Add shared link"
              type="button"
              className="rounded p-2 text-xl text-sky-400 hover:bg-slate-800"
              onClick={() => setShowNewSharedLinkModal(true)}
            >
              <FaRegPlusSquare />
            </button>
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

        <footer className="container mx-auto p-8 text-center text-slate-500">
          <p>
            <a
              href="https://github.com/simonknittel/dashboard/issues"
              className="text-slate-400 underline underline-offset-4 hover:text-slate-300"
            >
              Send us a ticket
            </a>
            , when you want to get a link added.
          </p>
        </footer>

        <Modal
          isOpen={showNewSharedLinkModal}
          onRequestClose={() => setShowNewSharedLinkModal(false)}
          className="w-[480px]"
        >
          <h2 className="text-xl font-bold">Add new shared link</h2>
        </Modal>
      </div>
    </>
  );
};

export default Page;
