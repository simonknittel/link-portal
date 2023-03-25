import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  try {
    const body = await request.json();

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
      // TODO: Send invite
      return NextResponse.json({}, { status: 400 });
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
    const body = await request.json();

    // TODO: Check if user is removing himself and there is at least on other admin left
    if (
      session.user.projectMemberships.some(
        (projectMembership) =>
          projectMembership.projectId === body.projectId &&
          projectMembership.role === 2
      ) === false
    )
      return NextResponse.json({}, { status: 401 });

    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId: body.projectId,
          userId: body.userId,
        },
      },
    });

    return NextResponse.json({});
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
