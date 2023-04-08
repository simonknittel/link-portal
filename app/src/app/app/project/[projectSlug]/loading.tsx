import { FaSpinner } from "react-icons/fa";

export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center text-6xl text-slate-700">
      <FaSpinner className="animate-spin" />
    </main>
  );
}
