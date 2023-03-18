import { type Metadata } from "next";
import { notFound } from "next/navigation";
import DeleteTeamButton from "~/components/DeleteTeamButton";
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
    title: `Team settings - ${team.name || ""} | Link Portal`,
  };
}

interface Props {
  params: Params;
}

export default async function Page({ params }: Props) {
  const team = await getTeamBySlug(params.teamSlug);
  if (!team) notFound();

  return (
    <main className="p-8">
      <h1 className="font-bold text-2xl">Team settings</h1>

      <section className="p-8 bg-red-900 rounded bg-opacity-25 max-w-4xl mt-4">
        <h2 className="font-bold text-2xl text-red-500">Danger zone</h2>

        <p className="mt-4">Delete the team and all links of this team.</p>

        <DeleteTeamButton team={team} />
      </section>
    </main>
  );
}
