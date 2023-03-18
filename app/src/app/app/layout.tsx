import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { authOptions } from "~/server/auth";

interface Props {
  children: ReactNode;
}

export default async function AppLayout({ children }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return children;
}
