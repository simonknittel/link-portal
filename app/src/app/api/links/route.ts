import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

const postSchema = z.object({
  projectId: z.string().cuid2(),
  title: z.string().min(1).max(255),
  description: z.string().max(255).optional(),
  href: z.string().url(),
  tagIds: z.array(z.string().cuid2()).optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  try {
    const body: unknown = await request.json();
    const data = await postSchema.parseAsync(body);

    if (
      session.user.projectMemberships.some(
        (projectMembership) => projectMembership.projectId === data.projectId
      ) === false
    )
      return NextResponse.json({}, { status: 401 });

    const createdItem = await prisma.link.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        href: data.href,
        tags: {
          connect: data.tagIds?.map((tagId) => ({ id: tagId })) || [],
        },
      },
    });

    return NextResponse.json(createdItem);
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
