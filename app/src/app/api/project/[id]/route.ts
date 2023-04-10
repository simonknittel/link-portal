import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { authorize } from "../../_utils/authorize";
import errorHandler from "../../_utils/errorHandler";

interface Params {
  id: string;
}

const deleteParamsSchema = z.string().cuid2();

export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    /**
     * Authenticate the request. Make sure only authenticated users can create.
     */
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    /**
     * Validate the request params
     */
    const paramsData = await deleteParamsSchema.parseAsync(params.id);

    const item = await prisma.project.findUnique({
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
      !(await authorize(session.user, "delete", "Project", {
        projectId: item.id,
      }))
    )
      throw new Error("Unauthorized");

    await prisma.project.delete({
      where: {
        id: paramsData,
      },
    });

    return NextResponse.json({});
  } catch (error) {
    return errorHandler(error);
  }
}
