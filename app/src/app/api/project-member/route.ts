import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { sendInviteEmail } from "~/server/mail";

const postSchema = z.object({
  projectId: z.string().cuid2(),
  email: z.string().email(),
  role: z.union([z.literal(1), z.literal(2)]),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  try {
    const body: unknown = await request.json();
    const data = await postSchema.parseAsync(body);

    if (
      session.user.projectMemberships.some(
        (projectMembership) =>
          projectMembership.projectId === data.projectId &&
          projectMembership.role === 2
      ) === false
    )
      return NextResponse.json({}, { status: 401 });

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
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid request body",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    console.error(error);
    return NextResponse.json({}, { status: 500 });
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
    const body: unknown = await request.json();
    const data = await deleteSchema.parseAsync(body);

    // TODO: Check if user is removing himself and there is at least on other admin left
    if (
      session.user.projectMemberships.some(
        (projectMembership) =>
          projectMembership.projectId === data.projectId &&
          projectMembership.role === 2
      ) === false
    )
      return NextResponse.json({}, { status: 401 });

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
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid request body",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
