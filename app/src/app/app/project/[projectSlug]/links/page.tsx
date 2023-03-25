import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { FaListUl } from "react-icons/fa";
import CreateLinkModal from "~/components/CreateLinkModal";
import LinksTable from "~/components/LinksTable";
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
    title: `Links - ${project.name || ""} | Link Portal`,
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
      links: {
        include: {
          tags: true,
        },
      },
      tags: true,
    },
  });
  if (!project) notFound();

  return (
    <main className="p-8">
      <div className="flex gap-8 items-center">
        <h1 className="font-bold text-2xl flex items-center gap-4">
          <FaListUl />
          Links
        </h1>

        <CreateLinkModal projectId={project.id} tags={project.tags} />
      </div>

      <div className="bg-slate-700 p-8 rounded mt-8">
        <LinksTable
          links={project.links.sort((a, b) => a.title.localeCompare(b.title))}
        />
      </div>
    </main>
  );
}
