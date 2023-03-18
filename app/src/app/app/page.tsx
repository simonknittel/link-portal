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

      <main className="ml-96 min-h-screen p-8">
        <h1 className="font-bold text-2xl">Your teams</h1>
      </main>
    </div>
  );
}
