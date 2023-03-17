import { type Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import LoginButton from "~/components/LoginButton";
import { authOptions } from "~/server/auth";

export const metadata: Metadata = {
  title: "Login | Login Portal",
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/app");
  }

  return (
    <div className="flex justify-center">
      <main className="mx-auto w-full max-w-md py-8">
        <h1 className="mb-10 text-center text-6xl">Dashboard</h1>

        <div className="rounded bg-slate-800 p-8">
          <LoginButton />
        </div>
      </main>
    </div>
  );
}
