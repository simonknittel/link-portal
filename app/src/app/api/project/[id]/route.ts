import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

interface Params {
  id: string;
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  try {
    const item = await prisma.project.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!item) return NextResponse.json({}, { status: 404 });

    if (
      session.user.projectMemberships.some(
        (projectMembership) =>
          projectMembership.projectId === item.id &&
          projectMembership.role === 2
      ) === false
    )
      return NextResponse.json({}, { status: 401 });

    await prisma.project.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({});
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
