import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

const postSchema = z.object({
  name: z.string(),
  slug: z.string(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  try {
    const body: unknown = await request.json();
    const data = await postSchema.parseAsync(body);

    const createdProject = await prisma.project.create({
      data: {
        name: data.name,
        slug: data.slug,
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
