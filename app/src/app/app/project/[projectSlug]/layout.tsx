import { type ReactNode } from "react";
import Sidebar from "~/components/Sidebar";

interface Props {
  children: ReactNode;
  params: {
    projectSlug?: string;
  };
}

export default function ProjectLayout({ children, params }: Props) {
  return (
    <div className="min-h-screen">
      <div className="fixed h-screen w-96 overflow-auto bg-slate-900">
        <Sidebar projectSlug={params.projectSlug} />
      </div>

      <div className="ml-96 min-h-screen">{children}</div>
    </div>
  );
}
