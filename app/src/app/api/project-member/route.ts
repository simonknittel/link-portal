import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sendInviteEmail } from "~/app/api/_utils/mail";
import { env } from "~/env.mjs";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { authorize } from "../_utils/authorize";
import errorHandler from "../_utils/errorHandler";

const postSchema = z.object({
  projectId: z.string().cuid2(),
  email: z.string().email(),
  role: z.union([z.literal(1), z.literal(2)]),
});

export async function POST(request: Request) {
  try {
    /**
     * Authenticate the request. Make sure only authenticated users can create.
     */
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    /**
     * Validate the request body
     */
    const body: unknown = await request.json();
    const data = await postSchema.parseAsync(body);

    /**
     * Authorize the request. Make sure only project members can continue.
     */
    if (
      !(await authorize(session.user, "create", "ProjectMember", {
        projectId: data.projectId,
      }))
    )
      throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      /**
       * Check demo limits
       */
      const [projectMembers, invitedProjectMembers] = await prisma.$transaction(
        [
          prisma.projectMember.count({
            where: {
              projectId: data.projectId,
            },
          }),
          prisma.invitedProjectMember.count({
            where: {
              projectId: data.projectId,
            },
          }),
        ]
      );

      if (
        env.NEXT_PUBLIC_DEMO === "true" &&
        projectMembers + invitedProjectMembers >= 3
      )
        throw new Error("Demo limits");

      /**
       * Create
       */
      const createdItem = await prisma.invitedProjectMember.create({
        data: {
          projectId: data.projectId,
          email: data.email,
          role: data.role,
        },
      });

      /**
       * Send an email to the invited user.
       */
      const project = await prisma.project.findUnique({
        where: {
          id: data.projectId,
        },
      });

      await sendInviteEmail(data.email, project!, session.user);

      // const definitions = await getDefinitions();
      // const { toggles } = evaluateFlags(definitions, {
      //   userId: session.user.id,
      // });
      // const flags = flagsClient(toggles);

      // if (flags.isEnabled("DisableInviteEmail") === false) {
      //   const project = await prisma.project.findUnique({
      //     where: {
      //       id: data.projectId,
      //     },
      //   });

      //   await sendInviteEmail(data.email, project!, session.user);
      // }

      return NextResponse.json(createdItem);
    }

    const createdProjectMember = await prisma.projectMember.create({
      data: {
        projectId: data.projectId,
        userId: user.id,
        role: data.role,
      },
    });

    return NextResponse.json(createdProjectMember);
  } catch (error) {
    return errorHandler(error);
  }
}

const deleteSchema = z.union([
  z.object({
    projectId: z.string().cuid2(),
    userId: z.string().cuid2(),
  }),
  z.object({
    projectId: z.string().cuid2(),
    email: z.string().email(),
  }),
]);

export async function DELETE(request: Request) {
  try {
    /**
     * Authenticate the request. Make sure only authenticated users can create.
     */
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    /**
     * Validate the request body
     */
    const body: unknown = await request.json();
    const data = await deleteSchema.parseAsync(body);

    /**
     * Authorize the request. Make sure only project members can continue.
     */
    if (
      !(await authorize(session.user, "delete", "ProjectMember", {
        projectId: data.projectId,
      }))
    )
      throw new Error("Unauthorized");

    // TODO: Check if user is removing himself and there is at least on other admin left

    if ("userId" in data) {
      await prisma.projectMember.delete({
        where: {
          projectId_userId: {
            projectId: data.projectId,
            userId: data.userId,
          },
        },
      });
    } else {
      await prisma.invitedProjectMember.delete({
        where: {
          projectId_email: {
            projectId: data.projectId,
            email: data.email,
          },
        },
      });
    }

    return NextResponse.json({});
  } catch (error) {
    return errorHandler(error);
  }
}
