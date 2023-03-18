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
    <div className="min-h-screen">
      <div className="fixed h-screen w-96 overflow-auto bg-slate-900">
        <Sidebar />
      </div>

      <div className="ml-96">{children}</div>
    </div>
  );
}
