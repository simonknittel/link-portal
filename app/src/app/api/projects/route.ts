import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  try {
    const body = await request.json();

    const createdProject = await prisma.project.create({
      data: {
        name: body.name,
        slug: body.slug,
      },
    });

    await prisma.projectMember.create({
      data: {
        projectId: createdProject.id,
        userId: session.user.id,
        role: 2,
      },
    });

    return NextResponse.json(createdProject);
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
