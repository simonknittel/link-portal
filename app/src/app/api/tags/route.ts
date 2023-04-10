import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { authorize } from "../_utils/authorize";
import errorHandler from "../_utils/errorHandler";

const postBodySchema = z.object({
  projectId: z.string().cuid2(),
  title: z.string().min(1).max(255),
  description: z.string().max(255).optional(),
});

export async function POST(request: Request) {
  try {
    /**
     * Authenticate the request. Make sure only authenticated users can create.
     */
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    /**
     * Validate the request body
     */
    const body: unknown = await request.json();
    const data = await postBodySchema.parseAsync(body);

    /**
     * Authorize the request. Make sure only project members can continue.
     */
    if (
      !(await authorize(session.user, "create", "Tag", {
        projectId: data.projectId,
      }))
    )
      throw new Error("Unauthorized");

    /**
     * Create the item
     */
    const createdItem = await prisma.tag.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
      },
    });

    return NextResponse.json(createdItem);
  } catch (error) {
    return errorHandler(error);
  }
}
