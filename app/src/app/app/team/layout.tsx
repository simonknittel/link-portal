import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { getTeamBySlug } from "~/services/team";

interface Props {
  children: ReactNode;
  params: {
    teamSlug: string;
  };
}

export default async function TeamLayout({ children, params }: Props) {
  const team = await getTeamBySlug(params.teamSlug);
  if (!team) redirect("/app");

  return children;
}
