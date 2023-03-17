import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import Sidebar from "~/components/Sidebar";
import { authOptions } from "~/server/auth";

interface Props {
  children: ReactNode;
}

export default async function AppLayout({ children }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-96 bg-slate-900">
        <Sidebar />
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
}
