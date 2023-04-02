import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { sendInviteEmail } from "~/server/mail";
import { authorize } from "../authorize";
import errorHandler from "../errorHandler";

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
     * Get the request body
     */
    const body: unknown = await request.json();

    /**
     * Validate the request body
     */
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
      const createdItem = await prisma.invitedProjectMember.create({
        data: {
          projectId: data.projectId,
          email: data.email,
          role: data.role,
        },
      });

      const project = await prisma.project.findUnique({
        where: {
          id: data.projectId,
        },
      });

      await sendInviteEmail(data.email, project!, session.user);

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
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  try {
    /**
     * Get the request body
     */
    const body: unknown = await request.json();

    /**
     * Validate the request body
     */
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
