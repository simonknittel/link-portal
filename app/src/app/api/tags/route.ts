import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

const postBodySchema = z.object({
  projectId: z.string().cuid2(),
  title: z.string().min(1).max(255),
  description: z.string().max(255).optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  try {
    const body: unknown = await request.json();
    const data = await postBodySchema.parseAsync(body);

    if (
      session.user.projectMemberships.some(
        (projectMembership) => projectMembership.projectId === data.projectId
      ) === false
    )
      return NextResponse.json({}, { status: 401 });

    const createdItem = await prisma.tag.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
      },
    });

    return NextResponse.json(createdItem);
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
