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
        (projectMembership) => projectMembership.projectId === body.projectId
      ) === false
    )
      return NextResponse.json({}, { status: 401 });

    const createdItem = await prisma.link.create({
      data: {
        projectId: body.projectId,
        title: body.title,
        description: body.description,
        href: body.href,
        tags: {
          connect: body.tagIds?.map((tagId) => ({ id: tagId })) || [],
        },
      },
    });

    return NextResponse.json(createdItem);
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
