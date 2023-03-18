import { type Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import LoginButtons from "~/components/LoginButtons";
import { authOptions } from "~/server/auth";

export const metadata: Metadata = {
  title: "Login | Link Portal",
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/app");
  }

  return (
    <div className="flex justify-center">
      <main className="w-full max-w-md py-8">
        <h1 className="mb-10 text-center text-6xl">Link Portal</h1>

        <div className="flex flex-col gap-2 rounded bg-slate-700 p-8">
          <LoginButtons />
        </div>
      </main>
    </div>
  );
}
