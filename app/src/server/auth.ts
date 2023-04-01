import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { init } from "@paralleldrive/cuid2";
import { type ProjectMember } from "@prisma/client";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Provider } from "next-auth/providers";
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
      projectMemberships: ProjectMember[];
    } & DefaultSession["user"];
  }
}

const providers: Provider[] = [];

if (env.GITHUB_ID && env.GITHUB_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    })
  );
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        // Append project memberships to the session object since we use this information often
        const projectMemberships = await prisma.projectMember.findMany({
          where: {
            userId: user.id,
          },
        });

        session.user.projectMemberships = projectMemberships;
      }

      return session;
    },

    async signIn({ user, profile }) {
      // Update user's email, name and avatar on each login
      if (profile) {
        /**
         * This callback doesn't tell us if the user already exists in the
         * database. Also, this callback gets called before a new user gets
         * created in the database. Therefore, we have to figure out ourselves
         * if we can update an existing user or not. We do this by just trying
         * with `try ... catch`.
         */
        try {
          // User already exists
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              email: profile.email!.toLocaleLowerCase(),
              name: profile.name,
              // TODO: Update avatar
            },
          });
        } catch (error) {
          // User doesn't exist yet, e.g. first login of a new user -> no update needed
        }
      }

      return true;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers,
  events: {
    async createUser({ user }) {
      /**
       * Make sure the email is stored in lowercase
       */
      const email = user.email!.toLowerCase();

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          email,
        },
      });

      /**
       * Create personal project
       */
      const slugifiedName = slugify(user.name, {
        lower: true,
        strict: true,
      });

      const createId = init({
        length: 10,
      });
      const slugWithCuid = slugifiedName + "-" + createId();

      const createdProject = await prisma.project.create({
        data: {
          name: "Your personal project",
          slug: slugWithCuid,
        },
      });

      await prisma.projectMember.create({
        data: {
          projectId: createdProject.id,
          userId: user.id,
          role: 2,
        },
      });

      /**
       * Accept invites
       */
      const invitedProjectMembers = await prisma.invitedProjectMember.findMany({
        where: {
          email,
        },
      });

      await prisma.$transaction([
        prisma.projectMember.createMany({
          data: invitedProjectMembers.map((invitedProjectMember) => ({
            projectId: invitedProjectMember.projectId,
            userId: user.id,
            role: invitedProjectMember.role,
          })),
        }),

        prisma.invitedProjectMember.deleteMany({
          where: {
            email,
          },
        }),
      ]);
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
