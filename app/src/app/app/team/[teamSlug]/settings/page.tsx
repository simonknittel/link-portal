import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { getTeamBySlug } from "~/services/team";

interface Params {
  teamSlug: string;
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const team = getTeamBySlug(params.teamSlug);
  if (!team) return {};

  return {
    title: `Team settings - ${team.name || ""} | Link Portal`,
  };
}

interface Props {
  params: Params;
}

export default function Page({ params }: Props) {
  const team = getTeamBySlug(params.teamSlug);
  if (!team) notFound();

  return <main className="p-8">Team settings</main>;
}
