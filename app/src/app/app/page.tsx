import { type Metadata } from "next";
import Sidebar from "~/components/Sidebar";

export const metadata: Metadata = {
  title: "Teams | Link Portal",
};

export default function Page() {
  return (
    <div className="min-h-screen">
      <div className="fixed h-screen w-96 overflow-auto bg-slate-900">
        <Sidebar />
      </div>

      <div className="ml-96 min-h-screen">Teams</div>
    </div>
  );
}
