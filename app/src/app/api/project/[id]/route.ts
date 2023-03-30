import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

interface Params {
  id: string;
}

const deleteParamsSchema = z.string().cuid2();

export async function DELETE(request: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  try {
    const paramsData = await deleteParamsSchema.parseAsync(params.id);

    const item = await prisma.project.findUnique({
      where: {
        id: paramsData,
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
