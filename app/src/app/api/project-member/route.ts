import {
  type InvitedProjectMember,
  type Project,
  type User,
} from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  try {
    const body = (await request.json()) as {
      projectId: Project["id"];
      email: string;
      role: 1 | 2;
    };

    if (
      session.user.projectMemberships.some(
        (projectMembership) =>
          projectMembership.projectId === body.projectId &&
          projectMembership.role === 2
      ) === false
    )
      return NextResponse.json({}, { status: 401 });

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      const createdItem = await prisma.invitedProjectMember.create({
        data: {
          projectId: body.projectId,
          email: body.email,
          role: body.role,
        },
      });

      // TODO: Send invite email

      return NextResponse.json(createdItem);
    }

    const createdProjectMember = await prisma.projectMember.create({
      data: {
        projectId: body.projectId,
        userId: user.id,
        role: body.role,
      },
    });

    return NextResponse.json(createdProjectMember);
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  try {
    const body = (await request.json()) as
      | { projectId: Project["id"]; userId: User["id"] }
      | { projectId: Project["id"]; email: InvitedProjectMember["email"] };

    // TODO: Check if user is removing himself and there is at least on other admin left
    if (
      session.user.projectMemberships.some(
        (projectMembership) =>
          projectMembership.projectId === body.projectId &&
          projectMembership.role === 2
      ) === false
    )
      return NextResponse.json({}, { status: 401 });

    if ("userId" in body) {
      await prisma.projectMember.delete({
        where: {
          projectId_userId: {
            projectId: body.projectId,
            userId: body.userId,
          },
        },
      });
    } else {
      await prisma.invitedProjectMember.delete({
        where: {
          projectId_email: {
            projectId: body.projectId,
            email: body.email,
          },
        },
      });
    }

    return NextResponse.json({});
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
