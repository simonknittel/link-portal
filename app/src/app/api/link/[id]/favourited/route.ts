import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

interface Params {
  id: string;
}

const paramsSchema = z.string().cuid2();

const patchSchema = z.object({
  favourited: z.boolean(),
});

export async function PATCH(request: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  try {
    const paramsData = await paramsSchema.parseAsync(params.id);

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

    const body: unknown = await request.json();
    const data = await patchSchema.parseAsync(body);

    const newValue = data.favourited ? "true" : "false";

    const createdItem = await prisma.linkUserKeyValue.upsert({
      create: {
        userId: session.user.id,
        linkId: paramsData,
        key: "favourited",
        value: newValue,
      },
      update: {
        value: newValue,
      },
      where: {
        linkId_userId_key: {
          userId: session.user.id,
          linkId: paramsData,
          key: "favourited",
        },
      },
    });

    return NextResponse.json(createdItem);
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
