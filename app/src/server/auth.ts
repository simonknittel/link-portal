import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { init } from "@paralleldrive/cuid2";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import slugify from "slugify";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // role: 0 | 1 | 2;
    } & DefaultSession["user"];
  }

  interface User {
    // role: 0 | 1 | 2;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  // TODO: Create personal team on user creation
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // session.user.role = user.role;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
  ],
  events: {
    async createUser({ user }) {
      const slugifiedName = slugify(user.name, {
        lower: true,
        strict: true,
      });

      const createId = init({
        length: 10,
      });
      const slugWithCuid = slugifiedName + "-" + createId();

      const createdTeam = await prisma.team.create({
        data: {
          name: "Personal",
          slug: slugWithCuid,
        },
      });

      await prisma.teamMember.create({
        data: {
          teamId: createdTeam.id,
          userId: user.id,
          role: 2,
        },
      });
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
