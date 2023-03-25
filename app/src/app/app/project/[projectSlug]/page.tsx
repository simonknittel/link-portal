import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { FaUsers } from "react-icons/fa";
import DashboardItem from "~/components/DashboardItem";
import { prisma } from "~/server/db";
import { getProjectBySlug } from "~/server/services/project";

interface Params {
  projectSlug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const project = await getProjectBySlug(params.projectSlug);
  if (!project) return {};

  return {
    title: `Dashboard - ${project.name || ""} | Link Portal`,
  };
}

interface Props {
  params: Params;
}

export default async function Page({ params }: Props) {
  const project = await prisma.project.findUnique({
    where: {
      slug: params.projectSlug,
    },
    include: {
      tags: {
        include: {
          links: true,
        },
      },
    },
  });
  if (!project) notFound();

  return (
    <>
      {/* <div className="bg-slate-700 p-8">
        <DashboardSearch />
      </div> */}

      <main className="p-8">
        <h1 className="font-bold text-2xl flex items-center gap-4">
          <FaUsers />
          Project dashboard
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

        {project.tags
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((tag) => (
            <section key={tag.title} className="mt-8">
              <h3 className="mb-4 text-xl font-bold">{tag.title}</h3>

              {tag.links.length > 0 ? (
                <ul className="grid grid-cols-4 gap-2">
                  {tag.links
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((link) => (
                      <DashboardItem key={link.title} link={link} />
                    ))}
                </ul>
              ) : (
                <p className="italic text-slate-500">
                  This tag doesn&apos;t have any links yet.
                </p>
              )}
            </section>
          ))}
      </main>
    </>
  );
}
