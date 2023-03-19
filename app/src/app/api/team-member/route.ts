import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  // TODO: Check if user is team member and has role 2

  try {
    const body = await request.json();

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      // TODO: Send invite
      return NextResponse.json({}, { status: 400 });
    }

    const createdTeamMember = await prisma.teamMember.create({
      data: {
        teamId: body.teamId,
        userId: user.id,
        role: body.role,
      },
    });

    return NextResponse.json(createdTeamMember);
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  // TODO: Check if user is team member, has role 2, removes himself and there is one other admin left

  try {
    const body = await request.json();

    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId: body.teamId,
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
