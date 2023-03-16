import { type GetServerSideProps, type NextPage } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Button from "~/components/Button";
import { getServerAuthSession } from "~/server/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex-col items-center justify-center bg-slate-900 bg-gradient-to-b text-white">
        <main className="mx-auto max-w-md pt-8">
          <h1 className="mb-10 text-center text-6xl">Dashboard</h1>

          <div className="rounded bg-slate-800 p-8">
            <Button className="w-full" onClick={() => signIn("github")}>
              Login with GitHub
            </Button>
          </div>
        </main>
      </div>
    </>
  );
};

export default Page;
