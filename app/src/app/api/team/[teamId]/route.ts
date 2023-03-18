import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

interface Params {
  teamId: string;
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  // TODO: Check if user is team member and has role 2

  await prisma.team.delete({
    where: {
      id: params.teamId,
    },
  });

  return NextResponse.json({});
}
