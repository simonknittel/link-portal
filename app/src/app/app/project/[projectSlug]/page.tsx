import { type Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FaUsers } from "react-icons/fa";
import DashboardItem from "~/components/DashboardItem";
import { authOptions } from "~/server/auth";
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
  const session = await getServerSession(authOptions);
  if (
    !project ||
    !session?.user.projectMemberships.some(
      (projectMembership) => projectMembership.projectId === project.id
    )
  )
    notFound();

  const linkUserKeyValue = await prisma.linkUserKeyValue.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <>
      {/* <div className="bg-slate-700 p-8">
        <DashboardSearch />
      </div> */}

      <main className="p-8 pt-24 lg:pt-8">
        <h1 className="font-bold text-2xl flex items-center gap-4">
          <FaUsers />
          Project dashboard
        </h1>

        {/* <section className="mt-8">
          <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
            <FaChartLine />
            Most common
          </h3>

          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
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
                <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
                  {tag.links
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((link) => {
                      const favourited = linkUserKeyValue.some(
                        (item) =>
                          item.key === "favourited" &&
                          item.linkId === link.id &&
                          item.value === "true"
                      );

                      return (
                        <DashboardItem
                          key={link.id}
                          link={link}
                          favourited={favourited}
                        />
                      );
                    })}
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
