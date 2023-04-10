import { type Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "~/server/auth";
import LoginButtons from "./_components/LoginButtons";

export const metadata: Metadata = {
  title: "Login | Link Portal",
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/app");

  const activeProviders = authOptions.providers.map((provider) => provider.id);

  return (
    <div className="flex justify-center">
      <main className="w-full max-w-md py-8">
        <h1 className="mb-4 text-center text-6xl">Link Portal</h1>

        <p className="text-sm mx-8 p-4">
          This is the demo of the{" "}
          <a
            href="https://github.com/simonknittel/link-portal"
            className="text-slate-400 underline hover:text-slate-300"
          >
            Link Portal repository
          </a>{" "}
          from GitHub.
        </p>

        <div className="flex flex-col gap-2 rounded bg-slate-700 p-8 mx-8">
          <LoginButtons activeProviders={activeProviders} />
        </div>

        <p className="bg-slate-800 p-4 mx-8 text-sm">
          <strong>Note:</strong> This demo may be slow at times. This is mainly
          due to Prisma not having proper support for PlanetScale in a
          serverless environment like Vercel yet.
        </p>
      </main>
    </div>
  );
}
