import { type ReactNode } from "react";
import Sidebar from "~/components/Sidebar";

interface Props {
  children: ReactNode;
  params: {
    teamSlug?: string;
  };
}

export default function TeamLayout({ children, params }: Props) {
  return (
    <div className="min-h-screen">
      <div className="fixed h-screen w-96 overflow-auto bg-slate-900">
        <Sidebar teamSlug={params.teamSlug} />
      </div>

      <div className="ml-96 min-h-screen">{children}</div>
    </div>
  );
}
