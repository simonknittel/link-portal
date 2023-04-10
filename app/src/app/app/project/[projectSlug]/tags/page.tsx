import { type Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FaListUl } from "react-icons/fa";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { getProjectBySlug } from "../_utils/getProject";
import CreateOrEditTagModal from "./_components/CreateOrEditTagModal";
import TagsTable from "./_components/TagsTable";

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
    title: `Tags - ${project.name || ""} | Link Portal`,
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
      tags: true,
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

  return (
    <main className="p-8 pt-24 lg:pt-8">
      <div className="flex gap-8 items-center">
        <h1 className="font-bold text-2xl flex items-center gap-4">
          <FaListUl />
          Tags
        </h1>

        <CreateOrEditTagModal projectId={project.id} />
      </div>

      <div className="bg-slate-700 p-8 rounded mt-8">
        <TagsTable
          tags={project.tags.sort((a, b) => a.title.localeCompare(b.title))}
        />
      </div>
    </main>
  );
}
