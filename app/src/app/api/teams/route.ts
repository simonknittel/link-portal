import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const body = await request.json();

  const createdTeam = await prisma.team.create({
    data: {
      name: body.name,
      slug: body.slug,
    },
  });

  await prisma.teamMember.create({
    data: {
      teamId: createdTeam.id,
      userId: session.user.id,
      role: 2,
    },
  });

  return NextResponse.json(createdTeam);
}
