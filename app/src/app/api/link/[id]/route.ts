import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

interface Params {
  id: string;
}

const getParamsSchema = z.string().cuid2();

export async function GET(request: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  try {
    const paramsData = await getParamsSchema.parseAsync(params.id);

    const item = await prisma.link.findUnique({
      where: {
        id: paramsData,
      },
      include: {
        tags: true,
      },
    });

    if (!item) return NextResponse.json({}, { status: 404 });

    if (
      session.user.projectMemberships.some(
        (projectMembership) => projectMembership.projectId === item.projectId
      ) === false
    )
      return NextResponse.json({}, { status: 401 });

    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid request params",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}

const patchSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(255).optional(),
  href: z.string().url(),
  tagIds: z.array(z.string().cuid2()).optional(),
});

export async function PATCH(request: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  try {
    const item = await prisma.link.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!item) return NextResponse.json({}, { status: 404 });

    if (
      session.user.projectMemberships.some(
        (projectMembership) => projectMembership.projectId === item.projectId
      ) === false
    )
      return NextResponse.json({}, { status: 401 });

    const body: unknown = await request.json();
    const data = await patchSchema.parseAsync(body);

    await prisma.link.update({
      where: {
        id: params.id,
      },
      data: {
        title: data.title,
        description: data.description,
        href: data.href,
        tags: {
          set: data.tagIds?.map((tagId) => ({ id: tagId })),
        },
      },
    });

    return NextResponse.json({});
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

const deleteParamsSchema = z.string().cuid2();

export async function DELETE(request: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  try {
    const paramsData = await deleteParamsSchema.parseAsync(params.id);

    const item = await prisma.link.findUnique({
      where: {
        id: paramsData,
      },
    });

    if (!item) return NextResponse.json({}, { status: 404 });

    if (
      session.user.projectMemberships.some(
        (projectMembership) => projectMembership.projectId === item.projectId
      ) === false
    )
      return NextResponse.json({}, { status: 401 });

    await prisma.link.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({});
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid request params",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
