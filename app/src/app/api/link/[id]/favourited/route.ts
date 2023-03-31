import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import errorHandler from "~/app/api/errorHandler";
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
  try {
    /**
     * Authenticate the request. Make sure only authenticated users can create.
     */
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    /**
     * Validate the request params
     */
    const paramsData = await paramsSchema.parseAsync(params.id);

    const item = await prisma.link.findUnique({
      where: {
        id: paramsData,
      },
    });

    /**
     * Make sure the item exists.
     */
    if (!item) throw new Error("Not found");

    if (
      session.user.projectMemberships.some(
        (projectMembership) => projectMembership.projectId === item.projectId
      ) === false
    )
      return NextResponse.json({}, { status: 401 });

    /**
     * Get the request body
     */
    const body: unknown = await request.json();

    /**
     * Validate the request body
     */
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
    return errorHandler(error);
  }
}
