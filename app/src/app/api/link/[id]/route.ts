import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { authorize } from "../../authorize";
import errorHandler from "../../errorHandler";

interface Params {
  id: string;
}

const getParamsSchema = z.string().cuid2();

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    /**
     * Authenticate the request. Make sure only authenticated users can create.
     */
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    /**
     * Validate the request params
     */
    const paramsData = await getParamsSchema.parseAsync(params.id);

    const item = await prisma.link.findUnique({
      where: {
        id: paramsData,
      },
      include: {
        tags: true,
      },
    });

    /**
     * Make sure the item exists.
     */
    if (!item) throw new Error("Not found");

    /**
     * Authorize the request. Make sure only project members can continue.
     */
    if (
      !(await authorize(session.user, "read", "Link", {
        projectId: item.projectId,
      }))
    )
      throw new Error("Unauthorized");

    return NextResponse.json(item);
  } catch (error) {
    return errorHandler(error);
  }
}

const patchSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(255).optional(),
  href: z.string().url(),
  tagIds: z.array(z.string().cuid2()).optional(),
});

export async function PATCH(request: Request, { params }: { params: Params }) {
  try {
    /**
     * Authenticate the request. Make sure only authenticated users can create.
     */
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    const item = await prisma.link.findUnique({
      where: {
        id: params.id,
      },
    });

    /**
     * Make sure the item exists.
     */
    if (!item) throw new Error("Not found");

    /**
     * Authorize the request. Make sure only project members can continue.
     */
    if (
      !(await authorize(session.user, "update", "Link", {
        projectId: item.projectId,
      }))
    )
      throw new Error("Unauthorized");

    /**
     * Get the request body
     */
    const body: unknown = await request.json();

    /**
     * Validate the request body
     */
    const data = await patchSchema.parseAsync(body);

    /**
     * Update the item
     */
    const updatedItem = await prisma.link.update({
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

    return NextResponse.json(updatedItem);
  } catch (error) {
    return errorHandler(error);
  }
}

const deleteParamsSchema = z.string().cuid2();

export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    /**
     * Authenticate the request. Make sure only authenticated users can continue.
     */
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    /**
     * Validate the request params
     */
    const paramsData = await deleteParamsSchema.parseAsync(params.id);

    const item = await prisma.link.findUnique({
      where: {
        id: paramsData,
      },
    });

    /**
     * Make sure the item exists.
     */
    if (!item) throw new Error("Not found");

    /**
     * Authorize the request. Make sure only project members can continue.
     */
    if (
      !(await authorize(session.user, "delete", "Link", {
        projectId: item.projectId,
      }))
    )
      throw new Error("Unauthorized");

    /**
     * Delete the item.
     */
    await prisma.link.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({});
  } catch (error) {
    return errorHandler(error);
  }
}
