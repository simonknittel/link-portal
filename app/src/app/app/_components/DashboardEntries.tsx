import { type Link, type Project, type Tag } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import DashboardItem from "./DashboardItem";

interface Props {
  project: Project & {
    tags: (Tag & { links: Link[] })[];
  };
}

const DashboardEntries = async ({ project }: Props) => {
  const session = await getServerSession(authOptions);

  const linkUserKeyValue = await prisma.linkUserKeyValue.findMany({
    where: {
      userId: session!.user.id,
    },
  });

  return (
    <>
      {project.tags
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((tag) => (
          <section key={tag.title} className="mt-8">
            <h3 className="text-xl font-bold">{tag.title}</h3>
            {tag.description && <p>{tag.description}</p>}

            {tag.links.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 mt-4">
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
              <p className="italic text-slate-500 mt-4">
                This tag doesn&apos;t have any links yet.
              </p>
            )}
          </section>
        ))}
    </>
  );
};

export default DashboardEntries;
