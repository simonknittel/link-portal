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

    const item = await prisma.tag.findUnique({
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

const patchParamsSchema = z.string().cuid2();

const patchBodySchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(255).optional(),
});

export async function PATCH(request: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  try {
    const paramsData = await patchParamsSchema.parseAsync(params.id);

    const item = await prisma.tag.findUnique({
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

    const body: unknown = await request.json();
    const data = await patchBodySchema.parseAsync(body);

    await prisma.tag.update({
      where: {
        id: paramsData,
      },
      data: {
        title: data.title,
        description: data.description,
      },
    });

    return NextResponse.json({});
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid request params or body",
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

    const item = await prisma.tag.findUnique({
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

    await prisma.tag.delete({
      where: {
        id: paramsData,
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
